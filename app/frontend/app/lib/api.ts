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

export async function getClub(slug: string): Promise<Club | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clubs/${slug}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}