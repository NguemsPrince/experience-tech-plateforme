# ✅ Vérification Root Directory - Guide Étape par Étape

## 🚨 Erreur Persistante : `npm error syscall open`

Cela signifie que Root Directory n'est **PAS encore configuré** ou **n'a pas été sauvegardé correctement**.

---

## 🔍 ÉTAPE 1 : Vérifier la Configuration Actuelle

### Dans Vercel Dashboard :

1. **Allez dans** : Settings > Build and Deployment > Framework Settings
2. **Regardez le champ "Root Directory"**
3. **Que voyez-vous ?**
   - Vide ? → Il faut le remplir
   - Autre valeur ? → Il faut le changer en `frontend`
   - `frontend` ? → Vérifiez qu'il est bien sauvegardé

---

## ✅ ÉTAPE 2 : Configurer Root Directory (Si Pas Fait)

### Action à Faire :

1. **Dans le champ "Root Directory"**
2. **Cliquez dedans**
3. **Effacez tout ce qui est dedans** (s'il y a quelque chose)
4. **Tapez exactement :** `frontend`
   - ⚠️ Pas `/frontend`
   - ⚠️ Pas `./frontend`
   - ⚠️ Pas `frontend/`
   - ✅ Juste : `frontend`

5. **Faites défiler vers le bas de la page**
6. **Cherchez le bouton "Save"** (en bas à droite)
7. **Cliquez sur "Save"**
8. **Attendez** que la page se mette à jour (vous devriez voir un message de confirmation)

---

## 🔍 ÉTAPE 3 : Vérifier que C'est Sauvegardé

### Après avoir cliqué sur "Save" :

1. **Rafraîchissez la page** (F5 ou Cmd+R)
2. **Retournez dans** : Settings > Build and Deployment > Framework Settings
3. **Vérifiez que "Root Directory" affiche toujours :** `frontend`
4. **Si c'est vide ou différent**, répétez l'Étape 2

---

## ✅ ÉTAPE 4 : Vérifier les Autres Paramètres

### Pendant que vous êtes dans Framework Settings :

Vérifiez aussi ces paramètres :

```
Root Directory: frontend ✅
Build Command: npm run build
Output Directory: build
Install Command: npm ci (ou npm install)
```

**Si certains champs sont vides ou incorrects :**
- Remplissez-les
- Activez les toggles "Override" si nécessaire
- Cliquez sur "Save"

---

## 🔄 ÉTAPE 5 : Redéployer

### Après avoir sauvegardé :

1. **Allez dans "Deployments"** (en haut de la page)
2. **Trouvez le dernier déploiement** (celui qui a échoué)
3. **Cliquez sur les trois points (⋯)** à droite
4. **Cliquez sur "Redeploy"**
5. **Décochez** "Use existing Build Cache" (optionnel mais recommandé)
6. **Cliquez sur "Redeploy"**

---

## 🆘 Si Root Directory N'Apparaît Pas

### Si vous ne voyez pas le champ "Root Directory" :

1. **Faites défiler** vers le haut de la page "Framework Settings"
2. **Cherchez** une section "Root Directory" (elle peut être en haut)
3. **OU** allez dans une autre section : "Build Settings" (peut-être dans le menu de gauche)

### Alternative : Utiliser vercel.json

Si vous ne pouvez pas configurer Root Directory dans l'interface :

1. **Assurez-vous que `vercel.json` est à la racine** de votre projet
2. **Poussez-le sur Git** (si pas déjà fait)
3. **Vercel devrait le détecter automatiquement**

---

## 📋 Checklist Complète

Avant de redéployer, vérifiez :

- [ ] **Root Directory** = `frontend` (dans Vercel Dashboard)
- [ ] **Root Directory est sauvegardé** (rafraîchir la page pour vérifier)
- [ ] **Build Command** = `npm run build` (ou vide si Root Directory est configuré)
- [ ] **Output Directory** = `build` (ou vide si Root Directory est configuré)
- [ ] **Install Command** = `npm ci` ou `npm install`
- [ ] **Bouton "Save" cliqué** et confirmation reçue
- [ ] **Projet redéployé** après les changements

---

## 🎯 Action Immédiate

### Faites ceci MAINTENANT dans cet ordre :

1. ✅ **Allez dans** : Settings > Build and Deployment > Framework Settings
2. ✅ **Trouvez "Root Directory"**
3. ✅ **Entrez :** `frontend`
4. ✅ **Faites défiler vers le bas**
5. ✅ **Cliquez sur "Save"**
6. ✅ **Attendez la confirmation**
7. ✅ **Rafraîchissez la page** et vérifiez que c'est toujours `frontend`
8. ✅ **Allez dans "Deployments"**
9. ✅ **Redéployez**

---

## 🔍 Vérification Finale

### Après le redéploiement, vérifiez les logs :

1. **Allez dans "Deployments"**
2. **Cliquez sur le nouveau déploiement**
3. **Regardez les "Build Logs"**

**Vous devriez voir :**
```
Running "install" command: `npm ci`...
✓ Installed dependencies
Running "build" command: `npm run build`...
✓ Build completed
```

**Si vous voyez encore :**
```
npm error path /vercel/path0/package.json
```
→ Root Directory n'est **PAS** configuré correctement. Répétez l'Étape 2.

---

**Configurez Root Directory = `frontend` et dites-moi si vous voyez toujours l'erreur !** 🚀

