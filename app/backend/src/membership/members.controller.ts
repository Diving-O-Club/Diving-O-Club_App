import {
  Controller,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MembershipService } from './membership.service';
import { ChangeRoleDto } from './dto/change-role.dto';

type AuthReq = Request & { user: { idUser: number; email: string } };

@Controller('members')
export class MembersController {
  constructor(private readonly membershipService: MembershipService) {}

  @Patch(':id/role')
  @UseGuards(AuthGuard('jwt'))
  async changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
    @Req() req: AuthReq,
  ) {
    return this.membershipService.changeMemberRole(
      req.user.idUser,
      parseInt(id),
      dto.codeRole,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async expel(@Param('id') id: string, @Req() req: AuthReq) {
    return this.membershipService.expelMember(req.user.idUser, parseInt(id));
  }
}
