const TicketComment = require('../models/TicketComment');
const Ticket = require('../models/Ticket');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { validationResult } = require('express-validator');

// @desc    Ajouter un commentaire à un ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const { content, type = 'comment', isPublic = true, isInternal = false } = req.body;

    // Vérifier que le ticket existe
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return sendErrorResponse(res, 404, 'Ticket non trouvé');
    }

    // Vérifier les permissions
    if (req.user.role === 'client' || req.user.role === 'student') {
      if (ticket.user.toString() !== req.user.id) {
        return sendErrorResponse(res, 403, 'Accès refusé à ce ticket');
      }
    }

    // Créer le commentaire
    const comment = await TicketComment.create({
      ticket: req.params.id,
      author: req.user.id,
      content,
      type,
      isPublic,
      isInternal,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Populate l'auteur
    await comment.populate('author', 'firstName lastName email role');

    // Mettre à jour le statut du ticket si nécessaire
    if (req.user.role === 'client' || req.user.role === 'student') {
      if (ticket.status === 'resolved') {
        await ticket.updateStatus('open', req.user.id, 'Nouveau commentaire du client');
      }
    }

    sendSuccessResponse(res, 201, 'Commentaire ajouté avec succès', comment);
  } catch (error) {
    console.error('Add comment error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de l\'ajout du commentaire');
  }
};

// @desc    Obtenir les commentaires d'un ticket
// @route   GET /api/tickets/:id/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Vérifier que le ticket existe
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return sendErrorResponse(res, 404, 'Ticket non trouvé');
    }

    // Vérifier les permissions
    if (req.user.role === 'client' || req.user.role === 'student') {
      if (ticket.user.toString() !== req.user.id) {
        return sendErrorResponse(res, 403, 'Accès refusé à ce ticket');
      }
    }

    // Construire le filtre pour les commentaires
    const filter = { ticket: req.params.id };
    
    // Les clients ne voient que les commentaires publics
    if (req.user.role === 'client' || req.user.role === 'student') {
      filter.isPublic = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const comments = await TicketComment.find(filter)
      .populate('author', 'firstName lastName email role')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TicketComment.countDocuments(filter);

    sendSuccessResponse(res, 200, 'Commentaires récupérés avec succès', {
      comments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la récupération des commentaires');
  }
};

// @desc    Mettre à jour un commentaire
// @route   PUT /api/tickets/:id/comments/:commentId
// @access  Private
const updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const { content, editReason } = req.body;

    const comment = await TicketComment.findById(req.params.commentId);
    if (!comment) {
      return sendErrorResponse(res, 404, 'Commentaire non trouvé');
    }

    // Vérifier les permissions
    if (req.user.role === 'client' || req.user.role === 'student') {
      if (comment.author.toString() !== req.user.id) {
        return sendErrorResponse(res, 403, 'Accès refusé à ce commentaire');
      }
    }

    // Mettre à jour le contenu
    comment.content = content;
    await comment.markAsEdited(req.user.id, editReason);

    // Populate l'auteur
    await comment.populate('author', 'firstName lastName email role');

    sendSuccessResponse(res, 200, 'Commentaire mis à jour avec succès', comment);
  } catch (error) {
    console.error('Update comment error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la mise à jour du commentaire');
  }
};

// @desc    Supprimer un commentaire
// @route   DELETE /api/tickets/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await TicketComment.findById(req.params.commentId);
    if (!comment) {
      return sendErrorResponse(res, 404, 'Commentaire non trouvé');
    }

    // Vérifier les permissions
    if (req.user.role === 'client' || req.user.role === 'student') {
      if (comment.author.toString() !== req.user.id) {
        return sendErrorResponse(res, 403, 'Accès refusé à ce commentaire');
      }
    } else if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      if (comment.author.toString() !== req.user.id) {
        return sendErrorResponse(res, 403, 'Accès refusé à ce commentaire');
      }
    }

    await TicketComment.findByIdAndDelete(req.params.commentId);

    sendSuccessResponse(res, 200, 'Commentaire supprimé avec succès');
  } catch (error) {
    console.error('Delete comment error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la suppression du commentaire');
  }
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment
};
