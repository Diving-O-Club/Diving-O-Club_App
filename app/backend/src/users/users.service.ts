import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }

  create(data: Pick<User, 'firstName' | 'lastName' | 'email'>) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }
}
