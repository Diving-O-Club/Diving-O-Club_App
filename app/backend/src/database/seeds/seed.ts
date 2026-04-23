// src/database/seeds/seed.ts
// Run in /backend : npx ts-node -r tsconfig-paths/register src/database/seeds/seed.ts

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
    // ── 0. CLEAN ──────────────────────────────────────────────────────────────
    console.log('\n🧹 Cleaning existing data...');
    await membershipRepo.query('TRUNCATE TABLE membership CASCADE');
    await eventRepo.query('TRUNCATE TABLE event CASCADE');
    await userRepo.query('TRUNCATE TABLE app_user CASCADE');
    await clubRepo.query('TRUNCATE TABLE club CASCADE');
    await roleRepo.query('TRUNCATE TABLE role CASCADE');
    console.log('  → Tables cleared');

    // ── 1. ROLES ──────────────────────────────────────────────────────────────
    console.log('\n📋 Inserting roles...');
    const roles = await roleRepo.save([
      { codeRole: 'member',      labelRole: 'Adhérent' },
      { codeRole: 'instructor',  labelRole: 'Moniteur' },
      { codeRole: 'committee',   labelRole: 'Membre du comité' },
      { codeRole: 'admin',       labelRole: 'Administrateur' },
      { codeRole: 'super_admin', labelRole: 'Super Administrateur' },
    ]);
    const r = Object.fromEntries(roles.map(role => [role.codeRole, role]));
    console.log(`  → ${roles.length} roles inserted`);

    // ── 2. CLUBS ──────────────────────────────────────────────────────────────
    console.log('\n🏊 Creating 20 clubs...');
    const clubsData = [
      { name: 'Aquaclub21',               slug: 'aquaclub21',               city: 'Dijon',             postalCode: '21000', address: '12 Avenue du Lac',           emailContact: 'contact@aquaclub21.fr' },
      { name: 'Neptune Marseille',         slug: 'neptune-marseille',         city: 'Marseille',         postalCode: '13000', address: '3 Quai du Port',             emailContact: 'contact@neptune-marseille.fr' },
      { name: 'Atlantis Lyon',             slug: 'atlantis-lyon',             city: 'Lyon',              postalCode: '69000', address: '18 Rue de la Plongée',       emailContact: 'contact@atlantis-lyon.fr' },
      { name: 'Océan Bleu Paris',          slug: 'ocean-bleu-paris',          city: 'Paris',             postalCode: '75001', address: '5 Rue des Plongeurs',        emailContact: 'contact@oceanblueparis.fr' },
      { name: 'Poseidon Bordeaux',         slug: 'poseidon-bordeaux',         city: 'Bordeaux',          postalCode: '33000', address: '22 Allée des Dauphins',      emailContact: 'contact@poseidon-bordeaux.fr' },
      { name: 'Dauphin Nantes',            slug: 'dauphin-nantes',            city: 'Nantes',            postalCode: '44000', address: '8 Boulevard Maritime',       emailContact: 'contact@dauphin-nantes.fr' },
      { name: 'Corail Toulon',             slug: 'corail-toulon',             city: 'Toulon',            postalCode: '83000', address: '14 Rue du Corail',           emailContact: 'contact@corail-toulon.fr' },
      { name: 'Triton Nice',               slug: 'triton-nice',               city: 'Nice',              postalCode: '06000', address: '9 Promenade des Plongeurs',  emailContact: 'contact@triton-nice.fr' },
      { name: 'Méduse Montpellier',        slug: 'meduse-montpellier',        city: 'Montpellier',       postalCode: '34000', address: '31 Rue de la Méduse',        emailContact: 'contact@meduse-montpellier.fr' },
      { name: 'Barracuda Strasbourg',      slug: 'barracuda-strasbourg',      city: 'Strasbourg',        postalCode: '67000', address: '2 Quai des Bateliers',       emailContact: 'contact@barracuda-strasbourg.fr' },
      { name: 'Manta Toulouse',            slug: 'manta-toulouse',            city: 'Toulouse',          postalCode: '31000', address: '45 Avenue de la Garonne',    emailContact: 'contact@manta-toulouse.fr' },
      { name: 'Requin Rennes',             slug: 'requin-rennes',             city: 'Rennes',            postalCode: '35000', address: '7 Rue des Plongeurs',        emailContact: 'contact@requin-rennes.fr' },
      { name: 'Baleine Lille',             slug: 'baleine-lille',             city: 'Lille',             postalCode: '59000', address: '19 Rue du Nord',             emailContact: 'contact@baleine-lille.fr' },
      { name: 'Pieuvre Grenoble',          slug: 'pieuvre-grenoble',          city: 'Grenoble',          postalCode: '38000', address: '3 Avenue des Alpes',         emailContact: 'contact@pieuvre-grenoble.fr' },
      { name: 'Morse Brest',               slug: 'morse-brest',               city: 'Brest',             postalCode: '29200', address: '11 Rue du Ponant',           emailContact: 'contact@morse-brest.fr' },
      { name: 'Étoile de Mer Perpignan',   slug: 'etoile-mer-perpignan',      city: 'Perpignan',         postalCode: '66000', address: '6 Avenue du Roussillon',     emailContact: 'contact@etoilemer-perpignan.fr' },
      { name: 'Murène Clermont',           slug: 'murene-clermont',           city: 'Clermont-Ferrand',  postalCode: '63000', address: '28 Rue Blatin',              emailContact: 'contact@murene-clermont.fr' },
      { name: 'Orque Rouen',               slug: 'orque-rouen',               city: 'Rouen',             postalCode: '76000', address: '4 Quai de la Bourse',        emailContact: 'contact@orque-rouen.fr' },
      { name: 'Crevette Angers',           slug: 'crevette-angers',           city: 'Angers',            postalCode: '49000', address: '15 Rue du Maine',            emailContact: 'contact@crevette-angers.fr' },
      { name: 'Oursin Caen',               slug: 'oursin-caen',               city: 'Caen',              postalCode: '14000', address: '23 Avenue de la Côte',       emailContact: 'contact@oursin-caen.fr' },
    ];

    const clubs = await clubRepo.save(clubsData.map(c => ({
      ...c,
      description:   `Club de plongée affilié FFESSM basé à ${c.city}. Formation, sorties et événements pour tous les niveaux.`,
      clubStatus:    'active',
      structureType: 'club',
    })));
    console.log(`  → ${clubs.length} clubs created`);

    // ── 3. USERS ──────────────────────────────────────────────────────────────
    console.log('\n👤 Creating users...');
    const pw = await argon2.hash('123');

    // Super admin — no club
    const superAdmin = await userRepo.save({
      email: 'superadmin@test.com', passwordHash: pw,
      firstName: 'Kevin', lastName: 'Lavier',
      birthDate: new Date('1995-06-15'),
      ffessmLicenseNumber: 'SA-000-0001', technicalLevel: 'N4', phone: '06 00 00 00 00',
    });
    console.log(`  → [super_admin ] Kevin Lavier — superadmin@test.com`);

    // Users no club
    await userRepo.save([
      { email: 'sansclub@test.com',       passwordHash: pw, firstName: 'Léa',     lastName: 'Moreau',  birthDate: new Date('2001-09-14') },
      { email: 'hugo.bernard@gmail.com',  passwordHash: pw, firstName: 'Hugo',    lastName: 'Bernard', birthDate: new Date('1998-03-22') },
      { email: 'camille.simon@gmail.com', passwordHash: pw, firstName: 'Camille', lastName: 'Simon',   birthDate: new Date('1995-11-05') },
      { email: 'pierre.leroy@gmail.com',  passwordHash: pw, firstName: 'Pierre',  lastName: 'Leroy',   birthDate: new Date('1988-07-30') },
      { email: 'marie.petit@gmail.com',   passwordHash: pw, firstName: 'Marie',   lastName: 'Petit',   birthDate: new Date('2000-01-18') },
    ]);
    console.log(`  → 5 users sans club`);

    // Members
    const membersData = [
      { email: 'adherent@test.com',          firstName: 'Marc',    lastName: 'Dupont',   birthDate: new Date('1972-11-08'), ffessmLicenseNumber: '21-001-0001', technicalLevel: 'N2', phone: '06 00 00 01 01', club: clubs[0] },
      { email: 'julie.martin@gmail.com',     firstName: 'Julie',   lastName: 'Martin',   birthDate: new Date('1990-04-12'), ffessmLicenseNumber: '13-002-0001', technicalLevel: 'N1', phone: '06 00 00 01 02', club: clubs[1] },
      { email: 'antoine.garcia@gmail.com',   firstName: 'Antoine', lastName: 'Garcia',   birthDate: new Date('1985-08-25'), ffessmLicenseNumber: '69-003-0001', technicalLevel: 'N3', phone: '06 00 00 01 03', club: clubs[2] },
      { email: 'sarah.roux@gmail.com',       firstName: 'Sarah',   lastName: 'Roux',     birthDate: new Date('1993-02-14'), ffessmLicenseNumber: '75-004-0001', technicalLevel: 'N1', phone: '06 00 00 01 04', club: clubs[3] },
      { email: 'nicolas.fournier@gmail.com', firstName: 'Nicolas', lastName: 'Fournier', birthDate: new Date('1980-06-03'), ffessmLicenseNumber: '33-005-0001', technicalLevel: 'N2', phone: '06 00 00 01 05', club: clubs[4] },
    ];

    const members: AppUser[] = [];
    for (const { club, ...userData } of membersData) {
      const user = await userRepo.save({ ...userData, passwordHash: pw });
      await membershipRepo.save({ user, club, role: r['member'], season: '2025-2026', membershipDate: new Date(), decisionDate: new Date(), status: 'active' });
      members.push(user);
      console.log(`  → [member      ] ${user.firstName} ${user.lastName} — ${user.email} → ${club.name}`);
    }

    // Instructors
    const instructorsData = [
      { email: 'moniteur@test.com',              firstName: 'Thomas', lastName: 'Dubois',  birthDate: new Date('1987-07-22'), ffessmLicenseNumber: '21-001-0010', technicalLevel: 'MF1', phone: '06 00 00 02 01', club: clubs[0] },
      { email: 'claire.bonnet@neptune.fr',       firstName: 'Claire', lastName: 'Bonnet',  birthDate: new Date('1983-09-10'), ffessmLicenseNumber: '13-002-0010', technicalLevel: 'MF2', phone: '06 00 00 02 02', club: clubs[1] },
      { email: 'lucas.mercier@atlantis.fr',      firstName: 'Lucas',  lastName: 'Mercier', birthDate: new Date('1991-01-28'), ffessmLicenseNumber: '69-003-0010', technicalLevel: 'MF1', phone: '06 00 00 02 03', club: clubs[2] },
      { email: 'emma.lambert@oceanblueparis.fr', firstName: 'Emma',   lastName: 'Lambert', birthDate: new Date('1986-05-17'), ffessmLicenseNumber: '75-004-0010', technicalLevel: 'MF1', phone: '06 00 00 02 04', club: clubs[3] },
      { email: 'paul.girard@poseidon.fr',        firstName: 'Paul',   lastName: 'Girard',  birthDate: new Date('1979-12-04'), ffessmLicenseNumber: '33-005-0010', technicalLevel: 'MF2', phone: '06 00 00 02 05', club: clubs[4] },
    ];

    const instructors: AppUser[] = [];
    for (const { club, ...userData } of instructorsData) {
      const user = await userRepo.save({ ...userData, passwordHash: pw });
      await membershipRepo.save({ user, club, role: r['instructor'], season: '2025-2026', membershipDate: new Date(), decisionDate: new Date(), status: 'active' });
      instructors.push(user);
      console.log(`  → [instructor  ] ${user.firstName} ${user.lastName} — ${user.email} → ${club.name}`);
    }

    // Admins
    const adminsData = [
      { email: 'admin@test.com',                     firstName: 'Sophie', lastName: 'Martin',    birthDate: new Date('1982-03-15'), ffessmLicenseNumber: '21-001-0020', technicalLevel: 'N4', phone: '06 00 00 03 01', club: clubs[0] },
      { email: 'julien.robert@neptune.fr',           firstName: 'Julien', lastName: 'Robert',    birthDate: new Date('1979-06-10'), ffessmLicenseNumber: '13-002-0020', technicalLevel: 'N3', phone: '06 00 00 03 02', club: clubs[1] },
      { email: 'alice.durand@atlantis.fr',           firstName: 'Alice',  lastName: 'Durand',    birthDate: new Date('1984-11-22'), ffessmLicenseNumber: '69-003-0020', technicalLevel: 'N4', phone: '06 00 00 03 03', club: clubs[2] },
      { email: 'remi.chevalier@oceanblueparis.fr',   firstName: 'Rémi',   lastName: 'Chevalier', birthDate: new Date('1976-08-09'), ffessmLicenseNumber: '75-004-0020', technicalLevel: 'N3', phone: '06 00 00 03 04', club: clubs[3] },
    ];

    const admins: AppUser[] = [];
    for (const { club, ...userData } of adminsData) {
      const user = await userRepo.save({ ...userData, passwordHash: pw });
      await membershipRepo.save({ user, club, role: r['admin'], season: '2025-2026', membershipDate: new Date(), decisionDate: new Date(), status: 'active' });
      admins.push(user);
      console.log(`  → [admin       ] ${user.firstName} ${user.lastName} — ${user.email} → ${club.name}`);
    }

    // ── 4. EVENTS ─────────────────────────────────────────────────────────────
    console.log('\n📅 Creating events...');

    type EventData = {
      club: Club; creator: AppUser; title: string; description: string;
      eventType: string; startDatetime: Date; endDatetime: Date;
      location: string; minimumLevel: string; maxCapacity: number;
      isPaid: boolean; price: number | undefined; status: string;
    };

    const eventsData: EventData[] = [
      // Aquaclub21 (clubs[0])
      {
        club: clubs[0], creator: instructors[0],
        title: 'Sortie plongée — Lac de Saint-Point',
        description: 'Sortie en eau libre. Deux plongées à 15m et 25m. Départ covoiturage à 7h.',
        eventType: 'dive_trip', startDatetime: new Date('2026-05-10T07:00:00'), endDatetime: new Date('2026-05-10T18:00:00'),
        location: 'Lac de Saint-Point, Malbuisson (25)', minimumLevel: 'N2', maxCapacity: 12, isPaid: true, price: 35, status: 'active',
      },
      {
        club: clubs[0], creator: instructors[0],
        title: 'Formation Niveau 1 — Printemps 2026',
        description: 'Formation complète N1 FFESSM. 6 séances piscine + 2 plongées milieu naturel.',
        eventType: 'training', startDatetime: new Date('2026-04-19T09:00:00'), endDatetime: new Date('2026-06-14T18:00:00'),
        location: 'Piscine Équinoxe, Dijon', minimumLevel: 'all', maxCapacity: 10, isPaid: true, price: 150, status: 'active',
      },
      {
        club: clubs[0], creator: admins[0],
        title: 'Assemblée Générale 2026',
        description: 'Bilan annuel, présentation des projets 2026-2027, renouvellement du bureau.',
        eventType: 'social', startDatetime: new Date('2026-05-03T14:00:00'), endDatetime: new Date('2026-05-03T17:00:00'),
        location: 'Salle polyvalente Aquaclub21, Dijon', minimumLevel: 'all', maxCapacity: 50, isPaid: false, price: undefined, status: 'active',
      },
      {
        club: clubs[0], creator: instructors[0],
        title: 'Séance piscine hebdomadaire',
        description: 'Entraînement hebdomadaire. Exercices techniques, palmage, remontées.',
        eventType: 'pool_session', startDatetime: new Date('2026-04-22T20:30:00'), endDatetime: new Date('2026-04-22T22:00:00'),
        location: 'Piscine Équinoxe, Dijon', minimumLevel: 'all', maxCapacity: 20, isPaid: false, price: undefined, status: 'active',
      },
      // Neptune Marseille (clubs[1])
      {
        club: clubs[1], creator: instructors[1],
        title: 'Plongée Calanques — Sormiou',
        description: 'Sortie plongée dans les calanques de Marseille. Faune méditerranéenne.',
        eventType: 'dive_trip', startDatetime: new Date('2026-05-15T08:00:00'), endDatetime: new Date('2026-05-15T17:00:00'),
        location: 'Calanque de Sormiou, Marseille', minimumLevel: 'N2', maxCapacity: 10, isPaid: true, price: 45, status: 'active',
      },
      {
        club: clubs[1], creator: instructors[1],
        title: 'Baptême de plongée — Piscine Luminy',
        description: 'Découverte de la plongée en piscine. Matériel fourni, aucun prérequis.',
        eventType: 'initiation', startDatetime: new Date('2026-05-08T10:00:00'), endDatetime: new Date('2026-05-08T12:00:00'),
        location: 'Piscine de Luminy, Marseille', minimumLevel: 'all', maxCapacity: 8, isPaid: true, price: 20, status: 'active',
      },
      // Atlantis Lyon (clubs[2])
      {
        club: clubs[2], creator: instructors[2],
        title: 'Sortie Lac du Bourget',
        description: 'Plongée dans le plus grand lac naturel de France. Visibilité exceptionnelle.',
        eventType: 'dive_trip', startDatetime: new Date('2026-05-24T07:30:00'), endDatetime: new Date('2026-05-24T18:00:00'),
        location: 'Lac du Bourget, Aix-les-Bains', minimumLevel: 'N1', maxCapacity: 16, isPaid: true, price: 40, status: 'active',
      },
      {
        club: clubs[2], creator: admins[2],
        title: 'Soirée conviviale Atlantis',
        description: 'Repas annuel du club. Remise des brevets de la saison.',
        eventType: 'social', startDatetime: new Date('2026-06-07T19:00:00'), endDatetime: new Date('2026-06-07T23:00:00'),
        location: 'Restaurant Le Nautilus, Lyon', minimumLevel: 'all', maxCapacity: 40, isPaid: true, price: 30, status: 'active',
      },
      // Océan Bleu Paris (clubs[3])
      {
        club: clubs[3], creator: instructors[3],
        title: 'Stage perfectionnement N2',
        description: 'Stage intensif de préparation à l\'examen Niveau 2 FFESSM.',
        eventType: 'training', startDatetime: new Date('2026-05-17T09:00:00'), endDatetime: new Date('2026-05-17T18:00:00'),
        location: 'Piscine Georges Vallerey, Paris', minimumLevel: 'N1', maxCapacity: 8, isPaid: true, price: 80, status: 'active',
      },
      {
        club: clubs[3], creator: instructors[3],
        title: 'Entraînement apnée',
        description: 'Session apnée statique et dynamique. Encadrement par moniteur certifié.',
        eventType: 'pool_session', startDatetime: new Date('2026-04-29T19:00:00'), endDatetime: new Date('2026-04-29T21:00:00'),
        location: 'Piscine de la Butte-aux-Cailles, Paris', minimumLevel: 'all', maxCapacity: 12, isPaid: false, price: undefined, status: 'active',
      },
      // Poseidon Bordeaux (clubs[4])
      {
        club: clubs[4], creator: instructors[4],
        title: 'Plongée épave — La Gironde',
        description: 'Exploration d\'une épave historique dans l\'estuaire de la Gironde.',
        eventType: 'dive_trip', startDatetime: new Date('2026-06-14T06:30:00'), endDatetime: new Date('2026-06-14T17:00:00'),
        location: 'Estuaire de la Gironde, Bordeaux', minimumLevel: 'N2', maxCapacity: 8, isPaid: true, price: 55, status: 'active',
      },
      // Past events
      {
        club: clubs[0], creator: instructors[0],
        title: 'Sortie plongée — Lac de Panthier',
        description: 'Plongée dans le lac de Panthier en Côte-d\'Or.',
        eventType: 'dive_trip', startDatetime: new Date('2026-03-15T08:00:00'), endDatetime: new Date('2026-03-15T17:00:00'),
        location: 'Lac de Panthier, Vandenesse-en-Auxois (21)', minimumLevel: 'N1', maxCapacity: 12, isPaid: true, price: 25, status: 'active',
      },
      {
        club: clubs[1], creator: instructors[1],
        title: 'Formation Nitrox — Mars 2026',
        description: 'Formation à la plongée au nitrox. Théorie + pratique piscine.',
        eventType: 'training', startDatetime: new Date('2026-03-22T09:00:00'), endDatetime: new Date('2026-03-22T17:00:00'),
        location: 'Club Neptune, Marseille', minimumLevel: 'N2', maxCapacity: 6, isPaid: true, price: 120, status: 'active',
      },
      {
        club: clubs[2], creator: instructors[2],
        title: 'Baptême hivernal — Piscine de Gerland',
        description: 'Session découverte de début d\'année. Tous niveaux.',
        eventType: 'initiation', startDatetime: new Date('2026-02-14T10:00:00'), endDatetime: new Date('2026-02-14T12:00:00'),
        location: 'Piscine de Gerland, Lyon', minimumLevel: 'all', maxCapacity: 10, isPaid: true, price: 15, status: 'active',
      },
      {
        club: clubs[3], creator: admins[3],
        title: 'AG Paris — Hiver 2026',
        description: 'Assemblée générale ordinaire de l\'Océan Bleu Paris.',
        eventType: 'social', startDatetime: new Date('2026-02-28T14:00:00'), endDatetime: new Date('2026-02-28T17:00:00'),
        location: 'Mairie du 20e, Paris', minimumLevel: 'all', maxCapacity: 35, isPaid: false, price: undefined, status: 'active',
      },
      {
        club: clubs[4], creator: instructors[4],
        title: 'Séance technique — Janvier 2026',
        description: 'Révision des techniques de sécurité. Gestion des pannes de détendeur.',
        eventType: 'pool_session', startDatetime: new Date('2026-01-20T19:30:00'), endDatetime: new Date('2026-01-20T21:30:00'),
        location: 'Piscine Judaïque, Bordeaux', minimumLevel: 'N1', maxCapacity: 14, isPaid: false, price: undefined, status: 'active',
      },
      // Secondary clubs
      {
        club: clubs[5], creator: admins[0],
        title: 'Plongée lac de Grand-Lieu',
        description: 'Sortie lac à Nantes. Découverte de la faune locale.',
        eventType: 'dive_trip', startDatetime: new Date('2026-05-30T08:00:00'), endDatetime: new Date('2026-05-30T17:00:00'),
        location: 'Lac de Grand-Lieu, Saint-Philbert', minimumLevel: 'N1', maxCapacity: 10, isPaid: true, price: 30, status: 'active',
      },
      {
        club: clubs[6], creator: admins[0],
        title: 'Plongée Méditerranée — Presqu\'île de Giens',
        description: 'Sortie mer au départ de Toulon. Tombant et faune méditerranéenne.',
        eventType: 'dive_trip', startDatetime: new Date('2026-06-21T07:00:00'), endDatetime: new Date('2026-06-21T17:00:00'),
        location: 'Presqu\'île de Giens, Toulon', minimumLevel: 'N2', maxCapacity: 10, isPaid: true, price: 50, status: 'active',
      },
      {
        club: clubs[7], creator: admins[0],
        title: 'Formation Niveau 2 — Été 2026',
        description: 'Préparation au brevet N2. Sessions piscine et milieu naturel.',
        eventType: 'training', startDatetime: new Date('2026-07-05T09:00:00'), endDatetime: new Date('2026-08-30T18:00:00'),
        location: 'Piscine Jean Médecin + Mer, Nice', minimumLevel: 'N1', maxCapacity: 8, isPaid: true, price: 180, status: 'active',
      },
      {
        club: clubs[8], creator: admins[0],
        title: 'Randonnée palmée — Étang de Thau',
        description: 'Sortie snorkeling dans l\'étang de Thau. Accessible à tous.',
        eventType: 'initiation', startDatetime: new Date('2026-05-20T10:00:00'), endDatetime: new Date('2026-05-20T13:00:00'),
        location: 'Étang de Thau, Sète', minimumLevel: 'all', maxCapacity: 20, isPaid: false, price: undefined, status: 'active',
      },
    ];

    for (const eventData of eventsData) {
      const event = eventRepo.create({ ...eventData, price: eventData.price ?? undefined });
      await eventRepo.save(event);
      console.log(`  → [${eventData.eventType.padEnd(12)}] ${eventData.title}`);
    }

    // ── RÉSUMÉ ────────────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════════════════');
    console.log('  ✅  Seed completed successfully!');
    console.log('  🏊  Clubs    : 20');
    console.log('  👤  Users    : 20 (1 super admin, 5 sans club, 5 membres, 5 moniteurs, 4 admins)');
    console.log('  📅  Events   : 20');
    console.log('');
    console.log('  🔑  Password for all accounts : 123');
    console.log('');
    console.log('  Accounts:');
    console.log('  super_admin → superadmin@test.com');
    console.log('  admin       → admin@test.com');
    console.log('  instructor  → moniteur@test.com');
    console.log('  member      → adherent@test.com');
    console.log('  sans club   → sansclub@test.com');
    console.log('════════════════════════════════════════════════════════════════\n');

  } catch (err) {
    console.error('❌ Seed failed:', err);
    throw err;
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});