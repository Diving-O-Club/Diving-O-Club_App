import { ReactNode } from 'react';

type LegalPageProps = {
  title: string;
  updatedAt: string;
  intro?: ReactNode;
  children: ReactNode;
};

// Shared chrome for static legal pages (privacy policy, legal notice, terms):
// gradient background, centered readable column, header with last-updated date.
export default function LegalPage({ title, updatedAt, intro, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#e8f4ff] to-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0d3b66] mb-3">{title}</h1>
          <p className="text-sm text-gray-400">Dernière mise à jour : {updatedAt}</p>
          {intro && <div className="mt-4 text-[#006994] leading-relaxed">{intro}</div>}
        </header>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

// A single titled card within a legal page.
export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-[#0d3b66] mb-3">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
