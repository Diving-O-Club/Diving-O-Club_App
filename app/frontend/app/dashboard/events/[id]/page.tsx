'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useMembership } from '../../../hooks/useMembership';
import { useEvents } from '../../../hooks/useEvents';
import {
  getEvent,
  getEventParticipants,
  registerToEvent,
  unregisterFromEvent,
  type DashboardEvent,
  type EventParticipants,
} from '@/app/lib/api/events';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserPlus,
  UserMinus,
  Pencil,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import EventTypeBadge from '../../../components/events/EventTypeBadge';
import EventDeleteModal from '../../../components/events/EventDeleteModal';

const MANAGER_ROLES = ['admin', 'super_admin', 'instructor', 'committee'];

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function EventDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const { membership, loading: membershipLoading } = useMembership();
  const { deleteEvent, loading: deleteLoading } = useEvents();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = parseInt(params.id as string);

  const [event, setEvent] = useState<DashboardEvent | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null)
  const [participants, setParticipants] = useState<EventParticipants>({
    registered: [],
    waitlist: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const loadEvent = () => getEvent(eventId).then(setEvent);
  const loadParticipants = () =>
    getEventParticipants(eventId).then(setParticipants);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (searchParams.get('updated') !== '1') return;
    const show = setTimeout(
      () => setToast('Événement mis à jour avec succès'),
      0,
    );
    const hide = setTimeout(() => setToast(null), 4000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [searchParams]);

  useEffect(() => {
    if (!eventId) return;
    Promise.all([
      getEvent(eventId).then(setEvent),
      getEventParticipants(eventId).then(setParticipants),
    ]).finally(() => setEventLoading(false));
  }, [eventId]);

  const handleRegister = async () => {
    setSubmitting(true);
    const message = await registerToEvent(eventId);
    setSubmitting(false);
    if (message) {
      showToast(message);
      await Promise.all([loadEvent(), loadParticipants()]);
    } else {
      showToast("Échec de l'inscription");
    }
  };

  const handleUnregister = async () => {
    setSubmitting(true);
    const message = await unregisterFromEvent(eventId);
    setSubmitting(false);
    if (message) {
      showToast(message);
      await Promise.all([loadEvent(), loadParticipants()]);
    } else {
      showToast('Échec de la désinscription');
    }
  };

  if (authLoading || membershipLoading || eventLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!user || !event) return null;

  const isManager = membership ? MANAGER_ROLES.includes(membership.role.codeRole) : false;
  const isPast = new Date(event.startDatetime) < new Date();
  const canParticipate = !!membership && !isPast;

  const handleDeleteConfirm = async () => {
    const success = await deleteEvent(event.idEvent);
    if (success) router.push('/dashboard/events');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      {toast && (
        <div className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-lg text-sm font-medium bg-[#2EC4B6] text-white">
          <span>✓</span>
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#0d3b66] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        {isManager && (
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/events/${event.idEvent}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#3DA9FC] bg-white px-3 py-2 text-sm font-medium text-[#0D3B66] hover:bg-[#e8f4ff] transition"
            >
              <Pencil className="w-3.5 h-3.5" />
              Modifier
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <EventTypeBadge eventType={event.eventType} />
          <h1 className="text-2xl font-bold text-[#0d3b66] mt-1">{event.title}</h1>
          {event.creator && (
            <p className="text-sm text-gray-400">
              Créé par <span className="font-medium text-gray-600">{event.creator.firstName} {event.creator.lastName}</span>
            </p>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Infos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-[#3DA9FC] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Date</p>
              <p className="text-sm font-medium text-gray-800">{formatDateLong(event.startDatetime)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#3DA9FC] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Horaire</p>
              <p className="text-sm font-medium text-gray-800">{formatTime(event.startDatetime)} — {formatTime(event.endDatetime)}</p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#3DA9FC] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Lieu</p>
                <p className="text-sm font-medium text-gray-800">{event.location}</p>
              </div>
            </div>
          )}

          {event.maxCapacity && (
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-[#3DA9FC] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Capacité</p>
                <p className="text-sm font-medium text-gray-800">{event.maxCapacity} places</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-[#3DA9FC] mt-0.5 shrink-0 text-base leading-none">€</span>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Tarif</p>
              <p className="text-sm font-medium text-gray-800">
                {event.isPaid && event.price
                  ? `${parseFloat(event.price).toFixed(2)} €`
                  : 'Gratuit'}
              </p>
            </div>
          </div>

          {event.minimumLevel && (
            <div className="flex items-start gap-3">
              <span className="text-[#3DA9FC] mt-0.5 shrink-0 text-base leading-none">★</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Niveau minimum</p>
                <p className="text-sm font-medium text-gray-800">{event.minimumLevel}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <>
            <hr className="border-gray-100" />
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          </>
        )}

      </div>

      {/* Participation */}
      {canParticipate && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {event.userStatus === 'registered' && (
              <p className="text-sm font-medium text-green-700">✓ Vous êtes inscrit</p>
            )}
            {event.userStatus === 'waitlist' && (
              <p className="text-sm font-medium text-yellow-700">⏳ Vous êtes en liste d’attente</p>
            )}
            {event.userStatus == null && event.remainingSpots != null && (
              <p className="text-sm text-gray-500">
                {event.remainingSpots > 0
                  ? `${event.remainingSpots} place${event.remainingSpots > 1 ? 's' : ''} restante${event.remainingSpots > 1 ? 's' : ''}`
                  : 'Événement complet — inscription en liste d’attente'}
              </p>
            )}
            {event.userStatus == null && event.remainingSpots == null && (
              <p className="text-sm text-gray-500">Places illimitées</p>
            )}
          </div>

          {event.userStatus == null ? (
            <button
              onClick={handleRegister}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#0d3b66] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#1b6ca8] transition-colors disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              S’inscrire
            </button>
          ) : (
            <button
              onClick={handleUnregister}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-red-50 text-red-600 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <UserMinus className="w-4 h-4" />
              Me désinscrire
            </button>
          )}
        </div>
      )}

      {/* Inscrits */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
        <h2 className="text-base font-semibold text-[#0d3b66] mb-4">
          Inscrits{' '}
          <span className="text-gray-400 font-normal">
            ({participants.registered.length})
          </span>
        </h2>
        {participants.registered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Aucun inscrit pour le moment
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {participants.registered.map((p, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0d3b66] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {p.firstName?.[0]}{p.lastName?.[0]}
                </div>
                <span className="text-sm text-gray-700">
                  {p.firstName} {p.lastName}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Liste d'attente */}
      {participants.waitlist.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          <h2 className="text-base font-semibold text-[#0d3b66] mb-4">
            Liste d’attente{' '}
            <span className="text-gray-400 font-normal">
              ({participants.waitlist.length})
            </span>
          </h2>
          <ul className="flex flex-col gap-2">
            {participants.waitlist.map((p, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700 text-xs font-semibold shrink-0">
                  {p.firstName?.[0]}{p.lastName?.[0]}
                </div>
                <span className="text-sm text-gray-700">
                  {p.firstName} {p.lastName}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <EventDeleteModal
        event={showDeleteModal ? event : null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
      />

    </div>
  );
}
