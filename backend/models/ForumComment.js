const mongoose = require('mongoose');

const forumCommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true,
    maxlength: [2000, 'Le commentaire ne peut pas dépasser 2000 caractères']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur est requis']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: [true, 'Le post est requis']
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumComment',
    default: null
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
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
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
  },
  isSolution: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
forumCommentSchema.index({ post: 1, createdAt: 1 });
forumCommentSchema.index({ author: 1, createdAt: -1 });
forumCommentSchema.index({ parentComment: 1 });
forumCommentSchema.index({ isDeleted: 1 });

// Méthodes virtuelles
forumCommentSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

forumCommentSchema.virtual('dislikesCount').get(function() {
  return this.dislikes.length;
});

forumCommentSchema.virtual('repliesCount', {
  ref: 'ForumComment',
  localField: '_id',
  foreignField: 'parentComment',
  count: true
});

forumCommentSchema.virtual('reportsCount').get(function() {
  return this.reports.filter(report => report.status === 'pending').length;
});

// Méthodes d'instance
forumCommentSchema.methods.toggleLike = function(userId) {
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
  
  return this.save();
};

forumCommentSchema.methods.toggleDislike = function(userId) {
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
  
  return this.save();
};

forumCommentSchema.methods.addReport = function(userId, reason, description) {
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

forumCommentSchema.methods.markAsSolution = function() {
  this.isSolution = true;
  return this.save();
};

forumCommentSchema.methods.unmarkAsSolution = function() {
  this.isSolution = false;
  return this.save();
};

// Middleware pre-save pour mettre à jour le post parent
forumCommentSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Mettre à jour lastActivity du post parent
    const ForumPost = mongoose.model('ForumPost');
    await ForumPost.findByIdAndUpdate(this.post, { lastActivity: new Date() });
  }
  next();
});

// Middleware post-save pour mettre à jour les compteurs
forumCommentSchema.post('save', async function(doc) {
  if (doc.isNew) {
    // Mettre à jour le compteur de commentaires du post
    const ForumPost = mongoose.model('ForumPost');
    await ForumPost.findByIdAndUpdate(doc.post, { $inc: { commentsCount: 1 } });
  }
});

// Middleware pre-remove pour mettre à jour les compteurs
forumCommentSchema.pre('remove', async function(next) {
  const ForumPost = mongoose.model('ForumPost');
  await ForumPost.findByIdAndUpdate(this.post, { $inc: { commentsCount: -1 } });
  next();
});

module.exports = mongoose.model('ForumComment', forumCommentSchema);
