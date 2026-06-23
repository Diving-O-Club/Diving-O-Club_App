import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembersController } from './members.controller';
import { Role } from '../role/role.entity';
import { LogModule } from '../log/log.module';

/**
 * Membership module: join-request lifecycle and admin member management
 * (two controllers), backed by the membership and role repositories.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Membership, Role]), LogModule],
  providers: [MembershipService],
  controllers: [MembershipController, MembersController],
})
export class MembershipModule {}
