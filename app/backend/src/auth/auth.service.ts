import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { AppUser } from '../app-user/app-user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogService } from '../log/log.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AppUser)
    private readonly userRepo: Repository<AppUser>,
    private readonly jwtService: JwtService,
    private readonly logService: LogService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) {
      await this.logService.logAuth({ action: 'register_failure', email: dto.email });
      throw new ConflictException('Email déjà utilisé');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = this.userRepo.create({
      firstName: dto.firstName,
      lastName:  dto.lastName,
      email:     dto.email,
      passwordHash,
    });

    await this.userRepo.save(user);
    await this.logService.logAuth({ action: 'register', userId: user.idUser, email: user.email });
    return { message: 'Compte créé avec succès' };
  }

  async login(dto: LoginDto, res: Response): Promise<{ message: string }> {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) {
      await this.logService.logAuth({ action: 'login_failure', email: dto.email });
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      await this.logService.logAuth({ action: 'login_failure', email: dto.email, userId: user.idUser });
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const token = this.jwtService.sign({
      sub:   user.idUser,
      email: user.email,
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    await this.logService.logAuth({ action: 'login_success', userId: user.idUser, email: user.email });
    return { message: 'Connexion réussie' };
  }

  async me(userId: number): Promise<{ idUser: number; email: string; firstName: string | null }> {
    const user = await this.userRepo.findOneBy({ idUser: userId });
    return {
      idUser:    user!.idUser,
      email:     user!.email,
      firstName: user!.firstName ?? null,
    };
  }

  async logout(res: Response): Promise<{ message: string }> {
    res.clearCookie('access_token');
    await this.logService.logAuth({ action: 'logout' });
    return { message: 'Déconnexion réussie' };
  }
}