import { Waves } from 'lucide-react';
import Link from 'next/link';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-[#0d3b66] text-white px-6 py-12 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* 1st column - Logo + description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-6 h-6 text-white" />
              <span className="font-bold text-lg">Diving O Club</span>
            </div>
            <p className="text-[#48cae4] text-sm leading-relaxed">
              Plateforme de gestion pour clubs de plongée associatifs
            </p>
          </div>

          {/* 2nd column - Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-3 text-[#48cae4] text-sm">
              <li><Link href="/clubs" className="hover:text-white transition-colors">Rechercher un club</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Créer un club</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* 3rd column - Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Informations</h3>
            <p className="text-[#48cae4] text-sm leading-relaxed mb-4">
              Application web pour la gestion d'adhésions, événements et certificats médicaux.
            </p>
            <p className="text-[#48cae4] text-sm">
              Version 1.0 - Avril 2026
            </p>
          </div>

        </div>

        {/* Separator + copyright */}
        <div className="border-t border-white/20 pt-6 text-center text-[#48cae4] text-sm">
          © {currentYear} Diving O Club. Tous droits réservés.
        </div>

      </div>
    </footer>
  );
}