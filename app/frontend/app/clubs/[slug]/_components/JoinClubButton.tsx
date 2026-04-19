'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = { clubId: number };
type StatusData = {
  status: 'active' | 'pending' | 'pending_other' | 'active_other' | null;
  clubName?: string;
  clubSlug?: string;
};

export default function JoinClubButton({ clubId }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [statusData, setStatusData] = useState<StatusData>({ status: null });
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoadingStatus(false); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership/status/${clubId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setStatusData(data))
      .catch(() => setStatusData({ status: null }))
      .finally(() => setLoadingStatus(false));
  }, [user, authLoading, clubId]);

  const handleRequest = async () => {
    if (!user) { router.push('/login'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership/request/${clubId}`,
        { method: 'POST', credentials: 'include' },
      );
      if (res.ok) setStatusData({ status: 'pending' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership/request/${clubId}`,
        { method: 'DELETE', credentials: 'include' },
      );
      if (res.ok) setStatusData({ status: null });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loadingStatus) {
    return <div className="w-48 h-14 bg-gray-100 rounded-xl animate-pulse mx-auto" />;
  }

  if (statusData.status === 'active') {
    return (
      <div className="inline-flex items-center gap-2 py-4 px-8 bg-green-50 text-green-700 font-semibold rounded-xl border border-green-200">
        ✅ Vous êtes membre de ce club
      </div>
    );
  }

    if (statusData.status === 'active_other') {
    return (
        <div className="flex flex-col items-center gap-2 py-4 px-8 bg-gray-50 text-gray-500 rounded-xl border border-gray-200">
        <p className="font-semibold text-sm">Vous êtes déjà membre de</p>
        <Link
            href={`/clubs/${statusData.clubSlug}`}
            className="font-bold text-[#0d3b66] hover:underline"
        >
            {statusData.clubName}
        </Link>
        </div>
    );
    }

  if (statusData.status === 'pending') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 py-4 px-8 bg-yellow-50 text-yellow-700 font-semibold rounded-xl border border-yellow-200">
          ⏳ Demande en attente de validation
        </div>
        <button
          onClick={handleCancel}
          disabled={submitting}
          className="text-sm text-gray-400 hover:text-red-500 underline transition-colors disabled:opacity-50"
        >
          {submitting ? 'Annulation...' : 'Annuler ma demande'}
        </button>
      </div>
    );
  }

  if (statusData.status === 'pending_other') {
    return (
      <div className="flex flex-col items-center gap-2 py-4 px-8 bg-gray-50 text-gray-500 rounded-xl border border-gray-200">
        <p className="font-semibold text-sm">Demande en cours pour rejoindre</p>
        <Link
            href={`/clubs/${statusData.clubSlug}`}
            className="font-bold text-[#0d3b66] hover:underline"
        >
            {statusData.clubName}
        </Link>
        <p className="text-xs text-gray-400">En attente de validation par le responsable du club.</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={submitting}
      className="inline-flex items-center gap-2 py-4 px-8 bg-linear-to-r from-[#0d3b66] to-[#006994] text-white rounded-xl hover:shadow-lg transition-all group disabled:opacity-50"
    >
      <span>{submitting ? 'Envoi...' : 'Demander à rejoindre'}</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}