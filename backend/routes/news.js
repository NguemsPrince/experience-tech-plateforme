const express = require('express');
const { query, param, validationResult } = require('express-validator');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { sanitizeSearchQuery, validatePagination } = require('../utils/security');

const router = express.Router();

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, 'Données invalides', errors.array());
  }
  return null;
};

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const articles = [
      {
        id: 'news-1',
        title: 'Nouvelle formation en IA disponible',
        excerpt: 'Découvrez notre nouvelle formation en intelligence artificielle',
        content: 'Contenu complet de l\'article...',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3',
        category: 'Formation',
        author: 'Équipe Expérience Tech',
        publishedAt: '2024-01-15',
        tags: ['IA', 'Formation', 'Technologie']
      }
    ];

    sendSuccessResponse(res, 200, 'Articles récupérés', articles);
  } catch (error) {
    console.error('Get news error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;
