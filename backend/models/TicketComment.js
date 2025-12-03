const mongoose = require('mongoose');

const ticketCommentSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: [true, 'Le ticket est requis']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur est requis']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true
  },
  
  // Type de commentaire
  type: {
    type: String,
    enum: ['comment', 'note', 'system', 'resolution'],
    default: 'comment'
  },
  
  // Visibilité
  isPublic: {
    type: Boolean,
    default: true
  },
  isInternal: {
    type: Boolean,
    default: false
  },
  
  // Métadonnées Freshdesk
  freshdeskId: {
    type: Number,
    unique: true,
    sparse: true
  },
  
  // Pièces jointes
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Métadonnées
  ipAddress: String,
  userAgent: String,
  
  // Édition
  editedAt: Date,
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  editReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
ticketCommentSchema.index({ ticket: 1, createdAt: -1 });
ticketCommentSchema.index({ author: 1 });
ticketCommentSchema.index({ type: 1 });

// Virtual pour vérifier si le commentaire est édité
ticketCommentSchema.virtual('isEdited').get(function() {
  return !!this.editedAt;
});

// Méthode pour marquer comme édité
ticketCommentSchema.methods.markAsEdited = function(editedBy, reason = '') {
  this.editedAt = new Date();
  this.editedBy = editedBy;
  this.editReason = reason;
  return this.save();
};

module.exports = mongoose.model('TicketComment', ticketCommentSchema);
