const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendTokenResponse, sendErrorResponse } = require('../utils/response');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             email: user@example.com
 *             password: Password123!
 *             firstName: John
 *             lastName: Doe
 *             phone: "+235 60 29 05 10"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('Le prénom est requis')
    .isLength({ max: 50 })
    .withMessage('Le prénom ne peut pas dépasser 50 caractères'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ max: 50 })
    .withMessage('Le nom ne peut pas dépasser 50 caractères'),
  
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Numéro de téléphone invalide')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const { firstName, lastName, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 400, 'Un utilisateur avec cet email existe déjà');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'client'
    });

    // Send welcome email
    try {
      const { sendWelcomeEmail } = require('../services/emailService');
      await sendWelcomeEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue even if email fails
    }

    // Generate token
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    sendTokenResponse(res, 201, token, {
      user,
      refreshToken
    });

  } catch (error) {
    console.error('Register error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors de l\'inscription');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
], async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const { email, password } = req.body;
    console.log('Looking for user:', email);

    // Check for user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found for email:', email);
      return sendErrorResponse(res, 401, 'Identifiants invalides');
    }

    if (!user.isActive) {
      return sendErrorResponse(res, 401, 'Compte désactivé. Contactez l\'administrateur.');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendErrorResponse(res, 401, 'Identifiants invalides');
    }

    // Update last login
    try {
      await user.updateLastLogin();
    } catch (updateError) {
      console.warn('Warning: Could not update last login:', updateError.message);
      // Continue with login even if last login update fails
    }

    // Generate token
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    sendTokenResponse(res, 200, token, { user, refreshToken });

  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    sendErrorResponse(res, 500, 'Erreur serveur lors de la connexion');
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Logout error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors de la déconnexion');
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get me error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
router.put('/updatedetails', protect, [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Le prénom ne peut pas dépasser 50 caractères'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Le nom ne peut pas dépasser 50 caractères'),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Numéro de téléphone invalide'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      'address.street': req.body.street,
      'address.city': req.body.city,
      'address.state': req.body.state,
      'address.zipCode': req.body.zipCode,
      'company.name': req.body.companyName,
      'company.position': req.body.position,
      'company.industry': req.body.industry
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Update details error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors de la mise à jour');
  }
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
router.put('/updatepassword', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return sendErrorResponse(res, 401, 'Mot de passe actuel incorrect');
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    console.error('Update password error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors de la mise à jour du mot de passe');
  }
});

// @desc    Refresh auth token
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh token)
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      return sendErrorResponse(res, 401, 'Refresh token manquant');
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return sendErrorResponse(res, 401, 'Refresh token invalide ou expiré');
    }

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return sendErrorResponse(res, 401, 'Utilisateur invalide ou inactif');
    }

    const newToken = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();

    sendTokenResponse(res, 200, newToken, {
      user,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur lors du rafraîchissement du token');
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return sendErrorResponse(res, 404, 'Aucun utilisateur trouvé avec cet email');
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Send email with reset token
    try {
      const { sendPasswordResetEmail } = require('../services/emailService');
      await sendPasswordResetEmail(user.email, user.firstName, resetToken);
      
      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé',
        ...(process.env.NODE_ENV === 'development' && { resetToken }) // Only for development
      });
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Still return success to prevent email enumeration
      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé',
        ...(process.env.NODE_ENV === 'development' && { resetToken }) // Only for development
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
router.put('/resetpassword/:resettoken', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    // Get hashed token
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return sendErrorResponse(res, 400, 'Token invalide ou expiré');
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;
