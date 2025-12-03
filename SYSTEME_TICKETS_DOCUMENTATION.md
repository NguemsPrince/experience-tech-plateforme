# 🎫 Système de Tickets - Documentation Technique

## 📋 Vue d'ensemble

Le système de tickets d'Expérience Tech est une solution complète de gestion de support client intégrée avec Freshdesk. Il permet aux utilisateurs de créer des tickets de support, aux agents de les gérer, et assure une synchronisation bidirectionnelle avec Freshdesk.

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Modèles** : Ticket, TicketComment, TicketCategory
- **APIs REST** : CRUD complet pour les tickets et commentaires
- **Intégration Freshdesk** : Synchronisation bidirectionnelle
- **Authentification** : JWT avec rôles (client, admin, super_admin)

### Frontend (React)
- **Composants** : CreateTicketModal, TicketList, TicketDetail
- **Pages** : SupportTickets, AdminTicketManagement
- **Services** : ticketService avec API calls
- **Multilingue** : Support FR/EN/AR

## 📊 Modèles de Données

### Ticket
```javascript
{
  ticketNumber: String,        // ET-20250101-0001
  subject: String,            // Sujet du ticket
  description: String,       // Description détaillée
  user: ObjectId,            // Référence vers User
  assignedTo: ObjectId,      // Agent assigné
  category: String,          // technical, billing, etc.
  priority: String,          // low, medium, high, urgent
  status: String,            // open, in_progress, resolved, closed
  freshdeskId: Number,       // ID Freshdesk
  freshdeskUrl: String,      // URL Freshdesk
  contactEmail: String,      // Email de contact
  contactPhone: String,      // Téléphone
  tags: [String],           // Tags personnalisés
  dueDate: Date,           // Date d'échéance
  resolutionTime: Number,   // Temps de résolution (minutes)
  responseTime: Number,     // Temps de réponse (minutes)
  satisfactionRating: Number, // Note satisfaction (1-5)
  source: String,           // web, email, phone, api
  statusHistory: [{         // Historique des changements
    status: String,
    changedBy: ObjectId,
    changedAt: Date,
    comment: String
  }]
}
```

### TicketComment
```javascript
{
  ticket: ObjectId,         // Référence vers Ticket
  author: ObjectId,         // Auteur du commentaire
  content: String,          // Contenu du commentaire
  type: String,            // comment, note, system, resolution
  isPublic: Boolean,       // Visible par le client
  isInternal: Boolean,     // Note interne
  freshdeskId: Number,     // ID Freshdesk
  attachments: [{         // Pièces jointes
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }]
}
```

### TicketCategory
```javascript
{
  name: String,            // Nom de la catégorie
  description: String,      // Description
  isActive: Boolean,       // Catégorie active
  isDefault: Boolean,      // Catégorie par défaut
  autoAssignTo: ObjectId,   // Assignation automatique
  sla: {                   // Service Level Agreement
    responseTime: Number,   // Temps de réponse (heures)
    resolutionTime: Number  // Temps de résolution (heures)
  },
  defaultPriority: String,  // Priorité par défaut
  defaultTags: [String],   // Tags par défaut
  responseTemplate: {      // Template de réponse
    subject: String,
    content: String
  },
  color: String,          // Couleur d'affichage
  icon: String           // Icône
}
```

## 🔌 APIs Backend

### Routes des Tickets
- `POST /api/tickets` - Créer un ticket
- `GET /api/tickets` - Lister les tickets (avec filtres)
- `GET /api/tickets/:id` - Obtenir un ticket
- `PUT /api/tickets/:id` - Mettre à jour un ticket
- `DELETE /api/tickets/:id` - Supprimer un ticket (admin)
- `GET /api/tickets/stats` - Statistiques (admin)

### Routes des Commentaires
- `POST /api/tickets/:id/comments` - Ajouter un commentaire
- `GET /api/tickets/:id/comments` - Lister les commentaires
- `PUT /api/tickets/:id/comments/:commentId` - Modifier un commentaire
- `DELETE /api/tickets/:id/comments/:commentId` - Supprimer un commentaire

## 🔄 Intégration Freshdesk

### Configuration
```env
FRESHDESK_API_KEY=your_api_key
FRESHDESK_DOMAIN=your_domain
```

