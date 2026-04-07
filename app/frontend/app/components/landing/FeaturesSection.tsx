import FeatureCard from "../ui/FeatureCard";
import { Users, Calendar, FileCheck, CreditCard } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des Adhérents",
    description:
      "Gérez facilement les membres de votre club avec attribution des rôles et suivi des certifications.",
  },
  {
    icon: Calendar,
    title: "Calendrier d'Événements",
    description:
      "Organisez vos sorties plongée, formations et événements avec inscriptions en ligne.",
  },
  {
    icon: FileCheck,
    title: "Certificats Médicaux",
    description:
      "Upload et validation automatique des certificats médicaux avec alertes d'expiration.",
  },
  {
    icon: CreditCard,
    title: "Paiements HelloAsso",
    description:
      "Intégration des paiements sécurisés pour les cotisations et événements.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6 md:px-16 bg-linear-to-br from-[#e8f4f8] to-[#d0eaf5]">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0d3b66] mb-4">
          Fonctionnalités principales
        </h2>

        <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
          Tout ce dont vous avez besoin pour gérer efficacement votre club de plongée associatif
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* CTA */}
        <div className="w-full bg-linear-to-br from-[#0d3b66] to-[#1b6ca8] rounded-3xl p-10 text-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prêt à démarrer ?
          </h2>

          <p className="text-white/80 mb-8">
            Rejoignez les clubs de plongée qui font confiance à notre plateforme
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#0d3b66] font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
              Créer un compte gratuit →
            </button>

            <button className="border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Demander la création d'un club
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}