const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  // Informations contact
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Sujet et message
  subject: {
    type: String,
    required: [true, 'Le sujet est requis'],
    trim: true,
    maxlength: [200, 'Le sujet ne peut pas dépasser 200 caractères']
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
    trim: true,
    maxlength: [5000, 'Le message ne peut pas dépasser 5000 caractères']
  },
  
  // Catégorie
  category: {
    type: String,
    enum: ['general', 'support', 'sales', 'partnership', 'other'],
    default: 'general'
  },
  
  // Statut
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved', 'archived'],
    default: 'new'
  },
  
  // Suivi
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  replies: [{
    message: {
      type: String,
      required: true,
      trim: true
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    repliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Liens avec utilisateur si connecté
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Métadonnées
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'admin'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,
  
  // Dates importantes
  readAt: Date,
  repliedAt: Date,
  resolvedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ user: 1 });
contactMessageSchema.index({ assignedTo: 1 });
contactMessageSchema.index({ category: 1, status: 1 }); // Compound index for filtering
contactMessageSchema.index({ status: 1, createdAt: -1 }); // Compound index for admin queries

// Virtual for status display
contactMessageSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    new: 'Nouveau',
    read: 'Lu',
    replied: 'Répondu',
    resolved: 'Résolu',
    archived: 'Archivé'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for category display
contactMessageSchema.virtual('categoryDisplay').get(function() {
  const categoryMap = {
    general: 'Général',
    support: 'Support',
    sales: 'Ventes',
    partnership: 'Partenariat',
    other: 'Autre'
  };
  return categoryMap[this.category] || this.category;
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);

