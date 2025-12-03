# 🔧 Solution : Fichiers Volumineux sur GitHub

## 🚨 Problème : GitHub refuse les fichiers > 100 MB

GitHub a une limite de **100 MB par fichier**. Les fichiers MongoDB et Node.js dépassent cette limite.

---

## ✅ SOLUTION : Nettoyer l'Historique Git

### Option 1 : Utiliser git filter-branch (Recommandé)

```bash
cd /Users/nguemsprince/Desktop/Projet

# Retirer les fichiers volumineux de tout l'historique Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch -r mongodb-macos-x86_64-7.0.5/ data/ mongodb-data/ mongodb.tgz node-v18.19.0-darwin-x64/ node.tar.gz" \
  --prune-empty --tag-name-filter cat -- --all

# Forcer le push (ATTENTION : cela réécrit l'historique)
git push origin --force --all
```

**⚠️ ATTENTION :** Cela réécrit l'historique Git. Si d'autres personnes travaillent sur ce repository, coordonnez-vous avec eux.

---

### Option 2 : Créer un Nouveau Repository (Plus Simple)

Si vous êtes seul sur ce projet :

1. **Créez un nouveau repository GitHub** : `experience-tech-plateforme-clean`
2. **Ajoutez-le comme nouveau remote** :
   ```bash
   git remote add clean https://github.com/NguemsPrince/experience-tech-plateforme-clean.git
   ```
3. **Poussez uniquement les fichiers nécessaires** :
   ```bash
   git push clean main
   ```
4. **Connectez Vercel au nouveau repository**

---

### Option 3 : Utiliser Git LFS (Pour les Gros Fichiers)

Si vous avez vraiment besoin de garder ces fichiers :

1. **Installez Git LFS** :
   ```bash
   brew install git-lfs  # Sur macOS
   git lfs install
   ```

2. **Configurez Git LFS** :
   ```bash
   git lfs track "mongodb-macos-x86_64-7.0.5/**"
   git lfs track "data/**"
   git add .gitattributes
   git commit -m "Add Git LFS tracking"
   ```

3. **Poussez** :
   ```bash
   git push origin main
   ```

**Note :** Git LFS a des limites sur le plan gratuit GitHub.

---

## ✅ SOLUTION RAPIDE : Pousser Seulement Frontend

### Pour déployer rapidement sur Vercel :

1. **Créez un nouveau repository** juste pour le frontend :
   ```bash
   # Créez un nouveau repo sur GitHub : experience-tech-frontend
   cd /Users/nguemsprince/Desktop/Projet/frontend
   git init
   git add .
   git commit -m "Initial commit - Frontend only"
   git remote add origin https://github.com/NguemsPrince/experience-tech-frontend.git
   git push -u origin main
   ```

2. **Connectez Vercel à ce nouveau repository**
3. **Configurez** : Root Directory = (vide, car tout est dans frontend/)

---

## 🎯 Solution Recommandée pour Votre Cas

### Pour déployer rapidement sur Vercel :

**Option la plus simple :**

1. **Dans Vercel Dashboard**, configurez directement sans Root Directory :
   - Build Command : `cd frontend && npm run build`
   - Output Directory : `frontend/build`
   - Install Command : `cd frontend && npm ci`

2. **OU créez un repository séparé** pour le frontend (voir Option 3 ci-dessus)

---

## 📋 Fichiers à Exclure de Git

Assurez-vous que `.gitignore` contient :

```
mongodb-macos-x86_64-*/
data/
mongodb-data/
mongodb.tgz
node-v*/
node.tar.gz
```

---

**Pour l'instant, configurez directement dans Vercel Dashboard sans Root Directory pour déployer rapidement !** 🚀

