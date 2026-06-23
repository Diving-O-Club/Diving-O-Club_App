# 🌊 Diving O Club

> Application web **multi-tenant** de gestion pour les clubs de plongée affiliés
> **FFESSM** : adhésions, événements, inscriptions, certificats médicaux et
> paiements, dans un outil unique.

Pensée pour les responsables de club comme pour les plongeurs, la plateforme
centralise et simplifie les workflows administratifs d'un club, tout en
permettant à plusieurs clubs de cohabiter sur la même instance.

---

## 📸 Aperçu

<!-- Ajoute 2 à 3 captures de l'application (ex. tableau de bord, liste des
événements, gestion des membres) dans un dossier /docs/screenshots puis
référence-les ici : ![Dashboard](docs/screenshots/dashboard.png) -->

> _Captures d'écran à venir._

---

## ✨ Fonctionnalités

### Implémentées
- 🔐 **Authentification & rôles** — JWT dans un cookie HttpOnly ; rôles
  *Adhérent, Moniteur, Comité, Admin, Super Admin*
- 🏊 **Multi-tenant** — chaque club a son espace, accessible par une URL `slug`
- 👥 **Adhésions** — demande d'adhésion, validation/refus par un admin,
  changement de rôle, expulsion (autorisation *cantonnée au club*)
- 📅 **Événements & inscriptions** — création par les encadrants, inscription
  des membres avec **liste d'attente** (FIFO)
- 🩺 **Certificats médicaux** — aptitude, date d'obtention et d'expiration
  (calculée automatiquement)
- 💳 **Paiements** — liés aux événements payants
- 📝 **Journalisation d'audit** — MongoDB, expiration automatique après 30 jours

### Perspectives
- Gestion du matériel du club
- Haute disponibilité, auto-scaling, bases de données managées
- Durcissement sécurité et conformité (voir [Limites & perspectives](#️-limites--perspectives))

---

## 🧱 Architecture

Architecture web moderne avec séparation **frontend / backend** :

```
Frontend (Next.js)
        │
        │ REST API (cookie JWT HttpOnly)
        ▼
Backend (NestJS / Node.js)
        │
        ├── PostgreSQL  (données métier relationnelles, via TypeORM + migrations)
        └── MongoDB     (logs d'audit)
```

Le tout est conteneurisé avec **Docker** et déployé sur **AWS EC2** derrière un
reverse proxy **Nginx** (HTTPS via Let's Encrypt).

---

## ⚙️ Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | NestJS, TypeORM, Passport (JWT), argon2 |
| **Bases de données** | PostgreSQL (métier), MongoDB / Mongoose (audit) |
| **DevOps** | Docker, Docker Compose, GitHub Actions (CI/CD), AWS EC2, Nginx, Let's Encrypt |

---

## 🗂 Conception

Les schémas de conception (MCD, MLD, MPD, cas d'usage, diagrammes de séquence,
wireframes, zoning) sont regroupés dans
[`docs/diagrammes/`](docs/diagrammes). Le dossier technique est dans
[`docs/dossier-technique/`](docs/dossier-technique).

> ⚠️ Schémas en cours de régénération suite à la refonte du schéma de base de
> données (méthode Merise).

---

## 🚀 Installation (développement local)

### Prérequis
- Node.js 20+
- PostgreSQL et MongoDB (en local, ou via Docker)

### 1. Cloner
```bash
git clone <url-du-depot>
cd Diving-O-Club_App
```

### 2. Backend
```bash
cd app/backend
npm install
cp .env.example .env            # puis renseigne les variables (DB, JWT, SEED_PASSWORD…)
npm run migration:run           # crée le schéma
SEED_PASSWORD='<motdepasse>' npm run seed   # données de démo (optionnel)
npm run start:dev               # API sur http://localhost:3001
```

### 3. Frontend
```bash
cd app/frontend
npm install
cp .env.example .env.local      # renseigne NEXT_PUBLIC_API_URL
npm run dev                     # app sur http://localhost:3000
```

---

## 📚 Documentation

| Doc | Où |
|---|---|
| **Backend** (stack, scripts, DB) | [`app/backend/README.md`](app/backend/README.md) |
| **API REST** (Swagger) | `http://localhost:3001/docs` — *local uniquement* |
| **Architecture du code** (Compodoc) | `cd app/backend && npm run doc:serve` → `http://localhost:8080` |

---

## 🧪 Tests

```bash
cd app/backend
npm run test        # tests unitaires (Jest)
npm run test:e2e    # tests end-to-end (Supertest, base de test)
```
La CI exécute également des tests E2E (Playwright) à chaque Pull Request.

---

## 🔁 Pipeline CI/CD (GitHub Actions)

Tests automatisés, build et push des images Docker, puis déploiement sur AWS.

```
Feature branch → PR → Develop (déploie le staging)
                            ↓
                   Tag vX.Y.Z (déploie la production)
```

---

## ☁️ Infrastructure

Déploiement sur **AWS EC2** : conteneurs Docker (frontend, backend, PostgreSQL,
MongoDB), reverse proxy **Nginx**, certificats HTTPS **Let's Encrypt**.
Staging et production cohabitent sur la même instance (stacks Docker séparées).

---

## ⚠️ Limites & perspectives

Points identifiés pour une mise en production grand public (au-delà du cadre
pédagogique actuel) :

- **Certificats médicaux** : il s'agit d'attestations d'aptitude (apte/inapte,
  sans pathologie), donc des données peu sensibles — mais « relatives à la
  santé ». À protéger proportionnellement : accès restreint, chiffrement au
  repos, durée de conservation définie.
- **Durcissement sécurité** : rate limiting sur l'authentification, en-têtes de
  sécurité (Helmet), réinitialisation de mot de passe, monitoring et sauvegardes.
- **Fonctionnel** : gestion du matériel non encore implémentée.

---

## 🎓 Contexte

Projet développé dans le cadre de la formation **RNCP Concepteur Développeur
d'Applications**, couvrant l'architecture logicielle, la modélisation des
données, le développement frontend et backend, la CI/CD et le déploiement cloud.

---

## 👤 Auteur

**Kevin Lavier** — développeur web (design & conception d'interfaces).

---

## 📜 Licence

Projet développé dans un cadre pédagogique et expérimental.
