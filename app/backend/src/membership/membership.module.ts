import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { Role } from '../role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, Role])],
  providers: [MembershipService],
  controllers: [MembershipController],
})
export class MembershipModule {}