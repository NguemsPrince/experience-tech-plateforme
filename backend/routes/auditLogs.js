const express = require('express');
const { query, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const AuditLog = require('../models/AuditLog');

const router = express.Router();

// Toutes les routes nécessitent une authentification admin
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Helper pour gérer les erreurs de validation
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendErrorResponse(res, 400, 'Validation échouée', errors.array());
    return true;
  }
  return false;
};

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Récupérer les logs d'audit avec filtres
 * @access  Private/Admin
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('action').optional().isString(),
    query('resource').optional().isString(),
    query('status').optional().isIn(['SUCCESS', 'ERROR', 'WARNING']),
    query('userId').optional().isMongoId(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('search').optional().isString(),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;

      // Construire les filtres
      const filter = {};

      if (req.query.action) {
        filter.action = req.query.action;
      }

      if (req.query.resource) {
        filter.resource = req.query.resource;
      }

      if (req.query.status) {
        filter.status = req.query.status;
      }

      if (req.query.userId) {
        filter.user = req.query.userId;
      }

      // Filtre par date
      if (req.query.startDate || req.query.endDate) {
        filter.createdAt = {};
        if (req.query.startDate) {
          filter.createdAt.$gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
          filter.createdAt.$lte = new Date(req.query.endDate);
        }
      }

      // Recherche dans la description
      if (req.query.search) {
        filter.description = { $regex: req.query.search, $options: 'i' };
      }

      // Récupérer les logs avec pagination
      const [logs, total] = await Promise.all([
        AuditLog.find(filter)
          .populate('user', 'firstName lastName email role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        AuditLog.countDocuments(filter),
      ]);

      sendSuccessResponse(res, 200, 'Logs d\'audit récupérés', {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la récupération des logs d\'audit', error.message);
    }
  }
);

/**
 * @route   GET /api/admin/audit-logs/stats
 * @desc    Obtenir les statistiques des logs d'audit
 * @access  Private/Admin
 */
router.get(
  '/stats',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const stats = await AuditLog.getStats(
        req.query.startDate,
        req.query.endDate
      );

      sendSuccessResponse(res, 200, 'Statistiques récupérées', stats);
    } catch (error) {
      console.error('Error fetching audit log stats:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la récupération des statistiques', error.message);
    }
  }
);

/**
 * @route   GET /api/admin/audit-logs/:id
 * @desc    Récupérer un log d'audit spécifique
 * @access  Private/Admin
 */
router.get('/:id', async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('user', 'firstName lastName email role')
      .lean();

    if (!log) {
      return sendErrorResponse(res, 404, 'Log d\'audit non trouvé');
    }

    sendSuccessResponse(res, 200, 'Log d\'audit récupéré', log);
  } catch (error) {
    console.error('Error fetching audit log:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la récupération du log d\'audit', error.message);
  }
});

/**
 * @route   GET /api/admin/audit-logs/user/:userId
 * @desc    Récupérer les logs d'un utilisateur spécifique
 * @access  Private/Admin
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find({ user: req.params.userId })
        .populate('user', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments({ user: req.params.userId }),
    ]);

    sendSuccessResponse(res, 200, 'Logs d\'audit de l\'utilisateur récupérés', {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user audit logs:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la récupération des logs', error.message);
  }
});

module.exports = router;

