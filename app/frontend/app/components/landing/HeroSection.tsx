import { Users, Calendar, FileCheck } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full bg-linear-to-br from-[#0d3b66] to-[#00b4d8] px-6 py-16 md:px-16 md:py-24">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">

        {/* Left text */}
        <div className="flex-1 text-white w-full">
          <h1 className="text-3xl md:text-6xl font-bold leading-tight mb-6">
            Simplifiez la gestion de votre club de plongée
          </h1>
          <p className="text-base md:text-xl text-white/80 mb-10 max-w-xl">
            Une plateforme tout-en-un pour gérer adhésions, événements,
            certificats médicaux et paiements de votre club associatif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-[#0d3b66] font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
              Créer un compte →
            </button>
            <Link
              href="/clubs"
              className="border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-center"
            >
              Rechercher un club
            </Link>
          </div>
        </div>

        {/* Right Stats */}
        <div className="hidden md:block flex-1 w-full">
          <div className="relative">
            {/* Div Glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-[#48cae4] to-[#00b4d8] rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            {/* Atom Icon + description */}
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="space-y-4">

                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                  <div className="bg-[#48cae4] p-3 rounded-lg shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#caf0f8]">Adhérents actifs</p>
                    <p className="text-2xl font-bold text-white">127</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                  <div className="bg-[#90e0ef] p-3 rounded-lg shrink-0">
                    <Calendar className="w-6 h-6 text-[#0d3b66]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#caf0f8]">Événements</p>
                    <p className="text-2xl font-bold text-white">24</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                  <div className="bg-[#00b4d8] p-3 rounded-lg shrink-0">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#caf0f8]">Certificats valides</p>
                    <p className="text-2xl font-bold text-white">42/45</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}