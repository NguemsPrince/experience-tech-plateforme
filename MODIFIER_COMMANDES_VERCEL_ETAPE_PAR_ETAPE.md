# 📝 Modifier les Commandes Vercel - Guide Étape par Étape

## 🚨 Problème : Les Commandes Ne Sont Pas Modifiées

Les logs montrent toujours :
```
Running "install" command: `npm install --legacy-peer-deps`...
```

**Il faut modifier les commandes pour inclure `cd frontend &&`.**

---

## ✅ ÉTAPE PAR ÉTAPE : Modifier les Commandes

### ÉTAPE 1 : Aller dans Framework Settings

1. **Allez sur** : https://vercel.com/dashboard
2. **Ouvrez votre projet** : `experience-tech-plateforme`
3. **Cliquez sur** : **Settings** (en haut)
4. **Cliquez sur** : **Build and Deployment** (menu de gauche)
5. **Cliquez sur** : **Framework Settings** (ou cherchez la section avec les commandes)

---

### ÉTAPE 2 : Trouver "Install Command"

1. **Dans la page Framework Settings**, cherchez la section **"Project Settings"**
2. **Si elle est fermée**, cliquez dessus pour l'ouvrir
3. **Cherchez** : **"Install Command"**
4. **À côté**, vous devriez voir un **toggle "Override"**

---

### ÉTAPE 3 : Activer et Modifier Install Command

1. **Cliquez sur le toggle "Override"** à côté de "Install Command"
   - Il devrait devenir **bleu** (activé)
2. **Le champ devient éditable**
3. **Cliquez dans le champ** "Install Command"
4. **Effacez** ce qui est dedans (probablement `npm install --legacy-peer-deps`)
5. **Tapez** :
   ```
   cd frontend && npm install --legacy-peer-deps
   ```
6. **Vérifiez** que c'est bien écrit

---

### ÉTAPE 4 : Modifier Build Command

1. **Trouvez** : **"Build Command"**
2. **Activez le toggle "Override"** (cliquez dessus pour qu'il devienne bleu)
3. **Cliquez dans le champ** "Build Command"
4. **Effacez** ce qui est dedans (probablement `npm run build`)
5. **Tapez** :
   ```
   cd frontend && npm run build
   ```
6. **Vérifiez** que c'est bien écrit

---

### ÉTAPE 5 : Modifier Output Directory

1. **Trouvez** : **"Output Directory"**
2. **Activez le toggle "Override"** (cliquez dessus pour qu'il devienne bleu)
3. **Cliquez dans le champ** "Output Directory"
4. **Effacez** ce qui est dedans (probablement `build`)
5. **Tapez** :
   ```
   frontend/build
   ```
6. **Vérifiez** que c'est bien écrit

---

### ÉTAPE 6 : Sauvegarder

1. **Faites défiler vers le bas** de la page
2. **Cherchez le bouton "Save"** (généralement en bas à droite)
3. **Cliquez sur "Save"**
4. **Attendez** la confirmation que les changements sont sauvegardés

---

### ÉTAPE 7 : Redéployer

1. **Allez dans** : **"Deployments"** (en haut de la page)
2. **Trouvez le dernier déploiement** (celui qui a échoué)
3. **Cliquez sur les trois points (⋯)** à droite
4. **Cliquez sur** : **"Redeploy"**
5. **Décochez** "Use existing Build Cache" (optionnel mais recommandé)
6. **Cliquez sur** : **"Redeploy"**

---

## 🔍 Vérification Après Redéploiement

### Dans les nouveaux logs, vous devriez voir :

**✅ CORRECT :**
```
Running "install" command: `cd frontend && npm install --legacy-peer-deps`...
✓ Installed dependencies
Running "build" command: `cd frontend && npm run build`...
✓ Build completed
```

**❌ INCORRECT (ce que vous voyez actuellement) :**
```
Running "install" command: `npm install --legacy-peer-deps`...
npm error path /vercel/path0/package.json
```

---

## 📋 Checklist Complète

- [ ] **Framework Settings** ouvert
- [ ] **Section "Project Settings"** ouverte
- [ ] **Install Command** : Toggle "Override" activé
- [ ] **Install Command** : Valeur = `cd frontend && npm install --legacy-peer-deps`
- [ ] **Build Command** : Toggle "Override" activé
- [ ] **Build Command** : Valeur = `cd frontend && npm run build`
- [ ] **Output Directory** : Toggle "Override" activé
- [ ] **Output Directory** : Valeur = `frontend/build`
- [ ] **Bouton "Save"** cliqué
- [ ] **Changements sauvegardés** (confirmation reçue)
- [ ] **Projet redéployé**
- [ ] **Logs vérifiés** (montrent `cd frontend &&`)

---

## 🆘 Si Vous Ne Voyez Pas les Toggles "Override"

### Cherchez dans d'autres sections :

1. **"Production Overrides"** (section ouverte)
2. **"Project Settings"** (peut être fermée - cliquez pour ouvrir)
3. **"Build Settings"** (peut être dans le menu de gauche)

### Si les champs sont grisés :

- Ils sont peut-être dans "Production Overrides" (qui peut être verrouillée)
- Modifiez-les dans "Project Settings" à la place

---

## 🎯 Action Immédiate

### Faites ceci dans cet ordre :

1. ✅ **Settings > Build and Deployment > Framework Settings**
2. ✅ **Ouvrez "Project Settings"** (si fermée)
3. ✅ **Install Command** : Activez "Override" → Tapez `cd frontend && npm install --legacy-peer-deps`
4. ✅ **Build Command** : Activez "Override" → Tapez `cd frontend && npm run build`
5. ✅ **Output Directory** : Activez "Override" → Tapez `frontend/build`
6. ✅ **Cliquez sur "Save"**
7. ✅ **Redéployez**

---

**Modifiez ces 3 commandes avec les toggles "Override" et dites-moi si vous voyez les changements dans les logs !** 🚀

