const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const Settings = require('../models/Settings');

const router = express.Router();

// Helper pour gérer les erreurs de validation
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendErrorResponse(res, 422, 'Validation échouée', errors.array());
    return true;
  }
  return false;
};

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Récupérer les paramètres de la plateforme
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paramètres récupérés avec succès
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get(
  '/',
  protect,
  authorize('admin', 'super_admin'),
  async (req, res) => {
    try {
      const settings = await Settings.getSettings();
      sendSuccessResponse(res, 200, 'Paramètres récupérés avec succès', settings);
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la récupération des paramètres', error.message);
    }
  }
);

/**
 * @swagger
 * /api/settings/payment:
 *   get:
 *     summary: Récupérer uniquement les paramètres de paiement
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paramètres de paiement récupérés avec succès
 */
router.get(
  '/payment',
  protect, // Only require authentication, not admin (payment settings should be accessible to all authenticated users)
  async (req, res) => {
    try {
      const settings = await Settings.getSettings();
      sendSuccessResponse(res, 200, 'Paramètres de paiement récupérés avec succès', {
        payment: settings.payment
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres de paiement:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la récupération des paramètres de paiement', error.message);
    }
  }
);

/**
 * @swagger
 * /api/settings/payment:
 *   put:
 *     summary: Mettre à jour les paramètres de paiement
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               airtelNumbers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     number:
 *                       type: string
 *                     name:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *               moovNumbers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     number:
 *                       type: string
 *                     name:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *               bankAccount:
 *                 type: object
 *                 properties:
 *                   bankName:
 *                     type: string
 *                   accountNumber:
 *                     type: string
 *                   accountHolderName:
 *                     type: string
 *                   iban:
 *                     type: string
 *                   swiftCode:
 *                     type: string
 *                   branch:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *               currency:
 *                 type: string
 *                 enum: [XAF, USD, EUR]
 *               taxRate:
 *                 type: number
 *               allowCashPayment:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Paramètres de paiement mis à jour avec succès
 *       422:
 *         description: Erreur de validation
 */
router.put(
  '/payment',
  protect,
  authorize('admin', 'super_admin'),
  [
    body('airtelNumbers').optional().isArray().withMessage('airtelNumbers doit être un tableau'),
    body('airtelNumbers.*.number').optional().isString().trim().notEmpty().withMessage('Le numéro Airtel est requis'),
    body('moovNumbers').optional().isArray().withMessage('moovNumbers doit être un tableau'),
    body('moovNumbers.*.number').optional().isString().trim().notEmpty().withMessage('Le numéro Moov est requis'),
    body('bankAccount.bankName').optional().isString().trim(),
    body('bankAccount.accountNumber').optional().isString().trim(),
    body('bankAccount.accountHolderName').optional().isString().trim(),
    body('bankAccount.iban').optional().isString().trim(),
    body('bankAccount.swiftCode').optional().isString().trim(),
    body('bankAccount.branch').optional().isString().trim(),
    body('currency').optional().isIn(['XAF', 'USD', 'EUR']).withMessage('Devise invalide'),
    body('taxRate').optional().isFloat({ min: 0, max: 1 }).withMessage('Le taux de taxe doit être entre 0 et 1'),
    body('allowCashPayment').optional().isBoolean().withMessage('allowCashPayment doit être un booléen')
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const settings = await Settings.getSettings();
      await settings.updatePaymentSettings(req.body);
      
      sendSuccessResponse(res, 200, 'Paramètres de paiement mis à jour avec succès', {
        payment: settings.payment
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de paiement:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la mise à jour des paramètres de paiement', error.message);
    }
  }
);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Mettre à jour tous les paramètres
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Paramètres mis à jour avec succès
 */
router.put(
  '/',
  protect,
  authorize('admin', 'super_admin'),
  async (req, res) => {
    try {
      let settings = await Settings.findOne();
      
      if (!settings) {
        settings = await Settings.create(req.body);
      } else {
        // Mettre à jour les paramètres
        if (req.body.payment) {
          await settings.updatePaymentSettings(req.body.payment);
        }
        if (req.body.general) {
          settings.general = req.body.general;
        }
        if (req.body.security) {
          settings.security = req.body.security;
        }
        if (req.body.email) {
          settings.email = req.body.email;
        }
        await settings.save();
      }
      
      sendSuccessResponse(res, 200, 'Paramètres mis à jour avec succès', settings);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la mise à jour des paramètres', error.message);
    }
  }
);

module.exports = router;

