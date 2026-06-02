'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { useMembership, DashboardEvent } from '../../../../hooks/useMembership';
import { useEvents, CreateEventPayload } from '../../../../hooks/useEvents';
import { ArrowLeft } from 'lucide-react';
import EventForm from '../../../../components/events/EventForm';

const MANAGER_ROLES = ['admin', 'super_admin', 'instructor', 'committee'];

function toDatetimeLocal(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const { user, loading: authLoading } = useAuth();
  const { membership, loading: membershipLoading } = useMembership();
  const { updateEvent, loading, error } = useEvents();
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params.id as string);

  const [event, setEvent] = useState<DashboardEvent | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!membershipLoading && membership) {
      if (!MANAGER_ROLES.includes(membership.role.codeRole)) {
        router.push('/dashboard/events');
        return;
      }
      const found = membership.club.events.find(e => e.idEvent === eventId);
      if (!found) {
        router.push('/dashboard/events');
        return;
      }
      setEvent(found);
    }
  }, [membership, membershipLoading, router, eventId]);

  if (authLoading || membershipLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!user || !membership || !event) return null;

  const handleSubmit = async (payload: CreateEventPayload) => {
    const updated = await updateEvent(eventId, payload);
    if (updated) router.push('/dashboard/events');
  };

  const initialValues: Partial<CreateEventPayload> = {
    title: event.title,
    eventType: event.eventType,
    startDatetime: toDatetimeLocal(event.startDatetime),
    endDatetime: toDatetimeLocal(event.endDatetime),
    location: event.location,
    maxCapacity: event.maxCapacity,
    isPaid: event.isPaid,
    price: event.price ? parseFloat(event.price) : undefined,
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
        <h1 className="text-2xl font-bold text-[#0d3b66]">Modifier l'événement</h1>
        <p className="text-gray-400 text-sm mt-1">{membership.club.name}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <EventForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel="Enregistrer les modifications"
        />
      </div>

    </div>
  );
}