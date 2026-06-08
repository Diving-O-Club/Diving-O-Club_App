'use client';

import { useEffect, useState } from 'react';
import {
  getMyMembership,
  type MembershipRole,
  type MemberUser,
  type ClubMember,
  type MembershipClub,
  type MembershipData,
} from '@/app/lib/api/membership';

export type { MembershipRole, MemberUser, ClubMember, MembershipClub, MembershipData };

export type { DashboardEvent } from '@/app/lib/api/events';

export function useMembership() {
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMembership = () => {
    getMyMembership()
      .then(setMembership)
      .catch(() => setMembership(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  return { membership, loading, refetch: fetchMembership };
}
