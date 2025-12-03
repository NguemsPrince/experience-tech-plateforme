#!/bin/bash

# Script pour nettoyer l'historique Git des fichiers MongoDB volumineux
# Ce script supprime les fichiers MongoDB de l'historique Git

echo "🧹 Nettoyage de l'historique Git des fichiers MongoDB volumineux..."
echo ""

# Sauvegarder le commit actuel
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "✅ Commit actuel sauvegardé: $CURRENT_COMMIT"
echo ""

# Supprimer les fichiers MongoDB de l'historique Git
echo "📦 Suppression des fichiers MongoDB de l'historique..."

# Utiliser git filter-branch pour supprimer les fichiers de l'historique
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch -r mongodb-macos-x86_64-7.0.5/ data/db/ data/journal/ mongodb-local/ mongodb-data/ mongodb.tgz" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "✅ Nettoyage terminé !"
echo ""
echo "⚠️  IMPORTANT: Vous devez maintenant forcer le push avec:"
echo "   git push origin main --force"
echo ""
echo "⚠️  ATTENTION: Le --force va réécrire l'historique sur GitHub."
echo "   Assurez-vous que personne d'autre ne travaille sur ce dépôt."

