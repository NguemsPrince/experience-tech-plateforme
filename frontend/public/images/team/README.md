# 📸 Photos de l'Équipe - Expérience Tech

## 📁 Structure des Fichiers

Ce dossier contient les photos des membres de l'équipe Expérience Tech.

### 📋 Fichiers Attendus

- `alexis-koumoukouye.jpg` - Photo d'Alexis Koumoukouye (Designer)
- `issa-mahamat-nour.jpg` - Photo d'Issa Mahamat Nour (Designer)
- `ndoubahidi-neko-assur.jpg` - Photo de Ndoubahidi Neko Assur (Assistant Imprimerie)
- `hassane-[nom].jpg` - Photo de Hassane (Direction)
- `issa-[nom].jpg` - Photo d'Issa (Direction)
- `taken-[nom].jpg` - Photo de Taken (Direction)

## 🎨 Spécifications Techniques

### Format et Taille
- **Format :** JPG ou PNG
- **Taille recommandée :** 200x200px minimum
- **Ratio :** 1:1 (carré)
- **Poids :** < 100KB par image
- **Qualité :** Optimisée pour le web

### Style et Présentation
- **Style :** Photo professionnelle
- **Fond :** Neutre (blanc, gris clair)
- **Éclairage :** Uniforme et naturel
- **Expression :** Sourire professionnel
- **Cadrage :** Portrait (buste)

## 🔧 Utilisation dans le Code

Les images sont utilisées dans la page `About.js` avec un système de fallback :

```jsx
<img 
  src="/images/team/nom-fichier.jpg" 
  alt="Nom Prénom - Poste"
  className="w-full h-full object-cover"
  onError={(e) => {
    // Affiche l'icône par défaut si l'image ne charge pas
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  }}
/>
```

## 📝 Instructions d'Ajout

1. **Nommer le fichier** selon le format : `prenom-nom.jpg`
2. **Optimiser l'image** (taille, poids, qualité)
3. **Placer dans ce dossier** `/public/images/team/`
4. **Mettre à jour le code** dans `About.js` si nécessaire

## 🎯 Exemple d'Intégration

Pour ajouter une nouvelle photo d'équipe :

1. Sauvegarder l'image dans ce dossier
2. Modifier le composant correspondant dans `About.js`
3. Remplacer l'icône par l'image avec fallback
4. Tester l'affichage

## ✅ Checklist

- [ ] Image optimisée pour le web
- [ ] Format JPG ou PNG
- [ ] Taille 200x200px minimum
- [ ] Poids < 100KB
- [ ] Nom de fichier conforme
- [ ] Alt text descriptif
- [ ] Fallback configuré
- [ ] Test d'affichage réussi

---

**Note :** Assurez-vous que toutes les images respectent les droits d'image et l'autorisation des personnes photographiées.
