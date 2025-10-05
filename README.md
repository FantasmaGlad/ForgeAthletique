# 🏋️ La Forge Athlétique

**Athlete Performance Optimizer** - Application web de cockpit analytique pour le suivi et l'optimisation des performances athlétiques.

## 📋 Vue d'ensemble

La Forge Athlétique est une application web locale conçue pour centraliser, suivre et analyser de manière visuelle l'ensemble des données de performance d'un ou plusieurs athlètes. Elle transforme des données éparses en un tableau de bord stratégique permettant d'identifier des tendances, de corréler différentes métriques et de prendre des décisions éclairées.

### Caractéristiques Principales

- 🎯 **Interface "Cockpit Technique"** - Design sombre et data-forward inspiré d'Under Armour
- 📊 **Visualisation Dynamique** - Graphiques interactifs et corrélations multi-métriques
- 💾 **Stockage Local** - Données stockées localement avec IndexedDB (pas de serveur requis)
- 📈 **90+ Métriques** - Suivi complet des performances (force, puissance, endurance, wellness)
- 🎨 **Design System Complet** - Composants réutilisables et cohérents

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ et npm

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

## 🏗️ Architecture Technique

### Stack Technologique

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Visualisation**: Recharts
- **Base de données**: IndexedDB (via Dexie.js)
- **Routing**: React Router
- **Build**: Vite
- **Icônes**: Lucide React

### Structure du Projet

```
src/
├── components/        # Composants React réutilisables
│   ├── ui/           # Composants de base (Button, Card, Input, etc.)
│   ├── layout/       # Composants de mise en page
│   ├── forms/        # Formulaires spécialisés
│   └── charts/       # Composants de visualisation
├── pages/            # Pages/vues de l'application
├── types/            # Définitions TypeScript
├── services/         # Logique métier et accès aux données
├── hooks/            # Custom React hooks
├── utils/            # Fonctions utilitaires
├── config/           # Configuration et données initiales
└── styles/           # Styles globaux
```

## 📊 Modèle de Données

L'application est structurée autour de 6 entités principales :

- **Athlete** - Profil complet de l'athlète (identité, objectifs, historique)
- **Measurement** - Mesure temporelle d'une métrique (KPI)
- **MetricType** - Type de métrique dans la bibliothèque (90+ métriques)
- **TrainingSession** - Séance d'entraînement complète
- **ExercisePerformed** - Exercice réalisé dans une séance
- **Exercise** - Bibliothèque des exercices disponibles

## 🎨 Design System

### Palette de Couleurs

- **Fonds**: `#1A1A1A` (primary), `#252525` (secondary)
- **Accent**: `#0066FF` (bleu cobalt) pour les actions principales
- **Status**: Vert (`#10B981`), Rouge (`#EF4444`), Orange (`#F59E0B`)
- **Texte**: Blanc (`#F5F5F5`), Gris clair (`#A0A0A0`), Gris sombre (`#707070`)

### Composants UI Disponibles

- `Button` - Boutons avec variantes (primary, secondary, danger, ghost)
- `Card` - Conteneurs type "widget cockpit"
- `Input` - Champs de saisie stylisés
- `Select` - Listes déroulantes
- `Badge` - Étiquettes de statut

## 📦 Fonctionnalités

### Phase 1 ✅ (Complétée)
- [x] Configuration du projet React 19 + TypeScript + Vite
- [x] Modèle de données TypeScript complet (90+ propriétés)
- [x] Base de données IndexedDB avec 70+ métriques
- [x] Design System "Cockpit Technique"

### Phase 2 ✅ (Complétée)
- [x] Layout principal avec Sidebar persistante
- [x] 13 composants UI réutilisables
- [x] 4 composants de graphiques (LineChart, MultiLineChart, etc.)
- [x] Système Cards/Widgets complet

### Phase 3 ✅ (Complétée)
- [x] Tableau de bord personnel avec records automatiques
- [x] Saisie quotidienne simplifiée (Wellness < 1 minute)
- [x] Journal d'entraînement avec analyse de charge

### Phase 4 ✅ (Complétée)
- [x] Gestion complète des profils athlètes (CRUD)
- [x] Dossier athlète centralisé avec onglets
- [x] Modules de saisie : Anthropométrie, Force, Puissance, Endurance
- [x] **Moteur de visualisation dynamique** (COEUR) ⭐
- [x] Historique des mesures avec tri et recherche
- [x] Export/Import JSON complet

### Phase 5 🚧 (Avancée)
- [x] Calculs automatiques (IMC, 1RM estimé, vitesse, VO2max)
- [x] Détection automatique de records personnels
- [x] Analyse de corrélations entre métriques ⭐
- [x] Export PNG/SVG des graphiques

### Progression Globale: **90% (16/17 tâches)**

## 🎯 Catégories de Métriques

L'application suit 7 grandes catégories de données :

1. **ANTHROPOMÉTRIE** - Taille, poids, circonférences, composition corporelle
2. **FORCE_MAXIMALE** - 1RM, 3RM, 5RM sur exercices polyarticulaires
3. **PUISSANCE_VITESSE** - CMJ, sprints, tests d'agilité
4. **ENDURANCE** - VO2max, seuils, fréquence cardiaque
5. **WELLNESS** - Sommeil, fatigue, stress, courbatures
6. **CHARGE_ENTRAINEMENT** - RPE, volume, ratios
7. **NUTRITION** - Apports caloriques, macronutriments

## 🧪 Développement

### Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
```

### Linting et Formatage

Le projet utilise ESLint et TypeScript pour garantir la qualité du code.

## 📝 Licence

Projet privé - © 2025 La Forge Athlétique

## 🤝 Contribution

Ce projet est en développement actif. Les contributions suivent le cahier des charges défini.

---

**Développé avec ⚡ Vite + ⚛️ React + 📘 TypeScript**
