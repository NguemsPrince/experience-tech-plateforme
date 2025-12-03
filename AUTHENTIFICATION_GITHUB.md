# 🔐 Authentification GitHub pour le Push

## ⚠️ Problème
GitHub demande une authentification pour pousser votre code. Vous devez utiliser un **Personal Access Token** (pas votre mot de passe GitHub).

## ✅ Solution : Créer un Personal Access Token

### Étape 1 : Créer le token
1. Allez sur : **https://github.com/settings/tokens**
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Remplissez le formulaire :
   - **Note** : `Expérience Tech Platform`
   - **Expiration** : Choisissez une durée (90 jours recommandé)
   - **Permissions** : Cochez **`repo`** (accès complet aux dépôts)
4. Cliquez sur **"Generate token"**
5. **⚠️ IMPORTANT** : Copiez le token immédiatement (vous ne pourrez plus le voir après)

### Étape 2 : Utiliser le token
Exécutez cette commande dans votre terminal :

```bash
git push -u origin main
```

Quand Git vous demande :
- **Username** : Entrez votre nom d'utilisateur GitHub (`NguemsPrince`)
- **Password** : Collez le **Personal Access Token** (pas votre mot de passe GitHub)

## 🔄 Alternative : Utiliser SSH (si vous avez une clé SSH)

Si vous avez déjà configuré une clé SSH sur GitHub :

```bash
# Changer l'URL du remote pour utiliser SSH
git remote set-url origin git@github.com:NguemsPrince/experience-tech-plateforme.git

# Pousser
git push -u origin main
```

## 📝 Vérification

Après le push réussi, vérifiez sur GitHub :
- Allez sur : https://github.com/NguemsPrince/experience-tech-plateforme
- Vous devriez voir tous vos fichiers

## 🆘 Problèmes courants

### "fatal: could not read Username"
→ Vous devez entrer vos identifiants. Utilisez le Personal Access Token comme mot de passe.

### "Permission denied"
→ Vérifiez que le token a bien la permission `repo` activée.

### "Repository not found"
→ Vérifiez que le nom du dépôt est correct : `experience-tech-plateforme`

