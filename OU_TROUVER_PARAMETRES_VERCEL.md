# 📍 Où Trouver les Paramètres de Build sur Vercel

## 🎯 Vous êtes actuellement sur : "General"

Vous voyez la page **"General"** avec :
- Project Name
- Project ID

**Mais les paramètres de build sont ailleurs !**

---

## ✅ ÉTAPE 1 : Aller dans "Build and Deployment"

### Dans le menu de gauche (sidebar), cliquez sur :

**"Build and Deployment"** 

(C'est le deuxième élément dans la liste, juste en dessous de "General")

---

## 📋 ÉTAPE 2 : Vérifier les Paramètres

Une fois dans **"Build and Deployment"**, vous verrez plusieurs sections :

### Section 1 : "Build Settings"

Vous devriez voir ces champs :

```
Framework Preset: [Menu déroulant]
Root Directory: [Champ texte]
Build Command: [Champ texte]
Output Directory: [Champ texte]
Install Command: [Champ texte]
```

### Section 2 : "Development Command" (optionnel)

### Section 3 : "Ignored Build Step" (optionnel)

---

## ⚙️ ÉTAPE 3 : Configurer les Paramètres

### Dans la section "Build Settings", configurez :

1. **Framework Preset**
   - Cliquez sur le menu déroulant
   - Sélectionnez **"Create React App"**

2. **Root Directory**
   - Cliquez dans le champ
   - Entrez : `frontend`
   - ⚠️ C'est le dossier qui contient votre `package.json` React

3. **Build Command**
   - Cliquez dans le champ
   - Entrez : `npm run build`
   - (Ou laissez vide si vous utilisez `vercel.json`)

4. **Output Directory**
   - Cliquez dans le champ
   - Entrez : `build`
   - ⚠️ C'est le dossier créé après le build

5. **Install Command**
   - Cliquez dans le champ
   - Entrez : `npm install --legacy-peer-deps`
   - (Pour éviter les erreurs de dépendances)

6. **Cliquez sur "Save"** en bas de la page

---

## 🔄 ÉTAPE 4 : Configurer les Routes (Important !)

### Toujours dans "Build and Deployment"

Faites défiler vers le bas jusqu'à voir :

### Section : "Redirects" ou "Rewrites"

1. Cliquez sur **"Add"** ou **"+ Add Redirect"**

2. Configurez :
   - **Source** : `/(.*)`
   - **Destination** : `/index.html`
   - **Status Code** : `200` (ou "Rewrite")

3. Cliquez sur **"Save"**

**Pourquoi c'est important :** Cela permet à toutes les routes React de fonctionner (nécessaire pour les Single Page Applications).

---

## 📋 Résumé des Paramètres à Configurer

### Dans "Build and Deployment" > "Build Settings" :

```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install --legacy-peer-deps
```

### Dans "Build and Deployment" > "Redirects" :

```
Source: /(.*)
Destination: /index.html
Status Code: 200
```

---

## 🎯 Navigation Complète

1. **Dashboard Vercel** → Votre projet `plateforme_web_dynamique`
2. **Settings** (en haut)
3. **Build and Deployment** (menu de gauche)
4. **Build Settings** (section principale)
5. **Redirects** (section en bas)

---

## ✅ Après Configuration

1. **Sauvegardez** tous les changements
2. Allez dans **"Deployments"** (en haut)
3. Cliquez sur **"Redeploy"** sur le dernier déploiement
4. Attendez que le build se termine
5. Testez votre URL : `https://plateformewebdynamique.vercel.app`

---

## 🆘 Si Vous Ne Voyez Pas "Build and Deployment"

**Vérifiez que :**
- Vous êtes bien sur la page **"Settings"** de votre projet
- Vous n'êtes pas dans "Team Settings" (il y a un lien "← Go to Team Settings")
- Vous êtes sur le bon projet (`plateforme_web_dynamique`)

---

## 📸 Chemin Visuel

```
Vercel Dashboard
  └─ plateforme_web_dynamique
      └─ Settings (en haut)
          └─ Build and Deployment ← CLIQUEZ ICI
              ├─ Build Settings
              │   ├─ Framework Preset
              │   ├─ Root Directory
              │   ├─ Build Command
              │   ├─ Output Directory
              │   └─ Install Command
              └─ Redirects
                  └─ Add Redirect
```

---

**Dites-moi quand vous êtes dans "Build and Deployment" et je vous guiderai pour chaque paramètre !** 🚀

