# 🎫 Système de Tickets Expérience Tech

## 🚀 Démarrage Rapide

### 1. Installation
```bash
# Cloner le projet
git clone <repository-url>
cd Projet

# Installer les dépendances
npm run install-all

# Configurer l'environnement
cp backend/env.example backend/.env
# Éditer backend/.env avec vos paramètres
```

### 2. Configuration Freshdesk (Optionnel)
```bash
# Dans backend/.env
FRESHDESK_API_KEY=your_api_key
FRESHDESK_DOMAIN=your_domain
```

### 3. Initialisation
```bash
# Initialiser les catégories de tickets
cd backend
node initialize-ticket-categories.js

# Tester l'intégration Freshdesk (si configuré)
node test-freshdesk-integration.js
```

### 4. Démarrage
```bash
# Démarrer le système complet
./start-ticket-system.sh

# Ou démarrer manuellement
npm run dev
```

## 🎯 Fonctionnalités

### ✅ Implémentées
- **Création de tickets** avec catégories et priorités
- **Gestion des commentaires** avec historique
- **Système de rôles** (client, admin, super_admin)
- **Filtres avancés** et recherche
- **Interface responsive** avec Tailwind CSS
- **Intégration Freshdesk** bidirectionnelle
- **Panneau d'administration** complet
- **Statistiques et métriques**
- **SLA configurable** par catégorie
- **Tags personnalisés**
- **Historique des changements**

### 🔄 Synchronisation Freshdesk
- Création automatique des tickets
- Mise à jour bidirectionnelle
- Synchronisation des commentaires
- Métriques et statistiques

## 📊 Interface Utilisateur

### Pour les Clients
- **Création de tickets** : Formulaire intuitif avec validation
- **Suivi des tickets** : Vue d'ensemble avec filtres
- **Détails du ticket** : Historique complet et ajout de commentaires
- **Notifications** : Alertes en temps réel

### Pour les Administrateurs
- **Tableau de bord** : Statistiques complètes
- **Gestion des tickets** : Assignation et mise à jour des statuts
- **Filtres avancés** : Recherche par tous les critères
- **Métriques SLA** : Suivi des performances

## 🔧 Configuration

### Variables d'Environnement
```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/experience_tech

# Authentification
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Freshdesk (optionnel)
FRESHDESK_API_KEY=your_api_key
FRESHDESK_DOMAIN=your_domain

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password
```

### Catégories par Défaut
- **Technique** : Problèmes techniques et bugs
- **Facturation** : Questions de paiement
- **Formation** : Demandes de formation
- **Service client** : Support général
- **Signalement de bug** : Bugs et problèmes
- **Demande de fonctionnalité** : Nouvelles fonctionnalités
- **Général** : Autres demandes

## 📱 Test de l'Interface

Ouvrez `test-ticket-system.html` dans votre navigateur pour voir un aperçu de l'interface utilisateur.

## 🔌 APIs Disponibles

### Tickets
- `POST /api/tickets` - Créer un ticket
- `GET /api/tickets` - Lister les tickets
- `GET /api/tickets/:id` - Détails d'un ticket
- `PUT /api/tickets/:id` - Mettre à jour
- `DELETE /api/tickets/:id` - Supprimer (admin)

### Commentaires
- `POST /api/tickets/:id/comments` - Ajouter un commentaire
- `GET /api/tickets/:id/comments` - Lister les commentaires
- `PUT /api/tickets/:id/comments/:commentId` - Modifier
- `DELETE /api/tickets/:id/comments/:commentId` - Supprimer

### Statistiques
- `GET /api/tickets/stats` - Métriques complètes (admin)

## 🛡️ Sécurité

### Authentification
- JWT avec expiration configurable
- Refresh tokens pour la sécurité
- Cookies HTTP-only

### Autorisation
- Rôles : client, student, admin, super_admin
- Permissions granulaires par endpoint
- Validation des données d'entrée

### Protection
- Rate limiting par IP
- Validation des entrées
- Sanitisation des données
- CORS configuré

## 📈 Métriques et Monitoring

### Statistiques Disponibles
- Nombre total de tickets
- Répartition par statut
- Temps moyen de résolution
- Temps moyen de réponse
- Répartition par catégorie
- Répartition par priorité

### SLA (Service Level Agreement)
- Temps de réponse configurable
- Temps de résolution configurable
- Alertes automatiques
- Métriques de performance

## 🔄 Intégration Freshdesk

### Configuration
1. Créer un compte Freshdesk
2. Générer une API Key
3. Configurer les variables d'environnement
4. Tester avec le script fourni

### Fonctionnalités
- Synchronisation bidirectionnelle
- Mapping automatique des statuts
- Synchronisation des commentaires
- Métriques Freshdesk

## 🚨 Dépannage

### Problèmes Courants

#### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
mongod --version
# Démarrer MongoDB
brew services start mongodb-community
```

#### Erreur Freshdesk
```bash
# Vérifier les credentials
node test-freshdesk-integration.js
# Vérifier la connectivité
curl -u "api_key:X" "https://domain.freshdesk.com/api/v2/tickets"
```

#### Erreur de permissions
- Vérifier les rôles utilisateur
- Vérifier les tokens JWT
- Vérifier les middlewares d'authentification

### Logs et Debug
```bash
# Mode debug
NODE_ENV=development npm run server

# Logs détaillés
tail -f backend/logs/tickets.log
```

## 📚 Documentation Complète

Consultez `SYSTEME_TICKETS_DOCUMENTATION.md` pour la documentation technique complète.

## 🤝 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les logs
3. Testez avec les scripts fournis
4. Contactez l'équipe technique

---

**Expérience Tech** - Système de Tickets v1.0.0