### Fonctionnalités
- **Création** : Tickets créés localement → Freshdesk
- **Mise à jour** : Changements synchronisés bidirectionnellement
- **Commentaires** : Ajout automatique dans Freshdesk
- **Synchronisation** : Sync périodique des données
- **Statistiques** : Récupération des métriques Freshdesk

### Mapping des Données
```javascript
// Priorités
local → Freshdesk
low → 1, medium → 2, high → 3, urgent → 4

// Statuts
local → Freshdesk
open → 2, in_progress → 3, pending_customer → 4, resolved → 5, closed → 6
```

## 🎨 Interface Utilisateur

### Composants Principaux

#### CreateTicketModal
- Formulaire de création de ticket
- Validation des champs
- Gestion des tags
- Catégories et priorités

#### TicketList
- Liste paginée des tickets
- Filtres avancés (statut, priorité, catégorie)
- Recherche textuelle
- Actions rapides

#### TicketDetail
- Affichage complet du ticket
- Historique des commentaires
- Formulaire d'ajout de commentaire
- Mise à jour du statut

#### AdminTicketManagement
- Vue d'ensemble des statistiques
- Gestion des tickets (assignation, statut)
- Filtres administratifs
- Tableau de bord complet

## 🔐 Sécurité et Permissions

### Rôles Utilisateur
- **client/student** : Créer tickets, voir ses tickets, ajouter commentaires
- **admin/super_admin** : Accès complet, gestion des tickets, statistiques

### Contrôles d'Accès
- Authentification JWT requise
- Vérification des permissions par rôle
- Validation des données d'entrée
- Protection contre les injections

## 📈 Fonctionnalités Avancées

### SLA (Service Level Agreement)
- Temps de réponse configurable par catégorie
- Alertes automatiques en cas de dépassement
- Métriques de performance

### Historique des Changements
- Traçabilité complète des modifications
- Audit trail pour conformité
- Notifications des changements

### Satisfaction Client
- Système de notation (1-5 étoiles)
- Commentaires de satisfaction
- Métriques de qualité de service

### Tags et Catégorisation
- Tags personnalisés par ticket
- Catégories prédéfinies avec SLA
- Assignation automatique par catégorie

## 🚀 Installation et Configuration

### 1. Backend
```bash
cd backend
npm install
# Configurer les variables d'environnement
cp .env.example .env
# Initialiser les catégories
node initialize-ticket-categories.js
# Démarrer le serveur
npm run server
```

### 2. Frontend
```bash
cd frontend
npm install
# Démarrer l'application
npm start
```

### 3. Configuration Freshdesk
```env
FRESHDESK_API_KEY=your_freshdesk_api_key
FRESHDESK_DOMAIN=your_freshdesk_domain
```

### 4. Test de l'Intégration
```bash
cd backend
node test-freshdesk-integration.js
```

## 📊 Métriques et Monitoring

### Statistiques Disponibles
- Nombre total de tickets
- Répartition par statut
- Temps moyen de résolution
- Temps moyen de réponse
- Répartition par catégorie
- Répartition par priorité

### Alertes
- Tickets en retard (SLA dépassé)
- Tickets non assignés
- Tickets urgents non traités

## 🔧 Maintenance

### Tâches Périodiques
- Synchronisation Freshdesk (cron job)
- Nettoyage des tickets fermés anciens
- Mise à jour des statistiques
- Sauvegarde des données

### Monitoring
- Logs des erreurs d'intégration
- Métriques de performance API
- Surveillance des SLA
- Alertes de système

## 🆘 Support et Dépannage

### Problèmes Courants
1. **Erreur de connexion Freshdesk** : Vérifier les credentials
2. **Tickets non synchronisés** : Vérifier la connectivité réseau
3. **Permissions insuffisantes** : Vérifier les rôles utilisateur
4. **Performance lente** : Optimiser les requêtes MongoDB

### Logs et Debug
- Logs détaillés dans `backend/logs/`
- Mode debug avec `NODE_ENV=development`
- Tests d'intégration disponibles

## 📚 Ressources Supplémentaires

- [Documentation Freshdesk API](https://developers.freshdesk.com/api/)
- [Guide MongoDB](https://docs.mongodb.com/)
- [Documentation Express.js](https://expressjs.com/)
- [Guide React](https://reactjs.org/docs/)

---

**Expérience Tech** - Système de Tickets v1.0.0
