import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { User } from '../user/user.entity';
import { Membership } from '../membership/membership.entity';
import { EventRegistration } from '../event/event-registration.entity';
import { Certificate } from '../certificate/certificate.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogService } from '../log/log.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

/**
 * Authentication domain logic: account creation, credential verification,
 * JWT issuance (HttpOnly cookie) and self-service profile/password updates.
 * Passwords are hashed with argon2; audit events are recorded via
 * {@link LogService}.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    @InjectRepository(EventRegistration)
    private readonly registrationRepo: Repository<EventRegistration>,
    @InjectRepository(Certificate)
    private readonly certificateRepo: Repository<Certificate>,
    private readonly jwtService: JwtService,
    private readonly logService: LogService,
  ) {}

  /** Create a new account; rejects a duplicate email with a 409 conflict. */
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) {
      await this.logService.logAuth({
        action: 'register_failure',
        email: dto.email,
      });
      throw new ConflictException('Email déjà utilisé');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = this.userRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
    });

    await this.userRepo.save(user);
    await this.logService.logAuth({
      action: 'register',
      userId: user.idUser,
      email: user.email,
    });
    return { message: 'Compte créé avec succès' };
  }

  /**
   * Verify the credentials and, on success, set the signed access_token cookie
   * (HttpOnly, 7-day expiry).
   */
  async login(dto: LoginDto, res: Response): Promise<{ message: string }> {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) {
      await this.logService.logAuth({
        action: 'login_failure',
        email: dto.email,
      });
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      await this.logService.logAuth({
        action: 'login_failure',
        email: dto.email,
        userId: user.idUser,
      });
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const token = this.jwtService.sign({
      sub: user.idUser,
      email: user.email,
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await this.logService.logAuth({
      action: 'login_success',
      userId: user.idUser,
      email: user.email,
    });
    return { message: 'Connexion réussie' };
  }

  /** Return the user for the given id, stripped of its password hash. */
  async me(userId: number): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepo.findOneBy({ idUser: userId });
    // Never expose the password hash to the client.
    const { passwordHash: _passwordHash, ...safeUser } = user!;
    return safeUser;
  }

  /** Clear the access_token cookie. */
  async logout(res: Response): Promise<{ message: string }> {
    res.clearCookie('access_token');
    await this.logService.logAuth({ action: 'logout' });
    return { message: 'Déconnexion réussie' };
  }

  /** Replace the password after verifying the current one. */
  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findOneByOrFail({ idUser: userId });
    const valid = await argon2.verify(user.passwordHash, dto.currentPassword);
    if (!valid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }
    const passwordHash = await argon2.hash(dto.newPassword);
    await this.userRepo.update(userId, { passwordHash });
    return { message: 'Mot de passe modifié avec succès' };
  }

  /** Update the user's editable profile fields and return the fresh entity. */
  async updateMe(userId: number, dto: UpdateUserDto): Promise<User> {
    await this.userRepo.update(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      street: dto.street,
      postalCode: dto.postalCode,
      city: dto.city,
      ffessmLicenseNumber: dto.ffessmLicenseNumber,
      divingLevel: dto.divingLevel,
      instructorLevel: dto.instructorLevel,
    });
    return this.userRepo.findOneByOrFail({ idUser: userId });
  }

  /**
   * Anonymize and soft-delete the account (GDPR right to erasure). Identifying
   * fields are wiped, medical certificates (health data) are removed, then the
   * row is soft-deleted so TypeORM excludes it from every `find()` while keeping
   * the `RESTRICT` relations (memberships, registrations) intact for club data
   * integrity. The session cookie is cleared on the way out.
   */
  async deleteMe(
    userId: number,
    res: Response,
  ): Promise<{ message: string }> {
    await this.userRepo.update(userId, {
      email: `deleted_${userId}@deleted.local`,
      firstName: 'Compte',
      lastName: 'supprimé',
      phone: null,
      birthDate: null,
      street: null,
      postalCode: null,
      city: null,
      ffessmLicenseNumber: null,
      divingLevel: null,
      instructorLevel: null,
      profilePictureUrl: null,
    });

    // Medical certificates are health data: remove them on account deletion.
    await this.certificateRepo
      .createQueryBuilder()
      .delete()
      .where('id_user = :userId', { userId })
      .execute();

    await this.userRepo.softDelete(userId);

    res.clearCookie('access_token');
    return { message: 'Compte supprimé' };
  }

  /**
   * Build a portable JSON copy of the user's personal data (GDPR right to
   * access/portability): identity, diving profile, memberships, event
   * registrations and certificates. The password hash, soft-delete marker and
   * stored file references are deliberately excluded.
   */
  async exportMyData(userId: number) {
    const user = await this.userRepo.findOneByOrFail({ idUser: userId });

    const memberships = await this.membershipRepo.find({
      where: { user: { idUser: userId } },
      relations: { club: true, role: true },
    });
    const registrations = await this.registrationRepo.find({
      where: { user: { idUser: userId } },
      relations: { event: true },
    });
    const certificates = await this.certificateRepo.find({
      where: { user: { idUser: userId } },
    });

    return {
      exportedAt: new Date().toISOString(),
      identity: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        phone: user.phone,
        address: {
          street: user.street,
          postalCode: user.postalCode,
          city: user.city,
        },
      },
      diving: {
        ffessmLicenseNumber: user.ffessmLicenseNumber,
        divingLevel: user.divingLevel,
        instructorLevel: user.instructorLevel,
      },
      account: {
        createdAt: user.createdAt,
      },
      memberships: memberships.map((m) => ({
        club: m.club?.name ?? null,
        role: m.role?.codeRole ?? null,
        season: m.season,
        status: m.status,
        membershipDate: m.membershipDate,
        decisionDate: m.decisionDate,
      })),
      registrations: registrations.map((r) => ({
        event: r.event?.title ?? null,
        date: r.event?.startDatetime ?? null,
        location: r.event?.location ?? null,
        status: r.status,
        registeredAt: r.createdAt,
      })),
      certificates: certificates.map((c) => ({
        issueDate: c.issueDate,
        expirationDate: c.expirationDate,
        status: c.status,
        depositAt: c.depositAt,
      })),
    };
  }
}
