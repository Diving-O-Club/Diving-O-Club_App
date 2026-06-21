// backend/src/event/event.service.spec.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { EventService } from './event.service';
import { ClubEvent } from './event.entity';
import { EventRegistration } from './event-registration.entity';
import { Membership } from '../membership/membership.entity';
import { LogService } from '../log/log.service';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockEventRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockRegistrationRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockMembershipRepo = {
  findOne: jest.fn(),
};

const mockLogService = {
  logAuth: jest.fn(),
  logMembership: jest.fn(),
  logError: jest.fn(),
};

// ── Helpers ────────────────────────────────────────────────────────────────
const makeMembership = (codeRole: string, clubId: number): Membership =>
  ({
    idMembership: 1,
    status: 'active',
    role: { codeRole, labelRole: codeRole } as any,
    club: { idClub: clubId } as any,
    user: { idUser: 1 } as any,
  }) as Membership;

const validDto = {
  title: 'Sortie fosse',
  startDatetime: '2026-07-01T10:00:00.000Z',
  endDatetime: '2026-07-01T12:00:00.000Z',
} as any;

// ── Suite ──────────────────────────────────────────────────────────────────
describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: getRepositoryToken(ClubEvent), useValue: mockEventRepo },
        {
          provide: getRepositoryToken(EventRegistration),
          useValue: mockRegistrationRepo,
        },
        {
          provide: getRepositoryToken(Membership),
          useValue: mockMembershipRepo,
        },
        { provide: LogService, useValue: mockLogService },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    jest.clearAllMocks();
  });

  // ── create ───────────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create the event when user is a manager of the targeted club', async () => {
      mockMembershipRepo.findOne.mockResolvedValue(makeMembership('admin', 1));
      mockEventRepo.create.mockImplementation((e: object) => e);
      mockEventRepo.save.mockImplementation((e: object) => Promise.resolve(e));

      await service.create(1, 1, validDto);

      // the role check is properly scoped to the targeted club
      expect(mockMembershipRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            user: { idUser: 1 },
            club: { idClub: 1 },
            status: 'active',
          }),
        }),
      );
      expect(mockEventRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should forbid creating an event in a club where the user is not a manager (cross-club)', async () => {
      // admin of club 1, but no active manager membership in club 2
      mockMembershipRepo.findOne.mockResolvedValue(null);

      await expect(service.create(1, 2, validDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockMembershipRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ club: { idClub: 2 } }),
        }),
      );
      expect(mockEventRepo.save).not.toHaveBeenCalled();
    });

    it('should forbid a plain member', async () => {
      mockMembershipRepo.findOne.mockResolvedValue(makeMembership('member', 1));

      await expect(service.create(1, 1, validDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockEventRepo.save).not.toHaveBeenCalled();
    });
  });

  // ── update ───────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should check the role against the event club, not just any club', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        idEvent: 10,
        club: { idClub: 5 },
      });
      mockMembershipRepo.findOne.mockResolvedValue(makeMembership('admin', 5));
      mockEventRepo.save.mockImplementation((e: object) => Promise.resolve(e));

      await service.update(1, 10, { title: 'Modifié' } as any);

      expect(mockMembershipRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ club: { idClub: 5 } }),
        }),
      );
      expect(mockEventRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should forbid a manager of another club from updating the event', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        idEvent: 10,
        club: { idClub: 5 },
      });
      // no active manager membership in club 5
      mockMembershipRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update(1, 10, { title: 'Modifié' } as any),
      ).rejects.toThrow(ForbiddenException);
      expect(mockEventRepo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the event does not exist', async () => {
      mockEventRepo.findOne.mockResolvedValue(null);

      await expect(service.update(1, 999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── delete ───────────────────────────────────────────────────────────────
  describe('delete', () => {
    it('should remove the event when user is a manager of the event club', async () => {
      const event = { idEvent: 10, club: { idClub: 5 } };
      mockEventRepo.findOne.mockResolvedValue(event);
      mockMembershipRepo.findOne.mockResolvedValue(makeMembership('admin', 5));

      await service.delete(1, 10);

      expect(mockMembershipRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ club: { idClub: 5 } }),
        }),
      );
      expect(mockEventRepo.remove).toHaveBeenCalledWith(event);
    });

    it('should forbid a manager of another club from deleting the event', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        idEvent: 10,
        club: { idClub: 5 },
      });
      mockMembershipRepo.findOne.mockResolvedValue(null);

      await expect(service.delete(1, 10)).rejects.toThrow(ForbiddenException);
      expect(mockEventRepo.remove).not.toHaveBeenCalled();
    });
  });

  // ── register ─────────────────────────────────────────────────────────────
  describe('register', () => {
    it('should register an active member when spots remain', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        idEvent: 10,
        maxCapacity: 5,
        club: { idClub: 1 },
      });
      mockMembershipRepo.findOne.mockResolvedValue(makeMembership('member', 1));
      mockRegistrationRepo.findOne.mockResolvedValue(null); // not yet registered
      mockRegistrationRepo.count.mockResolvedValue(2); // 2 < 5

      const result = await service.register(1, 10);
      expect(result.status).toBe('registered');
      expect(result.message).toBe('Inscription réussie');
      expect(mockRegistrationRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'registered' }),
      );
    });

    it('should waitlist when the event is full', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        idEvent: 10,
        maxCapacity: 2,
        club: { idClub: 1 },
      });
      mockMembershipRepo.findOne.mockResolvedValue(makeMembership('member', 1));
      mockRegistrationRepo.findOne.mockResolvedValue(null);
      mockRegistrationRepo.count.mockResolvedValue(2); // full

      const result = await service.register(1, 10);
      expect(result.status).toBe('waitlist');
      expect(mockRegistrationRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'waitlist' }),
      );
    });

    it('should always register when capacity is unlimited (null)', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        idEvent: 10,
        maxCapacity: null,
        club: { idClub: 1 },
      });
      mockMembershipRepo.findOne.mockResolvedValue(makeMembership('member', 1));
      mockRegistrationRepo.findOne.mockResolvedValue(null);

      const result = await service.register(1, 10);
      expect(result.status).toBe('registered');
      expect(mockRegistrationRepo.count).not.toHaveBeenCalled();
    });

    it('should forbid a non-member of the club', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        idEvent: 10,
        maxCapacity: 5,
        club: { idClub: 1 },
      });
      mockMembershipRepo.findOne.mockResolvedValue(null); // not a member

      await expect(service.register(1, 10)).rejects.toThrow(ForbiddenException);
      expect(mockRegistrationRepo.save).not.toHaveBeenCalled();
    });

    it('should reject a duplicate registration', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        idEvent: 10,
        maxCapacity: 5,
        club: { idClub: 1 },
      });
      mockMembershipRepo.findOne.mockResolvedValue(makeMembership('member', 1));
      mockRegistrationRepo.findOne.mockResolvedValue({ idRegistration: 99 });

      await expect(service.register(1, 10)).rejects.toThrow(ConflictException);
      expect(mockRegistrationRepo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the event does not exist', async () => {
      mockEventRepo.findOne.mockResolvedValue(null);
      await expect(service.register(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  // ── unregister ───────────────────────────────────────────────────────────
  describe('unregister', () => {
    it('should remove the registration and promote the first waitlisted member', async () => {
      const myReg = {
        idRegistration: 1,
        status: 'registered',
        event: { club: { idClub: 1 } },
      };
      const nextInLine = { idRegistration: 2, status: 'waitlist' };
      mockRegistrationRepo.findOne
        .mockResolvedValueOnce(myReg) // my registration
        .mockResolvedValueOnce(nextInLine); // next waitlisted

      const result = await service.unregister(1, 10);
      expect(result.success).toBe(true);
      expect(mockRegistrationRepo.remove).toHaveBeenCalledWith(myReg);
      expect(mockRegistrationRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'registered' }),
      );
    });

    it('should not promote anyone when the user was on the waitlist', async () => {
      const myReg = {
        idRegistration: 3,
        status: 'waitlist',
        event: { club: { idClub: 1 } },
      };
      mockRegistrationRepo.findOne.mockResolvedValueOnce(myReg);

      await service.unregister(1, 10);
      expect(mockRegistrationRepo.remove).toHaveBeenCalledWith(myReg);
      expect(mockRegistrationRepo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the user is not registered', async () => {
      mockRegistrationRepo.findOne.mockResolvedValue(null);
      await expect(service.unregister(1, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── getParticipants ──────────────────────────────────────────────────────
  describe('getParticipants', () => {
    it('should split participants into registered and waitlist', async () => {
      mockEventRepo.findOne.mockResolvedValue({ idEvent: 10 });
      mockRegistrationRepo.find.mockResolvedValue([
        { status: 'registered', user: { firstName: 'A', lastName: 'A' } },
        { status: 'waitlist', user: { firstName: 'B', lastName: 'B' } },
        { status: 'registered', user: { firstName: 'C', lastName: 'C' } },
      ]);

      const result = await service.getParticipants(10);
      expect(result.registered).toHaveLength(2);
      expect(result.waitlist).toHaveLength(1);
      expect(result.registered[0]).toEqual({ firstName: 'A', lastName: 'A' });
    });

    it('should throw NotFoundException when the event does not exist', async () => {
      mockEventRepo.findOne.mockResolvedValue(null);
      await expect(service.getParticipants(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
