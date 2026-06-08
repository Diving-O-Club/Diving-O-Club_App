import { clientFetch } from '../clientFetch';

export type DashboardEvent = {
  idEvent: number;
  title: string;
  eventType: string;
  startDatetime: string;
  endDatetime: string;
  location: string;
  minimumLevel: string;
  maxCapacity: number;
  isPaid: boolean;
  price: string | null;
  status: string;
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
