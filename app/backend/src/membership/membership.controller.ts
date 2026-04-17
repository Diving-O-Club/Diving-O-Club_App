import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MembershipService } from './membership.service';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMyMembership(@Req() req: any) {
    const membership = await this.membershipService.findMyMembership(req.user.idUser);

    if (!membership) return null;

    const { passwordHash: _, ...safeUser } = membership.user as any;

    return {
      ...membership,
      user: safeUser,
      club: {
        ...membership.club,
        memberships: membership.club.memberships.map((m) => {
          const { passwordHash: __, ...safeU } = m.user as any;
          return { ...m, user: safeU };
        }),
      },
    };
  }
}