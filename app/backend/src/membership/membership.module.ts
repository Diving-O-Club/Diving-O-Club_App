import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { Role } from '../role/role.entity';
import { LogModule } from '../log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, Role]), LogModule],
  providers: [MembershipService],
  controllers: [MembershipController],
})
export class MembershipModule {}
