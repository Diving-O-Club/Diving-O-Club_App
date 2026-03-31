// src/database/seeds/aquaclub21.seed.ts
// Run with: npx ts-node -r tsconfig-paths/register src/database/seeds/aquaclub21.seed.ts

import { AppDataSource } from '../data-source';
import * as argon2 from 'argon2';
import { Role } from '../../role/role.entity';
import { Club } from '../../club/club.entity';
import { AppUser } from '../../app-user/app-user.entity';
import { Membership } from '../../membership/membership.entity';
import { ClubEvent } from '../../event/event.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Database connection established');

  const roleRepo       = AppDataSource.getRepository(Role);
  const clubRepo       = AppDataSource.getRepository(Club);
  const userRepo       = AppDataSource.getRepository(AppUser);
  const membershipRepo = AppDataSource.getRepository(Membership);
  const eventRepo      = AppDataSource.getRepository(ClubEvent);

  try {
    // ── 1. ROLES ─────────────────────────────────────────────────────────────
    console.log('\n📋 Inserting roles...');

    const roles = await roleRepo.save([
      { codeRole: 'member',      labelRole: 'Member' },
      { codeRole: 'instructor',  labelRole: 'Instructor' },
      { codeRole: 'committee',   labelRole: 'Board member' },
      { codeRole: 'admin',       labelRole: 'Administrator' },
      { codeRole: 'super_admin', labelRole: 'Super Administrator' },
    ]);

    console.log(`  → ${roles.length} roles inserted`);

    const roleMap = Object.fromEntries(roles.map((r) => [r.codeRole, r]));

    // ── 2. CLUB ───────────────────────────────────────────────────────────────
    console.log('\n🏊 Creating club Aquaclub21...');

    const club = await clubRepo.save({
      name:          'Aquaclub21',
      description:   'FFESSM-affiliated diving club based in Dijon. Founded in 1988, Aquaclub21 welcomes beginner and experienced divers in a friendly and safe environment.',
      emailContact:  'contact@aquaclub21.fr',
      address:       '12 Avenue du Lac',
      postalCode:    '21000',
      city:          'Dijon',
      clubStatus:    'active',
      structureType: 'club',
    });

    console.log(`  → Club "${club.name}" created (id: ${club.idClub})`);

    // ── 3. USERS & MEMBERSHIPS ────────────────────────────────────────────────
    console.log('\n👤 Creating users and memberships...');

    const passwordHash = await argon2.hash('Plongee2025!');

    const usersData = [
      {
        email: 'kevin.lavier@divingoclub.com',
        lastName: 'Lavier', firstName: 'Kevin',
        birthDate: new Date('1995-01-01'),
        ffessmLicenseNumber: '21-001-0001',
        technicalLevel: 'N4', phone: '06 00 00 00 01',
        role: 'super_admin',
      },
      {
        email: 'sophie.martin@aquaclub21.fr',
        lastName: 'Martin', firstName: 'Sophie',
        birthDate: new Date('1982-03-15'),
        ffessmLicenseNumber: '21-001-0002',
        technicalLevel: 'N4', phone: '06 00 00 00 02',
        role: 'admin',
      },
      {
        email: 'thomas.dubois@aquaclub21.fr',
        lastName: 'Dubois', firstName: 'Thomas',
        birthDate: new Date('1987-07-22'),
        ffessmLicenseNumber: '21-001-0003',
        technicalLevel: 'MF1', phone: '06 00 00 00 03',
        role: 'instructor',
      },
      {
        email: 'marc.dupont@gmail.com',
        lastName: 'Dupont', firstName: 'Marc',
        birthDate: new Date('1972-11-08'),
        ffessmLicenseNumber: '21-001-0004',
        technicalLevel: 'N2', phone: '06 00 00 00 04',
        role: 'member',
      },
      {
        email: 'chloe.petit@gmail.com',
        lastName: 'Petit', firstName: 'Chloé',
        birthDate: new Date('1997-05-30'),
        ffessmLicenseNumber: '21-001-0005',
        technicalLevel: 'N1', phone: '06 00 00 00 05',
        role: 'member',
      },
    ];

    for (const userData of usersData) {
      const { role: roleCode, ...userFields } = userData;

      const user = await userRepo.save({ ...userFields, passwordHash });

      await membershipRepo.save({
        user,
        club,
        role:           roleMap[roleCode],
        season:         '2025-2026',
        membershipDate: new Date(),
        decisionDate:   new Date(),
        status:         'active',
      });

      console.log(
        `  → ${roleCode.padEnd(11)} : ${user.firstName} ${user.lastName} (${user.technicalLevel})`,
      );
    }

    // ── 4. EVENTS ─────────────────────────────────────────────────────────────
    console.log('\n📅 Creating events...');

    // findOneBy returns AppUser | null — we assert non-null after checking
    const thomas = await userRepo.findOneBy({ email: 'thomas.dubois@aquaclub21.fr' });
    const sophie = await userRepo.findOneBy({ email: 'sophie.martin@aquaclub21.fr' });

    if (!thomas || !sophie) {
      throw new Error('Creators not found — make sure users were inserted first');
    }

    // Define event type explicitly so TypeScript knows price is number | undefined
    type EventData = {
      title: string;
      description: string;
      eventType: string;
      startDatetime: Date;
      endDatetime: Date;
      location: string;
      minimumLevel: string;
      maxCapacity: number;
      isPaid: boolean;
      price: number | undefined;
      status: string;
      creator: AppUser;
    };

    const eventsData: EventData[] = [
      {
        title:        'Dive trip — Lac de Saint-Point',
        description:  'Open water dive at Lac de Saint-Point. Two dives planned at 15m and 25m. Carpooling departure from the club at 7:00 AM.',
        eventType:    'dive_trip',
        startDatetime: new Date('2026-04-12T07:00:00'),
        endDatetime:   new Date('2026-04-12T18:00:00'),
        location:     'Lac de Saint-Point, Malbuisson (25)',
        minimumLevel: 'N2',
        maxCapacity:  12,
        isPaid:       true,
        price:        35.00,
        status:       'active',
        creator:      thomas,
      },
      {
        title:        'Level 1 training — Spring 2026',
        description:  'Full FFESSM Level 1 certification training. 6 pool sessions + 2 open water dives. Prerequisites: swim 25m.',
        eventType:    'training',
        startDatetime: new Date('2026-04-19T09:00:00'),
        endDatetime:   new Date('2026-06-14T18:00:00'),
        location:     'Piscine Équinoxe + Lac de Panthier, Dijon',
        minimumLevel: 'all',
        maxCapacity:  10,
        isPaid:       true,
        price:        150.00,
        status:       'active',
        creator:      thomas,
      },
      {
        title:        'Discover scuba diving — Olympic Pool',
        description:  'Discovery session for absolute beginners. Safe initiation in a pool with certified MF1 instructors. Equipment provided.',
        eventType:    'initiation',
        startDatetime: new Date('2026-04-25T10:00:00'),
        endDatetime:   new Date('2026-04-25T12:00:00'),
        location:     'Piscine Olympique, Dijon',
        minimumLevel: 'all',
        maxCapacity:  8,
        isPaid:       true,
        price:        20.00,
        status:       'active',
        creator:      thomas,
      },
      {
        title:        'Annual General Meeting 2026',
        description:  'Annual club meeting. Year review, presentation of 2026-2027 projects, board renewal. Mandatory for board members.',
        eventType:    'social',
        startDatetime: new Date('2026-05-03T14:00:00'),
        endDatetime:   new Date('2026-05-03T17:00:00'),
        location:     'Salle polyvalente Aquaclub21, Dijon',
        minimumLevel: 'all',
        maxCapacity:  50,
        isPaid:       false,
        price:        undefined,
        status:       'active',
        creator:      sophie,
      },
      {
        title:        'Weekly pool session',
        description:  'Weekly pool training. Technical drills, finning, ascents. Open to all levels.',
        eventType:    'pool_session',
        startDatetime: new Date('2026-04-08T20:30:00'),
        endDatetime:   new Date('2026-04-08T22:00:00'),
        location:     'Piscine Équinoxe, Dijon',
        minimumLevel: 'all',
        maxCapacity:  20,
        isPaid:       false,
        price:        undefined,
        status:       'active',
        creator:      thomas,
      },
    ];

    for (const eventData of eventsData) {
      const event = eventRepo.create({ ...eventData, club });
      await eventRepo.save(event);
      console.log(`  → [${event.eventType.padEnd(12)}] ${event.title}`);
    }

    console.log('\n════════════════════════════════════════════════════════');
    console.log('  ✅  Seed completed successfully!');
    console.log(`  🏊  Club    : Aquaclub21`);
    console.log(`  👤  Users   : ${usersData.length}`);
    console.log(`  📅  Events  : ${eventsData.length}`);
    console.log('════════════════════════════════════════════════════════\n');

  } catch (err) {
    console.error('❌ Seed failed:', err);
    throw err;
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
