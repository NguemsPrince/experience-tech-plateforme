# Implémentation de la Sécurité - Expérience Tech

## 🛡️ Vue d'ensemble

Ce document décrit l'implémentation du système de sécurité basé sur les rôles pour la plateforme Expérience Tech.

## 🎯 Objectifs de sécurité

1. **Restriction d'accès** : Seuls les administrateurs peuvent accéder au dashboard admin
2. **Navigation sécurisée** : Les utilisateurs non-admin ne voient que les pages autorisées
3. **Protection des routes** : Vérification côté client et redirection appropriée
4. **Interface adaptative** : Menu et navigation adaptés selon le rôle utilisateur

## 🏗️ Architecture de sécurité

### Composants principaux

#### 1. **ProtectedRoute** (`/src/components/ProtectedRoute.js`)
- Composant de protection des routes
- Vérifie l'authentification et les rôles
- Redirige vers `/access-denied` si accès refusé

#### 2. **UserRoute** (`/src/components/UserRoute.js`)
- Route protégée pour les utilisateurs standards
- Limite l'accès aux pages autorisées
- Utilise les utilitaires de permissions

#### 3. **AccessDenied** (`/src/pages/AccessDenied.js`)
- Page d'erreur personnalisée
- Interface utilisateur conviviale
- Liens vers les pages autorisées

#### 4. **Permissions** (`/src/utils/permissions.js`)
- Utilitaires de gestion des rôles et permissions
- Configuration centralisée des accès
- Fonctions de vérification

### Rôles et permissions

#### 🔐 Rôles disponibles
- **`admin`** : Accès complet à toutes les fonctionnalités
- **`user`** : Accès limité aux pages utilisateur
- **`guest`** : Accès public uniquement

#### 📄 Pages par rôle

**Administrateur (`admin`)** :
- `/admin` - Dashboard administrateur
- `/admin/dashboard` - Tableau de bord
- `/admin/users` - Gestion des utilisateurs
- `/admin/projects` - Gestion des projets
- `/admin/settings` - Paramètres système
- Toutes les pages utilisateur

**Utilisateur (`user`)** :
- `/my-courses` - Mes formations
- `/cart` - Mon panier
- `/profile` - Mon profil
- Pages publiques (formation, services, etc.)

**Invité (`guest`)** :
- Pages publiques uniquement
- `/login` - Connexion
- `/register` - Inscription

## 🔧 Implémentation technique

### 1. Protection des routes

```jsx
// Route admin protégée
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />

// Route utilisateur protégée
<Route path="/my-courses" element={
  <UserRoute>
    <MyTraining />
  </UserRoute>
} />
```

### 2. Navigation adaptative

```jsx
// Navigation selon le rôle
let navigation = baseNavigation;
if (isAuthenticated && isAdmin(user?.role)) {
  navigation = [...adminNavigation, ...baseNavigation];
} else if (isAuthenticated) {
  navigation = [...userNavigation, ...baseNavigation];
}
```

### 3. Vérification des permissions

```javascript
// Vérifier l'accès à une page
const hasAccess = (userRole, pathname) => {
  const allowedPages = ALLOWED_PAGES[userRole] || ALLOWED_PAGES[ROLES.GUEST];
  return allowedPages.some(page => 
    pathname === page || 
    (page !== '/' && pathname.startsWith(page + '/'))
  );
};
```

## 🧪 Tests de sécurité

### Composant SecurityTest
- Accessible via `/admin/security-test` (admin uniquement)
- Tests automatisés des permissions
- Vérification des accès par rôle
- Interface de diagnostic

### Tests implémentés
1. **Vérification du rôle admin**
2. **Pages autorisées par rôle**
3. **Accès aux pages admin**
4. **Accès aux pages utilisateur**

## 🚀 Utilisation

### Pour les développeurs

1. **Ajouter une nouvelle route protégée** :
```jsx
<Route path="/nouvelle-page" element={
  <ProtectedRoute requiredRole="admin">
    <NouvellePage />
  </ProtectedRoute>
} />
```

2. **Vérifier les permissions dans un composant** :
```javascript
import { hasAccess, isAdmin } from '../utils/permissions';

const MonComposant = () => {
  const { user } = useAuth();
  
  if (isAdmin(user?.role)) {
    // Code pour admin
  }
  
  if (hasAccess(user?.role, '/ma-page')) {
    // Code si accès autorisé
  }
};
```

### Pour les utilisateurs

#### Utilisateur standard
- Accès à "Mes Formations" et "Mon Panier"
- Navigation limitée aux pages publiques
- Redirection vers page d'accès refusé si tentative d'accès admin

#### Administrateur
- Accès complet au dashboard admin
- Toutes les fonctionnalités de gestion
- Navigation étendue avec options admin

## 🔒 Sécurité côté serveur

### Recommandations
1. **Vérification côté serveur** : Implémenter des middlewares de vérification des rôles
2. **Tokens JWT** : Vérifier la validité et les permissions dans les tokens
3. **API sécurisée** : Endpoints protégés selon les rôles
4. **Audit** : Logs des tentatives d'accès non autorisées

### Exemple de middleware serveur
```javascript
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé' });
  }
};
```

## 📋 Checklist de sécurité

- [x] Protection des routes admin
- [x] Redirection des non-admin
- [x] Navigation adaptative
- [x] Page d'accès refusé
- [x] Utilitaires de permissions
- [x] Tests de sécurité
- [x] Documentation
- [ ] Vérification côté serveur
- [ ] Audit des accès
- [ ] Tests d'intrusion

## 🐛 Dépannage

### Problèmes courants

1. **Redirection en boucle** : Vérifier les conditions dans ProtectedRoute
2. **Menu non adaptatif** : Vérifier l'import des utilitaires de permissions
3. **Accès refusé incorrect** : Vérifier la configuration des pages autorisées

### Debug
- Utiliser le composant SecurityTest
- Vérifier les logs de la console
- Tester avec différents rôles utilisateur

## 📞 Support

Pour toute question sur l'implémentation de la sécurité, consulter :
- Documentation des composants
- Tests de sécurité intégrés
- Logs de l'application
