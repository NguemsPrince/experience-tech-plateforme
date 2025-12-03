# 🎯 Guide d'Accès au Dashboard - Expérience Tech

## 🚀 **Accès au Dashboard**

### **URLs d'accès :**
- **Dashboard principal** : `http://localhost:3000/dashboard`
- **Espace client** : `http://localhost:3000/client`
- **Dashboard client** : `http://localhost:3000/client/dashboard`
- **Projets** : `http://localhost:3000/client/projects`
- **Factures** : `http://localhost:3000/client/invoices`
- **Support** : `http://localhost:3000/client/support`

### **Authentification requise :**
Toutes ces routes sont protégées et nécessitent une connexion utilisateur.

## 🔐 **Processus de Connexion**

### **1. Page de Connexion**
- **URL** : `http://localhost:3000/login`
- **Fonctionnalités** :
  - Connexion par email/mot de passe
  - Redirection automatique vers le dashboard après connexion
  - Gestion des erreurs d'authentification

### **2. Création de Compte**
Pour créer un compte utilisateur, vous pouvez utiliser les scripts de création d'utilisateurs :

```bash
# Créer un utilisateur simple
cd /Users/nguemsprince/Desktop/Projet/backend
node create-simple-user.js

# Créer un utilisateur de démonstration
node create-demo-user.js

# Créer un utilisateur final
node create-final-user.js
```

## 🎛️ **Fonctionnalités du Dashboard**

### **Dashboard Principal (`/dashboard`)**
- **Vue d'ensemble** : Statistiques générales
- **Projets actifs** : Suivi des projets en cours
- **Activité récente** : Historique des actions
- **Tâches urgentes** : Alertes et notifications

### **Espace Client (`/client`)**
- **Gestion des projets** : Création, modification, suivi
- **Facturation** : Gestion des factures et paiements
- **Support** : Tickets d'assistance
- **Profil** : Informations personnelles

### **Sections Spécialisées**
- **`/client/projects`** : Gestion complète des projets
- **`/client/invoices`** : Facturation et paiements
- **`/client/support`** : Centre d'assistance

## 🛠️ **Démarrage de l'Application**

### **1. Démarrer le Backend**
```bash
cd /Users/nguemsprince/Desktop/Projet/backend
node server.js
```
**Port** : `http://localhost:5000`

### **2. Démarrer le Frontend**
```bash
cd /Users/nguemsprince/Desktop/Projet/frontend
npm start
```
**Port** : `http://localhost:3000`

### **3. Démarrer l'Application Complète**
```bash
cd /Users/nguemsprince/Desktop/Projet
npm run dev
```
**Démarre simultanément** : Backend (port 5000) + Frontend (port 3000)

## 🔧 **Résolution des Problèmes**

### **Erreur Backend**
Si le backend ne démarre pas :
```bash
# Vérifier les dépendances
cd /Users/nguemsprince/Desktop/Projet/backend
npm install

# Redémarrer le serveur
node server.js
```

### **Erreur Frontend**
Si le frontend ne démarre pas :
```bash
# Vérifier les dépendances
cd /Users/nguemsprince/Desktop/Projet/frontend
npm install

# Redémarrer le serveur
npm start
```

### **Problème d'Authentification**
- Vérifier que la base de données est accessible
- Créer un utilisateur de test avec les scripts fournis
- Vérifier les variables d'environnement

## 📱 **Interface du Dashboard**

### **Navigation**
- **Header** : Navigation principale avec menu utilisateur
- **Sidebar** : Menu latéral pour les sections du dashboard
- **Breadcrumb** : Indication du chemin de navigation

### **Sections Principales**
1. **Dashboard** : Vue d'ensemble et statistiques
2. **Projets** : Gestion des projets clients
3. **Factures** : Gestion financière
4. **Support** : Centre d'assistance
5. **Paramètres** : Configuration du compte

## 🎨 **Personnalisation**

### **Thèmes**
- Mode sombre/clair
- Couleurs personnalisables
- Interface responsive

### **Notifications**
- Alertes en temps réel
- Notifications par email
- Système de priorités

## 🔒 **Sécurité**

### **Authentification**
- JWT (JSON Web Tokens)
- Sessions sécurisées
- Déconnexion automatique

### **Autorisations**
- Rôles utilisateur (admin, client, etc.)
- Permissions granulaires
- Audit des actions

## 📊 **Statistiques Disponibles**

### **Métriques Générales**
- Projets actifs
- Clients totaux
- Revenus totaux
- Tickets de support

### **Métriques Détaillées**
- Projets complétés
- Factures en attente
- Performance des équipes
- Satisfaction client

## 🚀 **Prochaines Étapes**

1. **Accéder au dashboard** : `http://localhost:3000/dashboard`
2. **Se connecter** avec un compte utilisateur
3. **Explorer les fonctionnalités** disponibles
4. **Personnaliser** l'interface selon vos besoins

---

**Note** : Assurez-vous que les deux serveurs (backend et frontend) sont démarrés avant d'accéder au dashboard.
