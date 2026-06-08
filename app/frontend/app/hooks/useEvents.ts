'use client';

import { useState } from 'react';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  type DashboardEvent,
  type CreateEventPayload,
  type UpdateEventPayload,
} from '@/app/lib/api/events';

export type { DashboardEvent, CreateEventPayload, UpdateEventPayload };

export function useEvents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEventAction = async (
    clubId: number,
    payload: CreateEventPayload,
  ): Promise<DashboardEvent | null> => {
    setLoading(true);
    setError(null);
    try {
      return await createEvent(clubId, payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEventAction = async (
    eventId: number,
    payload: UpdateEventPayload,
  ): Promise<DashboardEvent | null> => {
    setLoading(true);
    setError(null);
    try {
      return await updateEvent(eventId, payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEventAction = async (eventId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteEvent(eventId);
      return true;
    } catch {
      setError('Erreur lors de la suppression');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent: createEventAction,
    updateEvent: updateEventAction,
    deleteEvent: deleteEventAction,
    loading,
    error,
  };
}
