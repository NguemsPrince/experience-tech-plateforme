const mongoose = require('mongoose');

const forumCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
  },
  icon: {
    type: String,
    default: 'ChatBubbleLeftRightIcon'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  topicsCount: {
    type: Number,
    default: 0
  },
  postsCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
forumCategorySchema.index({ name: 1 });
forumCategorySchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('ForumCategory', forumCategorySchema);
