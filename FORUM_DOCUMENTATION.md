# Forum Expérience Tech - Documentation

## 🎯 Vue d'ensemble

Le Forum Expérience Tech est un système de discussion complet intégré à la plateforme Expérience Tech. Il permet aux utilisateurs de créer des sujets, poser des questions, partager des connaissances et interagir autour des formations et services proposés.

## 🚀 Fonctionnalités principales

### Pour les utilisateurs
- **Création de sujets** : Titre, contenu, catégorie et tags
- **Système de commentaires** : Réponses aux sujets avec possibilité de marquer comme solution
- **Interactions** : Likes, dislikes et signalements
- **Recherche avancée** : Par mots-clés, catégories et tags
- **Filtres** : Tri par date, popularité, activité
- **Interface responsive** : Optimisée pour mobile et desktop

### Pour les administrateurs
- **Modération** : Gestion des signalements et contenu inapproprié
- **Administration** : Épinglage, verrouillage des sujets
- **Statistiques** : Vue d'ensemble des activités du forum
- **Gestion des catégories** : Création et modification des catégories

## 🏗️ Architecture technique

### Backend (Node.js + Express + MongoDB)
```
backend/
├── models/
│   ├── ForumCategory.js    # Modèle des catégories
│   ├── ForumPost.js        # Modèle des sujets
│   └── ForumComment.js     # Modèle des commentaires
├── routes/
│   └── forum.js            # Routes API du forum
└── initialize-forum-categories.js  # Script d'initialisation
```

### Frontend (React + Tailwind CSS)
```
frontend/src/
├── pages/
│   ├── Forum.js            # Page principale du forum
│   ├── CreatePost.js       # Création de sujets
│   ├── TopicPage.js        # Affichage d'un sujet
│   └── ForumAdmin.js       # Interface d'administration
└── services/
    └── forumService.js     # Service API pour le forum
```

## 📊 Modèles de données

### ForumCategory
```javascript
{
  name: String,           // Nom de la catégorie
  description: String,    // Description
  icon: String,          // Icône Heroicons
  color: String,         // Couleur hexadécimale
  isActive: Boolean,     // Statut actif/inactif
  sortOrder: Number,     // Ordre d'affichage
  topicsCount: Number,   // Nombre de sujets
  postsCount: Number,    // Nombre de messages
  lastActivity: Date    // Dernière activité
}
```

### ForumPost
```javascript
{
  title: String,         // Titre du sujet
  content: String,       // Contenu (Markdown)
  author: ObjectId,      // Référence User
  category: ObjectId,    // Référence ForumCategory
  tags: [String],        // Tags associés
  isPinned: Boolean,    // Épinglé par admin
  isLocked: Boolean,    // Verrouillé par admin
  isResolved: Boolean,  // Marqué comme résolu
  views: Number,         // Nombre de vues
  likes: [Object],       // Utilisateurs ayant liké
  dislikes: [Object],   // Utilisateurs ayant disliké
  reports: [Object],     // Signalements
  lastActivity: Date     // Dernière activité
}
```

### ForumComment
```javascript
{
  content: String,       // Contenu du commentaire
  author: ObjectId,       // Référence User
  post: ObjectId,        // Référence ForumPost
  parentComment: ObjectId, // Référence ForumComment (réponse)
  likes: [Object],       // Utilisateurs ayant liké
  dislikes: [Object],   // Utilisateurs ayant disliké
  reports: [Object],    // Signalements
  isEdited: Boolean,    // Modifié par l'auteur
  isSolution: Boolean,  // Marqué comme solution
  isDeleted: Boolean    // Supprimé (soft delete)
}
```

## 🔌 API Endpoints

### Catégories
- `GET /api/forum/categories` - Liste des catégories
- `POST /api/forum/categories` - Créer une catégorie (Admin)

### Sujets
- `GET /api/forum/posts` - Liste des sujets (avec filtres)
- `GET /api/forum/posts/:id` - Détails d'un sujet
- `POST /api/forum/posts` - Créer un sujet
- `PUT /api/forum/posts/:id` - Modifier un sujet
- `DELETE /api/forum/posts/:id` - Supprimer un sujet
- `POST /api/forum/posts/:id/like` - Liker un sujet
- `POST /api/forum/posts/:id/dislike` - Disliker un sujet
- `POST /api/forum/posts/:id/report` - Signaler un sujet

### Commentaires
- `GET /api/forum/posts/:id/comments` - Commentaires d'un sujet
- `POST /api/forum/posts/:id/comments` - Créer un commentaire
- `PUT /api/forum/comments/:id` - Modifier un commentaire
- `DELETE /api/forum/comments/:id` - Supprimer un commentaire
- `POST /api/forum/comments/:id/like` - Liker un commentaire
- `POST /api/forum/comments/:id/solution` - Marquer comme solution

