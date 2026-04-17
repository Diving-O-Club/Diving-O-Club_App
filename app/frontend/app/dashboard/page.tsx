'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../hooks/useMembership';
import { Search, Calendar, Users, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { membership, loading: membershipLoading } = useMembership();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || membershipLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!user) return null;

  if (!membership) return <DashboardNoClub />;

  return <DashboardWithClub membership={membership} />;
}

function DashboardNoClub() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-2xl font-bold text-[#0d3b66] mb-2">Bienvenue 👋</h1>
      <p className="text-gray-400 text-sm mb-8">Rôle : Utilisateur sans club</p>

      {/* CTA rejoindre */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#0d3b66] p-3 rounded-xl shrink-0">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0d3b66] mb-1">
              Rejoignez un club de plongée
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Pour accéder à toutes les fonctionnalités (événements, membres, paiements),
              vous devez d'abord rejoindre un club de plongée associatif.
            </p>
            <Link
              href="/clubs"
              className="inline-flex items-center gap-2 bg-[#0d3b66] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#1b6ca8] transition-colors"
            >
              <Search className="w-4 h-4" />
              Rechercher un club
            </Link>
          </div>
        </div>
      </div>

      {/* Certificat médical */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="bg-[#e8f4f8] p-3 rounded-xl w-fit mb-3">
          <FileText className="w-6 h-6 text-[#006994]" />
        </div>
        <p className="text-xs text-gray-400 mb-1">Certificat médical</p>
        <p className="text-xl font-bold text-[#0d3b66]">Non fourni</p>
      </div>

      {/* Grille bas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-bold text-[#0d3b66] mb-4">Certificat médical</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Statut actuel</span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Non fourni</span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700 mb-3">
            ⚠️ Vous devez fournir un certificat médical pour participer aux événements
          </div>
          <button className="w-full bg-[#0d3b66] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#1b6ca8] transition-colors">
            Ajouter mon certificat
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-bold text-[#0d3b66] mb-4">Actions rapides</h3>
          <Link
            href="/profile"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              Mon profil
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

function DashboardWithClub({ membership }: { membership: NonNullable<ReturnType<typeof useMembership>['membership']> }) {
  const { club, user, role } = membership;

  const upcoming = club.events
    .filter(e => new Date(e.startDatetime) > new Date())
    .sort((a, b) => +new Date(a.startDatetime) - +new Date(b.startDatetime))
    .slice(0, 3);

  const activeMembers = club.memberships.filter(m => m.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-2xl font-bold text-[#0d3b66] mb-1">
        Bienvenue, {user.firstName} {user.lastName} 👋
      </h1>
      <p className="text-gray-400 text-sm mb-8">Rôle : {role.labelRole}</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
          <div className="bg-[#0d3b66] p-3 rounded-xl">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Événements à venir</p>
            <p className="text-2xl font-bold text-[#0d3b66]">{upcoming.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
          <div className="bg-[#e8f4f8] p-3 rounded-xl">
            <Users className="w-5 h-5 text-[#006994]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Membres actifs</p>
            <p className="text-2xl font-bold text-[#0d3b66]">{activeMembers.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
          <div className="bg-[#e8f4f8] p-3 rounded-xl">
            <FileText className="w-5 h-5 text-[#006994]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Certificat médical</p>
            <p className="text-lg font-bold text-[#0d3b66]">À jour</p>
          </div>
        </div>
      </div>

      {/* Certificat + Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-bold text-[#0d3b66] mb-4">Certificat médical</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Statut actuel</span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Non fourni</span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700 mb-3">
            ⚠️ Vous devez fournir un certificat médical pour participer aux événements
          </div>
          <button className="w-full bg-[#0d3b66] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#1b6ca8] transition-colors">
            Ajouter mon certificat
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-bold text-[#0d3b66] mb-4">Actions rapides</h3>
          <div className="space-y-1">
            {[
              { href: '/dashboard/events',  label: 'Voir les événements', Icon: Calendar },
              { href: '/dashboard/members', label: 'Liste des membres',   Icon: Users },
              { href: '/profile',           label: 'Mon profil',          Icon: FileText },
            ].map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Prochains événements */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="font-bold text-[#0d3b66] mb-4">Prochains événements</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Aucun événement à venir.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map(event => (
              <div key={event.idEvent} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-[#0d3b66] text-sm">{event.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(event.startDatetime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    {' · '}{event.location}
                    {' · '}{event.isPaid ? `${parseFloat(event.price ?? '0').toFixed(0)} €` : 'Gratuit'}
                  </p>
                </div>
                <button className="text-xs px-3 py-1.5 bg-[#0d3b66] text-white rounded-lg hover:bg-[#1b6ca8] transition-colors whitespace-nowrap">
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}