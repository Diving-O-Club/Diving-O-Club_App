'use client';

import { useState } from 'react';
import { Waves, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '@/app/lib/api/auth';
import DashboardNav from '../ui/DashboardNav';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-[#0d3b66] rounded-lg flex items-center justify-center">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#0d3b66] font-bold text-lg whitespace-nowrap">
            Diving O Club
          </span>
        </Link>

        {/* Center */}
        <div className="hidden md:flex">
          {user && <DashboardNav />}
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 text-[#0d3b66] font-medium px-4 py-2 text-sm hover:underline">
                <User className="w-4 h-4" />
                {user.firstName ?? user.email}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 font-medium px-4 py-2 text-sm rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[#0d3b66] font-medium px-4 py-2 text-sm hover:underline">
                Connexion
              </Link>
              <Link href="/register" className="bg-[#0d3b66] text-white font-medium px-5 py-2 text-sm rounded-lg hover:bg-[#1b6ca8] transition-colors">
                Créer un compte
              </Link>
            </>
          )}
        </div>

{/* Mobile burger */}
        <button
          className="md:hidden text-[#0d3b66] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg px-6 py-4 flex flex-col gap-1 z-50">
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-[#0d3b66] font-medium py-2 px-3 border-b border-gray-100">Accueil</Link>
              <Link href="/dashboard/members" onClick={() => setMenuOpen(false)} className="text-[#0d3b66] font-medium py-2 px-3 border-b border-gray-100">Membres</Link>
              <Link href="/dashboard/events" onClick={() => setMenuOpen(false)} className="text-[#0d3b66] font-medium py-2 px-3 border-b border-gray-100">Événements</Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-[#0d3b66] font-medium py-2 px-3 border-b border-gray-100">Profil</Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-medium py-2 px-3 mt-1 text-sm text-left"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-[#0d3b66] font-medium py-2 text-left border-b border-gray-100"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-[#0d3b66] text-white font-medium px-4 py-3 rounded-lg text-center"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}