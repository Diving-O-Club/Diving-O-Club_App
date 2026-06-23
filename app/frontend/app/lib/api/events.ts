import { clientFetch } from '../clientFetch';

export type DashboardEvent = {
  idEvent: number;
  title: string;
  description?: string;
  eventType: string;
  startDatetime: string;
  endDatetime: string;
  location: string | null;
  minimumLevel: string | null;
  maxCapacity: number | null;
  isPaid: boolean;
  price: string | null;
  status: string;
  creator: { firstName: string; lastName: string } | null;
  // Registration info (null remainingSpots = unlimited capacity).
  remainingSpots?: number | null;
  registeredCount?: number;
  userStatus?: 'registered' | 'waitlist' | null;
};

export type EventParticipant = { firstName: string; lastName: string };

export type EventParticipants = {
  registered: EventParticipant[];
  waitlist: EventParticipant[];
};

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

export async function getEvent(eventId: number): Promise<DashboardEvent | null> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
      { cache: 'no-store', credentials: 'include' },
    );
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function createEvent(
  clubId: number,
  payload: CreateEventPayload,
): Promise<DashboardEvent> {
  const res = await clientFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la création');
  return data;
}

export async function updateEvent(
  eventId: number,
  payload: UpdateEventPayload,
): Promise<DashboardEvent> {
  const res = await clientFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la modification');
  return data;
}

export async function deleteEvent(eventId: number): Promise<void> {
  const res = await clientFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  );
  if (!res.ok) throw new Error('Erreur lors de la suppression');
}

// Enriched event list for a club (includes remainingSpots and userStatus).
export async function getClubEvents(clubId: number): Promise<DashboardEvent[]> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events`,
      { cache: 'no-store', credentials: 'include' },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getEventParticipants(
  eventId: number,
): Promise<EventParticipants> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/participants`,
      { cache: 'no-store', credentials: 'include' },
    );
    if (!res.ok) return { registered: [], waitlist: [] };
    return res.json();
  } catch {
    return { registered: [], waitlist: [] };
  }
}

// Returns the message to show as feedback, or null on failure.
export async function registerToEvent(eventId: number): Promise<string | null> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/register`,
      { method: 'POST', credentials: 'include' },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.message === 'string' ? data.message : 'Inscription réussie';
  } catch {
    return null;
  }
}

export async function unregisterFromEvent(
  eventId: number,
): Promise<string | null> {
  try {
    const res = await clientFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/register`,
      { method: 'DELETE', credentials: 'include' },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.message === 'string'
      ? data.message
      : 'Désinscription réussie';
  } catch {
    return null;
  }
}
