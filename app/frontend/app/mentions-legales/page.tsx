import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalSection } from '../components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Mentions légales — Diving O Club',
  description: 'Informations légales relatives à l’éditeur et à l’hébergeur du site Diving O Club.',
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updatedAt="24 juin 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site Diving O Club est édité par{' '}
          <strong>Kevin Lavier</strong>.
        </p>
        <p>
          Contact :{' '}
          <span className="font-medium text-[#0d3b66]">
            divingoclub@gmail.com
          </span>
        </p>
      </LegalSection>

      <LegalSection title="Hébergeur">
        <p>
          Le site est hébergé par{' '}
          <span className="font-medium text-[#0d3b66]">Amazon Web Services EMEA SARL</span>,
          38 avenue John F. Kennedy, L-1855 Luxembourg.
        </p>
        <p>
          Les données sont stockées dans la région AWS Europe (Paris), située en
          France, au sein de l&apos;Union européenne.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du site (structure, textes, logo, interface)
          est protégé par le droit de la propriété intellectuelle. Toute reproduction
          ou réutilisation sans autorisation préalable est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement de vos données personnelles est décrit dans notre{' '}
          <Link
            href="/confidentialite"
            className="text-[#3DA9FC] underline underline-offset-2 hover:text-[#0d3b66] transition"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
