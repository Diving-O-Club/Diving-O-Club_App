import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { AppUser } from '../app-user/app-user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AppUser)
    private readonly userRepo: Repository<AppUser>,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) {
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
    return { message: 'Compte créé avec succès' };
  }
}