# 🌊 Diving O Club

Diving O Club est une application web conçue pour moderniser et simplifier la gestion des clubs de plongée sous-marine.

La plateforme centralise les opérations du club telles que la gestion des membres, les certifications, les événements et certaines tâches administratives dans un outil numérique unique. Elle est pensée pour les clubs affiliés à la FFESSM et vise à faciliter les workflows administratifs tout en améliorant l'expérience des responsables de club et des plongeurs.

---

## 🎯 Objectifs du projet

Les principaux objectifs de Diving O Club sont :

- Simplifier la gestion administrative des clubs
- Centraliser les informations des plongeurs et leurs certifications
- Organiser les événements et les séances d'entraînement
- Suivre le matériel du club
- Offrir une interface moderne et accessible
- Permettre un déploiement scalable pour plusieurs clubs

À terme, le projet vise à devenir une plateforme complète de gestion pour les clubs de plongée.

---

## 🧱 Architecture

L'application repose sur une architecture web moderne avec séparation frontend / backend.
```
Frontend (Next.js)
        │
        │ REST API
        ▼
Backend (NestJS / Node.js)
        │
        ├── PostgreSQL (données relationnelles)
        └── MongoDB (stockage documentaire)
```

L'infrastructure est conteneurisée avec Docker et déployée sur AWS EC2.

---

## ⚙️ Stack technique

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- NestJS
- TypeORM / Prisma

### Bases de données
- PostgreSQL
- MongoDB

### DevOps
- Docker
- Docker Compose
- GitHub Actions (CI/CD)
- Déploiement AWS EC2
- Nginx (reverse proxy)
- HTTPS avec Let's Encrypt

---

## 📦 Fonctionnalités

### Gestion des membres
- Enregistrement et gestion des membres du club
- Suivi des niveaux et certifications

### Événements et entraînements
- Création et gestion des séances de plongée
- Suivi de la participation

### Certifications
- Stockage des certifications des plongeurs
- Suivi de la progression

### Gestion du matériel
- Gestion du matériel du club
- Suivi de la disponibilité et de l'utilisation

### Authentification et rôles

Gestion des accès selon différents rôles :

- Student / Member
- Coach
- Admin

---

## 🖥️ Installation (développement local)

Cloner le dépôt :
```bash
git clone https://github.com/your-repository/diving-o-club.git
cd diving-o-club
```

Installer les dépendances :
```bash
npm install
```

Lancer le projet avec Docker :
```bash
docker compose up --build
```

L'application sera accessible sur :
```
http://localhost:3000
```

---

## 🔁 Pipeline CI/CD

Le projet utilise GitHub Actions pour automatiser :

- les tests du code
- la construction des images Docker
- le push des images Docker
- le déploiement sur AWS EC2

Workflow de déploiement :
```
Feature branch
      ↓
Pull Request
      ↓
Develop (staging)
      ↓
Main (production)
```

---

## ☁️ Infrastructure

L'application est déployée sur AWS.

Principaux composants de l'infrastructure :

- Instance EC2
- Conteneurs Docker
- Base PostgreSQL
- Base MongoDB
- Reverse proxy Nginx
- Certificats HTTPS via Let's Encrypt

Évolutions possibles :

- Haute disponibilité
- Auto-scaling
- Externalisation des bases de données

---

## 🎓 Contexte du projet

Ce projet est développé dans le cadre de la formation :

> **RNCP Concepteur Développeur d'Applications**

L'objectif est de concevoir une application complète couvrant :

- architecture logicielle
- modélisation des données
- développement frontend et backend
- CI/CD et DevOps
- déploiement cloud

---

## 👨‍💻 Auteur

**Kevin Lavier**

Développeur web avec une expérience en design et conception d'interfaces.

Centres d'intérêt :

- développement web
- DevOps
- plongée sous-marine
- création d'outils numériques pour les communautés

---

## 📜 Licence

Projet développé actuellement dans un cadre pédagogique et expérimental.
