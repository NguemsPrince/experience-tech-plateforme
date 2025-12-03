const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { sanitizeSearchQuery, validatePagination, isValidObjectId } = require('../utils/security');
const User = require('../models/User');
const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendErrorResponse(res, 422, 'Validation échouée', errors.array());
    return true; // Retourner true pour indiquer qu'une erreur a été envoyée
  }
  return false; // Retourner false si pas d'erreurs
};

// @desc    Get all users with pagination, filtering, and search (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get(
  '/',
  protect,
  authorize('admin', 'super_admin'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 10000 }), // Augmenté pour permettre les exports
    query('role').optional().isIn(['client', 'student', 'admin', 'super_admin']),
    query('isActive').optional().isBoolean(),
    query('search').optional().isString(),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      // Use validated pagination
      const { page, limit } = validatePagination(req.query.page, req.query.limit, 10000);
      const skip = (page - 1) * limit;

      // Build filter with sanitized search
      const filter = {};
      if (req.query.role) filter.role = req.query.role;
      if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
      if (req.query.search) {
        const sanitizedSearch = sanitizeSearchQuery(req.query.search);
        if (sanitizedSearch) {
          filter.$or = [
            { firstName: { $regex: sanitizedSearch, $options: 'i' } },
            { lastName: { $regex: sanitizedSearch, $options: 'i' } },
            { email: { $regex: sanitizedSearch, $options: 'i' } },
          ];
        }
      }

      const [users, total] = await Promise.all([
        User.find(filter)
          .select('-password -emailVerificationToken -passwordResetToken')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(filter),
      ]);

      sendSuccessResponse(res, 200, 'Utilisateurs récupérés', {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get users error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

// @desc    Get user statistics (admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
router.get('/stats', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      recentUsers,
      usersWithOrders,
      usersWithEnrollments,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('firstName lastName email role createdAt')
        .lean(),
      Order.distinct('user'),
      Enrollment.distinct('user'),
    ]);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: last30Days },
    });

    // Get users with recent logins (last 30 days)
    const recentLogins = await User.countDocuments({
      lastLogin: { $gte: last30Days },
      isActive: true,
    });

    sendSuccessResponse(res, 200, 'Statistiques utilisateurs récupérées', {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      newUsers: newUsersLast30Days,
      newUsersLast30Days,
      recentLogins,
      usersWithOrders: usersWithOrders.length,
      usersWithEnrollments: usersWithEnrollments.length,
      recentUsers,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get single user details (admin only)
// @route   GET /api/users/:userId
// @access  Private/Admin
router.get(
  '/:userId',
  protect,
  authorize('admin', 'super_admin'),
  [
    param('userId')
      .isMongoId()
      .withMessage('ID utilisateur invalide')
      .custom((value) => {
        if (!isValidObjectId(value)) {
          throw new Error('ID utilisateur invalide');
        }
        return true;
      })
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { userId } = req.params;
      
      if (!isValidObjectId(userId)) {
        return sendErrorResponse(res, 400, 'ID utilisateur invalide');
      }
      
      const user = await User.findById(userId)
        .select('-password -emailVerificationToken -passwordResetToken')
        .lean();

      if (!user) {
        return sendErrorResponse(res, 404, 'Utilisateur non trouvé');
      }

      // Get user activity
      const [orders, enrollments] = await Promise.all([
        Order.find({ user: req.params.userId })
          .sort({ createdAt: -1 })
          .limit(10)
          .select('reference total status createdAt')
          .lean(),
        Enrollment.find({ user: req.params.userId })
          .populate('course', 'title price')
          .sort({ enrollmentDate: -1 })
          .limit(10)
          .lean(),
      ]);

      sendSuccessResponse(res, 200, 'Utilisateur récupéré', {
        user,
        activity: {
          orders,
          enrollments,
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

// @desc    Update user (admin only)
// @route   PUT /api/users/:userId
// @access  Private/Admin
router.put(
  '/:userId',
  protect,
  authorize('admin', 'super_admin'),
  [
    param('userId').isMongoId(),
    body('firstName').optional().isString().isLength({ min: 2, max: 50 }),
    body('lastName').optional().isString().isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail(),
    body('phone').optional().isString(),
    body('role').optional().isIn(['client', 'student', 'admin', 'super_admin']),
    body('isActive').optional().isBoolean(),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const updates = { ...req.body };
      delete updates.password; // Don't allow password update here

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        updates,
        { new: true, runValidators: true }
      )
        .select('-password -emailVerificationToken -passwordResetToken')
        .lean();

      if (!user) {
        return sendErrorResponse(res, 404, 'Utilisateur non trouvé');
      }

      sendSuccessResponse(res, 200, 'Utilisateur mis à jour', user);
    } catch (error) {
      console.error('Update user error:', error);
      if (error.code === 11000) {
        return sendErrorResponse(res, 400, 'Cet email est déjà utilisé');
      }
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

// @desc    Suspend/Activate user (admin only)
// @route   PATCH /api/users/:userId/suspend
// @access  Private/Admin
router.patch(
  '/:userId/suspend',
  protect,
  authorize('admin', 'super_admin'),
  [param('userId').isMongoId(), body('isActive').isBoolean()],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isActive: req.body.isActive },
        { new: true }
      )
        .select('-password -emailVerificationToken -passwordResetToken')
        .lean();

      if (!user) {
        return sendErrorResponse(res, 404, 'Utilisateur non trouvé');
      }

      sendSuccessResponse(res, 200, `Utilisateur ${req.body.isActive ? 'activé' : 'suspendu'}`, user);
    } catch (error) {
      console.error('Suspend user error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:userId
// @access  Private/Admin
router.delete(
  '/:userId',
  protect,
  authorize('admin', 'super_admin'),
  [param('userId').isMongoId()],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      // Soft delete - just deactivate
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isActive: false },
        { new: true }
      )
        .select('-password -emailVerificationToken -passwordResetToken')
        .lean();

      if (!user) {
        return sendErrorResponse(res, 404, 'Utilisateur non trouvé');
      }

      sendSuccessResponse(res, 200, 'Utilisateur supprimé', user);
    } catch (error) {
      console.error('Delete user error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

module.exports = router;
