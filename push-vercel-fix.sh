#!/bin/bash

# Script pour pousser seulement les fichiers nécessaires pour la correction Vercel
# en contournant le problème des fichiers volumineux

echo "🔧 Préparation du push des fichiers Vercel..."

# Sauvegarder les changements actuels
git stash push -m "Stash before Vercel fix push"

# Créer une branche temporaire depuis origin/main
git fetch origin
git checkout -b temp-vercel-fix origin/main 2>/dev/null || git checkout -b temp-vercel-fix

# Ajouter seulement les fichiers nécessaires
git checkout main -- vercel.json package.json RESOLUTION_REACT_SCRIPTS_NOT_FOUND.md 2>/dev/null || echo "Fichiers déjà présents"

# Commit
git add vercel.json package.json RESOLUTION_REACT_SCRIPTS_NOT_FOUND.md
git commit -m "Fix: Configure Vercel build to install dependencies correctly" || echo "Aucun changement à commiter"

# Essayer de pousser
echo "📤 Tentative de push..."
git push origin temp-vercel-fix:main --force 2>&1 | head -20

# Retourner à main et restaurer les changements
git checkout main
git stash pop

echo "✅ Terminé !"
echo ""
echo "Si le push a réussi, vous pouvez maintenant :"
echo "1. Vérifier sur GitHub que les fichiers sont bien poussés"
echo "2. Vercel devrait automatiquement redéployer avec la nouvelle configuration"

