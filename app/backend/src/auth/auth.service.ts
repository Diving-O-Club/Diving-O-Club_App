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
}
