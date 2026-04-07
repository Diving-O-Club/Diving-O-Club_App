'use client';

import { useState } from 'react';
import { Waves } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-[#0d3b66] rounded-lg flex items-center justify-center">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#0d3b66] font-bold text-lg whitespace-nowrap">
            Diving O Club
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-[#0d3b66] font-medium px-4 py-2 text-sm hover:underline">
            Connexion
          </button>
          <button className="bg-[#0d3b66] text-white font-medium px-5 py-2 text-sm rounded-lg hover:bg-[#1b6ca8] transition-colors">
            Créer un compte
          </button>
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg px-6 py-4 flex flex-col gap-3 z-50">
          <button className="text-[#0d3b66] font-medium py-2 text-left border-b border-gray-100">
            Connexion
          </button>
          <button className="bg-[#0d3b66] text-white font-medium px-4 py-3 rounded-lg text-center">
            Créer un compte
          </button>
        </div>
      )}
    </nav>
  );
}