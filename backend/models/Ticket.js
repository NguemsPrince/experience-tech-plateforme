const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  // Informations de base
  ticketNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: [true, 'Le sujet est requis'],
    trim: true,
    maxlength: [200, 'Le sujet ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  
  // Relations
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Classification
  category: {
    type: String,
    enum: [
      'technical',      // Problème technique
      'billing',        // Facturation
      'training',       // Formation
      'service',        // Service client
      'bug_report',     // Signalement de bug
      'feature_request', // Demande de fonctionnalité
      'general'         // Général
    ],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'pending_customer', 'resolved', 'closed'],
    default: 'open'
  },
  
  // Métadonnées Freshdesk
  freshdeskId: {
    type: Number,
    unique: true,
    sparse: true
  },
  freshdeskUrl: String,
  
  // Informations de contact
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  contactPhone: String,
  
  // Suivi
  tags: [{
    type: String,
    trim: true
  }],
  dueDate: Date,
  resolutionTime: Number, // en minutes
  
  // Statistiques
  responseTime: Number, // temps de première réponse en minutes
  firstResponseAt: Date,
  resolvedAt: Date,
  closedAt: Date,
  
  // Satisfaction client
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5
  },
  satisfactionComment: String,
  
  // Métadonnées système
  source: {
    type: String,
    enum: ['web', 'email', 'phone', 'api', 'freshdesk'],
    default: 'web'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Données techniques
  browserInfo: String,
  userAgent: String,
  ipAddress: String,
  
  // Historique des changements
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    comment: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
ticketSchema.index({ user: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ category: 1, priority: 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ status: 1, priority: 1 });

// Virtual pour le temps de résolution
ticketSchema.virtual('resolutionTimeHours').get(function() {
  if (this.resolutionTime) {
    return Math.round(this.resolutionTime / 60 * 100) / 100;
  }
  return null;
});

// Virtual pour le temps de réponse
ticketSchema.virtual('responseTimeHours').get(function() {
  if (this.responseTime) {
    return Math.round(this.responseTime / 60 * 100) / 100;
  }
  return null;
});

// Virtual pour le statut en français
ticketSchema.virtual('statusLabel').get(function() {
  const statusLabels = {
    'open': 'Ouvert',
    'in_progress': 'En cours',
    'pending_customer': 'En attente client',
    'resolved': 'Résolu',
    'closed': 'Fermé'
  };
  return statusLabels[this.status] || this.status;
});

// Virtual pour la priorité en français
ticketSchema.virtual('priorityLabel').get(function() {
  const priorityLabels = {
    'low': 'Faible',
    'medium': 'Moyenne',
    'high': 'Élevée',
    'urgent': 'Urgente'
  };
  return priorityLabels[this.priority] || this.priority;
});

// Virtual pour la catégorie en français
ticketSchema.virtual('categoryLabel').get(function() {
  const categoryLabels = {
    'technical': 'Technique',
    'billing': 'Facturation',
    'training': 'Formation',
    'service': 'Service client',
    'bug_report': 'Signalement de bug',
    'feature_request': 'Demande de fonctionnalité',
    'general': 'Général'
  };
  return categoryLabels[this.category] || this.category;
});

// Méthode pour générer un numéro de ticket unique
ticketSchema.statics.generateTicketNumber = async function() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const prefix = `ET-${year}${month}${day}`;
  
  // Compter les tickets du jour
  const count = await this.countDocuments({
    ticketNumber: { $regex: `^${prefix}` }
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}-${sequence}`;
};

// Méthode pour mettre à jour le statut avec historique
ticketSchema.methods.updateStatus = function(newStatus, changedBy, comment = '') {
  this.statusHistory.push({
    status: this.status,
    changedBy: changedBy,
    changedAt: new Date(),
    comment: comment
  });
  
  this.status = newStatus;
  
  // Mettre à jour les timestamps selon le statut
  if (newStatus === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  if (newStatus === 'closed' && !this.closedAt) {
    this.closedAt = new Date();
  }
  
  return this.save();
};

// Middleware pour générer le numéro de ticket avant sauvegarde
ticketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    this.ticketNumber = await this.constructor.generateTicketNumber();
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
