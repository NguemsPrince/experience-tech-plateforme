const express = require('express');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { body, validationResult } = require('express-validator');
const ChatbotQuestion = require('../models/ChatbotQuestion');
const { sanitizeInput } = require('../utils/security');

const router = express.Router();

// @desc    Get predefined questions
// @route   GET /api/chatbot/questions
// @access  Public
router.get('/questions', async (req, res) => {
  try {
    const questions = [
      {
        id: 1,
        text: "Quels sont vos services ?",
        category: "services",
        icon: "🔧"
      },
      {
        id: 2,
        text: "Comment puis-je vous contacter ?",
        category: "contact",
        icon: "📞"
      },
      {
        id: 3,
        text: "Proposez-vous des formations ?",
        category: "training",
        icon: "🎓"
      },
      {
        id: 4,
        text: "Quels sont vos tarifs ?",
        category: "pricing",
        icon: "💰"
      },
      {
        id: 5,
        text: "Où êtes-vous situés ?",
        category: "location",
        icon: "📍"
      },
      {
        id: 6,
        text: "Avez-vous des certifications ?",
        category: "certifications",
        icon: "🏆"
      }
    ];

    sendSuccessResponse(res, 200, 'Questions prédéfinies récupérées', questions);
  } catch (error) {
    console.error('Get chatbot questions error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get response for predefined question with follow-up questions
// @route   GET /api/chatbot/response/:category
// @access  Public
router.get('/response/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const responses = {
      services: {
        title: "Nos Services",
        content: "Nous proposons une gamme complète de services :\n\n🔧 **Services Numériques**\n- Développement Web & Mobile\n- Logiciels sur mesure\n- Maintenance IT\n- Conseil Technologique\n\n🎓 **Formations**\n- Formations IT\n- Bureautique\n- Certifications\n- Formations sur mesure\n\n🖨️ **Impression & Design**\n- Affiches & Banderoles\n- Cartes de visite\n- Brochures\n- Emballages\n\n🚛 **Commerce**\n- Import équipements\n- Distribution\n- Conseil commercial\n\n🌐 **Réseaux**\n- Configuration réseaux\n- Supervision\n- Maintenance\n- Sécurité",
        followUpQuestions: [
          {
            id: 1,
            text: "Développement web - Tarifs et délais",
            category: "web-dev",
            icon: "💻"
          },
          {
            id: 2,
            text: "Formations disponibles actuellement",
            category: "training-available",
            icon: "📚"
          },
          {
            id: 3,
            text: "Demander un devis personnalisé",
            category: "quote",
            icon: "📋"
          }
        ]
      },
      contact: {
        title: "Nous Contacter",
        content: "Vous pouvez nous contacter de plusieurs façons :\n\n📞 **Téléphone** : +235 60 29 05 10\n📧 **Email** : contact@experiencetech-tchad.com\n📍 **Adresse** : Abéché, Tchad\n🌐 **Site Web** : www.experiencetech-tchad.com\n\n⏰ **Horaires** :\nLundi - Vendredi : 8h00 - 18h00\nSamedi : 8h00 - 14h00\n\n💬 **Chat en ligne** : Disponible 24/7",
        followUpQuestions: [
          {
            id: 1,
            text: "Prendre un rendez-vous",
            category: "appointment",
            icon: "📅"
          },
          {
            id: 2,
            text: "Support technique urgent",
            category: "urgent-support",
            icon: "🚨"
          },
          {
            id: 3,
            text: "Demander un rappel",
            category: "callback",
            icon: "📞"
          }
        ]
      },
      training: {
        title: "Nos Formations",
        content: "Nous proposons des formations professionnelles de qualité :\n\n💻 **Formations IT**\n- Programmation (Python, JavaScript, PHP)\n- Développement Web\n- Bases de données\n- Réseaux informatiques\n\n📊 **Bureautique**\n- Microsoft Office\n- Google Workspace\n- Gestion de projets\n\n🏆 **Certifications**\n- Microsoft Certified\n- Cisco Certified\n- CompTIA\n\n🎯 **Formations sur mesure**\n- Adaptées à vos besoins\n- Formation en entreprise\n- Suivi personnalisé",
        followUpQuestions: [
          {
            id: 1,
            text: "Programmation - Détails et prérequis",
            category: "programming-details",
            icon: "💻"
          },
          {
            id: 2,
            text: "Certifications disponibles",
            category: "certifications-available",
            icon: "🏆"
          },
          {
            id: 3,
            text: "Formation en entreprise",
            category: "corporate-training",
            icon: "🏢"
          },
          {
            id: 4,
            text: "Calendrier des formations",
            category: "training-schedule",
            icon: "📅"
          }
        ]
      },
      pricing: {
        title: "Nos Tarifs",
        content: "Nos tarifs sont compétitifs et adaptés au marché tchadien :\n\n💰 **Services Numériques**\n- Développement web : À partir de 500,000 FCFA\n- Applications mobiles : À partir de 1,000,000 FCFA\n- Maintenance : 50,000 FCFA/mois\n\n🎓 **Formations**\n- Formation individuelle : 25,000 FCFA/jour\n- Formation en groupe : 15,000 FCFA/personne/jour\n- Certification : 100,000 FCFA\n\n🖨️ **Impression**\n- Cartes de visite : 1,000 FCFA/100\n- Affiches : 2,000 FCFA/m²\n- Brochures : 500 FCFA/page\n\n*Tarifs indicatifs, devis gratuit sur demande*",
        followUpQuestions: [
          {
            id: 1,
            text: "Devis détaillé pour mon projet",
            category: "detailed-quote",
            icon: "💰"
          },
          {
            id: 2,
            text: "Paiement échelonné possible ?",
            category: "payment-plan",
            icon: "💳"
          },
          {
            id: 3,
            text: "Réductions pour étudiants",
            category: "student-discount",
            icon: "🎓"
          }
        ]
      },
      location: {
        title: "Notre Localisation",
        content: "Nous sommes situés à Abéché, Tchad :\n\n📍 **Adresse complète**\nQuartier Centre, Abéché\nRégion du Ouaddaï, Tchad\n\n🚗 **Accès**\n- Facilement accessible en voiture\n- Parking disponible\n- Transport public à proximité\n\n🌍 **Zone de service**\n- Abéché et environs\n- N'Djamena (sur demande)\n- Autres villes du Tchad\n\n📱 **Contact local**\n+235 60 29 05 10",
        followUpQuestions: [
          {
            id: 1,
            text: "Itinéraire détaillé",
            category: "directions",
            icon: "🗺️"
          },
          {
            id: 2,
            text: "Services à domicile",
            category: "home-service",
            icon: "🏠"
          },
          {
            id: 3,
            text: "Parking et accès handicapés",
            category: "accessibility",
            icon: "♿"
          }
        ]
      },
      certifications: {
        title: "Nos Certifications",
        content: "Nous sommes certifiés et reconnus :\n\n🏆 **Certifications Professionnelles**\n- Microsoft Partner\n- Cisco Certified\n- CompTIA Authorized\n- Google Partner\n\n📜 **Agréments**\n- Agréé par le Ministère de l'Éducation\n- Membre de l'Association des Entreprises IT du Tchad\n- Certifié ISO 9001\n\n🎓 **Formations Certifiantes**\n- Microsoft Office Specialist\n- Cisco CCNA\n- CompTIA A+\n- Google Analytics\n\n✅ **Garanties**\n- Certificats reconnus internationalement\n- Suivi post-formation\n- Support technique",
        followUpQuestions: [
          {
            id: 1,
            text: "Voir les certificats",
            category: "view-certificates",
            icon: "📜"
          },
          {
            id: 2,
            text: "Processus de certification",
            category: "certification-process",
            icon: "🔄"
          },
          {
            id: 3,
            text: "Reconnaissance internationale",
            category: "international-recognition",
            icon: "🌍"
          }
        ]
      },
      // Nouvelles catégories pour les questions de suivi
      "web-dev": {
        title: "Développement Web",
        content: "**Développement Web - Détails**\n\n💻 **Technologies utilisées :**\n- Frontend : React, Vue.js, Angular\n- Backend : Node.js, PHP, Python\n- Bases de données : MySQL, MongoDB, PostgreSQL\n- Mobile : React Native, Flutter\n\n⏰ **Délais typiques :**\n- Site vitrine : 2-4 semaines\n- Site e-commerce : 6-8 semaines\n- Application web : 8-12 semaines\n- Application mobile : 10-16 semaines\n\n💰 **Tarifs :**\n- Site vitrine : 500,000 - 1,500,000 FCFA\n- E-commerce : 1,000,000 - 3,000,000 FCFA\n- Application sur mesure : Sur devis",
        followUpQuestions: [
          {
            id: 1,
            text: "Exemples de projets réalisés",
            category: "portfolio",
            icon: "🎨"
          },
          {
            id: 2,
            text: "Processus de développement",
            category: "development-process",
            icon: "🔄"
          }
        ]
      },
      "training-available": {
        title: "Formations Disponibles",
        content: "**Formations Actuellement Disponibles**\n\n📅 **Prochaines sessions :**\n\n🎓 **Formation Python**\n- Début : 15 Octobre 2024\n- Durée : 4 semaines\n- Horaires : 9h-17h (Lun-Ven)\n- Places : 12 participants\n\n💻 **Développement Web**\n- Début : 22 Octobre 2024\n- Durée : 6 semaines\n- Horaires : 14h-18h (Lun-Mer-Ven)\n- Places : 15 participants\n\n📊 **Excel Avancé**\n- Début : 28 Octobre 2024\n- Durée : 2 semaines\n- Horaires : 9h-13h (Sam)\n- Places : 10 participants",
        followUpQuestions: [
          {
            id: 1,
            text: "S'inscrire à une formation",
            category: "register-training",
            icon: "📝"
          },
          {
            id: 2,
            text: "Prérequis nécessaires",
            category: "prerequisites",
            icon: "📋"
          }
        ]
      },
      "appointment": {
        title: "Prendre Rendez-vous",
        content: "**Planification de Rendez-vous**\n\n📅 **Créneaux disponibles cette semaine :**\n\n🔸 **Lundi 14 Octobre**\n- 9h00 - 10h00 ✅\n- 14h00 - 15h00 ✅\n- 16h00 - 17h00 ✅\n\n🔸 **Mardi 15 Octobre**\n- 10h00 - 11h00 ✅\n- 15h00 - 16h00 ✅\n\n🔸 **Mercredi 16 Octobre**\n- 9h00 - 10h00 ✅\n- 14h00 - 15h00 ✅\n\n💬 **Pour réserver :**\nContactez-nous au +235 60 29 05 10 ou par email à contact@experiencetech-tchad.com",
        followUpQuestions: [
          {
            id: 1,
            text: "Réserver un créneau",
            category: "book-slot",
            icon: "📅"
          },
          {
            id: 2,
            text: "Types de rendez-vous",
            category: "appointment-types",
            icon: "📋"
          }
        ]
      }
    };

    const response = responses[category];
    
    if (!response) {
      return sendErrorResponse(res, 404, 'Catégorie non trouvée');
    }

    sendSuccessResponse(res, 200, 'Réponse récupérée', response);
  } catch (error) {
    console.error('Get chatbot response error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Submit custom question
// @route   POST /api/chatbot/custom-question
// @access  Public
router.post('/custom-question', [
  body('question').notEmpty().withMessage('La question est requise').isLength({ max: 500 }).withMessage('La question ne peut pas dépasser 500 caractères'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const { question, email, name } = req.body;

    // Sanitize inputs
    const sanitizedData = {
      question: sanitizeInput(question),
      email: email ? email.toLowerCase().trim() : undefined,
      name: name ? sanitizeInput(name) : undefined
    };

    // Get IP address and user agent for tracking
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Save question to database
    const chatbotQuestion = await ChatbotQuestion.create({
      question: sanitizedData.question,
      email: sanitizedData.email,
      name: sanitizedData.name,
      status: 'new',
      source: 'website',
      ipAddress: ipAddress,
      userAgent: userAgent,
      user: req.user ? req.user.id : null // Link to user if authenticated
    });

    const response = {
      questionId: chatbotQuestion._id,
      message: "Votre question a été reçue avec succès !",
      details: {
        question: sanitizedData.question,
        status: "En cours de traitement",
        estimatedResponse: "24 heures",
        nextSteps: [
          "Notre équipe d'experts examine votre question",
          "Nous vous répondrons par email si fourni",
          "Vous pouvez aussi nous contacter directement"
        ]
      },
      followUpQuestions: [
        {
          id: 1,
          text: "Poser une autre question",
          category: "another-question",
          icon: "❓"
        },
        {
          id: 2,
          text: "Demander un rappel",
          category: "callback",
          icon: "📞"
        },
        {
          id: 3,
          text: "Consulter nos services",
          category: "services",
          icon: "🔧"
        }
      ]
    };

    sendSuccessResponse(res, 201, 'Question soumise avec succès', response);
  } catch (error) {
    console.error('Submit custom question error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get conversation history
// @route   GET /api/chatbot/history
// @access  Public
router.get('/history', async (req, res) => {
  try {
    // In a real app, you'd retrieve from database
    const history = [];
    
    sendSuccessResponse(res, 200, 'Historique récupéré', history);
  } catch (error) {
    console.error('Get conversation history error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Save conversation
// @route   POST /api/chatbot/save-conversation
// @access  Public
router.post('/save-conversation', [
  body('messages').isArray().withMessage('Messages must be an array'),
  body('sessionId').optional().isString().withMessage('Session ID must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const { messages, sessionId } = req.body;

    // In a real app, you'd save to database
    console.log('Saving conversation:', {
      sessionId: sessionId || 'anonymous',
      messageCount: messages.length,
      timestamp: new Date().toISOString()
    });

    sendSuccessResponse(res, 200, 'Conversation sauvegardée', { sessionId });
  } catch (error) {
    console.error('Save conversation error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;