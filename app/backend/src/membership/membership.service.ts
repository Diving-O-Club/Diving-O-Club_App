import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { Role } from '../role/role.entity';
import { LogService } from '../log/log.service';

const ADMIN_ROLES = ['admin', 'super_admin'];
const ASSIGNABLE_ROLES = ['admin', 'committee', 'instructor', 'member'];

/**
 * Membership domain logic: join requests, status checks and admin actions
 * (accept/reject requests, change role, expel). Authorization is club-scoped:
 * admin actions require an active admin/super_admin membership in the same club.
 * Audit events are recorded via {@link LogService}.
 */
@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly logService: LogService,
  ) {}

  /**
   * Verifies the user is an active admin of the targeted club.
   * Throws ForbiddenException otherwise. Returns the admin membership.
   */
  private async assertClubAdmin(
    actorUserId: number,
    clubId: number,
  ): Promise<Membership> {
    const adminMembership = await this.membershipRepo.findOne({
      where: {
        user: { idUser: actorUserId },
        club: { idClub: clubId },
        status: 'active',
      },
      relations: ['role', 'club'],
    });

    if (
      !adminMembership ||
      !ADMIN_ROLES.includes(adminMembership.role.codeRole)
    ) {
      throw new ForbiddenException(
        'Action réservée aux administrateurs de ce club',
      );
    }

    return adminMembership;
  }

  /**
   * Loads the target membership and verifies the caller is an admin of its club.
   * Locks actions on one's own membership and on a super_admin.
   */
  private async loadTargetAsClubAdmin(
    actorUserId: number,
    membershipId: number,
  ): Promise<Membership> {
    const target = await this.membershipRepo.findOne({
      where: { idMembership: membershipId },
      relations: ['role', 'club', 'user'],
    });

    if (!target) {
      throw new NotFoundException('Membre introuvable');
    }

    await this.assertClubAdmin(actorUserId, target.club.idClub);

    if (target.user.idUser === actorUserId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas effectuer cette action sur votre propre adhésion',
      );
    }

    if (target.role.codeRole === 'super_admin') {
      throw new ForbiddenException(
        'Le rôle super administrateur ne peut pas être modifié',
      );
    }

    return target;
  }

  /**
   * Changes a member's role. Restricted to admins of the club.
   */
  async changeMemberRole(
    actorUserId: number,
    membershipId: number,
    newRoleCode: string,
  ): Promise<{ success: boolean }> {
    if (!ASSIGNABLE_ROLES.includes(newRoleCode)) {
      throw new ForbiddenException('Rôle non assignable');
    }

    const target = await this.loadTargetAsClubAdmin(actorUserId, membershipId);

    const newRole = await this.roleRepo.findOneBy({ codeRole: newRoleCode });
    if (!newRole) {
      throw new NotFoundException('Rôle introuvable');
    }

    target.role = newRole;
    await this.membershipRepo.save(target);
    await this.logService.logMembership({
      action: 'role_changed',
      actorId: actorUserId,
      targetUserId: target.user.idUser,
      clubId: target.club.idClub,
    });

    return { success: true };
  }

  /**
   * Expels a member from the club (removes the membership, keeps the account).
   * Restricted to admins of the club.
   */
  async expelMember(
    actorUserId: number,
    membershipId: number,
  ): Promise<{ success: boolean }> {
    const target = await this.loadTargetAsClubAdmin(actorUserId, membershipId);

    const targetUserId = target.user.idUser;
    const clubId = target.club.idClub;

    await this.membershipRepo.remove(target);
    await this.logService.logMembership({
      action: 'member_expelled',
      actorId: actorUserId,
      targetUserId,
      clubId,
    });

    return { success: true };
  }

  /** Load the caller's active membership with full club context (members, events). */
  async findMyMembership(userId: number): Promise<Membership | null> {
    return this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        status: 'active',
      },
      relations: [
        'user',
        'role',
        'club',
        'club.memberships',
        'club.memberships.user',
        'club.memberships.role',
        'club.events',
      ],
    });
  }

  /**
   * Resolve the caller's membership status for a club: active/pending for this
   * club, or active/pending on another club (with that club's name and slug).
   */
  async getStatusForClub(
    userId: number,
    clubId: number,
  ): Promise<{
    status: 'active' | 'pending' | 'pending_other' | 'active_other' | null;
    clubName?: string;
    clubSlug?: string;
  }> {
    // Check this specific club first
    const forThisClub = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        club: { idClub: clubId },
        season: '2025-2026',
      },
    });

    if (forThisClub) {
      return { status: forThisClub.status as 'active' | 'pending' };
    }

    // Check active membership on any other club
    const activeElsewhere = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        status: 'active',
        season: '2025-2026',
      },
      relations: ['club'],
    });

    if (activeElsewhere) {
      return {
        status: 'active_other',
        clubName: activeElsewhere.club.name,
        clubSlug: activeElsewhere.club.slug,
      };
    }

    // Check pending request on any other club
    const pendingElsewhere = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        status: 'pending',
        season: '2025-2026',
      },
      relations: ['club'],
    });

    if (pendingElsewhere) {
      return {
        status: 'pending_other',
        clubName: pendingElsewhere.club.name,
        clubSlug: pendingElsewhere.club.slug,
      };
    }

    return { status: null };
  }
  /**
   * Create a pending join request with the default member role. Rejects a
   * duplicate request for the club, or an existing membership on another club.
   */
  async requestMembership(
    userId: number,
    clubId: number,
  ): Promise<{ status: string }> {
    // Check no existing membership for this club
    const existingForClub = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        club: { idClub: clubId },
        season: '2025-2026',
      },
    });

    if (existingForClub) {
      throw new ConflictException(
        'Une demande existe déjà pour ce club cette saison',
      );
    }

    // Check no pending or active membership on any other club
    const existingElsewhere = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        season: '2025-2026',
      },
    });

    if (existingElsewhere) {
      throw new ConflictException(
        'Vous avez déjà un membership actif ou en attente sur un autre club',
      );
    }

    const defaultRole = await this.roleRepo.findOneBy({ codeRole: 'member' });

    await this.membershipRepo.save({
      user: { idUser: userId },
      club: { idClub: clubId },
      role: defaultRole!,
      season: '2025-2026',
      membershipDate: new Date(),
      status: 'pending',
    });
    await this.logService.logMembership({
      action: 'request_created',
      actorId: userId,
      clubId,
    });

    return { status: 'pending' };
  }

  /** Remove the caller's own pending request for a club. */
  async cancelRequest(userId: number, clubId: number): Promise<void> {
    const membership = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        club: { idClub: clubId },
        status: 'pending',
        season: '2025-2026',
      },
    });

    if (!membership) {
      throw new NotFoundException('Aucune demande en attente pour ce club');
    }

    await this.membershipRepo.remove(membership);
    await this.logService.logMembership({
      action: 'request_cancelled',
      actorId: userId,
      clubId,
    });
  }

  /** List a club's pending requests, each user stripped of its password hash. */
  async getPendingRequests(clubId: number): Promise<Membership[]> {
    const memberships = await this.membershipRepo.find({
      where: {
        club: { idClub: clubId },
        status: 'pending',
      },
      relations: ['user'],
    });

    return memberships.map((m) => {
      const { passwordHash: _pw, ...safeUser } = m.user;
      return { ...m, user: safeUser };
    }) as Membership[];
  }

  /** Approve a pending request: set it active and stamp the decision date. */
  async acceptRequest(
    membershipId: number,
    clubId: number,
  ): Promise<{ success: boolean }> {
    const membership = await this.membershipRepo.findOne({
      where: {
        idMembership: membershipId,
        club: { idClub: clubId },
        status: 'pending',
      },
    });

    if (!membership) {
      throw new NotFoundException('Demande introuvable');
    }

    membership.status = 'active';
    membership.decisionDate = new Date();
    await this.membershipRepo.save(membership);
    await this.logService.logMembership({
      action: 'request_accepted',
      actorId: membership.user?.idUser,
      clubId,
    });

    return { success: true };
  }

  /** Remove a pending request (rejection). */
  async rejectRequest(membershipId: number, clubId: number): Promise<void> {
    const membership = await this.membershipRepo.findOne({
      where: {
        idMembership: membershipId,
        club: { idClub: clubId },
        status: 'pending',
      },
    });

    if (!membership) {
      throw new NotFoundException('Demande introuvable');
    }

    await this.membershipRepo.remove(membership);
    await this.logService.logMembership({
      action: 'request_rejected',
      actorId: membership.user?.idUser,
      clubId,
    });
  }
}
