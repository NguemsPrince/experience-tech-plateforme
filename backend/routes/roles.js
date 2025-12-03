const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { checkPermission, PERMISSIONS } = require('../middleware/permissions');
const { logAction } = require('../middleware/auditLog');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { getRolePermissions, PERMISSIONS: PERMS, ROLE_PERMISSIONS } = require('../utils/permissions');
const User = require('../models/User');

const router = express.Router();

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendErrorResponse(res, 400, 'Validation échouée', errors.array());
    return true;
  }
  return false;
};

// @desc    Get all roles and their permissions
// @route   GET /api/admin/roles
// @access  Private/Admin
router.get(
  '/',
  protect,
  authorize('admin', 'super_admin'),
  async (req, res) => {
    try {
      const roles = Object.keys(ROLE_PERMISSIONS).map(role => ({
        role,
        permissions: getRolePermissions(role),
        permissionCount: getRolePermissions(role).length
      }));

      sendSuccessResponse(res, 200, 'Rôles récupérés', { roles });
    } catch (error) {
      console.error('Get roles error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

// @desc    Get permissions for a specific role
// @route   GET /api/admin/roles/:role
// @access  Private/Admin
router.get(
  '/:role',
  protect,
  authorize('admin', 'super_admin'),
  [
    param('role').isIn(['client', 'student', 'moderator', 'admin', 'super_admin'])
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { role } = req.params;
      const permissions = getRolePermissions(role);

      sendSuccessResponse(res, 200, 'Permissions du rôle récupérées', {
        role,
        permissions,
        permissionCount: permissions.length
      });
    } catch (error) {
      console.error('Get role permissions error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

// @desc    Get all available permissions
// @route   GET /api/admin/roles/permissions/all
// @access  Private/Admin
router.get(
  '/permissions/all',
  protect,
  authorize('admin', 'super_admin'),
  async (req, res) => {
    try {
      sendSuccessResponse(res, 200, 'Permissions disponibles récupérées', {
        permissions: PERMS
      });
    } catch (error) {
      console.error('Get all permissions error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

// @desc    Get users by role
// @route   GET /api/admin/roles/:role/users
// @access  Private/Admin
router.get(
  '/:role/users',
  protect,
  authorize('admin', 'super_admin'),
  [
    param('role').isIn(['client', 'student', 'moderator', 'admin', 'super_admin']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { role } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find({ role, isActive: true })
          .select('-password -emailVerificationToken -passwordResetToken')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments({ role, isActive: true })
      ]);

      sendSuccessResponse(res, 200, 'Utilisateurs du rôle récupérés', {
        role,
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get users by role error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

// @desc    Get role statistics
// @route   GET /api/admin/roles/stats
// @access  Private/Admin
router.get(
  '/stats',
  protect,
  authorize('admin', 'super_admin'),
  async (req, res) => {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            },
            inactive: {
              $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
            }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const roleStats = stats.reduce((acc, stat) => {
        acc[stat._id] = {
          total: stat.count,
          active: stat.active,
          inactive: stat.inactive
        };
        return acc;
      }, {});

      sendSuccessResponse(res, 200, 'Statistiques des rôles récupérées', {
        roles: roleStats,
        totalUsers: stats.reduce((sum, stat) => sum + stat.count, 0)
      });
    } catch (error) {
      console.error('Get role stats error:', error);
      sendErrorResponse(res, 500, 'Erreur serveur');
    }
  }
);

module.exports = router;

