# 🔧 Résolution : Erreur "frontend: No such file or directory" sur Vercel

## 🚨 Erreur Actuelle

```
sh: line 1: cd: frontend: No such file or directory
Error: Command "cd frontend && npm install --legacy-peer-deps" exited with 1
```

## ✅ SOLUTION 1 : Vérifier et Configurer Root Directory dans Vercel Dashboard

### ÉTAPE 1 : Accéder aux Settings

1. **Allez sur** : https://vercel.com/dashboard
2. **Sélectionnez votre projet** : `experience-tech-plateforme`
3. **Cliquez sur "Settings"** (en haut)
4. **Cliquez sur "Build and Deployment"** (menu de gauche)
5. **Cliquez sur "Framework Settings"**

### ÉTAPE 2 : Configurer Root Directory

**IMPORTANT :** Le champ "Root Directory" doit être **VIDE** ou **non configuré**.

Si vous voyez `frontend` dans "Root Directory" :
1. **Cliquez sur le champ "Root Directory"**
2. **Effacez tout** (laissez-le vide)
3. **Cliquez sur "Save"** (en bas de la page)

### ÉTAPE 3 : Vérifier les Commandes de Build

Assurez-vous que les commandes suivantes sont configurées :

**Install Command :**
```
cd frontend && npm install --legacy-peer-deps
```

**Build Command :**
```
cd frontend && npm install --legacy-peer-deps && GENERATE_SOURCEMAP=false npm run build
```

**Output Directory :**
```
frontend/build
```

**Si ces champs sont vides ou différents :**
1. **Activez le toggle "Override"** pour chaque champ
2. **Entrez les commandes ci-dessus**
3. **Cliquez sur "Save"**

---

## ✅ SOLUTION 2 : Vérifier que Frontend est sur GitHub

### Vérification Rapide

1. **Allez sur** : https://github.com/NguemsPrince/experience-tech-plateforme
2. **Vérifiez** que le dossier `frontend/` apparaît dans la liste des fichiers
3. **Cliquez sur `frontend/`** pour voir son contenu
4. **Vérifiez** que `frontend/package.json` existe

**Si `frontend/` n'apparaît pas :**
- Le dossier n'est pas poussé sur GitHub
- Vous devez le committer et le pousser

### Pousser Frontend sur GitHub (Si Nécessaire)

```bash
cd /Users/nguemsprince/Desktop/Projet
git add frontend/
git commit -m "Add frontend directory to repository"
git push origin main
```

---

## ✅ SOLUTION 3 : Configuration Alternative avec Root Directory

### Si Solution 1 ne fonctionne pas, essayez cette configuration :

**Dans Vercel Dashboard > Framework Settings :**

1. **Root Directory :** `frontend`
2. **Build Command :** `npm install --legacy-peer-deps && GENERATE_SOURCEMAP=false npm run build`
3. **Output Directory :** `build`
4. **Install Command :** `npm install --legacy-peer-deps`

**⚠️ IMPORTANT :** Si vous utilisez Root Directory = `frontend`, alors :
- Les commandes dans `vercel.json` ne doivent **PAS** inclure `cd frontend &&`
- Vercel sera déjà dans le dossier `frontend` automatiquement

---

## ✅ SOLUTION 4 : Mettre à Jour vercel.json (Déjà Fait)

Le fichier `vercel.json` a été mis à jour avec les bonnes commandes. 

**Poussez-le sur GitHub :**

```bash
cd /Users/nguemsprince/Desktop/Projet
git add vercel.json
git commit -m "Fix Vercel build: update commands for frontend directory"
git push origin main
```

---

## 🔍 Vérification Après Correction

### Après avoir appliqué une solution :

1. **Allez dans Vercel Dashboard > Deployments**
2. **Cliquez sur "Redeploy"** (ou attendez le déploiement automatique)
3. **Décochez "Use existing Build Cache"** (si disponible)
4. **Cliquez sur "Redeploy"**
5. **Vérifiez les logs** - vous devriez voir :

**✅ CORRECT :**
```
Running "install" command: `cd frontend && npm install --legacy-peer-deps`...
✓ Installed dependencies
Running "build" command: `cd frontend && npm install --legacy-peer-deps && GENERATE_SOURCEMAP=false npm run build`...
✓ Build completed
```

**❌ INCORRECT (erreur actuelle) :**
```
Running "install" command: `cd frontend && npm install --legacy-peer-deps`...
sh: line 1: cd: frontend: No such file or directory
```

---

## 📋 Checklist de Résolution

- [ ] **Root Directory** vérifié dans Vercel Dashboard (doit être VIDE)
- [ ] **Install Command** configuré : `cd frontend && npm install --legacy-peer-deps`
- [ ] **Build Command** configuré : `cd frontend && npm install --legacy-peer-deps && GENERATE_SOURCEMAP=false npm run build`
- [ ] **Output Directory** configuré : `frontend/build`
- [ ] **Frontend directory** vérifié sur GitHub (existe bien)
- [ ] **vercel.json** poussé sur GitHub avec les bonnes commandes
- [ ] **Redéploiement** effectué dans Vercel
- [ ] **Logs vérifiés** (montrent que le build fonctionne)

---

## 🎯 Action Immédiate Recommandée

### Option A : Configuration dans Vercel Dashboard (Plus Rapide)

1. **Allez dans** Vercel Dashboard > Settings > Build and Deployment > Framework Settings
2. **Laissez Root Directory VIDE**
3. **Configurez les commandes** comme indiqué dans Solution 1
4. **Cliquez sur "Save"**
5. **Redéployez**

### Option B : Pousser vercel.json sur GitHub

1. **Poussez** le `vercel.json` mis à jour sur GitHub
2. **Vercel redéploiera automatiquement**
3. **Vérifiez les logs**

---

## 🆘 Si Rien Ne Fonctionne

### Diagnostic Avancé

1. **Vérifiez** que le repository GitHub contient bien `frontend/`
2. **Vérifiez** que `frontend/package.json` existe sur GitHub
3. **Vérifiez** les logs Vercel pour voir exactement où il cherche les fichiers
4. **Essayez** de créer un nouveau projet Vercel et de le connecter au même repository

---

**Le problème principal est que Vercel ne trouve pas le dossier `frontend` lors du clonage. Cela peut être dû à une mauvaise configuration du Root Directory ou à un problème avec le repository GitHub.**

