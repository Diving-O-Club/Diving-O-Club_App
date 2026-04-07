export default function CTASection() {
  return (
    <section className="py-20 px-6 md:px-16 bg-[#0d3b66]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Prêt à rejoindre Diving O Club ?
        </h2>
        <p className="text-white/70 text-lg mb-10">
          Rejoignez les clubs de plongée qui font confiance à notre plateforme pour gérer leurs adhérents et événements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-[#00b4d8] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#48cae4] transition-colors">
            Créer un compte →
          </button>
          <button className="border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
            Rechercher un club
          </button>
        </div>
      </div>
    </section>
  );
}