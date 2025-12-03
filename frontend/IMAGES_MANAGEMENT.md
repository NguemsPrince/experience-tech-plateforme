# Gestion des Images - Expérience Tech

## Vue d'ensemble

Ce document décrit la stratégie de gestion des images mise en place pour éviter les problèmes de réseau et améliorer les performances.

## Structure des dossiers

```
frontend/public/images/
├── hero/                    # Images du slider principal
│   ├── training-hero.jpg    # Image pour les formations
│   ├── digital-hero.jpg     # Image pour les services numériques
│   └── network-hero.svg     # Image pour les réseaux (SVG optimisé)
├── testimonials/            # Avatars des témoignages
│   ├── avatar-1.svg         # Avatar Amina Mahamat
│   ├── avatar-2.svg         # Avatar Mahamat Saleh
│   ├── avatar-3.svg         # Avatar Fatima Oumar
│   ├── testimonial-1.jpg    # Image originale (si disponible)
│   ├── testimonial-2.jpg    # Image originale (si disponible)
│   └── testimonial-3.jpg    # Image originale (si disponible)
└── team/                    # Images de l'équipe
    └── team-image.jpg       # Image principale de l'équipe
```

## Configuration centralisée

Tous les chemins d'images sont centralisés dans `src/config/images.js` :

```javascript
export const IMAGES = {
  hero: {
    training: '/images/hero/training-hero.jpg',
    digital: '/images/hero/digital-hero.jpg',
    network: '/images/hero/network-hero.svg'
  },
  testimonials: {
    avatar1: '/images/testimonials/avatar-1.svg',
    avatar2: '/images/testimonials/avatar-2.svg',
    avatar3: '/images/testimonials/avatar-3.svg'
  },
  team: {
    main: '/images/team/team-image.jpg'
  },
  fallback: {
    // Images de secours en cas d'erreur
  }
};
```

## Avantages de cette approche

### 1. **Performance améliorée**
- Images servies localement (pas de latence réseau)
- Images optimisées pour le web
- Mise en cache efficace par le navigateur

### 2. **Fiabilité**
- Plus de dépendance aux services externes (Unsplash, etc.)
- Images toujours disponibles même sans connexion internet
- Système de fallback robuste

### 3. **Maintenance facilitée**
- Configuration centralisée des chemins
- Gestion d'erreur standardisée
- Structure organisée et prévisible

### 4. **Sécurité**
- Pas d'exposition aux changements d'URL externes
- Contrôle total sur les images affichées
- Évite les problèmes de CORS

## Utilisation dans les composants

### HeroSlider
```javascript
import { IMAGES } from '../config/images';

const slides = [
  {
    image: IMAGES.hero.training,
    fallbackImage: IMAGES.hero.training,
    // ...
  }
];
```

### TestimonialCard
```javascript
import { IMAGES, handleImageError } from '../config/images';

<img
  src={avatar}
  alt={name}
  onError={(e) => handleImageError(e, fallbackAvatar || IMAGES.fallback.avatar)}
/>
```

## Gestion des erreurs

La fonction `handleImageError` est utilisée pour gérer les cas où une image ne peut pas être chargée :

```javascript
export const handleImageError = (e, fallbackSrc) => {
  if (e.target.src !== fallbackSrc) {
    e.target.src = fallbackSrc;
  }
};
```

## Formats d'images

- **JPG** : Pour les photos avec beaucoup de détails (hero, équipe)
- **SVG** : Pour les illustrations simples (avatars, réseaux)
- **Fallback** : Images SVG encodées en base64 pour les cas d'urgence

## Optimisation

### Images JPG
- Compression optimisée pour le web
- Tailles adaptées aux besoins d'affichage
- Qualité équilibrée entre taille et qualité

### Images SVG
- Code optimisé et minimal
- Couleurs cohérentes avec la charte graphique
- Scalables sans perte de qualité

## Maintenance

### Ajouter une nouvelle image
1. Placer l'image dans le dossier approprié
2. Ajouter le chemin dans `src/config/images.js`
3. Utiliser la configuration dans les composants

### Remplacer une image
1. Remplacer le fichier dans le dossier correspondant
2. Garder le même nom de fichier (optionnel)
3. Vider le cache du navigateur si nécessaire

### Optimiser les performances
- Utiliser des outils comme ImageOptim ou TinyPNG
- Convertir en WebP si supporté
- Implémenter le lazy loading pour les images non critiques

## Migration effectuée

✅ **Images du slider hero** : Migrées de Unsplash vers `/images/hero/`
✅ **Avatars des témoignages** : Créés en SVG local
✅ **Image de l'équipe** : Téléchargée et stockée localement
✅ **Configuration centralisée** : Mise en place dans `src/config/images.js`
✅ **Gestion d'erreur** : Système de fallback implémenté
✅ **Code mis à jour** : Tous les composants utilisent la nouvelle configuration

## Résultat

- ✅ Plus de dépendance aux services externes
- ✅ Images toujours disponibles
- ✅ Performance améliorée
- ✅ Maintenance facilitée
- ✅ Code plus propre et organisé

