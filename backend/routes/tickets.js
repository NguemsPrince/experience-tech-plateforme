const express = require('express');
const { body } = require('express-validator');
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  getTicketStats
} = require('../controllers/ticketController');
const {
  addComment,
  getComments,
  updateComment,
  deleteComment
} = require('../controllers/ticketCommentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const ticketValidation = [
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Le sujet doit contenir entre 5 et 200 caractères'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La description doit contenir au moins 10 caractères'),
  body('category')
    .optional()
    .isIn(['technical', 'billing', 'training', 'service', 'bug_report', 'feature_request', 'general'])
    .withMessage('Catégorie invalide'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priorité invalide'),
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Email de contact invalide'),
  body('contactPhone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Numéro de téléphone invalide')
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le contenu du commentaire est requis'),
  body('type')
    .optional()
    .isIn(['comment', 'note', 'system', 'resolution'])
    .withMessage('Type de commentaire invalide')
];

// Routes principales des tickets
router.route('/')
  .post(protect, ticketValidation, createTicket)
  .get(protect, getTickets);

router.route('/stats')
  .get(protect, authorize('admin', 'super_admin'), getTicketStats);

router.route('/:id')
  .get(protect, getTicket)
  .put(protect, ticketValidation, updateTicket)
  .delete(protect, authorize('admin', 'super_admin'), deleteTicket);

// Routes des commentaires
router.route('/:id/comments')
  .post(protect, commentValidation, addComment)
  .get(protect, getComments);

router.route('/:id/comments/:commentId')
  .put(protect, commentValidation, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
