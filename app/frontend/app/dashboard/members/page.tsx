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
import {
  Users,
  Check,
  X,
  UserMinus,
  UserCog,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { CustomSelect } from '@/app/components/ui/form-fields';
import Link from 'next/link';

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
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  // Member whose actions menu (modal) is currently open.
  const [actionMenuMember, setActionMenuMember] = useState<ClubMember | null>(null);
  // Member being edited in the role modal, and the role selected there.
  const [roleModalMember, setRoleModalMember] = useState<ClubMember | null>(null);
  const [modalRole, setModalRole] = useState('');
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

  const openRoleModal = (member: ClubMember) => {
    setRoleModalMember(member);
    setModalRole(member.role.codeRole);
    setActionMenuMember(null);
  };

  const handleRoleChange = async () => {
    if (!roleModalMember) return;
    setSaving(true);
    const ok = await changeMemberRole(roleModalMember.idMembership, modalRole);
    setSaving(false);
    setRoleModalMember(null);
    if (ok) {
      setFeedback('Rôle mis à jour');
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
              <div
                key={request.idMembership}
                data-testid="pending-request"
                className="px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
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
                <div className="flex items-center gap-2 sm:shrink-0">
                  <button
                    onClick={() => handleAccept(request.idMembership)}
                    className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Accepter
                  </button>
                  <button
                    onClick={() => handleReject(request.idMembership)}
                    className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
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
              {isAdmin && <th className="px-6 py-4" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {activeMembers.map(member => {
              // Admins manage other members, but not their own row nor a super_admin.
              const isOwnRow = member.idMembership === membership.idMembership;
              const canManage =
                isAdmin && !isOwnRow && member.role.codeRole !== 'super_admin';

              return (
              <tr key={member.idMembership} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0d3b66] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {member.user.firstName?.[0]}{member.user.lastName?.[0]}
                    </div>
                    <p className="font-medium text-[#0d3b66]">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    {canManage && (
                      <button
                        onClick={() => setActionMenuMember(member)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-[#0d3b66] text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Actions
                        <ChevronDown className="w-4 h-4" />
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

      {actionMenuMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xs w-full p-4">
            <div className="flex items-center gap-2 flex-wrap px-2 pt-1 pb-3">
              <p className="text-sm font-semibold text-[#0d3b66]">
                {actionMenuMember.user.firstName} {actionMenuMember.user.lastName}
              </p>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                {ROLE_LABELS[actionMenuMember.role.codeRole] ?? actionMenuMember.role.labelRole}
              </span>
            </div>
            <div className="flex flex-col">
              <button
                onClick={() => openRoleModal(actionMenuMember)}
                className="w-full flex items-center gap-2.5 px-3 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserCog className="w-4 h-4 text-[#0d3b66]" />
                Changer le rôle
              </button>
              <button
                onClick={() => {
                  setConfirmExpel(actionMenuMember);
                  setActionMenuMember(null);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <UserMinus className="w-4 h-4" />
                Expulser
              </button>
            </div>
            <button
              onClick={() => setActionMenuMember(null)}
              className="w-full mt-2 px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {roleModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <UserCog className="w-5 h-5 text-[#0d3b66]" />
              </div>
              <h2 className="text-lg font-bold text-[#0d3b66]">
                Changer le rôle de {roleModalMember.user.firstName} {roleModalMember.user.lastName}
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Rôle actuel :{' '}
              <span className="font-medium text-[#0d3b66]">
                {ROLE_LABELS[roleModalMember.role.codeRole] ?? roleModalMember.role.labelRole}
              </span>
            </p>
            <CustomSelect
              value={modalRole}
              onValueChange={setModalRole}
              options={ASSIGNABLE_ROLES.map(code => ({
                value: code,
                label: ROLE_LABELS[code],
              }))}
              clearable={false}
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setRoleModalMember(null)}
                className="px-4 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRoleChange}
                disabled={modalRole === roleModalMember.role.codeRole || saving}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[#0d3b66] text-white hover:bg-[#1b6ca8]"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

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
