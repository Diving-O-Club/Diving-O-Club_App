'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useMembership } from '../../hooks/useMembership';
import { Users, Check, X } from 'lucide-react';
import Link from 'next/link';

const LEVEL_COLORS: Record<string, string> = {
  N1:  'bg-green-100 text-green-700',
  N2:  'bg-blue-100 text-blue-700',
  N3:  'bg-purple-100 text-purple-700',
  N4:  'bg-red-100 text-red-700',
  MF1: 'bg-orange-100 text-orange-700',
  MF2: 'bg-yellow-100 text-yellow-700',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin:       'Administrateur',
  committee:   'Comité',
  instructor:  'Moniteur',
  member:      'Adhérent',
};

const ADMIN_ROLES = ['admin', 'super_admin'];

type PendingRequest = {
  idMembership: number;
  status: string;
  user: {
    idUser: number;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function MembersPage() {
  const { user, loading: authLoading } = useAuth();
  const { membership, loading: membershipLoading } = useMembership();
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch pending requests if admin
  useEffect(() => {
    if (!membership) return;
    if (!ADMIN_ROLES.includes(membership.role.codeRole)) return;

    setLoadingPending(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership/pending`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setPendingRequests(data))
      .catch(() => setPendingRequests([]))
      .finally(() => setLoadingPending(false));
  }, [membership]);

  const handleAccept = async (membershipId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/request/${membershipId}/accept`,
      { method: 'PATCH', credentials: 'include' },
    );
    if (res.ok) {
      setPendingRequests(prev => prev.filter(r => r.idMembership !== membershipId));
    }
  };

  const handleReject = async (membershipId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/request/${membershipId}/reject`,
      { method: 'DELETE', credentials: 'include' },
    );
    if (res.ok) {
      setPendingRequests(prev => prev.filter(r => r.idMembership !== membershipId));
    }
  };

  if (authLoading || membershipLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!user) return null;

  // Empty state — no club
  if (!membership) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#0d3b66] mb-8">Membres du club</h1>
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="w-16 h-16 bg-[#0d3b66] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold text-[#0d3b66] mb-2">
            Rejoignez un club pour voir les membres
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
            Vous devez rejoindre un club de plongée pour accéder à la liste des membres
            et interagir avec votre communauté.
          </p>
          <Link
            href="/clubs"
            className="inline-flex items-center gap-2 bg-[#0d3b66] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#1b6ca8] transition-colors"
          >
            Rejoindre un club
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = ADMIN_ROLES.includes(membership.role.codeRole);
  const activeMembers = membership.club.memberships.filter(m => m.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0d3b66]">Membres du club</h1>
        <p className="text-gray-400 text-sm mt-1">
          {activeMembers.length} membre{activeMembers.length > 1 ? 's' : ''} actif{activeMembers.length > 1 ? 's' : ''} — {membership.club.name}
        </p>
      </div>

      {/* Pending requests — admin only */}
      {isAdmin && !loadingPending && pendingRequests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <h2 className="font-bold text-[#0d3b66]">Demandes en attente</h2>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingRequests.map(request => (
              <div key={request.idMembership} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700 text-sm font-semibold shrink-0">
                    {request.user.firstName?.[0]}{request.user.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-[#0d3b66]">
                      {request.user.firstName} {request.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{request.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAccept(request.idMembership)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Accepter
                  </button>
                  <button
                    onClick={() => handleReject(request.idMembership)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active members table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Membre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Niveau</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Rôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {activeMembers.map(member => (
              <tr key={member.idMembership} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0d3b66] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {member.user.firstName?.[0]}{member.user.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[#0d3b66]">
                        {member.user.firstName} {member.user.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{member.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${LEVEL_COLORS[member.user.technicalLevel] ?? 'bg-gray-100 text-gray-500'}`}>
                    {member.user.technicalLevel ?? '—'}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {ROLE_LABELS[member.role.codeRole] ?? member.role.labelRole}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}