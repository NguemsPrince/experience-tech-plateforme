# 🏦 Configuration des Informations Bancaires

## 📋 Problème
Dans le modal de paiement par virement bancaire, les informations suivantes affichent "Non configuré" :
- **Banque** : Non configuré
- **Compte** : Non configuré
- **Bénéficiaire** : Expérience Tech (par défaut)

## ✅ Solution : Configurer via l'interface Admin

### Étape 1 : Se connecter en tant qu'administrateur
1. Allez sur votre application : `http://localhost:3000`
2. Connectez-vous avec un compte administrateur
3. Ou allez directement sur : `http://localhost:3000/admin/login`

### Étape 2 : Accéder aux paramètres système
1. Une fois connecté, allez sur : `http://localhost:3000/admin/settings`
2. Ou depuis le dashboard admin, cliquez sur **"Paramètres système"** dans les actions rapides

### Étape 3 : Configurer le compte bancaire
Dans la section **"Compte bancaire du centre"**, remplissez les champs :

#### Champs obligatoires :
- **Nom de la banque** : 
  - Exemples : `Société Générale Tchad`, `Banque Commerciale du Chari`, `Ecobank Tchad`, etc.
- **Numéro de compte** :
  - Le numéro de compte bancaire de votre entreprise
  - Exemple : `1234567890` ou `12-34567-89` (selon le format de votre banque)

#### Champs optionnels (mais recommandés) :
- **Titulaire du compte** :
  - Exemple : `Expérience Tech` (déjà pré-rempli)
- **IBAN** (si applicable) :
  - Code IBAN international
  - Exemple : `TD11 1234 5678 9012 3456 7890`
- **Code SWIFT** (si applicable) :
  - Code SWIFT/BIC de la banque
  - Exemple : `SOGETDXT` (pour Société Générale Tchad)
- **Agence** :
  - Nom de l'agence bancaire
  - Exemple : `N'Djamena Centre`, `Avenue Charles de Gaulle`, etc.

#### Activation :
- ✅ Cochez **"Compte bancaire actif"** pour activer l'affichage dans les paiements

### Étape 4 : Sauvegarder
1. Cliquez sur le bouton **"Enregistrer les paramètres"** en bas de la page
2. Attendez la confirmation "Paramètres enregistrés avec succès"

## ✅ Vérification
1. Allez sur une page avec paiement (ex: `/cart`)
2. Cliquez sur **"Procéder au paiement"**
3. Sélectionnez **"Virement bancaire"**
4. Vérifiez que les informations s'affichent correctement :
   - ✅ **Banque** : [Nom de votre banque]
   - ✅ **Compte** : [Numéro de compte]
   - ✅ **Bénéficiaire** : Expérience Tech (ou le nom que vous avez configuré)

## 🔧 Configuration alternative : Via l'API

Si vous préférez configurer via l'API directement :

### Récupérer les paramètres actuels
```bash
curl -X GET http://localhost:5000/api/settings/payment \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN"
```

### Mettre à jour les paramètres bancaires
```bash
curl -X PUT http://localhost:5000/api/settings/payment \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankAccount": {
      "bankName": "Société Générale Tchad",
      "accountNumber": "1234567890",
      "accountHolderName": "Expérience Tech",
      "iban": "TD11 1234 5678 9012 3456 7890",
      "swiftCode": "SOGETDXT",
      "branch": "N'\''Djamena Centre",
      "isActive": true
    }
  }'
```

## 📝 Exemples de Codes SWIFT pour le Tchad

- **Société Générale Tchad** : `SOGETDXT`
- **Banque Commerciale du Chari** : `BCCATDXT`
- **Ecobank Tchad** : `ECBKTDXT`
- **Banque Sahélo-Saharienne pour l'Investissement et le Commerce** : `BSICTDXT`

## ⚠️ Notes importantes

1. **Sécurité** : Les informations bancaires sont stockées dans la base de données. Assurez-vous que votre serveur backend est sécurisé.

2. **Permissions** : Seuls les administrateurs peuvent modifier ces paramètres.

3. **Validation** : Le système valide que les informations sont bien formatées avant de les sauvegarder.

4. **Affichage** : Les informations bancaires ne s'affichent que si le compte bancaire est actif (`isActive: true`).

## 🆘 Problèmes courants

### Les informations ne s'affichent pas après la configuration
- Vérifiez que **"Compte bancaire actif"** est bien coché
- Rafraîchissez la page du panier
- Vérifiez la console du navigateur pour les erreurs

### "Non configuré" s'affiche toujours
- Vérifiez que vous avez bien sauvegardé les paramètres
- Vérifiez que vous êtes bien connecté en tant qu'admin lors de la configuration
- Vérifiez les logs du backend pour les erreurs

### Erreur 401 lors de l'accès aux paramètres
- Assurez-vous d'être connecté avec un compte administrateur
- Vérifiez que votre token d'authentification est valide

