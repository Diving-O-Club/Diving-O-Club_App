import {
  Controller,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MembershipService } from './membership.service';
import { ChangeRoleDto } from './dto/change-role.dto';

type AuthReq = Request & { user: { idUser: number; email: string } };

/**
 * Admin management of a club's members: change a member's role or expel them.
 * Both routes require the caller to be an admin of the target member's club.
 */
@ApiTags('Members')
@ApiCookieAuth()
@Controller('members')
export class MembersController {
  constructor(private readonly membershipService: MembershipService) {}

  /** Change a member's role (admin only); identified by membership id. */
  @Patch(':id/role')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Change a member's role (admin only)" })
  @ApiParam({ name: 'id', type: Number, description: 'Membership id.' })
  @ApiResponse({ status: 200, description: 'Role changed.' })
  @ApiResponse({
    status: 403,
    description:
      'Not a club admin, own membership, super_admin, or role not assignable.',
  })
  @ApiResponse({ status: 404, description: 'Member or role not found.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
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

  /** Expel a member from the club (admin only); keeps the user account. */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Expel a member from the club (admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Membership id.' })
  @ApiResponse({ status: 200, description: 'Member expelled.' })
  @ApiResponse({
    status: 403,
    description: 'Not a club admin, own membership, or super_admin.',
  })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async expel(@Param('id') id: string, @Req() req: AuthReq) {
    return this.membershipService.expelMember(req.user.idUser, parseInt(id));
  }
}
