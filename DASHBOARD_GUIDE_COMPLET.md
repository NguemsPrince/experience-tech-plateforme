# 🚀 Dashboard Expérience Tech - Guide Complet

## 📋 Vue d'ensemble

Le tableau de bord Expérience Tech est maintenant **100% fonctionnel** ! Ce guide vous explique comment l'utiliser et le maintenir.

## ✨ Fonctionnalités Disponibles

### 🎨 Interface Moderne
- **Design responsive** adapté à tous les écrans
- **Mode sombre/clair** avec transition fluide
- **Animations micro-interactions** avec Framer Motion
- **Sidebar collapsible** pour une meilleure utilisation de l'espace

### 📊 Tableau de Bord Administrateur
- **Statistiques en temps réel** avec graphiques interactifs
- **Gestion des utilisateurs** (création, modification, suppression)
- **Gestion des formations** et cours
- **Système de notifications** en temps réel
- **Actions rapides** pour les tâches courantes

### 🔐 Système d'Authentification
- **Inscription/Connexion** sécurisée
- **Rôles utilisateurs** (admin, utilisateur, client)
- **Protection des routes** sensibles
- **Gestion des sessions** avec JWT

## 🚀 Démarrage Rapide

### Option 1: Script Automatique (Recommandé)
```bash
cd /Users/nguemsprince/Desktop/Projet
./demarrer-dashboard.sh
```

### Option 2: Démarrage Manuel
```bash
# 1. Démarrer MongoDB
cd /Users/nguemsprince/Desktop/Projet
./mongodb-macos-x86_64-7.0.5/bin/mongod --dbpath ./data --port 27017 --logpath ./mongodb.log &

# 2. Démarrer le Backend
cd backend
export PATH="/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin:$PATH"
npm start &

# 3. Démarrer le Frontend
cd ../frontend
npm start &
```

## 🌐 Accès aux Services

| Service | URL | Description |
|---------|-----|-------------|
| **Dashboard Admin** | http://localhost:3000/admin | Interface administrateur moderne |
| **Page de Connexion** | http://localhost:3000/login | Authentification utilisateurs |
| **API Backend** | http://localhost:5000/api | API REST pour le frontend |
| **Test Complet** | test-dashboard-complet.html | Page de test de tous les services |

## 👤 Comptes de Test

### Administrateur
- **Email**: `admin@experiencetech.com`
- **Mot de passe**: `Admin123!`
- **Rôle**: Administrateur complet

### Utilisateur Standard
- **Email**: `user@experiencetech.com`
- **Mot de passe**: `User123!`
- **Rôle**: Utilisateur standard

> 💡 **Note**: Vous pouvez créer de nouveaux comptes via la page d'inscription

## 🛠️ Structure Technique

### Backend (Node.js + Express)
```
backend/
├── server.js              # Serveur principal
├── routes/                # Routes API
├── models/                # Modèles de données
├── middleware/             # Middlewares
└── .env                   # Configuration
```

### Frontend (React + Tailwind)
```
frontend/
├── src/
│   ├── pages/             # Pages de l'application
│   ├── components/         # Composants réutilisables
│   ├── contexts/          # Contextes React
│   ├── hooks/             # Hooks personnalisés
│   └── utils/             # Utilitaires
├── public/                # Fichiers statiques
└── .env                   # Configuration frontend
```

### Base de Données (MongoDB)
- **Port**: 27017
- **Base**: `experience_tech`
- **Collections**: users, courses, services, etc.

## 🔧 Maintenance

### Vérification du Statut
```bash
# Vérifier les processus actifs
ps aux | grep -E "(node|mongod)" | grep -v grep

# Tester les services
curl http://localhost:5000/api/health
curl http://localhost:3000
```

### Logs
- **MongoDB**: `./mongodb.log`
- **Backend**: Console du terminal
- **Frontend**: Console du navigateur

### Arrêt des Services
```bash
# Arrêter tous les services
pkill -f "mongod"
pkill -f "node server.js"
pkill -f "react-scripts start"
```

## 🐛 Résolution de Problèmes

### Port déjà utilisé
```bash
# Trouver et arrêter le processus
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Erreurs de dépendances
```bash
# Réinstaller les dépendances
cd backend && npm install
cd frontend && npm install --legacy-peer-deps
```

### Problèmes de base de données
```bash
# Redémarrer MongoDB
pkill -f mongod
./mongodb-macos-x86_64-7.0.5/bin/mongod --dbpath ./data --port 27017 --logpath ./mongodb.log &
```

## 📊 Fonctionnalités du Dashboard

### 1. **Vue d'ensemble**
- Statistiques générales de la plateforme
- Graphiques de performance
- Activité récente

### 2. **Gestion des Utilisateurs**
- Liste des utilisateurs inscrits
- Création de nouveaux comptes
- Modification des rôles
- Désactivation/activation des comptes

### 3. **Gestion des Formations**
- Catalogue des cours disponibles
- Ajout de nouvelles formations
- Suivi des inscriptions
- Gestion des certificats

### 4. **Système de Notifications**
- Notifications en temps réel
- Historique des alertes
- Configuration des préférences

### 5. **Actions Rapides**
- Ajouter un utilisateur
- Créer une formation
- Générer un rapport
- Envoyer une notification

## 🎯 Prochaines Améliorations

- [ ] **Export PDF** des rapports
- [ ] **Drag & drop** pour réorganiser les widgets
- [ ] **Thèmes personnalisés**
- [ ] **Mode hors ligne** avec PWA
- [ ] **Intégration API** temps réel
- [ ] **Tests automatisés**

## 📞 Support

Pour toute question ou problème :
- **Email**: admin@experiencetech.com
- **Documentation**: Consultez ce README
- **Logs**: Vérifiez les fichiers de log mentionnés ci-dessus

---

**🎉 Le tableau de bord Expérience Tech est maintenant 100% fonctionnel !**

*Développé avec ❤️ par l'équipe Expérience Tech*
