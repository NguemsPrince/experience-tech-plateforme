# 🔧 Résolution : react-scripts: command not found

## ❌ Erreur
```
sh: line 1: react-scripts: command not found
Error: Command "react-scripts build" exited with 127
```

## 🔍 Cause
Vercel essaie d'exécuter `react-scripts build` mais les dépendances ne sont pas installées dans le répertoire `frontend`, ou Vercel exécute la commande depuis le mauvais répertoire.

## ✅ Solutions Appliquées

### 1. Mise à jour de `vercel.json`
- `buildCommand` utilise maintenant `npm run build` depuis la racine
- `installCommand` installe les dépendances dans `frontend`
- Suppression de la détection automatique du framework

### 2. Mise à jour de `package.json` (racine)
- Le script `build` installe maintenant les dépendances avant de builder
- Commande : `cd frontend && npm install --legacy-peer-deps && GENERATE_SOURCEMAP=false npm run build`

## 🎯 Actions à Faire dans Vercel Dashboard

### Étape 1 : Vérifier les Paramètres de Build

1. **Allez dans** votre projet Vercel
2. **Cliquez sur** "Settings"
3. **Allez dans** "Build and Deployment"
4. **Vérifiez** les sections suivantes :

#### Framework Preset
- **Devrait être** : "Other" ou "Create React App"
- **Si c'est "Create React App"**, Vercel pourrait ignorer `vercel.json`

#### Build Command
- **Devrait être vide** (pour utiliser `vercel.json`)
- **OU** devrait être : `npm run build`
- **Supprimez** toute commande personnalisée ici si elle existe

#### Install Command
- **Devrait être vide** (pour utiliser `vercel.json`)
- **OU** devrait être : `cd frontend && npm install --legacy-peer-deps`
- **Supprimez** toute commande personnalisée ici si elle existe

#### Output Directory
- **Devrait être vide** (pour utiliser `vercel.json`)
- **OU** devrait être : `frontend/build`
- **Supprimez** toute valeur personnalisée ici si elle existe

#### Root Directory
- **Devrait être vide** (on utilise `cd frontend` dans les commandes)
- **OU** si vous voulez le définir : `frontend`
- **Si vous définissez Root Directory = `frontend`**, alors :
  - Build Command : `npm run build`
  - Install Command : `npm install --legacy-peer-deps`
  - Output Directory : `build`

### Étape 2 : Vérifier que vercel.json est sur GitHub

1. **Allez sur** : https://github.com/NguemsPrince/Mon-projet
2. **Vérifiez** que `vercel.json` existe et contient :
   ```json
   {
     "version": 2,
     "buildCommand": "npm run build",
     "outputDirectory": "frontend/build",
     "installCommand": "cd frontend && npm install --legacy-peer-deps",
     ...
   }
   ```

### Étape 3 : Pousser les Changements sur GitHub

Si `vercel.json` ou `package.json` ont été modifiés localement :

```bash
git add vercel.json package.json
git commit -m "Fix: Configure Vercel build to install dependencies correctly"
git push origin main
```

### Étape 4 : Redéployer

1. **Dans Vercel Dashboard**, allez dans "Deployments"
2. **Cliquez sur** "Redeploy" sur le dernier déploiement
3. **OU** créez un nouveau déploiement en poussant sur GitHub

## 🔄 Solution Alternative : Root Directory dans Dashboard

Si les commandes avec `cd frontend` ne fonctionnent pas :

### Configuration dans Vercel Dashboard :

1. **Settings** > **Build and Deployment**
2. **Root Directory** : `frontend`
3. **Build Command** : `npm run build` (ou laissez vide pour utiliser le script par défaut)
4. **Install Command** : `npm install --legacy-peer-deps`
5. **Output Directory** : `build`

**Important** : Si vous configurez Root Directory = `frontend`, vous devez **supprimer** les `cd frontend &&` de `vercel.json` ou supprimer `vercel.json` complètement.

## ✅ Vérification

Après le redéploiement, vérifiez les logs de build dans Vercel. Vous devriez voir :

```
✓ Installing dependencies
✓ Building application
✓ Build completed
```

Au lieu de :
```
✗ react-scripts: command not found
```

## 🆘 Si le Problème Persiste

1. **Vérifiez** que `frontend/package.json` contient `react-scripts` dans les dépendances
2. **Vérifiez** que `frontend/package-lock.json` existe et est commité
3. **Essayez** de supprimer complètement `vercel.json` et configurez tout dans le Dashboard
4. **Vérifiez** les logs de build complets dans Vercel pour voir exactement quelle commande est exécutée

