const express = require('express');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { protect, authorize } = require('../middleware/auth');
const PrepaidCard = require('../models/PrepaidCard');

const router = express.Router();

// @desc    Validate a prepaid card
// @route   POST /api/prepaid-cards/validate
// @access  Private
router.post('/validate', protect, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return sendErrorResponse(res, 400, 'Le code de la carte est requis');
    }

    const card = await PrepaidCard.findOne({ code: code.toUpperCase() });

    if (!card) {
      return sendErrorResponse(res, 404, 'Code de carte invalide');
    }

    // Vérifier si la carte est valide
    if (card.status !== 'active') {
      return sendErrorResponse(res, 400, 'Cette carte a déjà été utilisée ou est désactivée');
    }

    if (card.expiresAt && card.expiresAt < new Date()) {
      card.status = 'expired';
      await card.save();
      return sendErrorResponse(res, 400, 'Cette carte a expiré');
    }

    sendSuccessResponse(res, 200, 'Carte valide', {
      card: {
        code: card.code,
        value: card.value,
        currency: card.currency,
        isValid: card.isValid
      }
    });

  } catch (error) {
    console.error('Validate prepaid card error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Create a prepaid card
// @route   POST /api/prepaid-cards
// @access  Private (Admin only)
router.post('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { value, currency, expiresAt, notes } = req.body;

    if (!value || value <= 0) {
      return sendErrorResponse(res, 400, 'La valeur de la carte est requise et doit être positive');
    }

    // Générer un code unique
    let code;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      code = PrepaidCard.generateCode('EXP');
      const existingCard = await PrepaidCard.findOne({ code });
      if (!existingCard) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return sendErrorResponse(res, 500, 'Erreur lors de la génération du code unique');
    }

    const card = await PrepaidCard.create({
      code,
      value,
      currency: currency || 'XAF',
      status: 'active',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      notes,
      createdBy: req.user.id
    });

    sendSuccessResponse(res, 201, 'Carte prépayée créée avec succès', { card });

  } catch (error) {
    console.error('Create prepaid card error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get all prepaid cards
// @route   GET /api/prepaid-cards
// @access  Private (Admin only)
router.get('/', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const cards = await PrepaidCard.find(query)
      .populate('usedBy', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PrepaidCard.countDocuments(query);

    sendSuccessResponse(res, 200, 'Cartes prépayées récupérées avec succès', {
      cards,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get prepaid cards error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get a single prepaid card
// @route   GET /api/prepaid-cards/:id
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const card = await PrepaidCard.findById(req.params.id)
      .populate('usedBy', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email');

    if (!card) {
      return sendErrorResponse(res, 404, 'Carte prépayée non trouvée');
    }

    sendSuccessResponse(res, 200, 'Carte prépayée récupérée avec succès', { card });

  } catch (error) {
    console.error('Get prepaid card error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update a prepaid card
// @route   PUT /api/prepaid-cards/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { status, expiresAt, notes } = req.body;

    const card = await PrepaidCard.findById(req.params.id);

    if (!card) {
      return sendErrorResponse(res, 404, 'Carte prépayée non trouvée');
    }

    if (status) card.status = status;
    if (expiresAt !== undefined) card.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (notes !== undefined) card.notes = notes;

    await card.save();

    sendSuccessResponse(res, 200, 'Carte prépayée mise à jour avec succès', { card });

  } catch (error) {
    console.error('Update prepaid card error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Delete a prepaid card
// @route   DELETE /api/prepaid-cards/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const card = await PrepaidCard.findById(req.params.id);

    if (!card) {
      return sendErrorResponse(res, 404, 'Carte prépayée non trouvée');
    }

    // Ne pas supprimer une carte déjà utilisée
    if (card.status === 'used') {
      return sendErrorResponse(res, 400, 'Impossible de supprimer une carte déjà utilisée');
    }

    await card.remove();

    sendSuccessResponse(res, 200, 'Carte prépayée supprimée avec succès');

  } catch (error) {
    console.error('Delete prepaid card error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;


