const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur est requis']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumCategory',
    required: [true, 'La catégorie est requise']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Chaque tag ne peut pas dépasser 30 caractères']
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dislikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'off-topic', 'harassment', 'other'],
      required: true
    },
    description: {
      type: String,
      maxlength: [500, 'La description du signalement ne peut pas dépasser 500 caractères']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending'
    }
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
forumPostSchema.index({ title: 'text', content: 'text', tags: 'text' });
forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ author: 1, createdAt: -1 });
forumPostSchema.index({ isPinned: -1, lastActivity: -1 });
forumPostSchema.index({ isDeleted: 1 });

// Méthodes virtuelles
forumPostSchema.virtual('commentsCount', {
  ref: 'ForumComment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

forumPostSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

forumPostSchema.virtual('dislikesCount').get(function() {
  return this.dislikes.length;
});

forumPostSchema.virtual('reportsCount').get(function() {
  return this.reports.filter(report => report.status === 'pending').length;
});

// Méthodes d'instance
forumPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

forumPostSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userId.toString());
  const dislikeIndex = this.dislikes.findIndex(dislike => dislike.user.toString() === userId.toString());
  
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  } else {
    if (dislikeIndex > -1) {
      this.dislikes.splice(dislikeIndex, 1);
    }
    this.likes.push({ user: userId });
  }
  
  this.lastActivity = new Date();
  return this.save();
};

forumPostSchema.methods.toggleDislike = function(userId) {
  const dislikeIndex = this.dislikes.findIndex(dislike => dislike.user.toString() === userId.toString());
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userId.toString());
  
  if (dislikeIndex > -1) {
    this.dislikes.splice(dislikeIndex, 1);
  } else {
    if (likeIndex > -1) {
      this.likes.splice(likeIndex, 1);
    }
    this.dislikes.push({ user: userId });
  }
  
  this.lastActivity = new Date();
  return this.save();
};

forumPostSchema.methods.addReport = function(userId, reason, description) {
  const existingReport = this.reports.find(report => 
    report.user.toString() === userId.toString() && report.status === 'pending'
  );
  
  if (!existingReport) {
    this.reports.push({
      user: userId,
      reason,
      description
    });
  }
  
  return this.save();
};

// Middleware pre-save pour mettre à jour lastActivity
forumPostSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActivity = new Date();
  }
  next();
});

module.exports = mongoose.model('ForumPost', forumPostSchema);
