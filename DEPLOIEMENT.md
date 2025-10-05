# Guide de Déploiement - La Forge Athlétique

## Déploiement sur Netlify

### Option 1 : Déploiement via l'interface Netlify (Recommandé)

1. **Préparer le dépôt GitHub**
   ```bash
   git add .
   git commit -m "Configuration pour déploiement Netlify"
   git push origin main
   ```

2. **Connecter à Netlify**
   - Rendez-vous sur [netlify.com](https://www.netlify.com/)
   - Connectez-vous (ou créez un compte)
   - Cliquez sur "Add new site" > "Import an existing project"
   - Choisissez "Deploy with GitHub"
   - Sélectionnez votre dépôt `CoachCentral`

3. **Configuration du build**
   Les paramètres suivants seront automatiquement détectés grâce au fichier `netlify.toml` :
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   
   Si ce n'est pas le cas, entrez-les manuellement.

4. **Déployer**
   - Cliquez sur "Deploy site"
   - Attendez que le déploiement se termine (2-3 minutes)
   - Votre site sera disponible avec une URL du type `https://random-name.netlify.app`

5. **Personnaliser le nom de domaine** (optionnel)
   - Dans les paramètres du site, allez à "Domain management"
   - Cliquez sur "Options" > "Edit site name"
   - Changez pour un nom plus parlant comme `la-forge-athletique`

### Option 2 : Déploiement via Netlify CLI

1. **Installer Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Se connecter à Netlify**
   ```bash
   netlify login
   ```

3. **Initialiser le site**
   ```bash
   netlify init
   ```

4. **Déployer**
   ```bash
   # Build de production
   npm run build
   
   # Déploiement
   netlify deploy --prod
   ```

## Fichiers de Configuration Créés

### `netlify.toml`
Ce fichier configure :
- ✅ La commande de build et le dossier de publication
- ✅ Les redirections pour React Router (toutes les routes vers `index.html`)
- ✅ Les headers de sécurité (X-Frame-Options, X-XSS-Protection, etc.)
- ✅ Les headers de cache optimisés pour les assets

### `public/_redirects`
Fichier de backup pour les redirections SPA. Netlify lira ce fichier si `netlify.toml` n'est pas présent.

### `vite.config.ts`
Configuration optimisée pour :
- ✅ Code splitting intelligent (séparation des vendors, charts, utils)
- ✅ Optimisation du bundle de production
- ✅ Chargement plus rapide des pages

## Vérification Post-Déploiement

Une fois le site déployé, testez toutes les routes principales :

- ✅ `/` - Tableau de bord personnel
- ✅ `/dashboard` - Vue d'ensemble
- ✅ `/athletes` - Liste des athlètes
- ✅ `/athletes/:id` - Détail d'un athlète
- ✅ `/wellness` - Bien-être
- ✅ `/analytics` - Analyses
- ✅ `/settings` - Paramètres

**Important** : Testez en accédant directement aux URLs (pas seulement via la navigation), car c'est là que les problèmes de routage SPA apparaissent généralement.

## Problèmes Courants

### ❌ Erreur 404 sur les routes
- **Cause** : Le fichier `_redirects` ou `netlify.toml` n'est pas correctement configuré
- **Solution** : Vérifiez que les fichiers ont bien été déployés avec votre build

### ❌ Assets non chargés
- **Cause** : Chemins d'assets incorrects
- **Solution** : Tous les chemins sont relatifs, cela devrait fonctionner automatiquement

### ❌ Base de données vide
- **Cause** : IndexedDB est locale au navigateur
- **Solution** : Normal ! Chaque utilisateur aura sa propre base de données locale

## Déploiements Automatiques

Par défaut, Netlify redéploiera automatiquement votre site à chaque push sur la branche `main` de GitHub. Vous pouvez :
- Voir l'historique des déploiements dans l'interface Netlify
- Revenir à une version précédente en un clic
- Configurer des déploiements de prévisualisation pour les Pull Requests

## Performance

Grâce aux optimisations mises en place :
- 📦 Code splitting par vendor/feature
- 🚀 Cache longue durée pour les assets avec hash
- 🔒 Headers de sécurité configurés
- ⚡ Chargement optimisé des chunks

---

**Note** : L'application utilise IndexedDB pour le stockage local, ce qui signifie que les données sont stockées dans le navigateur de chaque utilisateur. Pour une application multi-utilisateurs avec synchronisation, vous devrez implémenter un backend.
