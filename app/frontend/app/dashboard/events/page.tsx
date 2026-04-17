'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useMembership, type DashboardEvent } from '../../hooks/useMembership';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

const EVENT_TYPE_LABELS: Record<string, string> = {
  dive_trip:    '🤿 Sortie plongée',
  training:     '📚 Formation',
  initiation:   '🎓 Baptême',
  pool_session: '🏊 Séance piscine',
  social:       '🎉 Événement social',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  dive_trip:    'bg-blue-100 text-blue-700',
  training:     'bg-purple-100 text-purple-700',
  initiation:   'bg-green-100 text-green-700',
  pool_session: 'bg-cyan-100 text-cyan-700',
  social:       'bg-orange-100 text-orange-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'long',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  });
}

function EventCard({ event }: { event: DashboardEvent }) {
  const isPast = new Date(event.startDatetime) < new Date();

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4 ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${EVENT_TYPE_COLORS[event.eventType] ?? 'bg-gray-100 text-gray-500'}`}>
            {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
          </span>
          {isPast && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              Passé
            </span>
          )}
        </div>
        <p className="font-semibold text-[#0d3b66] truncate">{event.title}</p>
        <p className="text-sm text-gray-400 mt-0.5">
          {formatDate(event.startDatetime)} · {formatTime(event.startDatetime)} — {formatTime(event.endDatetime)}
        </p>
        <p className="text-sm text-gray-400 truncate">📍 {event.location}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold text-[#0d3b66]">
          {event.isPaid && event.price
            ? `${parseFloat(event.price).toFixed(0)} €`
            : 'Gratuit'}
        </p>
        <button
          disabled={isPast}
          className={`mt-2 text-sm px-4 py-2 rounded-xl font-medium transition-colors ${
            isPast
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#0d3b66] text-white hover:bg-[#1b6ca8]'
          }`}
        >
          Voir détails
        </button>
      </div>
    </div>
  );
}

export default function EventsPage() {
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

  // Empty state — no club
  if (!membership) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#0d3b66] mb-8">Événements</h1>
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="w-16 h-16 bg-[#0d3b66] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold text-[#0d3b66] mb-2">
            Rejoignez un club pour voir les événements
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
            Vous devez rejoindre un club de plongée pour accéder aux événements
            et participer aux sorties et formations.
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

  const now = new Date();
  const upcoming = membership.club.events
    .filter(e => new Date(e.startDatetime) >= now)
    .sort((a, b) => +new Date(a.startDatetime) - +new Date(b.startDatetime));
  const past = membership.club.events
    .filter(e => new Date(e.startDatetime) < now)
    .sort((a, b) => +new Date(b.startDatetime) - +new Date(a.startDatetime));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0d3b66]">Événements</h1>
        <p className="text-gray-400 text-sm mt-1">{membership.club.name}</p>
      </div>

      {/* Upcoming events */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-[#0d3b66] mb-4">
          À venir <span className="text-gray-400 font-normal">({upcoming.length})</span>
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm">
            Aucun événement à venir pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(e => <EventCard key={e.idEvent} event={e} />)}
          </div>
        )}
      </section>

      {/* Past events */}
      {past.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-400 mb-4">
            Passés <span className="font-normal">({past.length})</span>
          </h2>
          <div className="space-y-3">
            {past.map(e => <EventCard key={e.idEvent} event={e} />)}
          </div>
        </section>
      )}

    </div>
  );
}