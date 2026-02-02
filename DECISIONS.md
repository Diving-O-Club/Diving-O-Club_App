# DECISIONS.md — Diving O Club

Journal des décisions techniques majeures (format ADR condensé).
Stack déclarée : **Next.js / React — Node.js / Nest.js — PostgreSQL + MongoDB — HelloAsso**

---

## 001 — Stack Frontend : Next.js
- **Statut** : Acceptée
- **Contexte** : Application “mobile-first”, besoin de pages statiques + dynamiques, SEO minimal (page publique), simplicité de déploiement.
- **Décision** : Next.js 14 (App Router), React 18, Tailwind.
- **Alternatives** : Vite, Nuxt (Vue), SvelteKit.
- **Conséquences** : + PRERENDER possible, + performances, + routing intégré ; – courbe d’apprentissage App Router.
- **Mesure/critères** : LCP mobile p95 < 2.5 s, bundle optimisé, temps build < 40s.

---

## 002 — Backend : Node.js + Nest.js (API REST modulaire)
- **Statut** : Acceptée
- **Contexte** : API structurée, validation, modularité, injection de dépendances, testabilité.
- **Décision** : Nest.js (controllers + services + modules), DTO (class-validator), Guards pour RBAC.
- **Alternatives** : Express (moins structuré), Fastify (perf), Django/Spring (changement langage).
- **Conséquences** : + Architecture propre et scalable ; – plus de contraintes initiales.
- **Mesure/critères** : Latence p95 < 300 ms, couverture tests services > 80%.

---

## 003 — Base de données principale : PostgreSQL
- **Statut** : Acceptée
- **Contexte** : Modèle relationnel strict (users, clubs, events, inscriptions).
- **Décision** : PostgreSQL 15, Prisma ou TypeORM (selon choix final), migrations versionnées.
- **Alternatives** : MySQL, MariaDB.
- **Conséquences** : + Intégrité ; – rigueur sur schéma & migrations.
- **Mesure/critères** : 0 erreur FK, temps requêtes clés < 50 ms.

---

## 004 — Logs / Audit / Traçabilité : MongoDB
- **Statut** : Acceptée
- **Contexte** : Logs volumétriques, structure flexible, accès rapide pour audit RGPD.
- **Décision** : MongoDB Atlas (ou instance locale), collections : logs_app, logs_access.
- **Alternatives** : Elastic, PostgreSQL JSONB.
- **Conséquences** : + flexibilité ; – stack supplémentaire.
- **Mesure/critères** : recherche log < 2s, 0 fuite de logs sensibles.

---

## 005 — Authentification : JWT + cookies httpOnly
- **Statut** : Acceptée
- **Contexte** : Multi-tenant, frontend Next.js, besoin session sécurisée.
- **Décision** : Access token court (15min), refresh httpOnly, rotation, RBAC Nest Guards.
- **Alternatives** : OAuth2, Auth0, Supabase Auth.
- **Conséquences** : + stateless ; – gestion tokens à coder.
- **Mesure/critères** : aucun token stocké en localStorage, 0 faille XSS reportée.

---

## 006 — Paiements : HelloAsso (webhooks)
- **Statut** : Acceptée
- **Contexte** : Clubs associatifs → outil gratuit et adapté.
- **Décision** : Webhook HelloAsso → synchronisation inscription/paiement.
- **Alternatives** : Stripe (hors cadre associatif).
- **Conséquences** : + coût = 0 ; – dépend HelloAsso.
- **Mesure/critères** : délai synchro < 5 min, 0 écart comptable.

---

## 007 — Multi-tenant : scope par club_id
- **Statut** : Acceptée
- **Contexte** : Plusieurs clubs dans la même application.
- **Décision** : Scoping systématique des queries via club_id, guards Nest.
- **Conséquences** : + isolation logique ; – vigilance tests.
- **Mesure/critères** : 0 fuite entre clubs en tests e2e.

---

## 008 — CI/CD : GitHub Actions
- **Statut** : Acceptée
- **Décision** : Lint + tests + build sur PR, déploiement auto sur main.
- **Conséquences** : + qualité ; – pipelines plus longs.
- **Mesure/critères** : pipeline < 8 min.

---

## 009 — Sécurité : baseline OWASP
- **Statut** : Acceptée
- **Décision** : CSP, HSTS, rate limit, bruteforce shield, validation DTO.
- **Mesure/critères** : Score sécurité Lighthouse ≥ 90.

---
