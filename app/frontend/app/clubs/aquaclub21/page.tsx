type Member = {
  idUser: number;
  firstName: string;
  lastName: string;
  technicalLevel: string;
};

type ClubEvent = {
  idEvent: number;
  title: string;
  startDatetime: string;
};

type Club = {
  name: string;
  memberships: { user: Member }[];
  events: ClubEvent[];
};

async function getClub(): Promise<Club> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/aquaclub21`, {
        cache: 'no-store',
    });

  if (!res.ok) {
    throw new Error('Failed to fetch club');
  }

  return res.json();
}

export default async function AquaclubPage() {
  const club = await getClub();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{club.name}</h1>

      <h2>Membres</h2>
      <ul>
        {club.memberships.map((m) => (
          <li key={m.user.idUser}>
            {m.user.firstName} {m.user.lastName} — {m.user.technicalLevel}
          </li>
        ))}
      </ul>

      <h2>Événements</h2>
      <ul>
        {club.events.map((e) => (
          <li key={e.idEvent}>
            {e.title} — {new Date(e.startDatetime).toLocaleDateString('fr-FR')}
          </li>
        ))}
      </ul>
    </main>
  );
}