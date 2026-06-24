import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { Membership } from '../membership/membership.entity';
import { EventRegistration } from '../event/event-registration.entity';
import { Certificate } from '../certificate/certificate.entity';
import { LogService } from '../log/log.service';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockUserRepo = {
  update: jest.fn(),
  softDelete: jest.fn(),
};

// Query builder used by deleteMe to count the other active admins of a club.
const mockMembershipQB = {
  innerJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getCount: jest.fn(),
};
const mockMembershipRepo = {
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
};

// Query builder used by deleteMe to delete the user's certificates.
const mockCertificateQB = {
  delete: jest.fn(),
  where: jest.fn(),
  execute: jest.fn(),
};
const mockCertificateRepo = {
  createQueryBuilder: jest.fn(),
};

const mockRegistrationRepo = {};
const mockJwtService = { sign: jest.fn() };
const mockLogService = {
  logAuth: jest.fn(),
  logMembership: jest.fn(),
  logError: jest.fn(),
};

const makeRes = () => {
  const clearCookie = jest.fn();
  return { res: { clearCookie } as unknown as Response, clearCookie };
};

// ── Suite ──────────────────────────────────────────────────────────────────
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        {
          provide: getRepositoryToken(Membership),
          useValue: mockMembershipRepo,
        },
        {
          provide: getRepositoryToken(EventRegistration),
          useValue: mockRegistrationRepo,
        },
        {
          provide: getRepositoryToken(Certificate),
          useValue: mockCertificateRepo,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: LogService, useValue: mockLogService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();

    // Re-wire the chainable query builders after the reset.
    mockMembershipQB.innerJoin.mockReturnThis();
    mockMembershipQB.where.mockReturnThis();
    mockMembershipQB.andWhere.mockReturnThis();
    mockMembershipRepo.createQueryBuilder.mockReturnValue(mockMembershipQB);

    mockCertificateQB.delete.mockReturnThis();
    mockCertificateQB.where.mockReturnThis();
    mockCertificateQB.execute.mockResolvedValue({});
    mockCertificateRepo.createQueryBuilder.mockReturnValue(mockCertificateQB);
  });

  describe('deleteMe', () => {
    it('blocks deletion when the user is the only admin of a club', async () => {
      mockMembershipRepo.find.mockResolvedValue([
        { idMembership: 1, club: { idClub: 5, name: 'Aquaclub21' } },
      ]);
      mockMembershipQB.getCount.mockResolvedValue(0); // no other admin left

      await expect(service.deleteMe(1, makeRes().res)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepo.update).not.toHaveBeenCalled();
      expect(mockUserRepo.softDelete).not.toHaveBeenCalled();
    });

    it('deletes the account when another admin remains in the club', async () => {
      mockMembershipRepo.find.mockResolvedValue([
        { idMembership: 1, club: { idClub: 5, name: 'Aquaclub21' } },
      ]);
      mockMembershipQB.getCount.mockResolvedValue(1); // another admin exists
      const { res, clearCookie } = makeRes();

      const result = await service.deleteMe(1, res);

      expect(result.message).toBe('Compte supprimé');
      expect(mockUserRepo.update).toHaveBeenCalledTimes(1);
      expect(mockUserRepo.softDelete).toHaveBeenCalledWith(1);
      expect(clearCookie).toHaveBeenCalledWith('access_token');
    });

    it('deletes the account when the user is not an admin of any club', async () => {
      mockMembershipRepo.find.mockResolvedValue([]);
      const { res, clearCookie } = makeRes();

      await service.deleteMe(2, res);

      expect(mockMembershipRepo.createQueryBuilder).not.toHaveBeenCalled();
      expect(mockUserRepo.softDelete).toHaveBeenCalledWith(2);
      expect(clearCookie).toHaveBeenCalledWith('access_token');
    });
  });
});
