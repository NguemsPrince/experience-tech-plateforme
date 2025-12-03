# Guide des Cartes Prépayées

## Vue d'ensemble

Le système de cartes prépayées permet aux utilisateurs de payer leurs formations avec des codes uniques générés manuellement ou automatiquement.

## Fonctionnalités

- ✅ Génération automatique de codes uniques
- ✅ Validation en temps réel
- ✅ Utilisation unique
- ✅ Gestion de l'expiration
- ✅ Traçabilité complète
- ✅ Interface admin complète

## Utilisation

### Pour les Utilisateurs

1. **Acheter une formation**
   - Allez sur la page de la formation
   - Cliquez sur "Acheter"
   - Sélectionnez "Carte prépayée"
   - Entrez votre code de carte
   - Validez le paiement

2. **Vérifier vos paiements**
   - Allez dans "Mes Formations"
   - Cliquez sur l'onglet "Historique des Paiements"
   - Consultez tous vos paiements

### Pour les Admins

#### Créer une carte prépayée

**Via l'API :**
```bash
curl -X POST http://localhost:5000/api/prepaid-cards \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 100000,
    "currency": "XAF",
    "notes": "Carte de test"
  }'
```

**Via Node.js (script) :**
```javascript
const mongoose = require('mongoose');
const PrepaidCard = require('./models/PrepaidCard');

// Générer une carte
const card = new PrepaidCard({
  code: PrepaidCard.generateCode('EXP'), // Génère EXPRANDOM12
  value: 100000,
  currency: 'XAF',
  status: 'active'
});

await card.save();
```

#### Lister les cartes

```bash
curl -X GET http://localhost:5000/api/prepaid-cards \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Paramètres de requête :**
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre par page (défaut: 20)
- `status` : Filtrer par statut (active, used, expired, disabled)

#### Valider un code

```bash
curl -X POST http://localhost:5000/api/prepaid-cards/validate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "EXP123456789"}'
```

## Structure des codes

Format : `EXP` + 12 caractères alphanumériques

**Exemple :** `EXPP79GI1KRCRYJ`

- **EXP** : Préfixe identifiant le type de carte
- **12 caractères** : Code aléatoire unique

## Statuts des cartes

| Statut | Description |
|--------|-------------|
| `active` | Carte disponible pour utilisation |
| `used` | Carte déjà utilisée (ne peut plus être utilisée) |
| `expired` | Carte expirée (date passée) |
| `disabled` | Carte désactivée manuellement |

## Sécurité

### Validations automatiques

1. **Vérification d'existence** : Le code existe dans la base de données
2. **Vérification de statut** : La carte est active
3. **Vérification d'expiration** : La carte n'a pas expiré
4. **Vérification du montant** : Le montant couvre le prix du cours
5. **Vérification d'utilisation** : La carte n'a pas déjà été utilisée

### Marquage automatique

- Lorsqu'une carte est utilisée, elle est automatiquement marquée comme `used`
- Les informations suivantes sont enregistrées :
  - `usedBy` : ID de l'utilisateur
  - `usedAt` : Date et heure d'utilisation

## Exemples d'utilisation

### Exemple 1 : Créer une carte de test

```javascript
const PrepaidCard = require('./models/PrepaidCard');

const card = await PrepaidCard.create({
  code: PrepaidCard.generateCode('EXP'),
  value: 50000,
  currency: 'XAF',
  status: 'active'
});

console.log(`Carte créée : ${card.code}`);
// Sortie : Carte créée : EXPRANDOM12CHAR
```

### Exemple 2 : Valider et utiliser une carte

```javascript
const PrepaidCard = require('./models/PrepaidCard');

// Trouver et valider la carte
const card = await PrepaidCard.findOne({ code: 'EXP123456789' });

if (card.isValid) {
  // Utiliser la carte
  await card.use(userId);
  console.log('Carte utilisée avec succès');
} else {
  console.log('Carte invalide');
}
```

### Exemple 3 : Payer une formation avec une carte

```javascript
const paymentsService = require('./services/payments');
const prepaidCardsService = require('./services/prepaidCards');

// 1. Valider la carte
const validation = await prepaidCardsService.validate('EXP123456789');

