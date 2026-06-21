import { clientFetch } from '../clientFetch';
import { DashboardEvent } from './events';

export type MembershipRole = {
  idRole: number;
  codeRole: string;
  labelRole: string;
};

export type MemberUser = {
  idUser: number;
  firstName: string;
  lastName: string;
  email: string;
  technicalLevel: string;
  phone: string;
  ffessmLicenseNumber: string;
};

export type ClubMember = {
  idMembership: number;
  status: string;
  user: MemberUser;
  role: MembershipRole;
};

export type MembershipClub = {
  idClub: number;
  name: string;
  slug: string;
  city: string;
  description: string;
  emailContact: string;
  memberships: ClubMember[];
  events: DashboardEvent[];
};

export type MembershipData = {
  idMembership: number;
  status: string;
  season: string;
  role: MembershipRole;
  user: MemberUser;
  club: MembershipClub;
};

export type MembershipStatus = {
  status: 'active' | 'pending' | 'pending_other' | 'active_other' | null;
  clubName?: string;
  clubSlug?: string;
};

export type PendingRequest = {
  idMembership: number;
  status: string;
  user: {
    idUser: number;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export async function getMyMembership(): Promise<MembershipData | null> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/me`,
      { credentials: 'include' },
    );
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function getMembershipStatus(clubId: number): Promise<MembershipStatus | null> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/status/${clubId}`,
      { credentials: 'include' },
    );
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function requestMembership(clubId: number): Promise<boolean> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/request/${clubId}`,
      { method: 'POST', credentials: 'include' },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function cancelMembership(clubId: number): Promise<boolean> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/request/${clubId}`,
      { method: 'DELETE', credentials: 'include' },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function getPendingRequests(): Promise<PendingRequest[]> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/pending`,
      { credentials: 'include' },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function acceptRequest(membershipId: number): Promise<boolean> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/request/${membershipId}/accept`,
      { method: 'PATCH', credentials: 'include' },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function rejectRequest(membershipId: number): Promise<boolean> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/request/${membershipId}/reject`,
      { method: 'DELETE', credentials: 'include' },
    );
    return res.ok;
  } catch {
    return false;
  }
}

// Changes a member's role (admin only, scoped to the club).
export async function changeMemberRole(
  membershipId: number,
  codeRole: string,
): Promise<boolean> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/members/${membershipId}/role`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeRole }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

// Expels a member from the club: removes the membership, keeps the account.
export async function expelMember(membershipId: number): Promise<boolean> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/members/${membershipId}`,
      { method: 'DELETE', credentials: 'include' },
    );
    return res.ok;
  } catch {
    return false;
  }
}
