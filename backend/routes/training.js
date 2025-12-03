const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { protect, authorize } = require('../middleware/auth');
const { cacheMiddleware, invalidateRouteCache } = require('../middleware/cache');
const { isValidObjectId, sanitizeSearchQuery, validatePagination } = require('../utils/security');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

/**
 * @swagger
 * /training:
 *   get:
 *     summary: Récupérer toutes les formations
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [débutant, intermédiaire, avancé]
 *         description: Filtrer par niveau
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher dans titre/description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des formations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *                     totalPages:
 *                       type: number
 *                     currentPage:
 *                       type: number
 *                     total:
 *                       type: number
 */
// Cache pour 1 heure (3600 secondes)
router.get('/', cacheMiddleware(3600, (req) => {
  return `training:list:${JSON.stringify(req.query)}`;
}), async (req, res) => {
  try {
    const { category, level, price, search, sortBy = 'popularity', page = 1, limit = 12 } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (category && category !== 'Tous') {
      query.category = category;
    }
    
    if (level && level !== 'Tous') {
      query.level = level;
    }
    
    if (price && price !== 'Tous') {
      if (price === 'Gratuit') {
        query.price = 0;
      } else if (price === '0-50000') {
        query.price = { $gt: 0, $lte: 50000 };
      } else if (price === '50000-100000') {
        query.price = { $gt: 50000, $lte: 100000 };
      } else if (price === '100000+') {
        query.price = { $gt: 100000 };
      }
    }
    
    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search);
      if (sanitizedSearch) {
        query.$or = [
          { title: { $regex: sanitizedSearch, $options: 'i' } },
          { description: { $regex: sanitizedSearch, $options: 'i' } },
          { tags: { $in: [new RegExp(sanitizedSearch, 'i')] } }
        ];
      }
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      default:
        sort = { 'rating.average': -1, studentsCount: -1 };
    }

    const courses = await Course.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-curriculum -requirements -whatYouWillLearn');

    const total = await Course.countDocuments(query);

    sendSuccessResponse(res, 200, 'Formations récupérées', {
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get training error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get training statistics
// @route   GET /api/training/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const total = await Course.countDocuments({});
    const active = await Course.countDocuments({ isActive: true });
    
    // Get average rating
    const courses = await Course.find({ isActive: true });
    const averageRating = courses.length > 0
      ? courses.reduce((sum, c) => sum + (c.rating?.average || 0), 0) / courses.length
      : 0;
    
    // Count total enrolled students
    const totalParticipants = await Enrollment.countDocuments();
    
    // Get top categories
    const categoryStats = await Course.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const topCategories = categoryStats.map(stat => ({
      category: stat._id,
      count: stat.count
    }));
    
    sendSuccessResponse(res, 200, 'Statistiques récupérées', {
      total,
      active,
      completed: 0, // Not implemented yet
      upcoming: 0, // Not implemented yet
      totalParticipants,
      averageRating: Math.round(averageRating * 10) / 10,
      topCategories
    });
  } catch (error) {
    console.error('Get training stats error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

/**
 * @swagger
 * /training/{courseId}:
 *   get:
 *     summary: Récupérer les détails d'une formation
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la formation
 *     responses:
 *       200:
 *         description: Détails de la formation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Formation non trouvée
 */
router.get('/:courseId', [
  param('courseId')
    .notEmpty()
    .withMessage('L\'ID du cours est requis')
    .custom((value) => {
      // Allow both ObjectId and demo ID '4'
      if (value === '4') return true;
      if (!isValidObjectId(value)) {
        throw new Error('ID de cours invalide');
      }
      return true;
    })
], cacheMiddleware(1800, (req) => {
  return `training:detail:${req.params.courseId}`;
}), async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Validate courseId
    if (courseId !== '4' && !isValidObjectId(courseId)) {
      return sendErrorResponse(res, 400, 'ID de cours invalide');
    }
    
    let course;
    
    // Handle both MongoDB ObjectId and simple numeric IDs
    if (courseId === '4') {
      // For demo purposes, return the first React course
      course = await Course.findOne({ title: { $regex: /React/i } });
    } else {
      course = await Course.findById(courseId);
    }
    
    if (!course) {
      return sendErrorResponse(res, 404, 'Cours non trouvé');
    }

    sendSuccessResponse(res, 200, 'Détails du cours récupérés', course);
  } catch (error) {
    console.error('Get course details error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get user enrollments
// @route   GET /api/training/my-courses
// @access  Private
router.get('/my-courses', protect, async (req, res) => {
  try {
    const { status = 'enrolled', page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    // Validate userId
    if (!userId) {
      return sendErrorResponse(res, 401, 'Utilisateur non authentifié');
    }

    const query = { user: userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate('course', 'title image price duration level category instructor')
      .sort({ enrollmentDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Enrollment.countDocuments(query);

    sendSuccessResponse(res, 200, 'Mes cours récupérés', {
      enrollments: enrollments || [],
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total: total || 0
    });
  } catch (error) {
    console.error('Get user enrollments error:', error);
    
    // More detailed error message based on error type
    let errorMessage = 'Erreur serveur lors de la récupération des formations';
    
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      errorMessage = 'Erreur de base de données. Veuillez réessayer.';
    } else if (error.name === 'CastError') {
      errorMessage = 'Données invalides. Veuillez contacter le support.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    sendErrorResponse(res, 500, errorMessage);
  }
});

// @desc    Enroll in a course
// @route   POST /api/training/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Check if course exists (handle both ObjectId and numeric ID)
    let course;
    if (courseId === '4') {
      course = await Course.findOne({ title: { $regex: /React/i } });
    } else {
      course = await Course.findById(courseId);
    }
    if (!course) {
      return sendErrorResponse(res, 404, 'Cours non trouvé');
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: course._id  // Use the actual course ID from database
    });

    if (existingEnrollment) {
      return sendErrorResponse(res, 400, 'Vous êtes déjà inscrit à ce cours');
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: course._id,  // Use the actual course ID from database
      status: 'enrolled',
      enrollmentDate: new Date(),
      progress: 0
    });

    await enrollment.save();

    // Populate course data
    await enrollment.populate('course', 'title image price duration level category instructor');

    sendSuccessResponse(res, 201, 'Inscription réussie', { enrollment });
  } catch (error) {
    console.error('Enroll in course error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get enrollment for a specific course
// @route   GET /api/training/:id/enrollment
// @access  Private
router.get('/:id/enrollment', protect, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Find the actual course ID (handle both ObjectId and numeric ID)
    let actualCourseId;
    if (courseId === '4') {
      const course = await Course.findOne({ title: { $regex: /React/i } });
      actualCourseId = course ? course._id : courseId;
    } else {
      actualCourseId = courseId;
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: actualCourseId
    }).populate('course', 'title image price duration level category instructor');

    if (!enrollment) {
      return sendErrorResponse(res, 404, 'Inscription non trouvée');
    }

    sendSuccessResponse(res, 200, 'Inscription récupérée', { enrollment });
  } catch (error) {
    console.error('Get enrollment error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update course progress
// @route   PUT /api/training/:courseId/progress
// @access  Private
router.put('/:courseId/progress', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress, lessonId } = req.body;
    const userId = req.user.id;

    if (progress < 0 || progress > 100) {
      return sendErrorResponse(res, 400, 'Le progrès doit être entre 0 et 100');
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: 'enrolled'
    });

    if (!enrollment) {
      return sendErrorResponse(res, 404, 'Inscription non trouvée');
    }

    enrollment.progress = progress;
    enrollment.lastAccessed = new Date();

    if (progress === 100) {
      enrollment.status = 'completed';
      enrollment.completionDate = new Date();
    }

    await enrollment.save();

    sendSuccessResponse(res, 200, 'Progrès mis à jour', enrollment);
  } catch (error) {
    console.error('Update progress error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, 'Données invalides', errors.array());
  }
  return null;
};

// @desc    Create new training course
// @route   POST /api/training
// @access  Private/Admin
router.post('/', protect, authorize('admin', 'super_admin'), [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 3, max: 200 })
    .withMessage('Le titre doit contenir entre 3 et 200 caractères'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ min: 50 })
    .withMessage('La description doit contenir au moins 50 caractères'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('La durée est requise')
    .isLength({ max: 50 })
    .withMessage('La durée ne peut pas dépasser 50 caractères'),
  body('totalHours')
    .isInt({ min: 1 })
    .withMessage('Le nombre total d\'heures doit être un entier positif'),
  body('lessons')
    .isInt({ min: 1 })
    .withMessage('Le nombre de leçons doit être un entier positif'),
  body('maxStudents')
    .isInt({ min: 1 })
    .withMessage('Le nombre maximum d\'étudiants doit être un entier positif'),
  body('startDate')
    .isISO8601()
    .withMessage('La date de début doit être une date valide'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('La date de fin doit être une date valide'),
  body('level')
    .optional()
    .isIn(['Débutant', 'Intermédiaire', 'Avancé'])
    .withMessage('Le niveau doit être Débutant, Intermédiaire ou Avancé'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La catégorie ne peut pas dépasser 100 caractères'),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description courte ne peut pas dépasser 500 caractères'),
  body('language')
    .optional()
    .isIn(['Français', 'Anglais', 'Arabe'])
    .withMessage('La langue doit être Français, Anglais ou Arabe'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Les tags doivent être un tableau'),
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Les prérequis doivent être un tableau'),
  body('whatYouWillLearn')
    .optional()
    .isArray()
    .withMessage('Les acquis doivent être un tableau'),
  body('curriculum')
    .optional()
    .isArray()
    .withMessage('Le curriculum doit être un tableau')
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const {
      title,
      description,
      shortDescription,
      instructor,
      duration,
      totalHours,
      lessons,
      level,
      category,
      price,
      originalPrice,
      maxStudents,
      startDate,
      endDate,
      requirements,
      whatYouWillLearn,
      curriculum,
      image,
      tags,
      language
    } = req.body;

    // Vérifier si une formation avec le même titre existe déjà (insensible à la casse)
    const existingCourse = await Course.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') },
      isActive: true
    });

    if (existingCourse) {
      return sendErrorResponse(res, 409, 'Une formation avec ce titre existe déjà');
    }

    // Create course object
    const courseData = {
      title: title.trim(),
      description: description.trim(),
      shortDescription: shortDescription || description.substring(0, 500),
      image: image || '/images/default-course.jpg',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      duration: duration.trim(),
      totalHours: parseInt(totalHours),
      lessons: parseInt(lessons),
      level: level || 'Débutant',
      category: category || 'Développement Web',
      instructor: {
        name: instructor ? instructor.trim() : 'Instructeur'
      },
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      maxStudents: parseInt(maxStudents),
      language: language || 'Français',
      tags: tags || [category, level],
      requirements: requirements || [],
      whatYouWillLearn: whatYouWillLearn || [],
      curriculum: curriculum || [],
      isActive: true,
      currentStudents: 0,
      rating: {
        average: 0,
        count: 0
      }
    };

    // Save to database
    const newCourse = await Course.create(courseData);

    sendSuccessResponse(res, 201, 'Formation créée avec succès', newCourse);
  } catch (error) {
    console.error('Create course error:', error);
    
    // Gérer les erreurs de duplication MongoDB
    if (error.code === 11000) {
      return sendErrorResponse(res, 409, 'Une formation avec ce titre existe déjà');
    }
    
    // Gérer les erreurs de validation
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return sendErrorResponse(res, 400, 'Erreur de validation', errors);
    }
    
    sendErrorResponse(res, 500, 'Erreur serveur lors de la création de la formation');
  }
});

// @desc    Update training course
// @route   PUT /api/training/:courseId
// @access  Private/Admin
router.put('/:courseId', protect, authorize('admin', 'super_admin'), [
  param('courseId')
    .notEmpty()
    .withMessage('L\'ID du cours est requis')
    .custom((value) => {
      if (value === '4') return true;
      if (!isValidObjectId(value)) {
        throw new Error('ID de cours invalide');
      }
      return true;
    })
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { courseId } = req.params;
    
    if (courseId !== '4' && !isValidObjectId(courseId)) {
      return sendErrorResponse(res, 400, 'ID de cours invalide');
    }
    
    const updateData = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return sendErrorResponse(res, 404, 'Formation non trouvée');
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        course[key] = updateData[key];
      }
    });

    course.updatedAt = new Date();
    await course.save();

    sendSuccessResponse(res, 200, 'Formation mise à jour avec succès', course);
  } catch (error) {
    console.error('Update course error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors de la mise à jour');
  }
});

// @desc    Delete training course
// @route   DELETE /api/training/:courseId
// @access  Private/Admin
router.delete('/:courseId', protect, authorize('admin', 'super_admin'), [
  param('courseId')
    .notEmpty()
    .withMessage('L\'ID du cours est requis')
    .custom((value) => {
      if (value === '4') return true;
      if (!isValidObjectId(value)) {
        throw new Error('ID de cours invalide');
      }
      return true;
    })
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { courseId } = req.params;

    if (courseId !== '4' && !isValidObjectId(courseId)) {
      return sendErrorResponse(res, 400, 'ID de cours invalide');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return sendErrorResponse(res, 404, 'Formation non trouvée');
    }

    // Soft delete - just deactivate
    course.isActive = false;
    await course.save();

    sendSuccessResponse(res, 200, 'Formation supprimée avec succès');
  } catch (error) {
    console.error('Delete course error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors de la suppression');
  }
});

module.exports = router;
