# 🔄 Changer le Repository dans Vercel

## 🚨 Problème : Vercel Clone Toujours "Mon-projet"

Les logs montrent que Vercel clone toujours :
```
Cloning github.com/NguemsPrince/Mon-projet
```

**Il faut changer le repository pour `experience-tech-plateforme`.**

---

## ✅ SOLUTION : Changer le Repository

### ÉTAPE 1 : Aller dans Settings > Git

1. **Allez sur** : https://vercel.com/dashboard
2. **Ouvrez votre projet** : `plateforme_web_dynamique`
3. **Allez dans** : **Settings** (en haut)
4. **Cliquez sur** : **Git** (menu de gauche)

---

### ÉTAPE 2 : Déconnecter l'Ancien Repository

1. **Dans la section "Connected Git Repository"**
2. **Vous devriez voir** : `github.com/NguemsPrince/Mon-projet`
3. **Cherchez un bouton** :
   - **"Disconnect"** 
   - **"Change"**
   - **"Edit"**
   - **"..."** (trois points) avec un menu
4. **Cliquez dessus**

---

### ÉTAPE 3 : Connecter le Nouveau Repository

1. **Après déconnexion**, vous verrez **"Connect Git Repository"**
2. **Cliquez dessus**
3. **Si une popup GitHub s'ouvre** :
   - Autorisez Vercel si demandé
   - Sélectionnez **"Only select repositories"**
   - Cochez : `experience-tech-plateforme`
   - Décochez : `Mon-projet`
   - Cliquez sur **"Install"** ou **"Authorize"**

4. **Sélectionnez le repository** :
   - Cherchez : `experience-tech-plateforme`
   - Cliquez dessus

5. **Sélectionnez la branche** : `main`

---

## 🆘 Si Vous Ne Voyez Pas "Disconnect"

### Option A : Via les Trois Points (⋯)

1. **Dans "Connected Git Repository"**
2. **Cherchez les trois points (⋯)** à droite
3. **Cliquez dessus**
4. **Sélectionnez** : "Disconnect" ou "Change Repository"

### Option B : Créer un Nouveau Projet

Si vous ne pouvez pas changer le repository :

1. **Créez un nouveau projet** sur Vercel
2. **Nom** : `plateforme-web-experience-tech` (ou autre)
3. **Connectez-le à** : `experience-tech-plateforme`
4. **Configurez** les paramètres de build

---

## ✅ SOLUTION Alternative : Vérifier que frontend Existe dans Mon-projet

### Si vous préférez utiliser Mon-projet :

1. **Allez sur** : https://github.com/NguemsPrince/Mon-projet
2. **Vérifiez** si le dossier `frontend/` existe
3. **Si non**, vous devez :
   - Soit ajouter le dossier `frontend/` dans `Mon-projet`
   - Soit changer le repository dans Vercel

---

## 🔍 Vérification Après Changement

### Après avoir changé le repository :

1. **Dans Vercel Dashboard > Settings > Git**
2. **Vous devriez voir** :
   - "Connected Git Repository" : `github.com/NguemsPrince/experience-tech-plateforme`
   - "Production Branch" : `main`

3. **Redéployez** :
   - Allez dans "Deployments"
   - Cliquez sur "Redeploy"

4. **Vérifiez les nouveaux logs** :
   - Ils devraient montrer : `Cloning github.com/NguemsPrince/experience-tech-plateforme`

---

## 📋 Checklist

- [ ] **Settings > Git** ouvert
- [ ] **Ancien repository** déconnecté (`Mon-projet`)
- [ ] **Nouveau repository** connecté (`experience-tech-plateforme`)
- [ ] **Branche** : `main`
- [ ] **Autorisation GitHub** accordée
- [ ] **Repository vérifié** dans Settings > Git
- [ ] **Projet redéployé**

---

## 🎯 Action Immédiate

### Faites ceci MAINTENANT :

1. ✅ **Allez dans** : Vercel Dashboard > Settings > Git
2. ✅ **Trouvez "Disconnect"** ou "Change" pour `Mon-projet`
3. ✅ **Cliquez dessus**
4. ✅ **Connectez** `experience-tech-plateforme`
5. ✅ **Autorisez** Vercel sur GitHub si demandé
6. ✅ **Sélectionnez** la branche `main`
7. ✅ **Redéployez**

---

## 🆘 Si Vous Ne Trouvez Pas "Disconnect"

### Dites-moi :

1. **Que voyez-vous** dans Settings > Git ?
2. **Y a-t-il un bouton** "Disconnect", "Change", "Edit" ou "..." ?
3. **Quel repository** est affiché actuellement ?

Je vous guiderai selon ce que vous voyez ! 🚀

