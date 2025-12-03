const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const User = require('../models/User');

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get client dashboard data
// @route   GET /api/client/dashboard
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const dashboardData = {
      user: req.user,
      projects: [],
      invoices: [],
      supportTickets: [],
      stats: {
        activeProjects: 0,
        completedProjects: 0,
        totalInvoices: 0,
        pendingInvoices: 0
      }
    };

    sendSuccessResponse(res, 200, 'Tableau de bord récupéré', dashboardData);
  } catch (error) {
    console.error('Get dashboard error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Create new client
// @route   POST /api/client/create
// @access  Private (Admin only)
router.post('/create', [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Le nom de l\'entreprise est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom de l\'entreprise ne peut pas dépasser 100 caractères'),
  
  body('contactName')
    .trim()
    .notEmpty()
    .withMessage('Le nom du contact est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom du contact ne peut pas dépasser 100 caractères'),
  
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Numéro de téléphone invalide'),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse est requise'),
  
  body('sector')
    .trim()
    .notEmpty()
    .withMessage('Le secteur d\'activité est requis')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const { companyName, contactName, email, phone, address, sector } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 400, 'Un client avec cet email existe déjà');
    }

    // Create client user
    const clientData = {
      firstName: contactName.split(' ')[0] || contactName,
      lastName: contactName.split(' ').slice(1).join(' ') || '',
      email,
      phone,
      role: 'client',
      company: {
        name: companyName,
        position: 'Contact'
      },
      address: {
        street: address,
        country: 'Cameroon'
      },
      preferences: {
        language: 'fr',
        notifications: {
          email: true,
          sms: false
        }
      }
    };

    const client = await User.create(clientData);

    // Remove password from response
    const clientResponse = {
      id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      company: client.company,
      address: client.address,
      role: client.role,
      createdAt: client.createdAt
    };

    sendSuccessResponse(res, 201, 'Client créé avec succès', clientResponse);

  } catch (error) {
    console.error('Create client error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors de la création du client');
  }
});

// @desc    Get all clients
// @route   GET /api/client/list
// @access  Private (Admin only)
router.get('/list', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 });

    sendSuccessResponse(res, 200, 'Liste des clients récupérée', clients);
  } catch (error) {
    console.error('Get clients error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get projects (alias for /client/projects)
// @route   GET /api/client/projects
// @access  Private
router.get('/projects', async (req, res) => {
  try {
    const projects = [];
    sendSuccessResponse(res, 200, 'Projets récupérés', projects);
  } catch (error) {
    console.error('Get projects error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get invoices (alias for /client/invoices)
// @route   GET /api/client/invoices
// @access  Private
router.get('/invoices', async (req, res) => {
  try {
    const invoices = [];
    sendSuccessResponse(res, 200, 'Factures récupérées', invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;
