# 📁 Configuration Root Directory sur Vercel

## 🎯 Page Actuelle : "Framework Settings" > "Root Directory"

Parfait ! Vous êtes sur la bonne page. Voici **EXACTEMENT** ce qu'il faut configurer :

---

## ✅ CHAMP PRINCIPAL : Root Directory

### Dans le champ "Root Directory" :

**Entrez :**
```
frontend
```

⚠️ **IMPORTANT** : 
- Entrez juste `frontend` (pas `/frontend` ni `./frontend`)
- C'est le dossier qui contient votre `package.json` React

---

## ⚙️ AUTRES PARAMÈTRES (Optionnels mais Recommandés)

### 1. "Include files outside the root directory in the Build Step"
- **Laissez cette case DÉCOCHÉE** (par défaut)
- Cela permet à Vercel de ne construire que ce qui est dans `frontend/`

### 2. "Skip deployments when there are no changes to the root directory or its dependencies"
- **Laissez cette case COCHÉE** (par défaut)
- Cela évite les déploiements inutiles

### 3. Node.js Version
- **Laissez la version par défaut** (généralement la dernière LTS)
- Ou choisissez **18.x** ou **20.x** si disponible
- Votre projet utilise Node.js 18, donc **18.x** serait idéal

---

## 🔄 APRÈS AVOIR CONFIGURÉ

1. **Vérifiez** que "Root Directory" contient `frontend`
2. **Faites défiler vers le bas** de la page
3. **Cherchez le bouton "Save"** et cliquez dessus
4. **Allez dans "Deployments"** (en haut)
5. **Cliquez sur "Redeploy"** sur le dernier déploiement

---

## 📋 RÉCAPITULATIF

### Ce qu'il faut faire MAINTENANT :

1. ✅ Dans "Root Directory", entrez : `frontend`
2. ✅ Laissez les autres options par défaut
3. ✅ Cliquez sur "Save"
4. ✅ Redéployez

---

## 🔍 VÉRIFICATION

Après avoir sauvegardé, vérifiez que :

- [ ] Root Directory = `frontend`
- [ ] Les changements sont sauvegardés
- [ ] Un nouveau déploiement est lancé

---

## 🆘 SI VOUS NE VOYEZ PAS LE BOUTON "SAVE"

1. **Faites défiler vers le bas** de la page
2. Le bouton "Save" est généralement en bas à droite
3. Si vous ne le voyez pas, les changements peuvent être sauvegardés automatiquement

---

## 🎯 PROCHAINES ÉTAPES

Après avoir configuré le Root Directory :

1. ✅ Vérifiez que le build réussit (dans "Deployments" > Logs)
2. ✅ Testez votre URL : `https://plateformewebdynamique.vercel.app`
3. ✅ Si l'erreur 404 persiste, il faudra aussi configurer les "Redirects"

---

**Entrez `frontend` dans le champ "Root Directory" et dites-moi quand c'est fait !** 🚀

