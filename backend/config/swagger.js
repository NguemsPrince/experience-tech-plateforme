/**
 * Configuration Swagger/OpenAPI pour la documentation API
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expérience Tech API',
      version: '1.0.0',
      description: `
# API Expérience Tech

API complète pour la plateforme Expérience Tech - Votre partenaire numérique de confiance au Tchad.

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Pour accéder aux endpoints protégés :

1. Inscrivez-vous via \`POST /api/auth/register\`
2. Connectez-vous via \`POST /api/auth/login\`
3. Utilisez le token reçu dans l'en-tête: \`Authorization: Bearer <token>\`

## Méthodes de Paiement

- **Stripe** : Cartes bancaires (Visa, MasterCard)
- **Airtel Money** : Paiement mobile money Tchad
- **Moov Money** : Paiement mobile money Tchad
- **Cartes prépayées** : Codes uniques

## Base URL

- **Développement**: \`http://localhost:5000/api\`
- **Production**: \`https://api.experiencetech-tchad.com/api\`
      `,
      contact: {
        name: 'Expérience Tech Support',
        email: 'Contact@experiencetech-tchad.com',
        url: 'https://experiencetech-tchad.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api',
        description: 'Serveur API'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT obtenu via /api/auth/login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            _id: { type: 'string', description: 'ID de l\'utilisateur' },
            email: { type: 'string', format: 'email', description: 'Email de l\'utilisateur' },
            firstName: { type: 'string', description: 'Prénom' },
            lastName: { type: 'string', description: 'Nom' },
            phone: { type: 'string', description: 'Numéro de téléphone' },
            role: { 
              type: 'string', 
              enum: ['client', 'student', 'admin', 'super_admin'], 
              description: 'Rôle de l\'utilisateur',
              default: 'client'
            },
            isActive: { type: 'boolean', description: 'Statut actif', default: true },
            createdAt: { type: 'string', format: 'date-time', description: 'Date de création' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID du cours' },
            title: { type: 'string', description: 'Titre du cours' },
            description: { type: 'string', description: 'Description' },
            price: { type: 'number', description: 'Prix en FCFA' },
            duration: { type: 'string', description: 'Durée' },
            level: { 
              type: 'string', 
              enum: ['débutant', 'intermédiaire', 'avancé'], 
              description: 'Niveau' 
            },
            category: { type: 'string', description: 'Catégorie' },
            instructor: { type: 'object', description: 'Instructeur' },
            isActive: { type: 'boolean', description: 'Cours actif' },
            currentStudents: { type: 'number', description: 'Nombre d\'étudiants inscrits' },
            maxStudents: { type: 'number', description: 'Nombre maximum d\'étudiants' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID du produit' },
            name: { type: 'string', description: 'Nom du produit' },
            description: { type: 'string', description: 'Description' },
            price: { type: 'number', description: 'Prix en FCFA' },
            category: { type: 'string', description: 'Catégorie' },
            type: { type: 'string', description: 'Type de produit' },
            stock: { type: 'number', description: 'Stock disponible' },
            isActive: { type: 'boolean', description: 'Produit actif' }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID du paiement' },
            amount: { type: 'number', description: 'Montant en FCFA' },
            currency: { 
              type: 'string', 
              enum: ['XAF', 'USD', 'EUR'], 
              description: 'Devise',
              default: 'XAF'
            },
            status: { 
              type: 'string', 
              enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'], 
              description: 'Statut du paiement' 
            },
            paymentMethod: { 
              type: 'string', 
              enum: ['airtel_money', 'moov_money', 'bank_transfer', 'prepaid_card'], 
              description: 'Méthode de paiement (Airtel Money, Tigo/Moov Money, Virement bancaire, Carte prépayée)' 
            },
            paymentProvider: { type: 'string', description: 'Fournisseur de paiement' },
            transactionId: { type: 'string', description: 'ID de transaction unique' },
            providerTransactionId: { type: 'string', description: 'ID de transaction du provider' },
            createdAt: { type: 'string', format: 'date-time', description: 'Date de création' },
            paidAt: { type: 'string', format: 'date-time', description: 'Date de paiement' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', description: 'Message d\'erreur' },
            errors: { type: 'array', items: { type: 'string' }, description: 'Détails des erreurs' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', description: 'Message de succès' },
            data: { type: 'object', description: 'Données retournées' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', format: 'password', example: 'Password123!' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', format: 'password', example: 'Password123!' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            phone: { type: 'string', example: '+235 60 29 05 10' },
            role: { type: 'string', enum: ['client', 'student'], default: 'client' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentification et autorisation' },
      { name: 'Users', description: 'Gestion des utilisateurs' },
      { name: 'Courses', description: 'Gestion des formations' },
      { name: 'Products', description: 'Gestion des produits' },
      { name: 'Payments', description: 'Gestion des paiements (Stripe, Airtel Money, Moov Money)' },
      { name: 'Orders', description: 'Gestion des commandes' },
      { name: 'Forum', description: 'Forum et discussions' },
      { name: 'Cart', description: 'Gestion du panier' },
      { name: 'Admin', description: 'Administration (nécessite rôle admin)' }
    ]
  },
  apis: [
    './routes/*.js',
    './server.js'
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerOptions
};

