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
