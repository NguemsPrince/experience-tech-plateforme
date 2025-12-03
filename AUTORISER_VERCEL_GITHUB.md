# 🔐 Autoriser Vercel à Accéder à GitHub

## 🎯 Objectif

Autoriser Vercel à accéder à votre repository GitHub pour pouvoir le connecter.

---

## ✅ MÉTHODE 1 : Via Vercel Dashboard (Recommandé)

### ÉTAPE 1 : Aller dans les Paramètres Git

1. **Allez sur** : https://vercel.com/dashboard
2. **Ouvrez votre projet** : `plateforme_web_dynamique`
3. **Allez dans** : **Settings** (en haut)
4. **Cliquez sur** : **Git** (dans le menu de gauche)

---

### ÉTAPE 2 : Connecter un Nouveau Repository

1. **Dans la section "Connected Git Repository"**
2. **Si un repository est déjà connecté** :
   - Cherchez **"Disconnect"** ou **"Change"** ou **"Edit"**
   - Cliquez dessus
3. **Si aucun repository n'est connecté** :
   - Cliquez sur **"Connect Git Repository"** ou **"Connect"**

---

### ÉTAPE 3 : Autoriser Vercel

1. **Une fenêtre popup s'ouvre** avec GitHub
2. **Vous verrez** : "Authorize Vercel"
3. **Choisissez** :
   - **"Authorize Vercel"** (pour autoriser tous les repositories)
   - **OU** "Only select repositories" (pour choisir spécifiquement)

4. **Si vous choisissez "Only select repositories"** :
   - Cochez : `experience-tech-plateforme`
   - Décochez : `Mon-projet` (si vous ne voulez plus l'utiliser)

5. **Cliquez sur** : **"Authorize"** ou **"Install"**

---

### ÉTAPE 4 : Sélectionner le Repository

1. **Après autorisation**, vous verrez une liste de vos repositories
2. **Cherchez** : `experience-tech-plateforme`
3. **Cliquez dessus** pour le sélectionner
4. **Vercel va se connecter** automatiquement

---

## ✅ MÉTHODE 2 : Via GitHub Directement

### Si la popup ne s'ouvre pas :

1. **Allez sur GitHub** : https://github.com/settings/installations
2. **Cherchez "Vercel"** dans la liste
3. **Cliquez dessus**
4. **Configurez les permissions** :
   - Cochez `experience-tech-plateforme`
   - Décochez `Mon-projet` (si nécessaire)
5. **Sauvegardez**

---

## ✅ MÉTHODE 3 : Réautoriser Vercel

### Si Vercel n'a plus accès :

1. **Allez sur** : https://github.com/settings/installations
2. **Trouvez "Vercel"**
3. **Cliquez sur "Configure"**
4. **Vérifiez les repositories autorisés**
5. **Ajoutez** `experience-tech-plateforme` si nécessaire
6. **Sauvegardez**

---

## 🔍 Vérification

### Après autorisation :

1. **Retournez sur Vercel Dashboard**
2. **Settings > Git**
3. **Vous devriez voir** :
   - "Connected Git Repository" : `github.com/NguemsPrince/experience-tech-plateforme`
   - "Production Branch" : `main`

---

## 🆘 Si Vous Ne Voyez Pas l'Option d'Autorisation

### Vérifiez que :

1. **Vous êtes connecté** à votre compte Vercel
2. **Vous êtes connecté** à votre compte GitHub
3. **Votre navigateur autorise les popups** (désactivez le bloqueur de popups)
4. **Vous utilisez le même compte** GitHub que celui qui possède les repositories

---

## 📋 Checklist

- [ ] **Vercel Dashboard** ouvert
- [ ] **Settings > Git** accessible
- [ ] **"Connect Git Repository"** cliqué
- [ ] **GitHub popup** ouverte
- [ ] **Vercel autorisé** sur GitHub
- [ ] **Repository** `experience-tech-plateforme` sélectionné
- [ ] **Branche** `main` sélectionnée
- [ ] **Repository connecté** avec succès

---

## 🎯 Action Immédiate

### Faites ceci MAINTENANT :

1. ✅ **Allez sur** : https://vercel.com/dashboard
2. ✅ **Ouvrez votre projet** : `plateforme_web_dynamique`
3. ✅ **Settings > Git**
4. ✅ **Cliquez sur "Connect Git Repository"** ou "Change"
5. ✅ **Autorisez Vercel** dans la popup GitHub
6. ✅ **Sélectionnez** : `experience-tech-plateforme`
7. ✅ **Sauvegardez**

---

## 🆘 Si la Popup Ne S'Ouvre Pas

### Solutions :

1. **Désactivez le bloqueur de popups** dans votre navigateur
2. **Autorisez manuellement** : https://github.com/settings/installations
3. **Utilisez un autre navigateur** (Chrome, Firefox, Safari)
4. **Videz le cache** du navigateur

---

**Allez dans Vercel > Settings > Git et cliquez sur "Connect Git Repository" pour autoriser Vercel !** 🚀

