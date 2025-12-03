const express = require('express');
const multer = require('multer');
const path = require('path');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { body, validationResult } = require('express-validator');
const JobApplication = require('../models/JobApplication');
const { sanitizeInput } = require('../utils/security');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/careers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF, DOC, DOCX, JPEG, JPG, PNG sont autorisés'));
    }
  }
});

// @desc    Get all job listings
// @route   GET /api/careers/jobs
// @access  Public
router.get('/jobs', async (req, res) => {
  try {
    const jobs = [
      {
        id: 1,
        title: 'Développeur Full Stack Senior',
        type: 'CDI',
        location: 'Yaoundé',
        salary: '400 000 - 600 000 FCFA',
        description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe dynamique.',
        requirements: [
          '5+ ans d\'expérience en développement web',
          'Maîtrise de React, Node.js, et MongoDB',
          'Expérience avec les architectures microservices',
          'Connaissance des bonnes pratiques DevOps'
        ],
        benefits: [
          'Salaire compétitif',
          'Formation continue',
          'Environnement de travail moderne',
          'Assurance santé'
        ],
        postedAt: '2024-01-15',
        deadline: '2024-02-15',
        status: 'active'
      },
      {
        id: 2,
        title: 'Formateur en Développement Web',
        type: 'CDD',
        location: 'Yaoundé',
        salary: '300 000 - 450 000 FCFA',
        description: 'Rejoignez notre équipe de formation pour transmettre vos connaissances en développement web.',
        requirements: [
          '3+ ans d\'expérience en développement',
          'Expérience en formation ou enseignement',
          'Excellente communication',
          'Certifications techniques appréciées'
        ],
        benefits: [
          'Impact sur la formation des jeunes',
          'Horaires flexibles',
          'Développement professionnel',
          'Prime de performance'
        ],
        postedAt: '2024-01-12',
        deadline: '2024-02-12',
        status: 'active'
      },
      {
        id: 3,
        title: 'Stagiaire Développeur Frontend',
        type: 'Stage',
        location: 'Yaoundé',
        salary: '50 000 FCFA',
        description: 'Stage de 6 mois pour étudiants en informatique souhaitant se spécialiser en développement frontend.',
        requirements: [
          'Étudiant en informatique ou équivalent',
          'Connaissance de base en HTML, CSS, JavaScript',
          'Motivation et esprit d\'équipe',
          'Disponibilité 6 mois'
        ],
        benefits: [
          'Formation pratique',
          'Mentorat personnalisé',
          'Possibilité d\'embauche',
          'Certificat de stage'
        ],
        postedAt: '2024-01-10',
        deadline: '2024-02-10',
        status: 'active'
      }
    ];

    sendSuccessResponse(res, 200, 'Offres d\'emploi récupérées', jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Submit job application
// @route   POST /api/careers/apply
// @access  Public
router.post('/apply', upload.single('cv'), [
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('phone').notEmpty().withMessage('Le téléphone est requis'),
  body('city').notEmpty().withMessage('La ville est requise'),
  body('experience').notEmpty().withMessage('L\'expérience est requise'),
  body('education').notEmpty().withMessage('La formation est requise'),
  body('skills').notEmpty().withMessage('Les compétences sont requises'),
  body('motivation').notEmpty().withMessage('La motivation est requise'),
  body('jobTitle').notEmpty().withMessage('Le poste est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const {
      jobTitle,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      experience,
      education,
      skills,
      motivation,
      coverLetter
    } = req.body;

    // Check if CV file was uploaded
    if (!req.file) {
      return sendErrorResponse(res, 400, 'Le CV est requis');
    }

    // Sanitize inputs
    const sanitizedData = {
      jobTitle: sanitizeInput(jobTitle),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      email: email.toLowerCase().trim(),
      phone: sanitizeInput(phone),
      address: address ? sanitizeInput(address) : undefined,
      city: sanitizeInput(city),
      experience: sanitizeInput(experience),
      education: sanitizeInput(education),
      skills: sanitizeInput(skills),
      motivation: sanitizeInput(motivation),
      coverLetter: coverLetter ? sanitizeInput(coverLetter) : undefined
    };

    // Get IP address and user agent for tracking
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Save application to database
    const application = await JobApplication.create({
      jobTitle: sanitizedData.jobTitle,
      personalInfo: {
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        address: sanitizedData.address || '',
        city: sanitizedData.city
      },
      professionalInfo: {
        experience: sanitizedData.experience,
        education: sanitizedData.education,
        skills: sanitizedData.skills,
        motivation: sanitizedData.motivation,
        coverLetter: sanitizedData.coverLetter || ''
      },
      documents: {
        cv: req.file.filename,
        cvPath: req.file.path
      },
      status: 'pending',
      source: 'website',
      ipAddress: ipAddress,
      userAgent: userAgent,
      user: req.user ? req.user.id : null // Link to user if authenticated
    });

    const response = {
      applicationId: application._id,
      message: "Votre candidature a été soumise avec succès !",
      details: {
        candidate: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
        job: sanitizedData.jobTitle,
        status: "En cours d'examen",
        nextSteps: [
          "Notre équipe RH examine votre candidature",
          "Nous vous contacterons dans les 5-7 jours ouvrés",
          "En cas de présélection, un entretien sera programmé"
        ],
        contact: {
          email: "rh@experiencetech-tchad.com",
          phone: "+235 XX XX XX XX"
        }
      }
    };

    sendSuccessResponse(res, 201, 'Candidature soumise avec succès', response);
  } catch (error) {
    console.error('Submit application error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return sendErrorResponse(res, 400, 'Le fichier est trop volumineux (max 5MB)');
    }
    
    if (error.message.includes('Seuls les fichiers')) {
      return sendErrorResponse(res, 400, error.message);
    }
    
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get application status
// @route   GET /api/careers/application/:id
// @access  Public
router.get('/application/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, you'd fetch from database
    const application = {
      id: parseInt(id),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      message: 'Votre candidature est en cours d\'examen par notre équipe RH.'
    };

    sendSuccessResponse(res, 200, 'Statut de candidature récupéré', application);
  } catch (error) {
    console.error('Get application status error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;