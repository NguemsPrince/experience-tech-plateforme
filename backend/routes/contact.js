const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { sanitizeInput } = require('../utils/security');
const ContactMessage = require('../models/ContactMessage');
// const { sendContactEmail } = require('../utils/email');

const router = express.Router();

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Numéro de téléphone invalide'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Le sujet est requis')
    .isLength({ max: 200 })
    .withMessage('Le sujet ne peut pas dépasser 200 caractères'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Le message est requis')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Le message doit contenir entre 10 et 1000 caractères')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const { name, email, phone, subject, message, category } = req.body;

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.toLowerCase().trim(),
      phone: phone ? sanitizeInput(phone) : undefined,
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      category: category || 'general'
    };

    // Get IP address and user agent for tracking
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Save to database
    const contactMessage = await ContactMessage.create({
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      subject: sanitizedData.subject,
      message: sanitizedData.message,
      category: sanitizedData.category,
      status: 'new',
      source: 'website',
      ipAddress: ipAddress,
      userAgent: userAgent,
      // Link to user if authenticated
      user: req.user ? req.user.id : null
    });

    // TODO: Send email notification
    // try {
    //   await sendContactEmail({
    //     name: sanitizedData.name,
    //     email: sanitizedData.email,
    //     phone: sanitizedData.phone,
    //     subject: sanitizedData.subject,
    //     message: sanitizedData.message
    //   });
    // } catch (emailError) {
    //   console.error('Error sending contact email:', emailError);
    //   // Continue even if email fails
    // }

    sendSuccessResponse(res, 200, 'Message envoyé avec succès', {
      id: contactMessage._id,
      timestamp: contactMessage.createdAt
    });

  } catch (error) {
    console.error('Contact form error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors de l\'envoi du message');
  }
});

// @desc    Get contact information
// @route   GET /api/contact/info
// @access  Public
router.get('/info', async (req, res) => {
  try {
    const contactInfo = {
      address: {
        street: 'Avenue de la Paix',
        city: 'Yaoundé',
        state: 'Centre',
        zipCode: '00000',
        country: 'Cameroun'
      },
      phone: [
        '+237 123 456 789',
        '+237 987 654 321'
      ],
      email: [
        'contact@experiencetech.cm',
        'info@experiencetech.cm',
        'support@experiencetech.cm'
      ],
      hours: {
        weekdays: '8h00 - 18h00',
        saturday: '9h00 - 13h00',
        sunday: 'Fermé'
      },
      social: {
        facebook: 'https://facebook.com/experiencetech',
        linkedin: 'https://linkedin.com/company/experiencetech',
        whatsapp: '+237123456789',
        youtube: 'https://youtube.com/experiencetech',
        twitter: 'https://twitter.com/experiencetech'
      }
    };

    sendSuccessResponse(res, 200, 'Informations de contact récupérées', contactInfo);

  } catch (error) {
    console.error('Get contact info error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;