### Administration
- `GET /api/forum/admin/reports` - Signalements en attente
- `PUT /api/forum/admin/reports/:type/:id` - Traiter un signalement
- `POST /api/forum/admin/posts/:id/pin` - Épingler/désépingler
- `POST /api/forum/admin/posts/:id/lock` - Verrouiller/déverrouiller

## 🎨 Interface utilisateur

### Page principale (/forum)
- Liste des catégories avec statistiques
- Barre de recherche avec filtres avancés
- Liste des sujets avec métadonnées
- Vue liste/grille
- Pagination

### Création de sujet (/forum/create)
- Formulaire avec validation
- Sélection de catégorie
- Ajout de tags
- Éditeur de contenu
- Conseils d'utilisation

### Sujet individuel (/forum/topic/:id)
- Affichage complet du sujet
- Métadonnées (auteur, date, vues, likes)
- Liste des commentaires
- Formulaire de réponse
- Actions (like, signaler, solution)

### Administration (/forum/admin)
- Statistiques des signalements
- Liste des contenus signalés
- Actions de modération
- Interface de gestion

## 🔧 Installation et configuration

### Prérequis
- Node.js 18+
- MongoDB 5+
- npm ou yarn

### Installation
1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd experience-tech-platform
   ```

2. **Installer les dépendances**
   ```bash
   npm run install-all
   ```

3. **Initialiser le forum**
   ```bash
   ./init-forum.sh
   ```

4. **Démarrer les services**
   ```bash
   npm run dev
   ```

### Configuration
- **Backend** : Variables d'environnement dans `backend/.env`
- **Frontend** : Configuration dans `frontend/src/config/`

## 🎯 Catégories par défaut

Le forum est initialisé avec les catégories suivantes :

1. **Formations** - Discussions sur les formations et certifications
2. **Développement** - Programmation et développement
3. **Support Technique** - Dépannage IT et résolution de problèmes
4. **Services Numériques** - Solutions numériques et services
5. **Impression & Design** - Services d'impression et design
6. **Commerce & E-commerce** - Solutions e-commerce
7. **Réseaux & Infrastructure** - Réseaux et infrastructure
8. **Général** - Discussions générales

## 🔒 Sécurité et modération

### Système de signalements
- **Raisons** : spam, inappropriate, off-topic, harassment, other
- **Workflow** : pending → reviewed/dismissed
- **Actions** : suppression, avertissement, blocage

### Permissions
- **Utilisateurs** : créer, modifier leurs contenus
- **Modérateurs** : gérer les signalements
- **Administrateurs** : accès complet + gestion des catégories

### Validation
- **Contenu** : longueur minimale/maximale
- **Titre** : 1-200 caractères
- **Commentaires** : 1-2000 caractères
- **Tags** : maximum 5, 30 caractères chacun

## 📱 Responsive Design

Le forum est entièrement responsive avec :
- **Mobile** : Navigation simplifiée, cartes empilées
- **Tablet** : Grille adaptative, sidebar collapsible
- **Desktop** : Interface complète avec sidebar

## 🚀 Améliorations futures

### Fonctionnalités prévues
- [ ] Notifications en temps réel
- [ ] Système de badges et réputation
- [ ] Recherche avancée avec filtres
- [ ] Export des discussions
- [ ] Intégration avec le système de tickets
- [ ] Modération automatique avec IA
- [ ] Statistiques avancées
- [ ] API publique pour intégrations

### Optimisations
- [ ] Cache Redis pour les performances
- [ ] Indexation Elasticsearch
- [ ] CDN pour les images
- [ ] Compression des réponses API
- [ ] Pagination infinie
- [ ] Lazy loading des commentaires

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion MongoDB**
   ```bash
   # Vérifier que MongoDB est démarré
   brew services start mongodb-community  # macOS
   sudo systemctl start mongod           # Linux
   ```

2. **Erreur de permissions**
   ```bash
   # Vérifier les permissions des fichiers
   chmod +x init-forum.sh
   ```

3. **Port déjà utilisé**
   ```bash
   # Changer le port dans les fichiers de configuration
   # Backend: server.js
   # Frontend: package.json
   ```

### Logs et débogage
- **Backend** : Logs dans `backend/backend.log`
- **Frontend** : Console du navigateur
- **MongoDB** : Logs dans `mongodb.log`

## 📞 Support

Pour toute question ou problème :
- **Documentation** : Ce fichier README
- **Issues** : Créer une issue sur le repository
- **Contact** : support@experience-tech.com

---

**Forum Expérience Tech** - Développé avec ❤️ pour la communauté
