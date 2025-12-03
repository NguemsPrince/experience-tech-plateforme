# 📁 Configurer Root Directory dans la Modal Vercel

## 🎯 Vous êtes dans la Modal "Root Directory"

Parfait ! Vous avez cliqué sur "Edit" et la modal s'est ouverte.

---

## ✅ ÉTAPE 1 : Entrer le Root Directory

### Dans la modal "Root Directory" :

1. **Vous voyez** : "experience-tech-plateforme" (c'est le repository)
2. **En dessous**, il y a un champ de texte ou une liste d'options
3. **Vous devez entrer** : `frontend`

### Comment faire :

**Option A : Si c'est un champ de texte :**
- Cliquez dedans
- Effacez ce qui est dedans (probablement `./` ou vide)
- Tapez : `frontend`
- ⚠️ **IMPORTANT** : Juste `frontend` (pas `/frontend` ni `./frontend` ni `frontend/`)

**Option B : Si c'est une liste déroulante :**
- Cliquez sur la liste
- Cherchez `frontend` dans les options
- Si vous ne le voyez pas, vous pouvez peut-être taper pour chercher
- Sélectionnez `frontend`

**Option C : Si vous voyez "experience-tech-plateforme" avec une option :**
- Cliquez sur l'option qui montre le repository
- Ensuite, vous devriez pouvoir entrer `frontend`

---

## ✅ ÉTAPE 2 : Continuer

1. **Après avoir entré** `frontend`
2. **Cliquez sur** : **"Continue"** (bouton en bas de la modal)
3. **La modal se fermera** et vous retournerez au formulaire de configuration

---

## 📋 Ce Que Vous Devriez Voir Après

### Dans le formulaire principal :

- **Root Directory** devrait afficher : `frontend`
- **Framework Preset** : Create React App (ou détecté automatiquement)
- **Build Command** : `npm run build` (automatique)
- **Output Directory** : `build` (automatique)

---

## ⚠️ Si Vous Ne Pouvez Pas Entrer "frontend"

### Vérifiez que :

1. **Le champ est éditable** (cliquez dedans)
2. **Vous pouvez taper** du texte
3. **Si c'est une liste**, cherchez `frontend` dans les options

### Si `frontend` n'apparaît pas dans les options :

Cela peut signifier que le dossier `frontend/` n'existe pas encore dans le repository sur GitHub. Dans ce cas :

1. **Cliquez sur "Cancel"** pour fermer la modal
2. **Laissez Root Directory vide** pour l'instant
3. **Configurez les commandes manuellement** :
   - Build Command : `cd frontend && npm run build`
   - Output Directory : `frontend/build`
   - Install Command : `cd frontend && npm install --legacy-peer-deps`

---

## 🎯 Action Immédiate

### Dans la modal "Root Directory" :

1. ✅ **Tapez** : `frontend` dans le champ
2. ✅ **Vérifiez** que c'est bien écrit (juste `frontend`)
3. ✅ **Cliquez sur** : **"Continue"**

---

## 📋 Après Avoir Cliqué "Continue"

### Vous retournerez au formulaire principal :

1. **Vérifiez** que Root Directory affiche : `frontend`
2. **Vérifiez** les autres paramètres :
   - Framework Preset : Create React App
   - Build Command : `npm run build`
   - Output Directory : `build`
   - Install Command : `npm install --legacy-peer-deps` (ajoutez-le si nécessaire)

3. **Cliquez sur** : **"Deploy"** en bas

---

**Dans la modal, entrez `frontend` et cliquez sur "Continue" !** 🚀