if (validation.success) {
  // 2. Créer le paiement
  const payment = await paymentsService.createPaymentIntent(
    courseId,
    'prepaid_card',
    null,
    'EXP123456789'
  );
  
  console.log('Paiement effectué avec succès');
}
```

## Gestion de l'expiration

Pour définir une date d'expiration :

```javascript
const card = await PrepaidCard.create({
  code: PrepaidCard.generateCode('EXP'),
  value: 100000,
  currency: 'XAF',
  status: 'active',
  expiresAt: new Date('2025-12-31') // Expire le 31 décembre 2025
});
```

## Statistiques et rapports

### Compter les cartes par statut

```javascript
const PrepaidCard = require('./models/PrepaidCard');

const stats = await PrepaidCard.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      totalValue: { $sum: '$value' }
    }
  }
]);

console.log(stats);
// Sortie : [{ _id: 'active', count: 50, totalValue: 5000000 }, ...]
```

### Historique d'utilisation

```javascript
const PrepaidCard = require('./models/PrepaidCard');

const usedCards = await PrepaidCard.find({ status: 'used' })
  .populate('usedBy', 'firstName lastName email')
  .sort({ usedAt: -1 })
  .limit(20);

usedCards.forEach(card => {
  console.log(`${card.code} utilisé par ${card.usedBy.firstName} le ${card.usedAt}`);
});
```

## Dépannage

### Erreur : "Code de carte invalide"

**Solutions :**
1. Vérifiez que le code est en majuscules
2. Vérifiez qu'il n'y a pas d'espaces
3. Vérifiez que le code existe dans la base de données

### Erreur : "Cette carte a déjà été utilisée"

**Cause :** Une carte ne peut être utilisée qu'une seule fois.

**Solution :** Utilisez une nouvelle carte ou vérifiez votre historique de paiements.

### Erreur : "Cette carte a expiré"

**Cause :** La date d'expiration de la carte est passée.

**Solution :** Utilisez une carte active ou demandez un remboursement.

### Erreur : "Montant insuffisant"

**Cause :** Le montant de la carte ne couvre pas le prix du cours.

**Solution :** Utilisez une carte avec un montant suffisant ou combinez avec une autre méthode de paiement.

## API Reference

### POST /api/prepaid-cards/validate

Valider un code de carte.

**Headers :**
- `Authorization: Bearer TOKEN`

**Body :**
```json
{
  "code": "EXP123456789"
}
```

**Response (200) :**
```json
{
  "success": true,
  "message": "Carte valide",
  "data": {
    "card": {
      "code": "EXP123456789",
      "value": 100000,
      "currency": "XAF",
      "isValid": true
    }
  }
}
```

### POST /api/prepaid-cards

Créer une carte prépayée (admin only).

**Headers :**
- `Authorization: Bearer TOKEN`

**Body :**
```json
{
  "value": 100000,
  "currency": "XAF",
  "expiresAt": "2025-12-31",
  "notes": "Carte de test"
}
```

**Response (201) :**
```json
{
  "success": true,
  "message": "Carte prépayée créée avec succès",
  "data": {
    "card": {
      "_id": "...",
      "code": "EXPABC123DEF456",
      "value": 100000,
      "status": "active",
      ...
    }
  }
}
```

## Base de données

### Collection : prepaidcards

**Index :**
- `code` (unique)
- `status`
- `usedBy`
- `expiresAt`
- `createdAt`

**Exemple de document :**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "code": "EXPABC123DEF456",
  "value": 100000,
  "currency": "XAF",
  "status": "active",
  "usedBy": null,
  "usedAt": null,
  "expiresAt": null,
  "createdAt": "2025-10-31T12:00:00.000Z",
  "createdBy": "507f1f77bcf86cd799439012",
  "notes": "Carte de test",
  "updatedAt": "2025-10-31T12:00:00.000Z"
}
```

## Support

Pour toute question ou problème :
1. Consultez la documentation complète dans `AMELIORATIONS_NAVIGATION_PAIEMENT.md`
2. Vérifiez les logs serveur
3. Testez avec la carte de test fournie

---

**Version :** 1.0  
**Date :** 31/10/2025


