const mongoose = require('mongoose');

const ticketCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    unique: true,
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
  },
  
  // Configuration
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  
  // Assignation automatique
  autoAssignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // SLA (Service Level Agreement)
  sla: {
    responseTime: {
      type: Number, // en heures
      default: 24
    },
    resolutionTime: {
      type: Number, // en heures
      default: 72
    }
  },
  
  // Priorité par défaut
  defaultPriority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Tags par défaut
  defaultTags: [{
    type: String,
    trim: true
  }],
  
  // Template de réponse
  responseTemplate: {
    subject: String,
    content: String
  },
  
  // Métadonnées
  color: {
    type: String,
    default: '#3B82F6'
  },
  icon: {
    type: String,
    default: 'help-circle'
  },
  
  // Statistiques
  ticketCount: {
    type: Number,
    default: 0
  },
  averageResolutionTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index
ticketCategorySchema.index({ name: 1 });
ticketCategorySchema.index({ isActive: 1 });

// Virtual pour le temps de réponse en minutes
ticketCategorySchema.virtual('responseTimeMinutes').get(function() {
  return this.sla.responseTime * 60;
});

// Virtual pour le temps de résolution en minutes
ticketCategorySchema.virtual('resolutionTimeMinutes').get(function() {
  return this.sla.resolutionTime * 60;
});

// Méthode pour mettre à jour les statistiques
ticketCategorySchema.methods.updateStats = async function() {
  const Ticket = mongoose.model('Ticket');
  
  const stats = await Ticket.aggregate([
    { $match: { category: this.name } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgResolutionTime: { $avg: '$resolutionTime' }
      }
    }
  ]);
  
  if (stats.length > 0) {
    this.ticketCount = stats[0].count;
    this.averageResolutionTime = Math.round(stats[0].avgResolutionTime || 0);
  }
  
  return this.save();
};

// Middleware pour s'assurer qu'une seule catégorie par défaut
ticketCategorySchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('TicketCategory', ticketCategorySchema);
