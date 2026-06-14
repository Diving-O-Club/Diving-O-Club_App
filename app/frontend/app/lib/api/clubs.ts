export type Member = {
  idMembership: number;
  user: { firstName: string; lastName: string; technicalLevel: string };
  role: { labelRole: string };
};

export type ClubEvent = {
  idEvent: number;
  title: string;
  startDatetime: string;
  isPaid: boolean;
  price: string | null;
};

export type Club = {
  idClub: number;
  name: string;
  city: string;
  address: string;
  description: string;
  emailContact: string;
  clubStatus: string;
  memberships: Member[];
  events: ClubEvent[];
};

export type ClubSearchResult = {
  name: string;
  city: string;
  slug: string;
};

export async function getClub(slug: string): Promise<Club | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clubs/${slug}`,
      { cache: 'no-store' },
    );
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function searchClubs(query: string): Promise<ClubSearchResult[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clubs?search=${encodeURIComponent(query)}`,
    );
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
