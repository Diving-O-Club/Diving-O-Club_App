// backend/src/membership/membership.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MembershipService } from './membership.service';
import { Membership } from './membership.entity';
import { Role } from '../role/role.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { LogService } from '../log/log.service';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockMembershipRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockRoleRepo = {
  findOneBy: jest.fn(),
};

const mockLogService = {
  logAuth: jest.fn(),
  logMembership: jest.fn(),
  logError: jest.fn(),
};

// ── Helpers ────────────────────────────────────────────────────────────────
const makeMembership = (overrides: Partial<Membership> = {}): Membership => ({
  idMembership: 1,
  status: 'active',
  season: '2025-2026',
  membershipDate: new Date(),
  decisionDate: null as unknown as Date,
  user: { idUser: 1, email: 'test@test.com' } as any,
  club: { idClub: 1, name: 'Aquaclub21', slug: 'aquaclub21' } as any,
  role: { codeRole: 'member', labelRole: 'Member' } as any,
  ...overrides,
});

// ── Suite ──────────────────────────────────────────────────────────────────
describe('MembershipService', () => {
  let service: MembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: getRepositoryToken(Membership),
          useValue: mockMembershipRepo,
        },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepo },
        { provide: LogService, useValue: mockLogService },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
    jest.clearAllMocks();
  });

  // ── getStatusForClub ───────────────────────────────────────────────────
  describe('getStatusForClub', () => {
    it('should return null when no membership is found', async () => {
      mockMembershipRepo.findOne.mockResolvedValue(null);

      const result = await service.getStatusForClub(1, 1);
      expect(result).toEqual({ status: null });
    });

    it('should return active when user has an active membership for this club', async () => {
      mockMembershipRepo.findOne.mockResolvedValueOnce(
        makeMembership({ status: 'active' }),
      );

      const result = await service.getStatusForClub(1, 1);
      expect(result).toEqual({ status: 'active' });
    });

    it('should return pending when user has a pending request for this club', async () => {
      mockMembershipRepo.findOne.mockResolvedValueOnce(
        makeMembership({ status: 'pending' }),
      );

      const result = await service.getStatusForClub(1, 1);
      expect(result).toEqual({ status: 'pending' });
    });

    it('should return active_other when user is an active member of a different club', async () => {
      mockMembershipRepo.findOne.mockResolvedValueOnce(null); // no membership for this club
      mockMembershipRepo.findOne.mockResolvedValueOnce(
        // active elsewhere
        makeMembership({
          status: 'active',
          club: { idClub: 2, name: 'Neptune', slug: 'neptune' } as any,
        }),
      );

      const result = await service.getStatusForClub(1, 1);
      expect(result.status).toBe('active_other');
    });

    it('should return pending_other with clubName and clubSlug when user has a pending request for a different club', async () => {
      mockMembershipRepo.findOne.mockResolvedValueOnce(null); // no membership for this club
      mockMembershipRepo.findOne.mockResolvedValueOnce(null); // no active elsewhere
      mockMembershipRepo.findOne.mockResolvedValueOnce(
        // pending elsewhere
        makeMembership({
          status: 'pending',
          club: {
            idClub: 3,
            name: 'Neptune Marseille',
            slug: 'neptune-marseille',
          } as any,
        }),
      );

      const result = await service.getStatusForClub(1, 1);
      expect(result).toEqual({
        status: 'pending_other',
        clubName: 'Neptune Marseille',
        clubSlug: 'neptune-marseille',
      });
    });
  });

  // ── requestMembership ──────────────────────────────────────────────────
  describe('requestMembership', () => {
    it('should create a pending membership successfully', async () => {
      mockMembershipRepo.findOne.mockResolvedValue(null);
      mockRoleRepo.findOneBy.mockResolvedValue({ codeRole: 'member' });
      mockMembershipRepo.save.mockResolvedValue(
        makeMembership({ status: 'pending' }),
      );

      const result = await service.requestMembership(1, 1);
      expect(result).toEqual({ status: 'pending' });
      expect(mockMembershipRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when a request already exists for this club', async () => {
      mockMembershipRepo.findOne.mockResolvedValueOnce(
        makeMembership({ status: 'pending' }),
      );

      await expect(service.requestMembership(1, 1)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException when user already has a membership elsewhere', async () => {
      mockMembershipRepo.findOne.mockResolvedValueOnce(null);
      mockMembershipRepo.findOne.mockResolvedValueOnce(
        makeMembership({ status: 'active' }),
      );

      await expect(service.requestMembership(1, 2)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ── cancelRequest ──────────────────────────────────────────────────────
  describe('cancelRequest', () => {
    it('should remove the pending membership successfully', async () => {
      const membership = makeMembership({ status: 'pending' });
      mockMembershipRepo.findOne.mockResolvedValue(membership);
      mockMembershipRepo.remove.mockResolvedValue(undefined);

      await service.cancelRequest(1, 1);
      expect(mockMembershipRepo.remove).toHaveBeenCalledWith(membership);
    });

    it('should throw NotFoundException when no pending request is found', async () => {
      mockMembershipRepo.findOne.mockResolvedValue(null);

      await expect(service.cancelRequest(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── acceptRequest ──────────────────────────────────────────────────────
  describe('acceptRequest', () => {
    it('should set membership status to active and set decisionDate', async () => {
      const membership = makeMembership({ status: 'pending' });
      mockMembershipRepo.findOne.mockResolvedValue(membership);
      mockMembershipRepo.save.mockResolvedValue({
        ...membership,
        status: 'active',
      });

      const result = await service.acceptRequest(1, 1);
      expect(result).toEqual({ success: true });
      expect(mockMembershipRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'active',
          decisionDate: expect.any(Date),
        }),
      );
    });

    it('should throw NotFoundException when membership is not found', async () => {
      mockMembershipRepo.findOne.mockResolvedValue(null);

      await expect(service.acceptRequest(99, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── rejectRequest ──────────────────────────────────────────────────────
  describe('rejectRequest', () => {
    it('should remove the pending membership successfully', async () => {
      const membership = makeMembership({ status: 'pending' });
      mockMembershipRepo.findOne.mockResolvedValue(membership);
      mockMembershipRepo.remove.mockResolvedValue(undefined);

      await service.rejectRequest(1, 1);
      expect(mockMembershipRepo.remove).toHaveBeenCalledWith(membership);
    });

    it('should throw NotFoundException when membership is not found', async () => {
      mockMembershipRepo.findOne.mockResolvedValue(null);

      await expect(service.rejectRequest(99, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
