# 🔧 Résolution : package.json Not Found

## 🚨 Erreur : `Could not read package.json: ENOENT: no such file or directory`

### Problème Identifié :

Vercel cherche `package.json` à la racine (`/vercel/path0/package.json`), mais votre `package.json` est dans `frontend/`.

**Cela signifie que Vercel ne sait pas où se trouve votre code !**

---

## ✅ SOLUTION 1 : Configurer Root Directory dans Vercel Dashboard

### Action Immédiate :

1. **Allez dans Vercel Dashboard**
2. **Settings > Build and Deployment > Framework Settings**
3. **Trouvez "Root Directory"**
4. **Entrez :** `frontend`
5. **Cliquez sur "Save"**
6. **Redéployez**

**C'est la solution la plus simple et la plus rapide !**

---

## ✅ SOLUTION 2 : Modifier vercel.json

### Le fichier vercel.json doit indiquer le Root Directory

Modifiez `vercel.json` pour inclure explicitement le root directory :

```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "build",
  "installCommand": "npm ci",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**ET configurez Root Directory = `frontend` dans Vercel Dashboard.**

---

## ✅ SOLUTION 3 : Configuration Complète dans Vercel Dashboard

### Dans Settings > Build and Deployment > Framework Settings :

```
Root Directory: frontend
Node.js Version: 18.x (ou version par défaut)
Build Command: npm run build
Output Directory: build
Install Command: npm ci
```

**Important :** Root Directory doit être `frontend` !

---

## 🔍 Pourquoi Cette Erreur ?

Vercel exécute les commandes depuis la racine du repository par défaut. Si votre code est dans un sous-dossier (`frontend/`), vous devez :

1. **Soit** configurer Root Directory = `frontend` dans Vercel
2. **Soit** utiliser des commandes avec `cd frontend &&` dans vercel.json

---

## 📋 Checklist de Vérification

- [ ] **Root Directory** configuré sur `frontend` dans Vercel Dashboard
- [ ] **Build Command** = `npm run build` (pas `cd frontend && npm run build` si Root Directory est configuré)
- [ ] **Output Directory** = `build` (pas `frontend/build` si Root Directory est configuré)
- [ ] **Install Command** = `npm ci` ou `npm install`
- [ ] **Tous les paramètres sauvegardés**
- [ ] **Projet redéployé**

---

## 🎯 Action Immédiate (La Plus Simple)

### Faites ceci MAINTENANT :

1. **Allez dans Vercel Dashboard**
2. **Settings > Build and Deployment > Framework Settings**
3. **Dans "Root Directory", entrez :** `frontend`
4. **Cliquez sur "Save"**
5. **Allez dans "Deployments"**
6. **Cliquez sur "Redeploy"**

**C'est tout ! Vercel saura maintenant où se trouve votre code.**

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

Vérifiez que :
1. Le dossier `frontend/` existe bien dans votre repository
2. Le fichier `frontend/package.json` existe
3. Root Directory est bien configuré sur `frontend` (pas `/frontend` ni `./frontend`)

---

**Configurez Root Directory = `frontend` dans Vercel Dashboard et redéployez !** 🚀

