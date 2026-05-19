'use client';

import CTACard from '../components/ui/CTACard';
import ClubCard from '../components/clubs/ClubCard';
import { Search, ArrowRight } from 'lucide-react';
import { useClubSearch } from '../hooks/useClubSearch';

export default function ClubsPage() {
  const { query, setQuery, clubs, loading } = useClubSearch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0d3b66] mb-4">
          Rechercher un club de plongée
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Trouvez le club de plongée qui correspond à vos besoins et rejoignez une communauté de passionnés
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, ville ou description..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] shadow-lg text-[#0d3b66] placeholder-gray-400"
          />
        </div>
      </div>

      {/* Clubs total results */}
      {clubs.length > 0 && (
        <div className="mb-8">
          <p className="text-gray-500">
            <strong>{clubs.length}</strong> club{clubs.length > 1 ? 's' : ''} trouvé{clubs.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Club status */}
      {loading && (
        <p className="text-center text-gray-400 py-8">Recherche en cours...</p>
      )}

      {!loading && clubs.length === 0 && query.length > 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-[#0d3b66] text-xl mb-2">Aucun club trouvé</h3>
          <p className="text-gray-500 mb-6">Essayez avec d'autres mots-clés</p>
        </div>
      )}

      {!loading && query.length === 0 && (
        <p className="text-center text-gray-400 py-8">Commencez à taper pour rechercher un club</p>
      )}

      {/* Grid clubs */}
      {!loading && clubs.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.slug} {...club} />
          ))}
        </div>
      )}

      {/* CTA */}
      <CTACard
        variant="light"
        title="Votre club n'est pas encore référencé ?"
        description="Créez une demande de club et rejoignez la plateforme Diving O Club"
        buttons={[
          { label: "Demander la création d'un club →", href: '#', variant: 'primary' },
        ]}
        className="mt-16"
      />

    </div>
  );
}