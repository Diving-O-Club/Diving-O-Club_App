# 📚 Template Dossier CDA - Colint School

Template LaTeX professionnel pour la rédaction de votre dossier CDA au style corporate Colint School.

## 🚀 Démarrage rapide

```bash
# 1. Cloner le repository
git clone [URL_DU_REPO]
cd cda-folder

# 2. Vérifier les dépendances
make install-deps

# 3. Compiler le template
make pdf

# 4. Personnaliser vos informations dans main.tex
# 5. Remplacer le contenu d'exemple par votre projet
```

## 🎯 À qui s'adresse ce template ?

Ce template est conçu pour les étudiants en **Concepteur Développeur d'Applications (CDA)** de Colint School qui doivent rédiger leur dossier de fin d'alternance. Il respecte les exigences du jury et facilite la mise en forme professionnelle.

## 🎨 Identité visuelle Colint School

- **Couleurs :** Jaune primaire (#FFD700), Noir (#101820), Blanc (#FFFFFF), Gris foncé (#333A40)
- **Typographie :** Inter (fallback Helvetica/Arial)
- **Style :** Corporate moderne avec environnements tcolorbox personnalisés
- **Mise en page :** A4, marges professionnelles, en-têtes/pieds de page

## 📁 Structure du projet

```
Colint-cda/
├── main.tex                 # Document principal (à personnaliser)
├── chapters/                # 11 chapitres complets
│   ├── chapitre_I.tex       # Présentation personnelle
│   ├── chapitre_II.tex      # Cadrage et cahier des charges
│   ├── chapitre_III.tex     # Méthodologie et organisation
│   ├── chapitre_IV.tex      # Conception fonctionnelle
│   ├── chapitre_V.tex       # Développement Front/Back/Data
│   ├── chapitre_VI.tex      # Sécurité et RGPD
│   ├── chapitre_VII.tex     # Tests et qualité
│   ├── chapitre_VIII.tex   # Déploiement et CI/CD
│   ├── chapitre_IX.tex      # Veille technologique
│   ├── chapitre_X.tex       # Bilan et REX
│   └── chapitre_XI.tex      # Conclusion et remerciements
├── assets/                  # Dossier pour vos figures et ressources
│   ├── README.md            # Guide pour les images
│   ├── image.png           # Logo de l'école
│   └── fonts/              # Polices Inter intégrées
│       ├── Inter-Regular.ttf    # Police principale
│       ├── Inter-Bold.ttf       # Police en gras
│       ├── Inter-Italic.ttf     # Police en italique
│       └── Inter-BoldItalic.ttf # Police gras + italique
├── Makefile                 # Compilation automatique
└── README.md               # Ce fichier
```

## 🛠️ Installation et configuration

### Étape 1 : Installation de LaTeX

**Sur macOS :**
```bash
# Option 1 : Installation complète (recommandée)
brew install --cask mactex

# Option 2 : Installation légère
brew install --cask basictex
sudo tlmgr update --self
sudo tlmgr install tcolorbox xcolor geometry hyperref fontspec
```

**Sur Linux (Ubuntu/Debian) :**
```bash
# Installation complète
sudo apt-get update
sudo apt-get install texlive-full

# Ou installation légère
sudo apt-get install texlive-xetex texlive-latex-extra texlive-fonts-recommended
```

**Sur Windows :**
- Téléchargez et installez [MiKTeX](https://miktex.org/) ou [TeXLive](https://www.tug.org/texlive/)
- Installez les packages supplémentaires via l'interface graphique

### Étape 2 : Vérification de l'installation

```bash
# Vérifier que XeLaTeX est installé
xelatex --version

# Vérifier que latexmk est installé
latexmk --version
```

### Étape 3 : Compilation du template

```bash
# Compilation complète (recommandée)
make pdf

# Compilation rapide (sans bibliographie)
make quick

# Compilation avec surveillance des changements
make watch

# Nettoyage des fichiers temporaires
make clean

# Vérification des dépendances
make install-deps

# Vérification de la structure du projet
make check-structure

# Aide
make help
```

**Note :** Le template utilise XeLaTeX avec la police Helvetica (système) pour une compatibilité maximale.

## 📝 Personnalisation du template

### Étape 1 : Informations personnelles

Modifiez le fichier `main.tex` pour personnaliser vos informations :

```latex
% Commandes personnalisées (lignes 150-155)
\newcommand{\ProjetTitre}{[Votre Titre de Projet]}
\newcommand{\CandidatNom}{[Votre Nom]}
\newcommand{\Promotion}{[Votre Promotion]}
\newcommand{\Entreprise}{[Nom de votre Entreprise]}
\newcommand{\Tuteur}{[Nom de votre Tuteur]}
```

### Étape 2 : Contenu des chapitres

Chaque chapitre contient déjà :
- ✅ **Texte d'exemple** (3-6 lignes par section)
- ✅ **Exemples concrets** (code, SQL, JSON, diagrammes)
- ✅ **Boîtes conseil** (checklist à faire/vérifier)
- ✅ **Boîtes jury** (questions pour le jury)
- ✅ **Liens utiles** (documentation officielle)

**Remplacez le contenu d'exemple par votre projet réel !**

## 📋 Structure des chapitres

### I. Présentation personnelle et du projet
- Rôle du candidat et contexte
- Problématique et objectifs SMART
- Pitch QQOQCP

### II. Cadrage et cahier des charges
- Objectifs métier, techniques et pédagogiques
- Cibles et parties prenantes
- Exigences fonctionnelles et techniques
- MVP et roadmap

### III. Méthodologie et organisation
- Méthode Agile et rituels
- Versioning GitHub et conventions
- Planification et outils de suivi

### IV. Conception fonctionnelle et technique
- Use Cases et diagrammes UML
- Diagrammes de séquence
- Conception graphique et UX
- Base de données et architecture 3 tiers

### V. Développement Front/Back/Data
- Développement Frontend (React, accessibilité)
- Développement Backend (API REST, validation)
- Gestion des données (PostgreSQL, MongoDB)

### VI. Sécurité applicative et RGPD
- Protection contre les vulnérabilités OWASP
- Authentification et autorisation
- Conformité RGPD

### VII. Tests et qualité logicielle
- Stratégie de tests (pyramide)
- Tests de performance
- Qualité du code avec SonarQube

### VIII. Déploiement et CI/CD
- Containerisation avec Docker
- Pipeline CI/CD avec GitHub Actions
- Documentation et monitoring

### IX. Veille technologique et sécurité
- Veille technologique stack
- Bonnes pratiques sécurité
- Application au projet

### X. Bilan et retour d'expérience (REX)
- Objectifs atteints et non atteints
- Difficultés rencontrées et solutions
- Dettes techniques et apprentissages

### XI. Conclusion et remerciements
- Synthèse du projet
- Perspectives d'évolution
- Remerciements

## 🎯 Environnements personnalisés

### Boîtes tcolorbox
- `\begin{conseil}` - À FAIRE / À VÉRIFIER (fond gris, bordure jaune)
- `\begin{jury}` - Contrôles Jury CDA (fond blanc, bordure noire)
- `\begin{exemple}` - Exemple (fond jaune pâle)
- `\begin{focusgithub}` - Focus GitHub (fond gris foncé)

### Commandes personnalisées
- `\ProjetTitre{}` - Titre du projet
- `\CandidatNom{}` - Nom du candidat
- `\Promotion{}` - Promotion
- `\Entreprise{}` - Nom de l'entreprise
- `\Tuteur{}` - Nom du tuteur
- `\DateDoc{}` - Date du document

## 📊 Ajout de figures et images

### Formats supportés
- **Images :** PNG, JPG, PDF, SVG
- **Diagrammes :** PDF, PNG (export depuis draw.io, Mermaid, etc.)
- **Captures :** PNG (haute résolution recommandée)

### Conventions de nommage
- `fig_chapitre_section_description.png`
- Exemple : `fig_IV_architecture_3tiers.png`

### Utilisation dans LaTeX
```latex
\begin{figure}[h]
    \centering
    \includegraphics[width=0.8\textwidth]{assets/fig_IV_architecture_3tiers.png}
    \caption{Architecture 3 tiers du système}
    \label{fig:architecture}
\end{figure}
```

## 🔧 Dépannage et FAQ

### Erreurs de compilation courantes

**Erreur : "XeLaTeX non trouvé"**
```bash
# Vérifier l'installation
xelatex --version

# Réinstaller si nécessaire
brew install --cask mactex  # macOS
sudo apt-get install texlive-xetex  # Linux
```

**Erreur : "Package tcolorbox not found"**
```bash
# Installer les packages manquants
sudo tlmgr install tcolorbox xcolor geometry hyperref
```

**Erreur : "Font Helvetica not found"**
- Le template utilise Helvetica (police système macOS)
- Sur Linux/Windows, LaTeX utilisera automatiquement Arial ou une police similaire
- Les polices Inter sont incluses dans le dossier `fonts/` mais non utilisées par défaut

### Problèmes de figures
- Vérifiez que les chemins des images sont corrects
- Utilisez des formats supportés : PNG, JPG, PDF, SVG
- Placez vos images dans le dossier `assets/`

### Optimisation de la compilation
```bash
# Compilation standard
make pdf

# Compilation rapide (sans bibliographie)
make quick

# Surveillance des changements (recompilation automatique)
make watch

# Nettoyage des fichiers temporaires
make clean

# Vérification des dépendances
make install-deps

# Vérification de la structure
make check-structure
```

## 📚 Ressources et liens utiles

### Documentation LaTeX
- [Documentation XeLaTeX](https://www.overleaf.com/learn/latex/XeLaTeX)
- [tcolorbox Documentation](https://ctan.org/pkg/tcolorbox)
- [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX)

### Outils recommandés
- **Éditeur :** VS Code avec extension LaTeX Workshop
- **Diagrammes :** [draw.io](https://app.diagrams.net/), [Mermaid](https://mermaid-js.github.io/)
- **Gestion de versions :** Git avec GitHub

### Colint School
- [Site officiel](https://colint.school/)
- [Documentation CDA](https://colint.school/formations/cda/)
- Support technique : contact@colint.school

## 🎯 Éléments de Rappel CDA - Points Cruciaux

### ⚠️ **Attention : votre projet doit couvrir ces compétences obligatoires**

#### **CCP1 - Développer une application sécurisée**
- ✅ **Installer et configurer** son environnement de travail
- ✅ **Développer des interfaces utilisateur** (Frontend)
- ✅ **Développer des composants métier** (Backend)
- ✅ **Contribuer à la gestion** d'un projet informatique

#### **CCP2 - Concevoir et développer une application sécurisée organisée en couches**
- ✅ **Analyser les besoins** et maquetter une application
- ✅ **Définir l'architecture logicielle** d'une application
- ✅ **Concevoir et mettre en place** une base de données relationnelle
- ✅ **Développer des composants d'accès** aux données SQL et NoSQL

#### **CCP3 - Préparer le déploiement d'une application sécurisée**
- ✅ **Préparer et exécuter** les plans de tests d'une application
- ✅ **Préparer et documenter** le déploiement d'une application
- ✅ **Contribuer à la mise en production** dans une démarche DevOps

### 🏗️ **Architecture 3 tiers obligatoire**

Votre application doit être organisée en couches distinctes :

```
┌─────────────────────────────────────┐
│  Couche Présentation (Frontend)     │ ← React, Vue, Angular...
├─────────────────────────────────────┤
│  Couche Métier (Services)           │ ← Logique business
├─────────────────────────────────────┤
│  Couche Accès Données (DAO/Repo)     │ ← Accès BDD
├─────────────────────────────────────┤
│  Couche Persistance (Base de données)│ ← PostgreSQL, MongoDB...
└─────────────────────────────────────┘
```

### 📊 **Diagrammes obligatoires à fournir**

1. **Diagramme de cas d'utilisation (Use Cases)** - Minimum 1
2. **Diagramme de séquence** - Minimum 1
3. **Schéma de base de données** :
   - **MCD** (Modèle Conceptuel de Données) - Méthodologie Merise recommandée
   - **MLD** (Modèle Logique de Données)
   - **MPD** (Modèle Physique de Données)

### 🎨 **Conception graphique obligatoire**

- ✅ **Zoning** des pages
- ✅ **Wireframes** (mobile + desktop)
- ✅ **Maquettes** responsives
- ✅ **Charte graphique** complète (couleurs, typographie, logo)

### 🔒 **Sécurité - bonnes pratiques obligatoires**

- ✅ **Validation des entrées** utilisateur
- ✅ **Protection XSS** (échappement des caractères)
- ✅ **Authentification robuste** (JWT, OAuth...)
- ✅ **Gestion des autorisations** (rôles/permissions)
- ✅ **HTTPS** pour les communications
- ✅ **Gestion sécurisée des erreurs**

### 📱 **Responsive design obligatoire**

Votre application doit être responsive :
- ✅ **Mobile First** approach
- ✅ **Media queries** CSS ou framework (Bootstrap...)
- ✅ **Test sur différentes tailles** d'écran

### 🛠️ **Outils et Technologies Recommandés**

#### Frontend
- React, Vue.js, Angular
- Bootstrap, Tailwind CSS
- JavaScript ES6+, TypeScript

#### Backend
- Node.js, Java Spring, PHP Laravel
- API RESTful obligatoire
- JWT pour l'authentification

#### Base de Données
- **SQL** : PostgreSQL, MySQL
- **NoSQL** : MongoDB (pour les rapports/analytics)

#### DevOps
- **Docker** (containerisation)
- **GitHub Actions** (CI/CD)
- **SonarQube** (qualité du code)

### 📋 **Checklist Projet CDA**

- [ ] **Architecture 3 tiers** implémentée
- [ ] **API RESTful** développée
- [ ] **Base de données** relationnelle + NoSQL
- [ ] **Authentification** sécurisée
- [ ] **Interface responsive** (mobile + desktop)
- [ ] **Tests** automatisés
- [ ] **Déploiement** avec Docker
- [ ] **Documentation** technique complète
- [ ] **Diagrammes** UML/Merise fournis
- [ ] **Maquettes** et charte graphique

## 🎤 Informations sur la Soutenance CDA

### 📅 Déroulement de l'Examen

#### **1ère Étape : Évaluation Anglais (30 minutes)**
- 📖 **Documentation technique** en anglais (ex: documentation Git)
- ❓ **2 questions QCM** en français
- ✍️ **2 questions ouvertes** écrites en anglais avec réponses en anglais
- 💡 **Conseil** : Les réponses sont dans le document, pas de panique !

#### **2ème Étape : Présentation Projet (40 minutes)**
- 🎯 **Votre moment** : Présentation PowerPoint de votre projet
- 📊 **Démonstration** de l'application (5 minutes)
- 🔧 **Code** : Montrer les parties techniques importantes
- 💻 **Utilisez votre ordinateur** personnel pour la démo

#### **3ème Étape : Entretien Technique (45 minutes)**
- 🤔 **Questions** sur vos choix techniques
- 🧠 **Vérification** de votre compréhension du projet
- 📚 **Questions théoriques** liées à votre formation
- ✅ **Objectif** : S'assurer que vous êtes bien l'auteur du projet

#### **4ème Étape : Entretien Final (20 minutes)**
- 💼 **Parcours professionnel** et objectifs futurs
- 🎓 **Formation continue** ou emploi trouvé
- 🤝 **Discussion formelle** sur votre avenir

### 🎯 Structure PowerPoint Recommandée

#### **Partie 1 (15 minutes)**
1. **Introduction en anglais** (QQOQCP : Qui, Quoi, Où, Quand, Comment, Pourquoi)
2. **Annonce du plan** de présentation
3. **Conception fonctionnelle** (Use Cases, séquences, classes/Merise)
4. **Conception BDD** (MCD, MLD, MPD)
5. **Conception graphique** (Zoning, wireframes, maquettes, charte)
6. **Méthodologie** (Agile, Scrum, outils)
7. **Environnement technique** (VS Code, Git, technologies)
8. **🎬 DÉMONSTRATION** (5 minutes)

#### **Partie 2 (20 minutes)**
1. **Code Frontend** : Formulaire d'inscription + CSS responsive
2. **Code Backend** : Gestion formulaire + requêtes BDD
3. **Sécurité** : Mesures implémentées
4. **Déploiement** : Docker et outils DevOps
5. **Veille technologique** : Recherches en anglais
6. **Conclusion**

### 💡 Conseils pour Réussir

#### **Avant la Soutenance**
- ✅ **Préparez-vous** : Répétez votre présentation plusieurs fois
- ⏰ **Respectez le timing** : 40 minutes exactement
- 🧪 **Testez votre démo** : Vérifiez que tout fonctionne
- 📱 **Préparez des données** de test pour la démonstration

#### **Pendant la Soutenance**
- 🗣️ **Parlez clairement** et à un rythme normal
- 👀 **Regardez le jury** dans les yeux
- 🎯 **Restez concentré** même si le jury semble occupé
- 💪 **Soyez confiant** : Vous connaissez votre projet !

#### **Questions Fréquentes du Jury**
- 🤔 "Expliquez votre architecture 3 tiers"
- 🔒 "Comment avez-vous sécurisé votre application ?"
- 📊 "Montrez-nous votre MCD et expliquez les contraintes"
- 🚀 "Comment avez-vous déployé votre application ?"
- 🧪 "Quels tests avez-vous mis en place ?"

### 🎉 Pourquoi Vous Allez Réussir

- ✅ **Vous avez travaillé** sur votre projet pendant des mois
- ✅ **Vous connaissez** chaque ligne de code
- ✅ **Vous avez surmonté** les difficultés techniques
- ✅ **Vous êtes prêt** à défendre vos choix
- ✅ **Le jury veut** vous voir réussir !

## 🎓 Conseils pour le jury

### Points clés à retenir
1. **Personnalisez** le contenu d'exemple par votre projet réel
2. **Ajoutez** vos propres figures et diagrammes
3. **Respectez** la structure des chapitres CCP1/CCP2/CCP3
4. **Préparez** les réponses aux questions des boîtes jury
5. **Testez** la compilation avant la remise

### Checklist avant remise
- [ ] Informations personnelles mises à jour
- [ ] Contenu personnalisé avec votre projet
- [ ] Contenu d'exemple remplacé par votre projet
- [ ] Figures et diagrammes ajoutés
- [ ] Compilation sans erreur
- [ ] PDF généré et vérifié
- [ ] Sauvegarde sur GitHub/cloud

## 📄 Licence et utilisation

Ce template est fourni gratuitement aux étudiants CDA de Colint School. Vous pouvez :
- ✅ L'utiliser pour votre dossier CDA
- ✅ Le personnaliser selon vos besoins
- ✅ Le partager avec d'autres étudiants CDA
- ❌ Le revendre ou le redistribuer commercialement

---

**Bon travail pour votre dossier CDA ! 🚀**

*Template créé par l'équipe Colint School - Version 2025*
