#!/bin/bash

echo "🚀 Pousser le projet vers GitHub"
echo "=================================="
echo ""

# Vérifier que le remote est configuré
if ! git remote get-url origin &> /dev/null; then
    echo "❌ Le remote 'origin' n'est pas configuré"
    echo "   Exécutez : git remote add origin https://github.com/NguemsPrince/experience-tech-plateforme.git"
    exit 1
fi

echo "✅ Remote configuré :"
git remote get-url origin
echo ""

# Vérifier l'état
echo "📊 État actuel :"
git status --short | head -5
echo ""

# Demander confirmation
read -p "Voulez-vous ajouter tous les fichiers et pousser vers GitHub ? (o/n) : " confirm

if [ "$confirm" != "o" ] && [ "$confirm" != "O" ]; then
    echo "❌ Opération annulée"
    exit 0
fi

echo ""
echo "📦 Ajout des fichiers..."
git add .

echo ""
echo "💾 Création du commit..."
git commit -m "Initial commit: Plateforme Expérience Tech" || {
    echo "⚠️  Aucun changement à commiter"
}

echo ""
echo "🌿 Vérification de la branche..."
git branch -M main

echo ""
echo "⬆️  Poussage vers GitHub..."
echo "   (Vous devrez peut-être entrer vos identifiants GitHub)"
echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Succès ! Votre projet est maintenant sur GitHub :"
    echo "   https://github.com/NguemsPrince/experience-tech-plateforme"
else
    echo ""
    echo "❌ Erreur lors du push"
    echo ""
    echo "💡 Si GitHub demande un mot de passe :"
    echo "   1. Utilisez un Personal Access Token (pas votre mot de passe)"
    echo "   2. Créez-en un ici : https://github.com/settings/tokens"
    echo "   3. Permissions : cocher 'repo'"
fi

