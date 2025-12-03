const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  // Informations sur le service
  serviceId: {
    type: String,
    required: [true, 'L\'ID du service est requis'],
    trim: true
  },
  serviceName: {
    type: String,
    trim: true
  },
  
  // Informations client
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
  
  // Détails de la demande
  requirements: {
    type: String,
    trim: true,
    maxlength: [2000, 'Les exigences ne peuvent pas dépasser 2000 caractères']
  },
  budget: {
    type: Number,
    min: [0, 'Le budget ne peut pas être négatif']
  },
  
  // Statut de la demande
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'quoted', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  
  // Suivi
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
  },
  
  // Dates importantes
  quotedAt: Date,
  respondedAt: Date,
  resolvedAt: Date,
  
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
  userAgent: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
quoteRequestSchema.index({ serviceId: 1 });
quoteRequestSchema.index({ email: 1 });
quoteRequestSchema.index({ status: 1 });
quoteRequestSchema.index({ createdAt: -1 });
quoteRequestSchema.index({ user: 1 });
quoteRequestSchema.index({ assignedTo: 1 });
quoteRequestSchema.index({ status: 1, createdAt: -1 }); // Compound index for admin queries

// Virtual for status display
quoteRequestSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'En attente',
    in_progress: 'En cours',
    quoted: 'Devis envoyé',
    accepted: 'Accepté',
    rejected: 'Refusé',
    cancelled: 'Annulé'
  };
  return statusMap[this.status] || this.status;
});

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);

