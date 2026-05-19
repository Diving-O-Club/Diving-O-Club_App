'use client';

import { useEffect, useState } from 'react';

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

export type DashboardEvent = {
  idEvent: number;
  title: string;
  eventType: string;
  startDatetime: string;
  endDatetime: string;
  location: string;
  minimumLevel: string;
  maxCapacity: number;
  isPaid: boolean;
  price: string | null;
  status: string;
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

export function useMembership() {
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMembership = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership/me`, {
      credentials: 'include',
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => setMembership(data))
      .catch(() => setMembership(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  return { membership, loading, refetch: fetchMembership };
}