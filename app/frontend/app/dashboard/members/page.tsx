'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useMembership } from '../../hooks/useMembership';
import {
  getPendingRequests,
  acceptRequest,
  rejectRequest,
  changeMemberRole,
  expelMember,
  type PendingRequest,
  type ClubMember,
} from '@/app/lib/api/membership';
import { Users, Check, X, UserMinus, AlertTriangle } from 'lucide-react';
import { CustomSelect } from '@/app/components/ui/form-fields';
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

// Roles an admin can assign through the dropdown (super_admin excluded).
const ASSIGNABLE_ROLES = ['admin', 'committee', 'instructor', 'member'];

export default function MembersPage() {
  const { user, loading: authLoading } = useAuth();
  const { membership, loading: membershipLoading, refetch } = useMembership();
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  // Pending dropdown selection per membership (only set when changed).
  const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  // Member awaiting expulsion confirmation in the modal.
  const [confirmExpel, setConfirmExpel] = useState<ClubMember | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!membership) return;
    if (!ADMIN_ROLES.includes(membership.role.codeRole)) return;

    const load = () => {
      setLoadingPending(true);
      getPendingRequests()
        .then(setPendingRequests)
        .finally(() => setLoadingPending(false));
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [membership]);

  const handleAccept = async (membershipId: number) => {
    const ok = await acceptRequest(membershipId);
    if (ok) {
      setPendingRequests(prev => prev.filter(r => r.idMembership !== membershipId));
      refetch();
    }
  };

  const handleReject = async (membershipId: number) => {
    const ok = await rejectRequest(membershipId);
    if (ok) {
      setPendingRequests(prev => prev.filter(r => r.idMembership !== membershipId));
    }
  };

  // Auto-hide the feedback banner after a few seconds.
  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const handleRoleChange = async (membershipId: number) => {
    const codeRole = selectedRoles[membershipId];
    if (!codeRole) return;
    setSavingId(membershipId);
    const ok = await changeMemberRole(membershipId, codeRole);
    setSavingId(null);
    if (ok) {
      setFeedback('Rôle mis à jour');
      setSelectedRoles(prev => {
        const next = { ...prev };
        delete next[membershipId];
        return next;
      });
      refetch();
    } else {
      setFeedback('Échec de la mise à jour du rôle');
    }
  };

  const handleExpel = async () => {
    if (!confirmExpel) return;
    const ok = await expelMember(confirmExpel.idMembership);
    setConfirmExpel(null);
    if (ok) {
      setFeedback('Membre expulsé');
      refetch();
    } else {
      setFeedback("Échec de l'expulsion");
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

      {feedback && (
        <div className="mb-6 bg-[#0d3b66] text-white text-sm font-medium px-4 py-3 rounded-xl shadow">
          {feedback}
        </div>
      )}

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

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Membre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Niveau</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Rôle</th>
              {isAdmin && (
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {activeMembers.map(member => {
              // Admins manage other members, but not their own row nor a super_admin.
              const isOwnRow = member.idMembership === membership.idMembership;
              const canManage =
                isAdmin && !isOwnRow && member.role.codeRole !== 'super_admin';
              const selectedRole = selectedRoles[member.idMembership] ?? member.role.codeRole;

              return (
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
                  {canManage ? (
                    <div className="flex items-center gap-2">
                      <div className="w-48">
                        <CustomSelect
                          value={selectedRole}
                          onValueChange={v =>
                            setSelectedRoles(prev => ({
                              ...prev,
                              [member.idMembership]: v,
                            }))
                          }
                          options={ASSIGNABLE_ROLES.map(code => ({
                            value: code,
                            label: ROLE_LABELS[code],
                          }))}
                          clearable={false}
                        />
                      </div>
                      <button
                        onClick={() => handleRoleChange(member.idMembership)}
                        disabled={
                          selectedRole === member.role.codeRole ||
                          savingId === member.idMembership
                        }
                        className="text-sm font-medium px-4 min-h-11 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[#0d3b66] text-white hover:bg-[#1b6ca8]"
                      >
                        Valider
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {ROLE_LABELS[member.role.codeRole] ?? member.role.labelRole}
                    </span>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    {canManage && (
                      <button
                        onClick={() => setConfirmExpel(member)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                        Expulser
                      </button>
                    )}
                  </td>
                )}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {confirmExpel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-[#0d3b66]">Expulser ce membre ?</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {confirmExpel.user.firstName} {confirmExpel.user.lastName} sera retiré
              du club. Son compte utilisateur est conservé, mais il devra refaire une
              demande pour rejoindre le club.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmExpel(null)}
                className="px-4 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleExpel}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <UserMinus className="w-4 h-4" />
                Expulser
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
