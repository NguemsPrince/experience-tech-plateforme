# 🚀 Mettre à Jour les Fichiers Vercel sur GitHub (Solution Manuelle)

## ❌ Problème
GitHub refuse le push car il y a des fichiers MongoDB volumineux (>100 MB) dans l'historique Git.

## ✅ Solution : Mise à Jour Manuelle sur GitHub

### Option 1 : Via l'Interface Web GitHub (Recommandé - 2 minutes)

1. **Allez sur GitHub** : https://github.com/NguemsPrince/Mon-projet

2. **Pour `vercel.json`** :
   - Cliquez sur `vercel.json`
   - Cliquez sur l'icône ✏️ (Edit)
   - Remplacez le contenu par :
   ```json
   {
     "version": 2,
     "buildCommand": "npm run build",
     "outputDirectory": "frontend/build",
     "installCommand": "cd frontend && npm install --legacy-peer-deps",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ],
     "headers": [
       {
         "source": "/static/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=31536000, immutable"
           }
         ]
       }
     ]
   }
   ```
   - Cliquez sur "Commit changes"
   - Message : `Fix: Configure Vercel build to install dependencies correctly`

3. **Pour `package.json`** (racine) :
   - Cliquez sur `package.json`
   - Cliquez sur ✏️ (Edit)
   - Trouvez la ligne avec `"build": "cd frontend && npm run build",`
   - Remplacez par : `"build": "cd frontend && npm install --legacy-peer-deps && GENERATE_SOURCEMAP=false npm run build",`
   - Cliquez sur "Commit changes"

4. **Vercel redéploiera automatiquement** avec la nouvelle configuration !

---

### Option 2 : Utiliser GitHub Desktop

1. **Ouvrez GitHub Desktop**
2. **Sélectionnez** votre repository
3. **Faites les modifications** dans votre éditeur local :
   - `vercel.json`
   - `package.json`
4. **Commit** seulement ces 2 fichiers
5. **Push** (GitHub Desktop gère mieux les gros fichiers)

---

### Option 3 : Nettoyer l'Historique Git (Avancé)

Si vous voulez vraiment nettoyer l'historique Git :

```bash
# Installer git-filter-repo (plus moderne que filter-branch)
pip install git-filter-repo

# Nettoyer l'historique
git filter-repo --path mongodb-macos-x86_64-7.0.5 --invert-paths
git filter-repo --path data --invert-paths
git filter-repo --path mongodb-data --invert-paths
git filter-repo --path mongodb.tgz --invert-paths
git filter-repo --path node-v18.19.0-darwin-x64 --invert-paths
git filter-repo --path node.tar.gz --invert-paths

# Forcer le push (ATTENTION : réécrit l'historique)
git push origin --force --all
```

**⚠️ ATTENTION :** Cela réécrit l'historique Git. Si d'autres personnes travaillent sur ce repository, coordonnez-vous avec eux.

---

## 🎯 Recommandation

**Utilisez l'Option 1 (Interface Web)** - C'est la plus rapide et la plus simple ! 

Une fois les fichiers mis à jour sur GitHub, Vercel détectera automatiquement les changements et redéploiera avec la nouvelle configuration.

---

## ✅ Vérification

Après la mise à jour :

1. **Vérifiez sur GitHub** que les fichiers sont bien modifiés
2. **Allez dans Vercel Dashboard** > Deployments
3. **Vercel devrait automatiquement créer un nouveau déploiement**
4. **Vérifiez les logs** pour confirmer que `react-scripts` est trouvé

