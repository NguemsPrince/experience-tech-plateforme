const express = require('express');
const { query, param, body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { sanitizeSearchQuery, validatePagination, isValidObjectId } = require('../utils/security');

// Models
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Ticket = require('../models/Ticket');
const QuoteRequest = require('../models/QuoteRequest');
const ContactMessage = require('../models/ContactMessage');
const ChatbotQuestion = require('../models/ChatbotQuestion');
const JobApplication = require('../models/JobApplication');

const router = express.Router();

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, 'Données invalides', errors.array());
  }
  return null;
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
router.get('/dashboard/stats', protect, authorize('admin', 'super_admin'), [
    query('period').optional().isIn(['7days', '30days', '90days', '1year', 'all']),
], async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
    const { period = '30days' } = req.query;

    // Calculate date filter based on period
    let startDate = null;
    if (period !== 'all') {
      const daysMap = {
        '7days': 7,
        '30days': 30,
        '90days': 90,
        '1year': 365
      };
      const days = daysMap[period] || 30;
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      }

      const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

    // Get all statistics in parallel
    const [
      totalUsers,
      activeUsers,
      newUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalCourses,
      activeCourses,
      totalEnrollments,
      openTickets,
      resolvedTickets,
      pendingQuoteRequests,
      newContactMessages,
      newChatbotQuestions,
      pendingJobApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ ...dateFilter, isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.aggregate([
        { $match: { status: { $in: ['completed', 'shipped'] }, ...dateFilter } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lte: 10 }, isActive: true }),
      Course.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Enrollment.countDocuments(dateFilter),
      Ticket.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      Ticket.countDocuments({ status: 'resolved', ...dateFilter }),
      QuoteRequest.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ status: 'new' }),
      ChatbotQuestion.countDocuments({ status: 'new' }),
      JobApplication.countDocuments({ status: 'pending' }),
    ]);

      // Get revenue by period for chart
      const revenueByPeriod = await Order.aggregate([
        {
          $match: {
            status: { $in: ['completed', 'shipped'] },
            ...dateFilter,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            revenue: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

    // Get orders by payment method
    const ordersByPaymentMethod = await Order.aggregate([
      { $match: { ...dateFilter } },
      { $group: { _id: '$payment.method', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
    ]);

    sendSuccessResponse(res, 200, 'Statistiques récupérées', {
      revenue: {
        total: totalRevenue[0]?.total || 0,
        byPeriod: revenueByPeriod,
      },
        users: {
          total: totalUsers,
          active: activeUsers,
          new: newUsers,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
        },
        courses: {
          total: totalCourses,
          active: activeCourses,
          enrollments: totalEnrollments,
        },
      support: {
        openTickets,
        resolvedTickets,
        pendingQuoteRequests,
        newContactMessages,
        newChatbotQuestions,
        pendingJobApplications,
        totalTickets: openTickets + resolvedTickets,
      },
      byPaymentMethod: ordersByPaymentMethod.reduce((acc, item) => {
        acc[item._id] = { count: item.count, revenue: item.revenue };
        return acc;
      }, {}),
      });

    } catch (error) {
      console.error('Get dashboard stats error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
});

// ==================== QUOTE REQUESTS ====================

// @desc    Get all quote requests (admin only)
// @route   GET /api/admin/quote-requests
// @access  Private/Admin
router.get('/quote-requests', protect, authorize('admin', 'super_admin'), [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'in_progress', 'quoted', 'accepted', 'rejected', 'cancelled']),
  query('serviceId').optional().isString(),
  query('search').optional().isString(),
], async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
    const { page, limit: validatedLimit } = validatePagination(req.query.page, req.query.limit, 100);
    const limit = validatedLimit || 20;
      const skip = (page - 1) * limit;

    // Build filter
      const filter = {};
      if (req.query.status) filter.status = req.query.status;
    if (req.query.serviceId) filter.serviceId = req.query.serviceId;
    if (req.query.search) {
      const sanitizedSearch = sanitizeSearchQuery(req.query.search);
      if (sanitizedSearch) {
        filter.$or = [
          { name: { $regex: sanitizedSearch, $options: 'i' } },
          { email: { $regex: sanitizedSearch, $options: 'i' } },
          { serviceName: { $regex: sanitizedSearch, $options: 'i' } },
        ];
      }
    }

    const [quoteRequests, total] = await Promise.all([
      QuoteRequest.find(filter)
          .populate('user', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      QuoteRequest.countDocuments(filter),
      ]);

    sendSuccessResponse(res, 200, 'Demandes de devis récupérées', {
      quoteRequests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });

    } catch (error) {
    console.error('Get quote requests error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get single quote request (admin only)
// @route   GET /api/admin/quote-requests/:id
// @access  Private/Admin
router.get('/quote-requests/:id', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const quoteRequest = await QuoteRequest.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .lean();

    if (!quoteRequest) {
      return sendErrorResponse(res, 404, 'Demande de devis non trouvée');
    }

    sendSuccessResponse(res, 200, 'Demande de devis récupérée', quoteRequest);

  } catch (error) {
    console.error('Get quote request error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update quote request status (admin only)
// @route   PUT /api/admin/quote-requests/:id
// @access  Private/Admin
router.put('/quote-requests/:id', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
  body('status').optional().isIn(['pending', 'in_progress', 'quoted', 'accepted', 'rejected', 'cancelled']),
  body('assignedTo').optional().isMongoId(),
  body('notes').optional().isString().isLength({ max: 1000 }),
], async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
    const { id } = req.params;
    const { status, assignedTo, notes } = req.body;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'quoted') updateData.quotedAt = new Date();
      if (status === 'accepted' || status === 'rejected') updateData.resolvedAt = new Date();
      if (status === 'accepted') updateData.respondedAt = new Date();
    }
    if (assignedTo) {
      if (!isValidObjectId(assignedTo)) {
        return sendErrorResponse(res, 400, 'ID assigné invalide');
      }
      updateData.assignedTo = assignedTo;
    }
    if (notes !== undefined) updateData.notes = notes;

    const quoteRequest = await QuoteRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
        .populate('user', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
        .lean();

    if (!quoteRequest) {
      return sendErrorResponse(res, 404, 'Demande de devis non trouvée');
    }

    sendSuccessResponse(res, 200, 'Demande de devis mise à jour', quoteRequest);

    } catch (error) {
    console.error('Update quote request error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== CONTACT MESSAGES ====================

// @desc    Get all contact messages (admin only)
// @route   GET /api/admin/contact-messages
// @access  Private/Admin
router.get('/contact-messages', protect, authorize('admin', 'super_admin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['new', 'read', 'replied', 'resolved', 'archived']),
  query('category').optional().isIn(['general', 'support', 'sales', 'partnership', 'other']),
  query('search').optional().isString(),
], async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
    const { page, limit: validatedLimit } = validatePagination(req.query.page, req.query.limit, 100);
    const limit = validatedLimit || 20;
    const skip = (page - 1) * limit;

    // Build filter
      const filter = {};
      if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      const sanitizedSearch = sanitizeSearchQuery(req.query.search);
      if (sanitizedSearch) {
        filter.$or = [
          { name: { $regex: sanitizedSearch, $options: 'i' } },
          { email: { $regex: sanitizedSearch, $options: 'i' } },
          { subject: { $regex: sanitizedSearch, $options: 'i' } },
          { message: { $regex: sanitizedSearch, $options: 'i' } },
        ];
      }
    }

    const [contactMessages, total] = await Promise.all([
      ContactMessage.find(filter)
        .populate('user', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        .populate('replies.repliedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(filter),
    ]);

    sendSuccessResponse(res, 200, 'Messages de contact récupérés', {
      contactMessages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get single contact message (admin only)
// @route   GET /api/admin/contact-messages/:id
// @access  Private/Admin
router.get('/contact-messages/:id', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const contactMessage = await ContactMessage.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .populate('replies.repliedBy', 'firstName lastName email')
      .lean();

    if (!contactMessage) {
      return sendErrorResponse(res, 404, 'Message de contact non trouvé');
    }

    // Mark as read if status is 'new'
    if (contactMessage.status === 'new') {
      await ContactMessage.findByIdAndUpdate(id, {
        status: 'read',
        readAt: new Date(),
      });
    }

    sendSuccessResponse(res, 200, 'Message de contact récupéré', contactMessage);

  } catch (error) {
    console.error('Get contact message error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update contact message status (admin only)
// @route   PUT /api/admin/contact-messages/:id
// @access  Private/Admin
router.put('/contact-messages/:id', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
  body('status').optional().isIn(['new', 'read', 'replied', 'resolved', 'archived']),
  body('assignedTo').optional().isMongoId(),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'read' && !updateData.readAt) updateData.readAt = new Date();
      if (status === 'replied') updateData.repliedAt = new Date();
      if (status === 'resolved') updateData.resolvedAt = new Date();
    }
    if (assignedTo) {
      if (!isValidObjectId(assignedTo)) {
        return sendErrorResponse(res, 400, 'ID assigné invalide');
      }
      updateData.assignedTo = assignedTo;
    }

    const contactMessage = await ContactMessage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .lean();

    if (!contactMessage) {
      return sendErrorResponse(res, 404, 'Message de contact non trouvé');
    }

    sendSuccessResponse(res, 200, 'Message de contact mis à jour', contactMessage);

  } catch (error) {
    console.error('Update contact message error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Add reply to contact message (admin only)
// @route   POST /api/admin/contact-messages/:id/reply
// @access  Private/Admin
router.post('/contact-messages/:id/reply', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
  body('message').trim().notEmpty().withMessage('Le message de réponse est requis'),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const contactMessage = await ContactMessage.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: {
            message: message.trim(),
            repliedBy: req.user.id,
            repliedAt: new Date(),
          },
        },
        status: 'replied',
        repliedAt: new Date(),
      },
      { new: true, runValidators: true }
    )
      .populate('user', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .populate('replies.repliedBy', 'firstName lastName email')
      .lean();

    if (!contactMessage) {
      return sendErrorResponse(res, 404, 'Message de contact non trouvé');
    }

    sendSuccessResponse(res, 200, 'Réponse ajoutée avec succès', contactMessage);

  } catch (error) {
    console.error('Add reply error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== CHATBOT QUESTIONS ====================

// @desc    Get all chatbot questions (admin only)
// @route   GET /api/admin/chatbot-questions
// @access  Private/Admin
router.get('/chatbot-questions', protect, authorize('admin', 'super_admin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['new', 'answered', 'archived']),
  query('search').optional().isString(),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};

    if (status) query.status = status;

    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search);
      query.$or = [
        { question: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } },
        { name: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const [questions, total] = await Promise.all([
      ChatbotQuestion.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('user', 'firstName lastName email')
        .populate('answeredBy', 'firstName lastName email')
        .lean(),
      ChatbotQuestion.countDocuments(query),
    ]);

    sendSuccessResponse(res, 200, 'Questions chatbot récupérées', {
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Get chatbot questions error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get single chatbot question (admin only)
// @route   GET /api/admin/chatbot-questions/:id
// @access  Private/Admin
router.get('/chatbot-questions/:id', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const question = await ChatbotQuestion.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('answeredBy', 'firstName lastName email')
      .lean();

    if (!question) {
      return sendErrorResponse(res, 404, 'Question chatbot non trouvée');
    }

    sendSuccessResponse(res, 200, 'Question chatbot récupérée', question);

  } catch (error) {
    console.error('Get chatbot question error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update chatbot question (admin only)
// @route   PUT /api/admin/chatbot-questions/:id
// @access  Private/Admin
router.put('/chatbot-questions/:id', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
  body('status').optional().isIn(['new', 'answered', 'archived']).withMessage('Statut invalide'),
  body('answer').optional().trim().isLength({ max: 1000 }).withMessage('La réponse ne peut pas dépasser 1000 caractères'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Les notes ne peuvent pas dépasser 500 caractères'),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;
    const { status, answer, notes } = req.body;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (answer !== undefined) {
      updateData.answer = answer.trim();
      if (answer.trim()) {
        updateData.answeredBy = req.user.id;
        updateData.answeredAt = new Date();
        updateData.status = 'answered';
      }
    }
    if (notes !== undefined) updateData.notes = notes.trim();

    const question = await ChatbotQuestion.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'firstName lastName email')
      .populate('answeredBy', 'firstName lastName email')
      .lean();

    if (!question) {
      return sendErrorResponse(res, 404, 'Question chatbot non trouvée');
    }

    sendSuccessResponse(res, 200, 'Question chatbot mise à jour', question);

  } catch (error) {
    console.error('Update chatbot question error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== JOB APPLICATIONS ====================

// @desc    Get all job applications (admin only)
// @route   GET /api/admin/job-applications
// @access  Private/Admin
router.get('/job-applications', protect, authorize('admin', 'super_admin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected']),
  query('jobTitle').optional().isString(),
  query('search').optional().isString(),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { page = 1, limit = 10, status, jobTitle, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (jobTitle) {
      const sanitizedJobTitle = sanitizeSearchQuery(jobTitle);
      query.jobTitle = { $regex: sanitizedJobTitle, $options: 'i' };
    }

    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search);
      query.$or = [
        { 'personalInfo.firstName': { $regex: sanitizedSearch, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: sanitizedSearch, $options: 'i' } },
        { 'personalInfo.email': { $regex: sanitizedSearch, $options: 'i' } },
        { jobTitle: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const [applications, total] = await Promise.all([
      JobApplication.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('user', 'firstName lastName email')
        .populate('reviewedBy', 'firstName lastName email')
        .lean(),
      JobApplication.countDocuments(query),
    ]);

    sendSuccessResponse(res, 200, 'Candidatures récupérées', {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get single job application (admin only)
// @route   GET /api/admin/job-applications/:id
// @access  Private/Admin
router.get('/job-applications/:id', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const application = await JobApplication.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .lean();

    if (!application) {
      return sendErrorResponse(res, 404, 'Candidature non trouvée');
    }

    sendSuccessResponse(res, 200, 'Candidature récupérée', application);

  } catch (error) {
    console.error('Get job application error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update job application (admin only)
// @route   PUT /api/admin/job-applications/:id
// @access  Private/Admin
router.put('/job-applications/:id', protect, authorize('admin', 'super_admin'), [
  param('id').isMongoId().withMessage('ID invalide'),
  body('status').optional().isIn(['pending', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected']).withMessage('Statut invalide'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Les notes ne peuvent pas dépasser 1000 caractères'),
  body('interviewDate').optional().isISO8601().toDate().withMessage('Date d\'entretien invalide'),
  body('rejectionReason').optional().trim().isLength({ max: 500 }).withMessage('La raison du refus ne peut pas dépasser 500 caractères'),
], async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { id } = req.params;
    const { status, notes, interviewDate, rejectionReason } = req.body;

    if (!isValidObjectId(id)) {
      return sendErrorResponse(res, 400, 'ID invalide');
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status !== 'pending') {
        updateData.reviewedBy = req.user.id;
        updateData.reviewedAt = new Date();
      }
    }
    if (notes !== undefined) updateData.notes = notes.trim();
    if (interviewDate !== undefined) updateData.interviewDate = interviewDate;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason.trim();

    const application = await JobApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .lean();

    if (!application) {
      return sendErrorResponse(res, 404, 'Candidature non trouvée');
    }

    sendSuccessResponse(res, 200, 'Candidature mise à jour', application);

  } catch (error) {
    console.error('Update job application error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;
