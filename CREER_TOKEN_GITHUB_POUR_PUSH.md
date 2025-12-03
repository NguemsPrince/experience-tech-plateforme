# 🔑 Créer un Token GitHub pour Push

## 🚨 Problème : Authentication Failed

GitHub ne supporte plus l'authentification par mot de passe. Vous devez utiliser un **Personal Access Token**.

---

## ✅ SOLUTION : Créer un Token GitHub

### ÉTAPE 1 : Créer le Token

1. **Allez sur GitHub** : https://github.com/settings/tokens
2. **Cliquez sur** : "Generate new token" > "Generate new token (classic)"
3. **Donnez un nom** : `Vercel Deploy` (ou n'importe quel nom)
4. **Sélectionnez la durée** : 
   - "No expiration" (pour ne pas avoir à le recréer)
   - OU "90 days" (plus sécurisé)
5. **Cochez les permissions** :
   - ✅ **`repo`** (accès complet aux repositories)
     - Cela inclut automatiquement toutes les sous-permissions
6. **Cliquez sur** : "Generate token"
7. **⚠️ IMPORTANT : Copiez le token immédiatement !**
   - Il ressemble à : `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Vous ne pourrez plus le voir après !**

---

## ✅ ÉTAPE 2 : Utiliser le Token pour Push

### Dans votre terminal :

```bash
cd /Users/nguemsprince/Desktop/Projet
git push origin main
```

**Quand Git demande :**
- **Username** : `NguemsPrince`
- **Password** : **Collez le token** (pas votre mot de passe GitHub !)

**Le token commence par** `ghp_` et fait environ 40 caractères.

---

## ✅ ÉTAPE 3 : Alternative - Configurer Git Credential Helper

### Pour éviter de retaper le token à chaque fois :

```bash
# Sauvegarder le token dans le keychain macOS
git config --global credential.helper osxkeychain
```

Ensuite, quand vous faites `git push`, macOS vous demandera une fois le token et le sauvegardera.

---

## 🎯 Action Immédiate

### Faites ceci maintenant :

1. ✅ **Créez le token** sur GitHub (Étape 1)
2. ✅ **Copiez le token** (commence par `ghp_`)
3. ✅ **Dans votre terminal** :
   ```bash
   git push origin main
   ```
4. ✅ **Quand demandé** :
   - Username : `NguemsPrince`
   - Password : **Collez le token** (pas votre mot de passe !)

---

## 🆘 Si Vous Avez Perdu le Token

Si vous avez fermé la page avant de copier le token :

1. **Retournez sur** : https://github.com/settings/tokens
2. **Trouvez votre token** dans la liste
3. **Cliquez dessus** pour voir les détails
4. **Si vous ne voyez pas le token complet**, vous devrez en créer un nouveau

---

## ✅ Après le Push Réussi

Une fois le push réussi :

1. **Vérifiez sur GitHub** : https://github.com/NguemsPrince/experience-tech-plateforme
2. **Vérifiez que le dossier `frontend/` est visible**
3. **Retournez sur Vercel Dashboard**
4. **Vérifiez que le repository est** : `experience-tech-plateforme`
5. **Redéployez** votre projet

---

## 📋 Checklist

- [ ] Token GitHub créé
- [ ] Token copié (commence par `ghp_`)
- [ ] `git push origin main` exécuté
- [ ] Token utilisé comme password (pas le mot de passe GitHub)
- [ ] Push réussi
- [ ] Dossier `frontend/` visible sur GitHub
- [ ] Vercel redéployé

---

**Créez le token GitHub et poussez le commit. Dites-moi quand c'est fait !** 🚀

