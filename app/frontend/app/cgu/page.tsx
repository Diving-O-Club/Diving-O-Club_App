import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalSection } from '../components/legal/LegalPage';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Diving O Club",
  description: "Conditions générales d'utilisation de la plateforme Diving O Club.",
};

export default function CguPage() {
  return (
    <LegalPage
      title="Conditions générales d'utilisation"
      updatedAt="24 juin 2026"
      intro={
        <p>
          Les présentes conditions générales d&apos;utilisation (CGU) encadrent
          l&apos;accès et l&apos;usage de la plateforme Diving O Club. En créant un
          compte, vous acceptez ces conditions.
        </p>
      }
    >
      <LegalSection title="1. Objet">
        <p>
          Diving O Club est une plateforme de gestion destinée aux clubs de plongée
          associatifs et à leurs membres : gestion du profil, des adhésions, des
          certificats médicaux et des inscriptions aux événements.
        </p>
      </LegalSection>

      <LegalSection title="2. Accès au service et compte">
        <p>
          L&apos;accès aux fonctionnalités réservées nécessite la création d&apos;un
          compte. Vous vous engagez à fournir des informations exactes et à maintenir
          la confidentialité de vos identifiants. Vous êtes responsable des activités
          réalisées depuis votre compte.
        </p>
      </LegalSection>

      <LegalSection title="3. Obligations de l'utilisateur">
        <p>Vous vous engagez à ne pas :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>usurper l&apos;identité d&apos;un tiers ou fournir de fausses informations ;</li>
          <li>déposer des contenus illicites, trompeurs ou portant atteinte aux droits d&apos;autrui ;</li>
          <li>tenter de perturber le fonctionnement ou la sécurité de la plateforme.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Contenus déposés">
        <p>
          Vous restez responsable des documents que vous déposez (notamment le
          certificat médical et la photo de profil) et garantissez disposer du droit
          de les transmettre. Ces contenus ne sont utilisés que dans le cadre des
          finalités décrites dans la{' '}
          <Link
            href="/confidentialite"
            className="text-[#3DA9FC] underline underline-offset-2 hover:text-[#0d3b66] transition"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Disponibilité et responsabilité">
        <p>
          La plateforme est en cours de construction et en constante évolution :
          de nouvelles fonctionnalités et améliorations sont régulièrement déployées,
          en restant attentif aux retours des utilisateurs. À ce titre, elle est
          fournie « en l&apos;état », sans garantie de disponibilité continue, et
          l&apos;éditeur ne saurait être tenu responsable des interruptions de service
          ou des dommages indirects résultant de l&apos;utilisation du site.
        </p>
      </LegalSection>

      <LegalSection title="6. Données personnelles">
        <p>
          Le traitement de vos données est décrit dans la{' '}
          <Link
            href="/confidentialite"
            className="text-[#3DA9FC] underline underline-offset-2 hover:text-[#0d3b66] transition"
          >
            politique de confidentialité
          </Link>
          . Vous pouvez à tout moment télécharger ou supprimer vos données depuis votre
          espace profil.
        </p>
      </LegalSection>

      <LegalSection title="7. Évolution des CGU">
        <p>
          Les présentes CGU peuvent être modifiées pour suivre l&apos;évolution de la
          plateforme ou de la réglementation. La version applicable est celle publiée
          sur cette page.
        </p>
      </LegalSection>

      <LegalSection title="8. Droit applicable">
        <p>
          Les présentes CGU sont soumises au droit français. À défaut de résolution
          amiable, tout litige relève de la compétence des tribunaux français.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
