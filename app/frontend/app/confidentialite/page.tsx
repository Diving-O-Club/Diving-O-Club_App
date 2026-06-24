import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalSection } from '../components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Diving O Club',
  description:
    'Données personnelles collectées par Diving O Club, durées de conservation et exercice de vos droits RGPD.',
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      updatedAt="24 juin 2026"
      intro={
        <p>
          Cette politique décrit les données personnelles traitées par Diving O Club,
          les raisons de leur collecte, leur durée de conservation et les droits dont
          vous disposez conformément au Règlement Général sur la Protection des
          Données (RGPD).
        </p>
      }
    >
      <LegalSection title="1. Responsable du traitement">
        <p>
          Le site Diving O Club est édité par Kevin Lavier. Pour toute question relative à vos données
          personnelles, vous pouvez écrire à :{' '}
          <span className="font-medium text-[#0d3b66]">
            divingoclub@gmail.com
          </span>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Données que nous collectons">
        <p>Dans le cadre de l&apos;utilisation de la plateforme, nous collectons :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Identité :</strong> nom, prénom, adresse e-mail, numéro de
            téléphone, date de naissance, adresse postale (rue, code postal, ville).
          </li>
          <li>
            <strong>Compte :</strong> mot de passe, stocké uniquement sous forme
            chiffrée (haché) et jamais en clair.
          </li>
          <li>
            <strong>Données de plongée :</strong> numéro de licence FFESSM, niveau de
            plongée, niveau d&apos;encadrement.
          </li>
          <li>
            <strong>Vie associative :</strong> adhésions à des clubs, rôles et
            inscriptions aux événements.
          </li>
        </ul>
        <p>
          Nous ne collectons aucune donnée bancaire ou de paiement, et ne pratiquons
          aucune publicité ciblée.
        </p>
      </LegalSection>

      <LegalSection title="3. Durées de conservation">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Données du compte et de profil :</strong> conservées tant que
            votre compte est actif, puis anonymisées lors de sa suppression.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Destinataires des données">
        <p>
          Vos données ne sont ni vendues ni cédées. Elles sont accessibles à
          l&apos;éditeur du site (administration de la plateforme) et aux responsables
          du club auquel vous adhérez, pour la gestion de votre adhésion. Elles sont
          hébergées par notre prestataire technique (voir les{' '}
          <Link
            href="/mentions-legales"
            className="text-[#3DA9FC] underline underline-offset-2 hover:text-[#0d3b66] transition"
          >
            mentions légales
          </Link>
          ). Aucun transfert n&apos;est réalisé en dehors de l&apos;Union européenne.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          La plateforme utilise un seul cookie strictement nécessaire à son
          fonctionnement : un cookie d&apos;authentification (sécurisé, non accessible
          au code JavaScript) qui maintient votre session après connexion. Aucun
          cookie publicitaire ou de mesure d&apos;audience n&apos;est déposé.
        </p>
      </LegalSection>

      <LegalSection title="6. Vos droits">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>droit d&apos;accès et de rectification de vos données ;</li>
          <li>droit à l&apos;effacement (suppression de votre compte) ;</li>
          <li>droit à la portabilité (export de vos données au format JSON) ;</li>
          <li>droit d&apos;opposition et de limitation du traitement.</li>
        </ul>
        <p>
          Vous pouvez exercer la plupart de ces droits directement depuis votre{' '}
          <Link
            href="/profile"
            className="text-[#3DA9FC] underline underline-offset-2 hover:text-[#0d3b66] transition"
          >
            espace profil
          </Link>{' '}
          : modification de vos informations, téléchargement de vos données et
          suppression de votre compte. Pour toute autre demande, contactez
          l&apos;éditeur à l&apos;adresse indiquée en section 1.
        </p>
      </LegalSection>

      <LegalSection title="7. Sécurité">
        <p>
          Les mots de passe sont chiffrés (hachés) et les échanges avec la plateforme
          sont sécurisés. Nous mettons en œuvre des mesures techniques raisonnables
          pour protéger vos données contre tout accès non autorisé.
        </p>
      </LegalSection>

      <LegalSection title="8. Réclamation">
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire
          une réclamation auprès de la Commission Nationale de l&apos;Informatique et
          des Libertés (CNIL). {' '}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3DA9FC] underline underline-offset-2 hover:text-[#0d3b66] transition"
          >
            www.cnil.fr
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
