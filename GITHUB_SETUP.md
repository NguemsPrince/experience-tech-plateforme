# Guide de Configuration GitHub

## 📋 Étapes pour mettre votre projet sur GitHub

### 1. Configurer Git (si pas déjà fait)

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### 2. Créer un dépôt sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite
3. Sélectionnez **"New repository"**
4. Remplissez les informations :
   - **Repository name** : `experience-tech-platform` (ou le nom de votre choix)
   - **Description** : "Plateforme web complète pour Expérience Tech"
   - **Visibility** : Choisissez Public ou Private
   - **NE PAS** cocher "Initialize with README" (on a déjà un README)
5. Cliquez sur **"Create repository"**

### 3. Connecter votre dépôt local à GitHub

Après avoir créé le dépôt, GitHub vous donnera une URL. Utilisez-la dans cette commande :

```bash
# Remplacez USERNAME par votre nom d'utilisateur GitHub
# Remplacez REPO_NAME par le nom de votre dépôt

git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

**OU** si vous préférez utiliser SSH :

```bash
git remote add origin git@github.com:USERNAME/REPO_NAME.git
```

### 4. Ajouter tous les fichiers et faire le premier commit

```bash
# Ajouter tous les fichiers (sauf ceux dans .gitignore)
git add .

# Faire le premier commit
git commit -m "Initial commit: Plateforme Expérience Tech"

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

### 5. Vérifier que tout est bien poussé

Allez sur votre dépôt GitHub et vérifiez que tous les fichiers sont présents.

## 🔐 Authentification GitHub

Si vous utilisez HTTPS et que GitHub vous demande un mot de passe :
- Utilisez un **Personal Access Token** (pas votre mot de passe)
- Créez-en un ici : https://github.com/settings/tokens
- Sélectionnez les permissions : `repo` (accès complet aux dépôts)

## 📝 Commandes Git utiles

```bash
# Voir l'état des fichiers
git status

# Ajouter des fichiers spécifiques
git add nom-du-fichier

# Faire un commit
git commit -m "Description des changements"

# Pousser vers GitHub
git push

# Récupérer les changements depuis GitHub
git pull

# Voir l'historique des commits
git log
```

## ⚠️ Fichiers exclus du dépôt

Les fichiers suivants sont automatiquement exclus grâce au `.gitignore` :
- `node_modules/` (dépendances)
- `.env` (variables d'environnement sensibles)
- `*.log` (fichiers de log)
- `mongodb-local/` (données MongoDB locales)
- `node-v*/` (versions Node.js locales)
- Fichiers de test temporaires

## 🚀 Prochaines étapes

Après avoir poussé votre code :
1. Ajoutez une description dans le README du dépôt GitHub
2. Configurez les GitHub Actions si nécessaire
3. Ajoutez des collaborateurs si besoin
4. Configurez les branches de protection pour `main`

