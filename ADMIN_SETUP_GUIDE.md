# 🎯 Guide de Configuration du Dashboard Administrateur

## 📋 Prérequis

### 1. Installation de Node.js
```bash
# Installer Homebrew (si pas déjà installé)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Node.js
brew install node

# Vérifier l'installation
node --version
npm --version
```

### 2. Installation de MongoDB
```bash
# Installer MongoDB avec Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Démarrer MongoDB
brew services start mongodb/brew/mongodb-community
```

## 🚀 Configuration du Dashboard Admin

### 1. Démarrer le Backend
```bash
cd /Users/nguemsprince/Desktop/Projet/backend
npm install
node create-admin-quick.js  # Créer l'utilisateur admin
npm start                    # Démarrer le serveur backend
```

### 2. Démarrer le Frontend
```bash
cd /Users/nguemsprince/Desktop/Projet/frontend
npm install
npm start                    # Démarrer l'application React
```

## 🔐 Informations de Connexion Admin

### Compte Administrateur
- **Email** : `admin@experiencetech-tchad.com`
- **Mot de passe** : `admin123`
- **Rôle** : `admin`
- **Nom** : Admin Expérience Tech

### Accès au Dashboard
1. **URL** : `http://localhost:3000/admin`
2. **Connexion** : Utilisez les identifiants ci-dessus
3. **Interface** : Dashboard complet avec gestion des utilisateurs, projets, formations

## 🎯 Fonctionnalités du Dashboard Admin

### 📊 Vue d'ensemble
- **Statistiques** : Utilisateurs, revenus, projets, formations
- **Activité récente** : Utilisateurs et projets récents
- **Métriques** : Données en temps réel

### 👥 Gestion des Utilisateurs
- **Liste complète** : Tous les utilisateurs de la plateforme
- **Recherche** : Filtrage par nom, email, statut
- **Actions** : Voir, modifier, supprimer les utilisateurs
- **Statuts** : Actif/Inactif avec indicateurs visuels

### 📈 Gestion des Projets
- **Projets actifs** : Suivi des projets en cours
- **Budget** : Gestion des budgets et paiements
- **Progression** : Suivi de l'avancement
- **Échéances** : Alertes et rappels

### 🎓 Gestion des Formations
- **Catalogue** : Gestion des formations disponibles
- **Inscriptions** : Suivi des étudiants inscrits
- **Progression** : Avancement des apprenants
- **Certificats** : Gestion des certifications

### 🎫 Support Client
- **Tickets** : Gestion des demandes de support
- **Priorités** : Classification des urgences
- **Résolution** : Suivi des solutions
- **Communication** : Interface de messagerie

### ⚙️ Paramètres Système
- **Configuration** : Paramètres de la plateforme
- **Sécurité** : Gestion des accès et permissions
- **Notifications** : Configuration des alertes
- **Maintenance** : Outils d'administration

## 🔧 Dépannage

### Problème de Connexion
1. **Vérifiez MongoDB** : `brew services list | grep mongodb`
2. **Vérifiez le backend** : `http://localhost:5000/api/health`
3. **Vérifiez les logs** : `tail -f backend.log`

### Problème d'Authentification
1. **Recréez l'admin** : `node create-admin-quick.js`
2. **Vérifiez les tokens** : Inspectez les cookies du navigateur
3. **Nettoyez le cache** : Effacez le localStorage

### Problème de Permissions
1. **Vérifiez le rôle** : L'utilisateur doit avoir `role: 'admin'`
2. **Vérifiez l'activation** : `isActive: true`
3. **Vérifiez l'email** : `emailVerified: true`

## 📱 Accès Mobile

### Responsive Design
- **Mobile** : Interface adaptée aux smartphones
- **Tablet** : Optimisée pour les tablettes
- **Desktop** : Interface complète sur ordinateur

### Navigation
- **Menu hamburger** : Navigation mobile
- **Onglets** : Navigation par sections
- **Recherche** : Barre de recherche globale

## 🎨 Personnalisation

### Thème
- **Mode sombre** : Disponible dans les paramètres
- **Couleurs** : Personnalisation des couleurs
- **Layout** : Adaptation de l'interface

### Notifications
- **Email** : Notifications par email
- **SMS** : Alertes par SMS
- **Push** : Notifications push

## 🚨 Sécurité

### Bonnes Pratiques
1. **Changez le mot de passe** : Après la première connexion
2. **Utilisez HTTPS** : En production
3. **Sauvegardez** : Régulièrement la base de données
4. **Surveillez** : Les logs d'accès

### Permissions
- **Admin uniquement** : Accès restreint aux administrateurs
- **Sessions** : Expiration automatique
- **Audit** : Traçabilité des actions

## 📞 Support

### En cas de problème
1. **Logs** : Vérifiez les logs du serveur
2. **Base de données** : Vérifiez la connexion MongoDB
3. **Réseau** : Vérifiez la connectivité
4. **Permissions** : Vérifiez les droits d'accès

### Contact
- **Email** : admin@experiencetech-tchad.com
- **Téléphone** : +23560290510
- **Support** : Via le dashboard de support

---

## 🎉 Félicitations !

Votre dashboard administrateur est maintenant configuré et prêt à l'emploi !

**Prochaines étapes :**
1. Installez Node.js et MongoDB
2. Créez l'utilisateur admin
3. Démarrez les serveurs
4. Connectez-vous au dashboard
5. Explorez les fonctionnalités

**Bonne administration !** 🚀
