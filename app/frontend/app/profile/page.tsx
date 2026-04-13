'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { User, Mail } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <h1 className="text-2xl font-bold text-[#0d3b66] mb-8">Mon profil</h1>

      <div className="bg-white rounded-2xl shadow-xl p-8">

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-[#0d3b66] to-[#006994] rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0d3b66]">Mon compte</h2>
            <p className="text-gray-400 text-sm">Adhérent Diving O Club</p>
          </div>
        </div>

        {/* Informations */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-[#e8f4f8] p-3 rounded-lg shrink-0">
              <Mail className="w-5 h-5 text-[#006994]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Adresse email</p>
              <p className="font-medium text-[#0d3b66]">{user.email}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center mt-8">
          Les informations de profil seront complétées lors de l'adhésion à un club.
        </p>

      </div>

    </div>
  );
}