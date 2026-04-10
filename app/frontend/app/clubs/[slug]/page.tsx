import Link from 'next/link';
import { MapPin, Users, Calendar, ArrowLeft, ArrowRight, Mail, Shield } from 'lucide-react';
import { getClub } from '../../lib/api';

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClub(slug);

    if (!club) {
    return (
        <div className="min-h-[calc(100vh-350px)] flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-2xl font-bold text-[#0d3b66]">Club non trouvé</h1>
        <p className="text-gray-500">Le club que vous recherchez n'existe pas.</p>
        <Link href="/clubs" className="flex items-center gap-2 text-[#006994] hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" />
            Retour à la recherche
        </Link>
        </div>
    );
    }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        <Link href="/clubs" className="inline-flex items-center gap-2 text-[#006994] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour à la recherche
        </Link>

        {/* Main card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-6">
          <div className="h-48 md:h-56 bg-linear-to-br from-[#0d3b66] via-[#006994] to-[#48cae4] flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl">
              <Shield className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[#0d3b66]">{club.name}</h1>
                {club.clubStatus === 'active' && (
                  <span className="bg-green-100 text-green-700 text-sm px-3 py-0.5 rounded-full">Actif</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{club.city}, France</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#f1f8fb] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#006994] mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold">{club.memberships?.length ?? 0}</span>
                </div>
                <p className="text-sm text-gray-500">Membres actifs</p>
              </div>
              <div className="bg-[#f1f8fb] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#006994] mb-1">
                  <Calendar className="w-5 h-5" />
                  <span className="text-2xl font-bold">{club.events?.length ?? 0}</span>
                </div>
                <p className="text-sm text-gray-500">Événements</p>
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed">{club.description}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
          <h2 className="text-xl font-bold text-[#0d3b66] mb-6">Informations de contact</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="bg-[#f1f8fb] p-3 rounded-lg shrink-0">
                <Mail className="w-5 h-5 text-[#006994]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <a href={`mailto:${club.emailContact}`} className="text-[#006994] hover:underline font-medium">
                  {club.emailContact}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-[#f1f8fb] p-3 rounded-lg shrink-0">
                <MapPin className="w-5 h-5 text-[#006994]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Adresse</p>
                <p className="font-medium text-[#0d3b66]">{club.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Join this club */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl text-center">
          <h2 className="text-xl font-bold text-[#0d3b66] mb-4">Rejoindre ce club</h2>
          <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
            Envoyez une demande d'adhésion au club. Le président examinera votre demande et vous contactera.
          </p>
          <button className="inline-flex items-center gap-2 py-4 px-8 bg-linear-to-r from-[#0d3b66] to-[#006994] text-white rounded-xl hover:shadow-lg transition-all group">
            <span>Demander à rejoindre</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-400 mt-4">Connexion requise pour rejoindre un club</p>
        </div>

      </div>
    </div>
  );
}