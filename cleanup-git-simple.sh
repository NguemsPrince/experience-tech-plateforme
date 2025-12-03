#!/bin/bash

# Script pour créer une nouvelle branche propre sans les fichiers MongoDB volumineux
# Cette approche est plus simple et plus sûre que filter-branch

echo "🧹 Création d'une nouvelle branche propre sans fichiers MongoDB..."
echo ""

# Sauvegarder les changements actuels
echo "📦 Sauvegarde des changements actuels..."
git stash push -m "Sauvegarde avant nettoyage Git"

# Créer une nouvelle branche orpheline (sans historique)
echo "🆕 Création d'une nouvelle branche orpheline..."
git checkout --orphan clean-main

# Ajouter tous les fichiers sauf ceux dans .gitignore
echo "📝 Ajout des fichiers (en respectant .gitignore)..."
git add .

# Commit initial
echo "💾 Création du commit initial..."
git commit -m "Initial commit: Clean repository without MongoDB files"

# Supprimer l'ancienne branche main localement
echo "🗑️  Suppression de l'ancienne branche main locale..."
git branch -D main 2>/dev/null || true

# Renommer la branche actuelle en main
echo "🔄 Renommage de la branche en main..."
git branch -m main

echo ""
echo "✅ Nouvelle branche propre créée !"
echo ""
echo "⚠️  PROCHAINES ÉTAPES :"
echo "   1. Vérifiez que tout est correct : git log"
echo "   2. Forcez le push : git push origin main --force"
echo "   3. Réappliquez vos changements : git stash pop"
echo ""
echo "⚠️  ATTENTION: Le --force va réécrire l'historique sur GitHub."
echo "   Assurez-vous que personne d'autre ne travaille sur ce dépôt."

