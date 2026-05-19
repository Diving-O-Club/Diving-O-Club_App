'use client';

import { useState } from 'react';
import { DashboardEvent } from './useMembership';

export type CreateEventPayload = {
  title: string;
  description?: string;
  eventType: string;
  startDatetime: string;
  endDatetime: string;
  location?: string;
  minimumLevel?: string;
  maxCapacity?: number;
  isPaid: boolean;
  price?: number;
};

export type UpdateEventPayload = Partial<CreateEventPayload>;

export function useEvents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (
    clubId: number,
    payload: CreateEventPayload,
  ): Promise<DashboardEvent | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Erreur lors de la création');
        return null;
      }
      return data;
    } catch {
      setError('Impossible de contacter le serveur');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (
    eventId: number,
    payload: UpdateEventPayload,
  ): Promise<DashboardEvent | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Erreur lors de la modification');
        return null;
      }
      return data;
    } catch {
      setError('Impossible de contacter le serveur');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (!res.ok) {
        setError('Erreur lors de la suppression');
        return false;
      }
      return true;
    } catch {
      setError('Impossible de contacter le serveur');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, updateEvent, deleteEvent, loading, error };
}