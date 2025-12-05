const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { sanitizeInput, isValidEmail, isValidPhone } = require('../utils/security');
const QuoteRequest = require('../models/QuoteRequest');

const router = express.Router();

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, 'Données invalides', errors.array());
  }
  return null;
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = [
      {
        id: 'digital',
        name: 'Services Numériques',
        description: 'Solutions numériques complètes pour votre transformation digitale',
        icon: 'CogIcon',
        features: [
          'Développement Web & Mobile',
          'Logiciels sur mesure',
          'Maintenance IT',
          'Conseil Technologique'
        ],
        pricing: {
          consultation: 'Gratuit',
          development: 'Sur devis',
          maintenance: 'À partir de 50 000 FCFA/mois'
        },
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker']
      },
      {
        id: 'training',
        name: 'Formations',
        description: 'Formations professionnelles certifiantes',
        icon: 'AcademicCapIcon',
        features: [
          'Formations IT',
          'Bureautique',
          'Certifications',
          'Formations sur mesure'
        ],
        pricing: {
          individual: 'À partir de 25 000 FCFA',
          group: 'À partir de 15 000 FCFA/personne',
          certification: 'À partir de 50 000 FCFA'
        },
        duration: {
          basic: '1-2 semaines',
          intermediate: '1-2 mois',
          advanced: '3-6 mois'
        }
      },
      {
        id: 'printing',
        name: 'Impression & Design',
        description: 'Services d\'impression et design professionnel',
        icon: 'PrinterIcon',
        features: [
          'Affiches & Banderoles',
          'Cartes de visite',
          'Brochures',
          'Emballages'
        ],
        pricing: {
          businessCards: 'À partir de 2 000 FCFA',
          posters: 'À partir de 5 000 FCFA',
          banners: 'À partir de 15 000 FCFA'
        },
        formats: ['A4', 'A3', 'A2', 'A1', 'A0', 'Personnalisé']
      },
      {
        id: 'maintenance',
        name: 'Maintenance Informatique',
        description: 'Support technique et maintenance préventive de vos équipements IT',
        icon: 'WrenchScrewdriverIcon',
        features: [
          'Support technique 24/7',
          'Maintenance préventive',
          'Réparation d\'équipements',
          'Mise à jour et optimisation'
        ],
        pricing: {
          support: 'Sur devis',
          intervention: 'Sur devis',
          maintenance: 'Sur devis'
        },
        services: [
          'Support technique à distance',
          'Maintenance préventive',
          'Réparation matérielle',
          'Mise à jour logicielle',
          'Optimisation système'
        ]
      },
      {
        id: 'networks',
        name: 'Réseaux & Connectivité',
        description: 'Solutions réseaux et connectivité',
        icon: 'WifiIcon',
        features: [
          'Configuration réseaux',
          'Supervision',
          'Maintenance',
          'Sécurité'
        ],
        services: [
          'Installation réseau local',
          'Configuration routeurs',
          'Sécurité réseau',
          'Maintenance préventive'
        ]
      },
      {
        id: 'commerce',
        name: 'Commerce & Import-Export',
        description: 'Commerce et import-export de matériel IT',
        icon: 'TruckIcon',
        features: [
          'Import équipements',
          'Distribution',
          'Conseil commercial',
          'Logistique'
        ],
        categories: [
          'Ordinateurs et accessoires',
          'Équipements réseau',
          'Matériel de bureau',
          'Logiciels'
        ]
      }
    ];

    sendSuccessResponse(res, 200, 'Services récupérés avec succès', services);

  } catch (error) {
    console.error('Get services error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, fetch from database
    const service = {
      id,
      name: 'Service détaillé',
      description: 'Description complète du service',
      // ... more details
    };

    if (!service) {
      return sendErrorResponse(res, 404, 'Service non trouvé');
    }

    sendSuccessResponse(res, 200, 'Service récupéré avec succès', service);

  } catch (error) {
    console.error('Get service error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Request quote for service
// @route   POST /api/services/:id/quote
// @access  Public
router.post('/:id/quote', [
  param('id')
    .notEmpty()
    .withMessage('L\'ID du service est requis'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('phone')
    .optional()
    .custom((value) => {
      if (value && !isValidPhone(value)) {
        throw new Error('Numéro de téléphone invalide');
      }
      return true;
    }),
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Les exigences ne peuvent pas dépasser 2000 caractères'),
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Le budget doit être un nombre')
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;
    const { name, email, phone, requirements, budget } = req.body;

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.toLowerCase().trim(),
      phone: phone ? sanitizeInput(phone) : undefined,
      requirements: requirements ? sanitizeInput(requirements) : undefined,
      budget: budget ? parseFloat(budget) : undefined
    };

    // Get IP address and user agent for tracking
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Save quote request to database
    const quoteRequest = await QuoteRequest.create({
      serviceId: id,
      serviceName: id, // TODO: Fetch actual service name from DB if service model exists
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      requirements: sanitizedData.requirements,
      budget: sanitizedData.budget,
      status: 'pending',
      source: 'website',
      ipAddress: ipAddress,
      userAgent: userAgent,
      // Link to user if authenticated
      user: req.user ? req.user.id : null
    });
    
    // Send email notification to admin
    try {
      const { sendQuoteRequestNotification } = require('../services/emailService');
      const serviceName = id; // In a real app, fetch service name from DB
      await sendQuoteRequestNotification(serviceName, sanitizedData);
    } catch (emailError) {
      console.error('Error sending quote request notification:', emailError);
      // Continue even if email fails
    }

    sendSuccessResponse(res, 201, 'Demande de devis envoyée avec succès', {
      quoteId: quoteRequest._id,
      serviceId: id,
      timestamp: quoteRequest.createdAt
    });

  } catch (error) {
    console.error('Request quote error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;
