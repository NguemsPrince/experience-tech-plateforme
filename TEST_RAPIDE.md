# 🚀 Test Rapide - Dashboard Access

## ✅ Configuration Terminée !

L'utilisateur de test a été créé avec succès :
- **Email** : `demo@test.com`
- **Mot de passe** : `demo123`
- **Rôle** : client

## 📝 Étapes pour Tester

### 1️⃣ Vérifier que le Backend est Démarré

```bash
# Le serveur doit tourner sur http://localhost:5000
# Si ce n'est pas le cas, démarrez-le avec :
cd /Users/nguemsprince/Desktop/Projet/backend
/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin/node server.js
```

### 2️⃣ Ouvrir le Fichier de Test

Ouvrez ce fichier dans votre navigateur :
```
/Users/nguemsprince/Desktop/Projet/test-dashboard-access.html
```

**Méthode 1 : Double-clic sur le fichier**
- Allez dans `/Users/nguemsprince/Desktop/Projet/`
- Double-cliquez sur `test-dashboard-access.html`

**Méthode 2 : Depuis le terminal**
```bash
open /Users/nguemsprince/Desktop/Projet/test-dashboard-access.html
```

### 3️⃣ Effectuer les Tests

Dans le navigateur :

1. **Cliquez sur "Tester la Connexion"**
   - ✅ Vous devriez voir : "Connexion réussie !"
   - Les informations de l'utilisateur Demo s'afficheront
   - Un token JWT sera affiché

2. **Cliquez sur "Tester le Dashboard"**
   - ✅ Vous devriez voir : "Dashboard accessible !"
   - Les statistiques du dashboard s'afficheront (projets, factures, etc.)

### 4️⃣ Tester depuis l'Interface Web

Vous pouvez aussi tester depuis l'application React (si elle est démarrée) :

```bash
# Démarrer le frontend (dans un nouveau terminal)
cd /Users/nguemsprince/Desktop/Projet/frontend
/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin/npm start
```

Puis ouvrez : `http://localhost:3000/login`

Connectez-vous avec :
- Email : `demo@test.com`
- Mot de passe : `demo123`

## 🔧 Tests API en Ligne de Commande

### Test de Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"demo123"}'
```

### Test du Dashboard (remplacez TOKEN par votre token)
```bash
TOKEN="VOTRE_TOKEN_ICI"
curl -X GET http://localhost:5000/api/client/dashboard \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## ❓ Résolution de Problèmes

### Erreur "Failed to fetch" ou "Network Error"
- ✅ Vérifiez que le backend est démarré sur le port 5000
- ✅ Vérifiez qu'il n'y a pas de problème CORS
- ✅ Ouvrez la console du navigateur (F12) pour voir les erreurs détaillées

### Erreur "Identifiants invalides"
- ✅ L'utilisateur demo a bien été créé (voir ci-dessus)
- ✅ Utilisez exactement : `demo@test.com` / `demo123`

### Erreur "Token invalide"
- ✅ Reconnectez-vous pour obtenir un nouveau token
- ✅ Le token expire après 7 jours

## 🎯 Résultat Attendu

Si tout fonctionne correctement, vous devriez voir :

1. ✅ **Connexion réussie** avec les informations de l'utilisateur Demo
2. ✅ **Dashboard accessible** avec les statistiques (même si elles sont à 0)
3. ✅ Aucune erreur dans la console du navigateur

## 📊 Vérification Rapide

Pour vérifier que le serveur backend fonctionne :
```bash
curl http://localhost:5000/api/health
```

Devrait retourner :
```json
{
  "status": "success",
  "message": "Expérience Tech API is running",
  "timestamp": "...",
  "environment": "development"
}
```

## 🎉 Succès !

Si vous voyez les messages de succès, votre dashboard est maintenant **fonctionnel** !

Vous pouvez maintenant :
- Développer d'autres fonctionnalités du dashboard
- Ajouter des projets, factures, etc.
- Personnaliser l'interface utilisateur
- Créer d'autres utilisateurs de test

---

**Créé le** : 14 octobre 2025  
**Utilisateur de test** : demo@test.com  
**Serveur backend** : http://localhost:5000  
**Serveur frontend** : http://localhost:3000

