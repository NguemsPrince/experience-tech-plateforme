const Ticket = require('../models/Ticket');
const TicketComment = require('../models/TicketComment');
const TicketCategory = require('../models/TicketCategory');
const User = require('../models/User');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// @desc    Créer un nouveau ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

    const {
      subject,
      description,
      category,
      priority,
      contactEmail,
      contactPhone,
      tags,
      attachments
    } = req.body;

    // Vérifier que la catégorie existe
    if (category) {
      const categoryExists = await TicketCategory.findOne({ name: category, isActive: true });
      if (!categoryExists) {
        return sendErrorResponse(res, 400, 'Catégorie invalide');
      }
    }

    // Créer le ticket
    const ticket = await Ticket.create({
      subject,
      description,
      category: category || 'general',
      priority: priority || 'medium',
      user: req.user.id,
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone,
      tags: tags || [],
      source: 'web',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Ajouter le premier commentaire avec la description
    await TicketComment.create({
      ticket: ticket._id,
      author: req.user.id,
      content: description,
      type: 'comment',
      isPublic: true
    });

    // Assignation automatique selon la catégorie
    if (category) {
      const categoryConfig = await TicketCategory.findOne({ name: category });
      if (categoryConfig && categoryConfig.autoAssignTo) {
        ticket.assignedTo = categoryConfig.autoAssignTo;
        await ticket.save();
      }
    }

    // Populate les relations
    await ticket.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'assignedTo', select: 'firstName lastName email' }
    ]);

    sendSuccessResponse(res, 201, 'Ticket créé avec succès', ticket);
  } catch (error) {
    console.error('Create ticket error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la création du ticket');
  }
};

// @desc    Obtenir tous les tickets (avec filtres)
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      assignedTo,
      user,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construire le filtre
    const filter = {};

    // Filtres selon le rôle
    if (req.user.role === 'client' || req.user.role === 'student') {
      filter.user = req.user.id;
    } else if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      // Les admins voient tous les tickets
    } else {
      // Autres rôles voient seulement leurs tickets assignés
      filter.$or = [
        { user: req.user.id },
        { assignedTo: req.user.id }
      ];
    }

    // Appliquer les filtres
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (user) filter.user = user;

    // Recherche textuelle
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Options de tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tickets = await Ticket.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ticket.countDocuments(filter);

    sendSuccessResponse(res, 200, 'Tickets récupérés avec succès', {
      tickets,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la récupération des tickets');
  }
};

// @desc    Obtenir un ticket par ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .populate('statusHistory.changedBy', 'firstName lastName');

    if (!ticket) {
      return sendErrorResponse(res, 404, 'Ticket non trouvé');
    }

    // Vérifier les permissions
    if (req.user.role === 'client' || req.user.role === 'student') {
      if (ticket.user._id.toString() !== req.user.id) {
        return sendErrorResponse(res, 403, 'Accès refusé à ce ticket');
      }
    } else if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      if (ticket.user._id.toString() !== req.user.id && 
          ticket.assignedTo && ticket.assignedTo._id.toString() !== req.user.id) {
        return sendErrorResponse(res, 403, 'Accès refusé à ce ticket');
      }
    }

    // Récupérer les commentaires
    const comments = await TicketComment.find({ ticket: ticket._id })
      .populate('author', 'firstName lastName email role')
      .sort({ createdAt: 1 });

    sendSuccessResponse(res, 200, 'Ticket récupéré avec succès', {
      ticket,
      comments
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la récupération du ticket');
  }
};

// @desc    Mettre à jour un ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Données invalides', errors.array());
    }

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

    const {
      subject,
      description,
      category,
      priority,
      status,
      assignedTo,
      tags,
      dueDate
    } = req.body;

    // Mise à jour des champs
    if (subject) ticket.subject = subject;
    if (description) ticket.description = description;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (tags) ticket.tags = tags;
    if (dueDate) ticket.dueDate = dueDate;

    // Mise à jour du statut avec historique
    if (status && status !== ticket.status) {
      await ticket.updateStatus(status, req.user.id, req.body.statusComment || '');
    }

    await ticket.save();

    // Populate les relations
    await ticket.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'assignedTo', select: 'firstName lastName email' }
    ]);

    sendSuccessResponse(res, 200, 'Ticket mis à jour avec succès', ticket);
  } catch (error) {
    console.error('Update ticket error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la mise à jour du ticket');
  }
};

// @desc    Supprimer un ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin seulement)
const deleteTicket = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return sendErrorResponse(res, 404, 'Ticket non trouvé');
    }

    // Supprimer les commentaires associés
    await TicketComment.deleteMany({ ticket: ticket._id });

    // Supprimer le ticket
    await Ticket.findByIdAndDelete(req.params.id);

    sendSuccessResponse(res, 200, 'Ticket supprimé avec succès');
  } catch (error) {
    console.error('Delete ticket error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la suppression du ticket');
  }
};

// @desc    Obtenir les statistiques des tickets
// @route   GET /api/tickets/stats
// @access  Private (Admin/Support)
const getTicketStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          avgResolutionTime: { $avg: '$resolutionTime' },
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    const categoryStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgResolutionTime: { $avg: '$resolutionTime' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    sendSuccessResponse(res, 200, 'Statistiques récupérées avec succès', {
      overview: stats[0] || {},
      byCategory: categoryStats,
      byPriority: priorityStats
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la récupération des statistiques');
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  getTicketStats
};
