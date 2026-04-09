// src/database/seeds/seed.ts
// Run with: npx ts-node -r tsconfig-paths/register src/database/seeds/seed.ts

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

    // ── 2. CLUBS (20) ─────────────────────────────────────────────────────────
    console.log('\n🏊 Creating 20 clubs...');

    const clubsData = [
      { name: 'Aquaclub21',            slug: 'aquaclub21',            city: 'Dijon',         postalCode: '21000', address: '12 Avenue du Lac',         email: 'contact@aquaclub21.fr' },
      { name: 'Neptune Marseille',     slug: 'neptune-marseille',     city: 'Marseille',     postalCode: '13002', address: '5 Quai des Docks',          email: 'contact@neptune-marseille.fr' },
      { name: 'Atlantis Lyon',         slug: 'atlantis-lyon',         city: 'Lyon',          postalCode: '69001', address: '8 Rue du Rhône',            email: 'contact@atlantis-lyon.fr' },
      { name: 'Océan Bleu Paris',      slug: 'ocean-bleu-paris',      city: 'Paris',         postalCode: '75013', address: '42 Rue de la Plongée',      email: 'contact@ocean-bleu-paris.fr' },
      { name: 'Poseidon Bordeaux',     slug: 'poseidon-bordeaux',     city: 'Bordeaux',      postalCode: '33000', address: '17 Cours de la Garonne',    email: 'contact@poseidon-bordeaux.fr' },
      { name: 'Dauphin Nantes',        slug: 'dauphin-nantes',        city: 'Nantes',        postalCode: '44000', address: '3 Rue de la Loire',         email: 'contact@dauphin-nantes.fr' },
      { name: 'Corail Toulon',         slug: 'corail-toulon',         city: 'Toulon',        postalCode: '83000', address: '9 Boulevard Maritime',      email: 'contact@corail-toulon.fr' },
      { name: 'Triton Nice',           slug: 'triton-nice',           city: 'Nice',          postalCode: '06000', address: '22 Promenade des Plongeurs', email: 'contact@triton-nice.fr' },
      { name: 'Méduse Montpellier',    slug: 'meduse-montpellier',    city: 'Montpellier',   postalCode: '34000', address: '7 Allée des Coraux',        email: 'contact@meduse-montpellier.fr' },
      { name: 'Baleine Brest',         slug: 'baleine-brest',         city: 'Brest',         postalCode: '29200', address: '15 Rue de la Mer',          email: 'contact@baleine-brest.fr' },
      { name: 'Requin Rennes',         slug: 'requin-rennes',         city: 'Rennes',        postalCode: '35000', address: '6 Place de la Plongée',     email: 'contact@requin-rennes.fr' },
      { name: 'Pieuvre Perpignan',     slug: 'pieuvre-perpignan',     city: 'Perpignan',     postalCode: '66000', address: '11 Avenue de la Méditerranée', email: 'contact@pieuvre-perpignan.fr' },
      { name: 'Étoile de Mer Cannes',  slug: 'etoile-de-mer-cannes',  city: 'Cannes',        postalCode: '06400', address: '28 Boulevard de la Croisette', email: 'contact@etoile-mer-cannes.fr' },
      { name: 'Barracuda Grenoble',    slug: 'barracuda-grenoble',    city: 'Grenoble',      postalCode: '38000', address: '4 Rue des Alpes',           email: 'contact@barracuda-grenoble.fr' },
      { name: 'Homard Lorient',        slug: 'homard-lorient',        city: 'Lorient',       postalCode: '56100', address: '2 Quai de Rohan',           email: 'contact@homard-lorient.fr' },
      { name: 'Murène Strasbourg',     slug: 'murene-strasbourg',     city: 'Strasbourg',    postalCode: '67000', address: '19 Quai des Pêcheurs',      email: 'contact@murene-strasbourg.fr' },
      { name: 'Raie Manta Clermont',   slug: 'raie-manta-clermont',   city: 'Clermont-Ferrand', postalCode: '63000', address: '31 Rue Blatin',         email: 'contact@raie-manta-clermont.fr' },
      { name: 'Orque Lille',           slug: 'orque-lille',           city: 'Lille',         postalCode: '59000', address: '5 Rue Nationale',           email: 'contact@orque-lille.fr' },
      { name: 'Thon Rouge Bayonne',    slug: 'thon-rouge-bayonne',    city: 'Bayonne',       postalCode: '64100', address: '8 Allée Boufflers',         email: 'contact@thon-rouge-bayonne.fr' },
      { name: 'Langouste La Rochelle', slug: 'langouste-la-rochelle', city: 'La Rochelle',   postalCode: '17000', address: '14 Cours des Dames',        email: 'contact@langouste-la-rochelle.fr' },
    ];

    const clubs = await clubRepo.save(clubsData.map(c => ({
      name:          c.name,
      slug:          c.slug,
      description:   `Club de plongée basé à ${c.city}. Formation, sorties et événements pour tous les niveaux.`,
      emailContact:  c.email,
      address:       c.address,
      postalCode:    c.postalCode,
      city:          c.city,
      clubStatus:    'active',
      structureType: 'club',
    })));

    console.log(`  → ${clubs.length} clubs created`);

    // ── 3. USERS (100) ────────────────────────────────────────────────────────
    console.log('\n👤 Creating 100 users...');

    const passwordHash = await argon2.hash('Plongee2025!');

    const firstNames = [
      'Kevin', 'Sophie', 'Thomas', 'Marc', 'Chloé', 'Pierre', 'Julie', 'Antoine', 'Léa', 'Nicolas',
      'Camille', 'Romain', 'Emma', 'Lucas', 'Manon', 'Hugo', 'Inès', 'Maxime', 'Laura', 'Théo',
      'Élise', 'Julien', 'Marie', 'Baptiste', 'Clara', 'Alexandre', 'Alice', 'Florian', 'Pauline', 'Adrien',
      'Lucie', 'Guillaume', 'Sarah', 'Mathieu', 'Anaïs', 'Valentin', 'Charlotte', 'Sébastien', 'Margot', 'Clément',
      'Océane', 'Raphaël', 'Amandine', 'Thibault', 'Estelle', 'Quentin', 'Laure', 'Alexis', 'Aurélie', 'Vincent',
      'Nathalie', 'Éric', 'Isabelle', 'Patrick', 'Christine', 'François', 'Sandrine', 'Stéphane', 'Valérie', 'Benoît',
      'Catherine', 'Philippe', 'Monique', 'Jean-Pierre', 'Brigitte', 'Michel', 'Martine', 'Alain', 'Sylvie', 'Pascal',
      'Delphine', 'Arnaud', 'Virginie', 'Christophe', 'Céline', 'Laurent', 'Nadia', 'Olivier', 'Agnès', 'David',
      'Mélanie', 'Frédéric', 'Patricia', 'Xavier', 'Véronique', 'Yannick', 'Hélène', 'Damien', 'Stéphanie', 'Thierry',
      'Annabelle', 'Grégoire', 'Corinne', 'Élodie', 'Sonia', 'Nathan', 'Fanny', 'Dylan', 'Jade', 'Mathis',
    ];

    const lastNames = [
      'Lavier', 'Martin', 'Dubois', 'Dupont', 'Petit', 'Lambert', 'Moreau', 'Bernard', 'Rousseau', 'Garcia',
      'Lefebvre', 'Simon', 'Durand', 'Leroy', 'Girard', 'Bonnet', 'Morel', 'Fontaine', 'Muller', 'Mercier',
      'Faure', 'Aubert', 'Lemaire', 'Perez', 'Blanc', 'Henry', 'Renard', 'Vincent', 'Lucas', 'Thomas',
      'Robert', 'Richard', 'Roux', 'David', 'Bertrand', 'Morin', 'Fournier', 'Giraud', 'Bonnet', 'Chevalier',
      'Robin', 'Clement', 'Gauthier', 'Perrin', 'Roussel', 'Mathieu', 'Legrand', 'Colin', 'Bouchard', 'Lacroix',
      'Noel', 'Meunier', 'Denis', 'Picard', 'Meyer', 'Leclerc', 'Guillaume', 'Caron', 'Gilles', 'Garnier',
      'Vidal', 'Ferreira', 'Lopez', 'Martinez', 'Bertrand', 'Leblanc', 'Guerin', 'Francois', 'Brun', 'Gilles',
      'Barbier', 'Arnaud', 'Michaud', 'Pichon', 'Masse', 'Blondel', 'Delaunay', 'Tessier', 'Lecomte', 'Bouvet',
      'Carpentier', 'Salmon', 'Renault', 'Collin', 'Regnier', 'Marty', 'Pascal', 'Schneider', 'Pons', 'Delorme',
      'Briand', 'Lebrun', 'Leclercq', 'Gros', 'Lepage', 'Barriere', 'Levy', 'Perret', 'Chauvin', 'Besson',
    ];

    const levels = ['N1', 'N1', 'N2', 'N2', 'N2', 'N3', 'N3', 'N4', 'MF1', 'MF2'];
    const domains = ['gmail.com', 'yahoo.fr', 'hotmail.fr', 'outlook.fr', 'orange.fr', 'free.fr', 'sfr.fr'];

    const usersData = firstNames.map((firstName, i) => {
      const lastName = lastNames[i];
      const email    = `${firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '')}.${lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '')}${i}@${domains[i % domains.length]}`;
      const year     = 1960 + (i % 45);
      const month    = String((i % 12) + 1).padStart(2, '0');
      const day      = String((i % 28) + 1).padStart(2, '0');
      const deptCode = String(10 + (i % 90)).padStart(2, '0');
      const licNum   = `${deptCode}-${String(i + 1).padStart(3, '0')}-${String(i + 1).padStart(4, '0')}`;

      return {
        email,
        firstName,
        lastName,
        birthDate:           new Date(`${year}-${month}-${day}`),
        ffessmLicenseNumber: licNum,
        technicalLevel:      levels[i % levels.length],
        phone:               `06 ${String(i).padStart(2, '0')} ${String(i % 100).padStart(2, '0')} ${String(i % 100).padStart(2, '0')} ${String(i % 100).padStart(2, '0')}`,
        passwordHash,
      };
    });

    const users = await userRepo.save(usersData);
    console.log(`  → ${users.length} users created`);

    // ── 4. MEMBERSHIPS ────────────────────────────────────────────────────────
    console.log('\n🔗 Creating memberships...');

    const season    = '2025-2026';
    const today     = new Date();
    const roleCodes = ['member', 'member', 'member', 'member', 'member', 'member', 'instructor', 'instructor', 'committee', 'admin'];
    type MembershipData = {
        user: AppUser;
        club: Club;
        role: Role;
        season: string;
        membershipDate: Date;
        decisionDate: Date;
        status: string;
        };

    const memberships: MembershipData[] = [];

    // Distribute users across clubs — each user in 1 or 2 clubs
    for (let i = 0; i < users.length; i++) {
      const primaryClub = clubs[i % clubs.length];
      const roleCode    = i === 0 ? 'super_admin' : roleCodes[i % roleCodes.length];

      memberships.push({
        user:           users[i],
        club:           primaryClub,
        role:           roleMap[roleCode],
        season,
        membershipDate: today,
        decisionDate:   today,
        status:         'active',
      });

      // Every 5th user is also in a second club
      if (i % 5 === 0 && i > 0) {
        const secondaryClub = clubs[(i + 7) % clubs.length];
        if (secondaryClub.idClub !== primaryClub.idClub) {
          memberships.push({
            user:           users[i],
            club:           secondaryClub,
            role:           roleMap['member'],
            season,
            membershipDate: today,
            decisionDate:   today,
            status:         'active',
          });
        }
      }
    }

    await membershipRepo.save(memberships);
    console.log(`  → ${memberships.length} memberships created`);

    // ── 5. EVENTS ─────────────────────────────────────────────────────────────
    console.log('\n📅 Creating events...');

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
      club: Club;
    };

    const eventTypes = ['dive_trip', 'training', 'pool_session', 'social', 'initiation'];
    const eventsData: EventData[] = [];

    for (let i = 0; i < clubs.length; i++) {
      const club    = clubs[i];
      const creator = users[i % users.length];

      eventsData.push({
        title:         `Sortie plongée — ${club.city}`,
        description:   `Sortie plongée organisée par ${club.name}. Tous niveaux bienvenus.`,
        eventType:     'dive_trip',
        startDatetime: new Date(`2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T08:00:00`),
        endDatetime:   new Date(`2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T18:00:00`),
        location:      `${club.city} (${club.postalCode.substring(0, 2)})`,
        minimumLevel:  i % 3 === 0 ? 'N2' : 'all',
        maxCapacity:   10 + (i % 10),
        isPaid:        i % 2 === 0,
        price:         i % 2 === 0 ? 25 + (i % 50) : undefined,
        status:        'active',
        creator,
        club,
      });

      eventsData.push({
        title:         `Formation ${['N1', 'N2', 'N3', 'MF1'][i % 4]} — ${club.city}`,
        description:   `Formation complète organisée par ${club.name}.`,
        eventType:     'training',
        startDatetime: new Date(`2026-0${(i % 9) + 1}-15T09:00:00`),
        endDatetime:   new Date(`2026-0${((i + 2) % 9) + 1}-15T18:00:00`),
        location:      `Piscine municipale, ${club.city}`,
        minimumLevel:  ['all', 'N1', 'N2', 'N3'][i % 4],
        maxCapacity:   8 + (i % 8),
        isPaid:        true,
        price:         100 + (i % 100),
        status:        'active',
        creator,
        club,
      });
    }

    for (const eventData of eventsData) {
      const event = eventRepo.create(eventData);
      await eventRepo.save(event);
    }

    console.log(`  → ${eventsData.length} events created`);

    console.log('\n════════════════════════════════════════════════════════');
    console.log('  ✅  Seed completed successfully!');
    console.log(`  🏊  Clubs       : ${clubs.length}`);
    console.log(`  👤  Users       : ${users.length}`);
    console.log(`  🔗  Memberships : ${memberships.length}`);
    console.log(`  📅  Events      : ${eventsData.length}`);
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
