#!/bin/bash

echo "🚀 Configuration GitHub pour Expérience Tech"
echo "=============================================="
echo ""

# Vérifier si Git est configuré
if ! git config user.name &> /dev/null; then
    echo "⚠️  Git n'est pas configuré. Veuillez entrer vos informations :"
    read -p "Votre nom : " git_name
    read -p "Votre email : " git_email
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
    echo "✅ Git configuré avec succès"
fi

echo ""
echo "📋 Informations Git actuelles :"
echo "   Nom : $(git config user.name)"
echo "   Email : $(git config user.email)"
echo ""

# Vérifier si le remote existe déjà
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Un remote 'origin' existe déjà :"
    git remote get-url origin
    read -p "Voulez-vous le remplacer ? (o/n) : " replace
    if [ "$replace" = "o" ] || [ "$replace" = "O" ]; then
        git remote remove origin
    else
        echo "❌ Opération annulée"
        exit 1
    fi
fi

echo ""
echo "📝 Veuillez créer un dépôt sur GitHub.com d'abord, puis :"
echo ""
read -p "Nom d'utilisateur GitHub : " github_username
read -p "Nom du dépôt GitHub : " repo_name
read -p "Utiliser HTTPS (h) ou SSH (s) ? [h] : " protocol

if [ "$protocol" = "s" ] || [ "$protocol" = "S" ]; then
    repo_url="git@github.com:${github_username}/${repo_name}.git"
else
    repo_url="https://github.com/${github_username}/${repo_name}.git"
fi

echo ""
echo "🔗 Ajout du remote : $repo_url"
git remote add origin "$repo_url"

echo ""
echo "✅ Remote ajouté avec succès !"
echo ""
echo "📦 Prochaines étapes :"
echo "   1. git add ."
echo "   2. git commit -m 'Initial commit'"
echo "   3. git branch -M main"
echo "   4. git push -u origin main"
echo ""
