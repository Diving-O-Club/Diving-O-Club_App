import { Pencil, Trash2, MapPin, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { type DashboardEvent } from '@/app/lib/api/events';
import EventTypeBadge from './EventTypeBadge';

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

type Props = {
  event: DashboardEvent;
  isManager: boolean;
  onEdit: (event: DashboardEvent) => void;
  onDelete: (event: DashboardEvent) => void;
};

export default function EventCard({ event, isManager, onEdit, onDelete }: Props) {
  const isPast = new Date(event.startDatetime) < new Date();

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4 ${isPast ? 'opacity-60' : ''}`}>
      <Link href={`/dashboard/events/${event.idEvent}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
        <div className="flex items-center gap-2 mb-1.5">
          <EventTypeBadge eventType={event.eventType} />
          {isPast && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              Passé
            </span>
          )}
        </div>
        <p className="font-semibold text-[#0d3b66] truncate">{event.title}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(event.startDatetime)} · {formatTime(event.startDatetime)} — {formatTime(event.endDatetime)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {event.location && (
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              {event.location}
            </span>
          )}
          {event.remainingSpots != null ? (
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Users className="w-3.5 h-3.5" />
              {event.remainingSpots} place{event.remainingSpots > 1 ? 's' : ''} restante{event.remainingSpots > 1 ? 's' : ''}
            </span>
          ) : (
            event.maxCapacity && (
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <Users className="w-3.5 h-3.5" />
                {event.maxCapacity} places
              </span>
            )
          )}
        </div>
      </Link>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className="font-semibold text-[#0d3b66]">
            {event.isPaid && event.price
              ? `${parseFloat(event.price).toFixed(0)} €`
              : 'Gratuit'}
          </p>
        </div>

        {isManager && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-gray-400 hover:text-[#0d3b66] hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(event)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}