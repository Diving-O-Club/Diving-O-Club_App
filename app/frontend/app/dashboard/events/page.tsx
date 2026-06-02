'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useMembership, type DashboardEvent } from '../../hooks/useMembership';
import { useEvents } from '../../hooks/useEvents';
import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import EventCard from '../../components/events/EventCard';
import EventDeleteModal from '../../components/events/EventDeleteModal';

const MANAGER_ROLES = ['admin', 'super_admin', 'instructor', 'committee'];

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth();
  const { membership, loading: membershipLoading, refetch } = useMembership();
  const { deleteEvent, loading: deleteLoading } = useEvents();
  const router = useRouter();

  const [eventToDelete, setEventToDelete] = useState<DashboardEvent | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

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

  const isManager = MANAGER_ROLES.includes(membership.role.codeRole);
  const now = new Date();

  const upcoming = membership.club.events
    .filter(e => new Date(e.startDatetime) >= now)
    .sort((a, b) => +new Date(a.startDatetime) - +new Date(b.startDatetime));

  const past = membership.club.events
    .filter(e => new Date(e.startDatetime) < now)
    .sort((a, b) => +new Date(b.startDatetime) - +new Date(a.startDatetime));

  const handleEdit = (event: DashboardEvent) => {
    router.push(`/dashboard/events/${event.idEvent}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    const success = await deleteEvent(eventToDelete.idEvent);
    if (success) {
      setEventToDelete(null);
      refetch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0d3b66]">Événements</h1>
          <p className="text-gray-400 text-sm mt-1">{membership.club.name}</p>
        </div>
        {isManager && (
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center gap-2 bg-[#0d3b66] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#1b6ca8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer un événement
          </Link>
        )}
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
            {upcoming.map(e => (
              <EventCard
                key={e.idEvent}
                event={e}
                isManager={isManager}
                onEdit={handleEdit}
                onDelete={setEventToDelete}
              />
            ))}
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
            {past.map(e => (
              <EventCard
                key={e.idEvent}
                event={e}
                isManager={isManager}
                onEdit={handleEdit}
                onDelete={setEventToDelete}
              />
            ))}
          </div>
        </section>
      )}

      <EventDeleteModal
        event={eventToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEventToDelete(null)}
        loading={deleteLoading}
      />

    </div>
  );
}