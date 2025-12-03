# 🚀 Créer vercel.json sur GitHub

## Étapes pour créer `vercel.json` sur GitHub

### 1. Sur la page GitHub de votre repository

1. **Cliquez sur le bouton vert "Add file"** (en haut à droite de la liste des fichiers)
2. **Sélectionnez "Create new file"**

### 2. Nommez le fichier

Dans le champ "Name your file...", tapez exactement :
```
vercel.json
```

### 3. Copiez-collez ce contenu

Dans la zone de texte, copiez-collez exactement ceci :

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

### 4. Commitez le fichier

1. **Descendez en bas de la page**
2. Dans "Commit new file", tapez ce message :
   ```
   Add vercel.json configuration for build fix
   ```
3. **Cliquez sur le bouton vert "Commit new file"**

### 5. Vercel redéploiera automatiquement

Une fois le fichier créé, Vercel détectera automatiquement le changement et créera un nouveau déploiement avec la configuration corrigée.

---

## ✅ Vérification

Après avoir créé le fichier :

1. **Vérifiez** que `vercel.json` apparaît dans la liste des fichiers sur GitHub
2. **Allez dans Vercel Dashboard** > Deployments
3. **Un nouveau déploiement devrait démarrer automatiquement**
4. **Vérifiez les logs** pour confirmer que le build fonctionne maintenant

---

## 📝 Note sur package.json

Si `package.json` existe déjà sur GitHub, vous devrez aussi le mettre à jour :

1. **Cliquez sur `package.json`** sur GitHub
2. **Cliquez sur l'icône ✏️ (Edit)**
3. **Trouvez la ligne** : `"build": "cd frontend && npm run build",`
4. **Remplacez par** : `"build": "cd frontend && npm install --legacy-peer-deps && GENERATE_SOURCEMAP=false npm run build",`
5. **Commitez** avec le message : `Fix: Update build script to install dependencies`

