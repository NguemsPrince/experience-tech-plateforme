# 🔐 Créer un Personal Access Token pour GitHub

## ⚠️ Problème
Vous avez reçu l'erreur : `Permission denied (403)`
→ GitHub n'accepte plus les mots de passe pour Git. Vous devez utiliser un **Personal Access Token**.

## ✅ Solution : Créer un Token

### Étape 1 : Aller sur la page des tokens
1. Ouvrez votre navigateur
2. Allez sur : **https://github.com/settings/tokens**
3. Ou : GitHub.com → Votre profil (en haut à droite) → **Settings** → **Developer settings** (en bas à gauche) → **Personal access tokens** → **Tokens (classic)**

### Étape 2 : Générer un nouveau token
1. Cliquez sur **"Generate new token"**
2. Sélectionnez **"Generate new token (classic)"**

### Étape 3 : Configurer le token
Remplissez le formulaire :
- **Note** : `Expérience Tech Platform` (ou un nom de votre choix)
- **Expiration** : 
  - Recommandé : **90 days** (ou plus si vous préférez)
  - Ou **No expiration** si vous voulez qu'il ne expire jamais
- **Permissions** : Cochez **`repo`** (accès complet aux dépôts privés)
  - Cela inclut automatiquement toutes les sous-permissions nécessaires

### Étape 4 : Générer et copier
1. Cliquez sur **"Generate token"** en bas de la page
2. **⚠️ IMPORTANT** : Copiez le token immédiatement (il commence par `ghp_...`)
   - Vous ne pourrez plus le voir après avoir quitté la page
   - Si vous le perdez, vous devrez en créer un nouveau

### Étape 5 : Utiliser le token
Dans votre terminal, exécutez :

```bash
git push -u origin main
```

Quand Git vous demande :
- **Username** : `NguemsPrince`
- **Password** : **Collez le token** (pas votre mot de passe GitHub)

## 🔄 Alternative : Utiliser le gestionnaire de credentials

Si vous voulez que Git se souvienne du token :

### Sur macOS (Keychain)
```bash
# Le token sera sauvegardé dans le Keychain macOS
git push -u origin main
# Entrez le token une fois, il sera sauvegardé
```

### Ou utiliser Git Credential Manager
```bash
# Configurer Git pour utiliser le credential helper
git config --global credential.helper osxkeychain
```

## ✅ Vérification

Après un push réussi, vous verrez :
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To https://github.com/NguemsPrince/experience-tech-plateforme.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifiez que le token a la permission `repo`**
2. **Vérifiez que le token n'a pas expiré**
3. **Essayez de supprimer les credentials sauvegardés** :
   ```bash
   git credential-osxkeychain erase
   host=github.com
   protocol=https
   ```
   (Appuyez sur Entrée deux fois)
4. **Réessayez avec un nouveau token**

## 📝 Note importante

- Le token est comme un mot de passe temporaire
- Ne le partagez jamais publiquement
- Si vous pensez qu'il a été compromis, supprimez-le et créez-en un nouveau

