import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
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

type AuthReq = Request & { user: { idUser: number; email: string } };

const ADMIN_ROLES = ['admin', 'super_admin'];

/**
 * Membership lifecycle for the current user (join requests, status) and the
 * admin review queue (pending requests, accept/reject). Every route requires a
 * valid JWT; admin routes additionally require an admin role in the club.
 */
@ApiTags('Membership')
@ApiCookieAuth()
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  /** Return the caller's active membership (with club context), or null. */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the current user active membership' })
  @ApiResponse({ status: 200, description: 'Active membership, or null.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async getMyMembership(@Req() req: AuthReq) {
    const membership = await this.membershipService.findMyMembership(
      req.user.idUser,
    );
    if (!membership) return null;
    const { passwordHash: _pw, ...safeUser } = membership.user;
    return {
      ...membership,
      user: safeUser,
      club: {
        ...membership.club,
        memberships: membership.club.memberships.map((m) => {
          const { passwordHash: _pw2, ...safeU } = m.user;
          return { ...m, user: safeU };
        }),
      },
    };
  }

  /** Return the caller's membership status for a given club. */
  @Get('status/:clubId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the membership status for a club' })
  @ApiParam({ name: 'clubId', type: Number })
  @ApiResponse({ status: 200, description: 'Membership status for the club.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async getStatus(@Param('clubId') clubId: string, @Req() req: AuthReq) {
    return this.membershipService.getStatusForClub(
      req.user.idUser,
      parseInt(clubId),
    );
  }

  /** Submit a join request for a club (created with the default member role). */
  @Post('request/:clubId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Request to join a club' })
  @ApiParam({ name: 'clubId', type: Number })
  @ApiResponse({ status: 201, description: 'Pending request created.' })
  @ApiResponse({
    status: 409,
    description: 'Already requested here, or member/pending on another club.',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async requestMembership(
    @Param('clubId') clubId: string,
    @Req() req: AuthReq,
  ) {
    return this.membershipService.requestMembership(
      req.user.idUser,
      parseInt(clubId),
    );
  }

  /** Cancel the caller's own pending request for a club. */
  @Delete('request/:clubId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Cancel my pending join request' })
  @ApiParam({ name: 'clubId', type: Number })
  @ApiResponse({ status: 200, description: 'Request cancelled.' })
  @ApiResponse({
    status: 404,
    description: 'No pending request for this club.',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async cancelRequest(@Param('clubId') clubId: string, @Req() req: AuthReq) {
    await this.membershipService.cancelRequest(
      req.user.idUser,
      parseInt(clubId),
    );
    return { status: null };
  }

  /** List pending requests for the admin's club (admin only). */
  @Get('pending')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'List pending join requests (admin only)' })
  @ApiResponse({ status: 200, description: 'Pending requests for the club.' })
  @ApiResponse({ status: 403, description: 'Caller is not a club admin.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async getPendingRequests(@Req() req: AuthReq) {
    const adminMembership = await this.membershipService.findMyMembership(
      req.user.idUser,
    );
    if (
      !adminMembership ||
      !ADMIN_ROLES.includes(adminMembership.role.codeRole)
    ) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.membershipService.getPendingRequests(
      adminMembership.club.idClub,
    );
  }

  /** Accept a pending request for the admin's club (admin only). */
  @Patch('request/:membershipId/accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Accept a pending request (admin only)' })
  @ApiParam({ name: 'membershipId', type: Number })
  @ApiResponse({ status: 200, description: 'Request accepted.' })
  @ApiResponse({ status: 403, description: 'Caller is not a club admin.' })
  @ApiResponse({ status: 404, description: 'Request not found.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async acceptRequest(
    @Param('membershipId') membershipId: string,
    @Req() req: AuthReq,
  ) {
    const adminMembership = await this.membershipService.findMyMembership(
      req.user.idUser,
    );
    if (
      !adminMembership ||
      !ADMIN_ROLES.includes(adminMembership.role.codeRole)
    ) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.membershipService.acceptRequest(
      parseInt(membershipId),
      adminMembership.club.idClub,
    );
  }

  /** Reject a pending request for the admin's club (admin only). */
  @Delete('request/:membershipId/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Reject a pending request (admin only)' })
  @ApiParam({ name: 'membershipId', type: Number })
  @ApiResponse({ status: 200, description: 'Request rejected.' })
  @ApiResponse({ status: 403, description: 'Caller is not a club admin.' })
  @ApiResponse({ status: 404, description: 'Request not found.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async rejectRequest(
    @Param('membershipId') membershipId: string,
    @Req() req: AuthReq,
  ) {
    const adminMembership = await this.membershipService.findMyMembership(
      req.user.idUser,
    );
    if (
      !adminMembership ||
      !ADMIN_ROLES.includes(adminMembership.role.codeRole)
    ) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    await this.membershipService.rejectRequest(
      parseInt(membershipId),
      adminMembership.club.idClub,
    );
    return { success: true };
  }
}
