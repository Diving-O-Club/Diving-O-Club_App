'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useMembership } from '../../../hooks/useMembership';
import { useEvents } from '../../../hooks/useEvents';
import { CreateEventPayload } from '../../../hooks/useEvents';
import { ArrowLeft } from 'lucide-react';
import EventForm from '../../../components/events/EventForm';
import { useEffect } from 'react';

const MANAGER_ROLES = ['admin', 'super_admin', 'instructor', 'committee'];

export default function CreateEventPage() {
  const { user, loading: authLoading } = useAuth();
  const { membership, loading: membershipLoading } = useMembership();
  const { createEvent, loading, error } = useEvents();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!membershipLoading && membership) {
      if (!MANAGER_ROLES.includes(membership.role.codeRole)) {
        router.push('/dashboard/events');
      }
    }
  }, [membership, membershipLoading, router]);

  if (authLoading || membershipLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!user || !membership) return null;

  const handleSubmit = async (payload: CreateEventPayload) => {
    const event = await createEvent(membership.club.idClub, payload);
    if (event) router.push('/dashboard/events');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#0d3b66] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0d3b66]">Créer un événement</h1>
        <p className="text-gray-400 text-sm mt-1">{membership.club.name}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <EventForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel="Créer l'événement"
        />
      </div>

    </div>
  );
}