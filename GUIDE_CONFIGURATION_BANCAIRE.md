# 🏦 Guide de Configuration Bancaire - Dashboard Admin

## 📋 Vue d'ensemble

Ce guide explique comment configurer les informations bancaires dans le dashboard administrateur pour permettre les paiements par virement bancaire.

---

## 🎯 Accès à la Configuration

### Étape 1 : Se connecter en tant qu'administrateur

1. Allez sur : `http://localhost:3000/admin/login`
2. Connectez-vous avec un compte administrateur
3. Ou accédez depuis : `http://localhost:3000/admin` (si déjà connecté)

### Étape 2 : Accéder aux paramètres

1. Dans le dashboard admin, cliquez sur **"Paramètres système"** dans le menu
2. Ou allez directement sur : `http://localhost:3000/admin/settings`
3. Cliquez sur l'onglet **"Paiements"**

---

## ⚙️ Configuration des Informations Bancaires

### Section : "Compte bancaire du centre"

#### 📝 Champs à remplir :

**1. Nom de la banque** (Recommandé)
   - Exemples : 
     - `Société Générale Tchad`
     - `Banque Commerciale du Chari`
     - `Ecobank Tchad`
     - `Banque Sahélo-Saharienne pour l'Investissement et le Commerce`

**2. Numéro de compte** (Recommandé)
   - Le numéro de compte bancaire de votre entreprise
   - Format : selon votre banque (ex: `1234567890` ou `12-34567-89`)

**3. Titulaire du compte** (Optionnel mais recommandé)
   - Nom du titulaire du compte
   - Exemple : `Expérience Tech`

**4. IBAN** (Optionnel)
   - Code IBAN international
   - Format pour le Tchad : `TD` suivi de 2 chiffres + 22 caractères
   - Exemple : `TD11 1234 5678 9012 3456 7890`

**5. Code SWIFT** (Optionnel)
   - Code SWIFT/BIC de la banque
   - Exemples pour le Tchad :
     - `SOGETDXT` - Société Générale Tchad
     - `BCCATDXT` - Banque Commerciale du Chari
     - `ECBKTDXT` - Ecobank Tchad
     - `BSICTDXT` - Banque Sahélo-Saharienne

**6. Agence** (Optionnel)
   - Nom de l'agence bancaire
   - Exemples :
     - `N'Djamena Centre`
     - `Avenue Charles de Gaulle`
     - `Abéché`

**7. Compte bancaire actif** ✅
   - **Important** : Cochez cette case pour activer l'affichage des informations bancaires dans la modal de paiement
   - Si non coché, les informations ne s'afficheront pas même si elles sont renseignées

---

## 💾 Sauvegarde

1. Une fois tous les champs remplis, cliquez sur le bouton **"Enregistrer les paramètres"** en bas de la page
2. Attendez la confirmation : **"Paramètres de paiement sauvegardés avec succès !"**
3. Les informations seront immédiatement disponibles dans la modal de paiement

---

## ✅ Vérification

### Comment vérifier que la configuration fonctionne :

1. **Accéder au panier** :
   - Allez sur : `http://localhost:3000/cart`
   - Ou ajoutez un cours au panier

2. **Ouvrir la modal de paiement** :
   - Cliquez sur **"Procéder au paiement"**
   - Sélectionnez **"Virement bancaire"**

3. **Vérifier l'affichage** :
   - Les informations bancaires configurées devraient s'afficher :
     - ✅ **Banque** : [Nom de votre banque]
     - ✅ **Compte** : [Numéro de compte]
     - ✅ **Bénéficiaire** : [Titulaire du compte]
     - ✅ **IBAN** : [Si configuré]
     - ✅ **Code SWIFT** : [Si configuré]
     - ✅ **Agence** : [Si configurée]

---

## 🔧 Structure Technique

### Modèle de données

Les informations sont stockées dans MongoDB avec la structure suivante :

```javascript
{
  payment: {
    bankAccount: {
      bankName: String,
      accountNumber: String,
      accountHolderName: String,
      iban: String,
      swiftCode: String,
      branch: String,
      isActive: Boolean
    }
  }
}
```

### API Endpoints

- **GET** `/api/settings/payment` - Récupérer les paramètres de paiement
- **PUT** `/api/settings/payment` - Mettre à jour les paramètres de paiement

---

## 🆘 Dépannage

### Les informations ne s'affichent pas après configuration

1. **Vérifier l'activation** :
   - ✅ Assurez-vous que "Compte bancaire actif" est bien coché

2. **Vérifier les champs obligatoires** :
   - ✅ Au minimum, le **Nom de la banque** et le **Numéro de compte** doivent être remplis

3. **Actualiser la page** :
   - Rechargez la modal de paiement (fermez et rouvrez-la)

4. **Vérifier les logs** :
   ```bash
   tail -f /Users/nguemsprince/Desktop/Projet/backend.log
   ```

### Erreur lors de la sauvegarde

1. **Vérifier les permissions** :
   - ✅ Vous devez être connecté en tant qu'administrateur

2. **Vérifier le backend** :
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Vérifier la console** :
   - Ouvrez les outils de développement (F12)
   - Vérifiez les erreurs dans la console

---

## 📝 Exemples Complets

### Exemple 1 : Société Générale Tchad

```
Nom de la banque: Société Générale Tchad
Numéro de compte: 1234567890
Titulaire du compte: Expérience Tech
IBAN: TD11 1234 5678 9012 3456 7890
Code SWIFT: SOGETDXT
Agence: N'Djamena Centre
Compte bancaire actif: ✅
```

### Exemple 2 : Ecobank Tchad

```
Nom de la banque: Ecobank Tchad
Numéro de compte: 9876543210
Titulaire du compte: Expérience Tech
Code SWIFT: ECBKTDXT
Agence: Abéché
Compte bancaire actif: ✅
```

---

## 🔒 Sécurité

⚠️ **Important** : Les informations bancaires sont sensibles. Assurez-vous que :

1. ✅ Seuls les administrateurs peuvent modifier ces paramètres
2. ✅ Le backend est sécurisé et accessible uniquement aux personnes autorisées
3. ✅ Les informations sont stockées de manière sécurisée dans la base de données

---

## 📞 Support

Pour toute question ou problème :

1. Vérifiez les logs du backend
2. Consultez la documentation technique
3. Contactez l'équipe technique

---

**Date de création** : 2025-11-28  
**Version** : 1.0.0

