const express = require('express');
const { protect } = require('../middleware/auth');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

const ForumCategory = require('../models/ForumCategory');
const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');
const User = require('../models/User');
const UserReputation = require('../models/UserReputation');
const ForumNotification = require('../models/ForumNotification');

const router = express.Router();

// ==================== CATEGORIES ====================

// @desc    Get all forum categories
// @route   GET /api/forum/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await ForumCategory.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .select('-__v');

    sendSuccessResponse(res, 200, 'Catégories récupérées', categories);
  } catch (error) {
    console.error('Get forum categories error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Create a new forum category (Admin only)
// @route   POST /api/forum/categories
// @access  Private/Admin
router.post('/categories', protect, async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const { name, description, icon, color } = req.body;

    // Validation basique
    if (!name || !description) {
      return sendErrorResponse(res, 400, 'Le nom et la description sont requis');
    }

    if (name.length > 50 || description.length > 200) {
      return sendErrorResponse(res, 400, 'Le nom ou la description est trop long');
    }

    // Vérifier si la catégorie existe déjà
    const existingCategory = await ForumCategory.findOne({ name });
    if (existingCategory) {
      return sendErrorResponse(res, 400, 'Une catégorie avec ce nom existe déjà');
    }

    const category = new ForumCategory({
      name,
      description,
      icon: icon || 'ChatBubbleLeftRightIcon',
      color: color || '#3B82F6'
    });

    await category.save();

    sendSuccessResponse(res, 201, 'Catégorie créée avec succès', category);
  } catch (error) {
    console.error('Create forum category error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== POSTS ====================

// @desc    Get all forum posts with pagination and filters
// @route   GET /api/forum/posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const sort = req.query.sort || 'newest';
    const search = req.query.search;

    // Construire le filtre
    let filter = { isDeleted: false };
    
    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Construire le tri
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { isPinned: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { isPinned: -1, createdAt: 1 };
        break;
      case 'mostActive':
        sortOptions = { isPinned: -1, lastActivity: -1 };
        break;
      case 'mostLiked':
        sortOptions = { isPinned: -1, 'likesCount': -1 };
        break;
      default:
        sortOptions = { isPinned: -1, createdAt: -1 };
    }

    const posts = await ForumPost.find(filter)
      .populate('author', 'firstName lastName email avatar')
      .populate('category', 'name color icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-content -reports -__v');

    const total = await ForumPost.countDocuments(filter);

    // Mettre à jour les vues pour chaque post
    posts.forEach(post => {
      post.incrementViews();
    });

    sendSuccessResponse(res, 200, 'Posts récupérés', {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get forum posts error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get a single forum post by ID
// @route   GET /api/forum/posts/:id
// @access  Public
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'firstName lastName email avatar role')
      .populate('category', 'name color icon')
      .populate({
        path: 'likes.user',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'dislikes.user',
        select: 'firstName lastName email'
      });

    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    // Ajouter un champ name virtuel pour la compatibilité frontend
    if (post.author) {
      post.author.name = `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || post.author.email;
    }
    if (post.likes && post.likes.length > 0) {
      post.likes.forEach(like => {
        if (like.user) {
          like.user.name = `${like.user.firstName || ''} ${like.user.lastName || ''}`.trim() || like.user.email || '';
        }
      });
    }
    if (post.dislikes && post.dislikes.length > 0) {
      post.dislikes.forEach(dislike => {
        if (dislike.user) {
          dislike.user.name = `${dislike.user.firstName || ''} ${dislike.user.lastName || ''}`.trim() || dislike.user.email || '';
        }
      });
    }

    // Incrémenter les vues
    await post.incrementViews();

    sendSuccessResponse(res, 200, 'Post récupéré', post);
  } catch (error) {
    console.error('Get forum post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Create a new forum post
// @route   POST /api/forum/posts
// @access  Private
router.post('/posts', protect, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    // Validation basique
    if (!title || !title.trim()) {
      return sendErrorResponse(res, 400, 'Le titre est requis');
    }

    if (!content || !content.trim()) {
      return sendErrorResponse(res, 400, 'Le contenu est requis');
    }

    if (!category) {
      return sendErrorResponse(res, 400, 'La catégorie est requise');
    }

    if (title.trim().length > 200) {
      return sendErrorResponse(res, 400, 'Le titre ne peut pas dépasser 200 caractères');
    }

    if (content.trim().length < 10) {
      return sendErrorResponse(res, 400, 'Le contenu doit contenir au moins 10 caractères');
    }

    // Vérifier que la catégorie existe
    const categoryExists = await ForumCategory.findById(category);
    if (!categoryExists) {
      return sendErrorResponse(res, 400, 'Catégorie non trouvée');
    }

    const post = new ForumPost({
      title: title.trim(),
      content: content.trim(),
      author: req.user.id,
      category,
      tags: Array.isArray(tags) ? tags.filter(tag => tag && tag.trim()).map(tag => tag.trim().toLowerCase()) : []
    });

    await post.save();

    // Mettre à jour les compteurs de la catégorie
    await ForumCategory.findByIdAndUpdate(category, {
      $inc: { topicsCount: 1 },
      lastActivity: new Date()
    });

    // Populer les données pour la réponse
    await post.populate('author', 'firstName lastName email avatar role');
    await post.populate('category', 'name color icon');

    // Ajouter un champ name virtuel pour la compatibilité frontend
    if (post.author) {
      post.author.name = `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || post.author.email;
    }

    sendSuccessResponse(res, 201, 'Post créé avec succès', post);
  } catch (error) {
    console.error('Create forum post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Toggle like on a forum post
// @route   POST /api/forum/posts/:id/like
// @access  Private
router.post('/posts/:id/like', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    await post.toggleLike(req.user.id);

    sendSuccessResponse(res, 200, 'Like mis à jour', {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount
    });
  } catch (error) {
    console.error('Toggle post like error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Toggle dislike on a forum post
// @route   POST /api/forum/posts/:id/dislike
// @access  Private
router.post('/posts/:id/dislike', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    await post.toggleDislike(req.user.id);

    sendSuccessResponse(res, 200, 'Dislike mis à jour', {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount
    });
  } catch (error) {
    console.error('Toggle post dislike error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Report a forum post
// @route   POST /api/forum/posts/:id/report
// @access  Private
router.post('/posts/:id/report', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    const { reason, description } = req.body;

    if (!reason) {
      return sendErrorResponse(res, 400, 'La raison du signalement est requise');
    }

    await post.addReport(req.user.id, reason, description);

    sendSuccessResponse(res, 200, 'Signalement envoyé');
  } catch (error) {
    console.error('Report post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== COMMENTS ====================

// @desc    Get comments for a forum post
// @route   GET /api/forum/posts/:id/comments
// @access  Public
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    const comments = await ForumComment.find({
      post: req.params.id,
      isDeleted: false,
      parentComment: null
    })
      .populate('author', 'firstName lastName email avatar role')
      .populate({
        path: 'likes.user',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'dislikes.user',
        select: 'firstName lastName email'
      })
      .sort({ isSolution: -1, createdAt: 1 })
      .skip(skip)
      .limit(limit);

    // Récupérer les réponses pour chaque commentaire
    for (let comment of comments) {
      const replies = await ForumComment.find({
        parentComment: comment._id,
        isDeleted: false
      })
        .populate('author', 'firstName lastName email avatar role')
        .sort({ createdAt: 1 })
        .limit(5); // Limiter à 5 réponses par commentaire pour les performances
      
      // Ajouter un champ name virtuel pour les réponses
      replies.forEach(reply => {
        if (reply.author) {
          reply.author.name = `${reply.author.firstName || ''} ${reply.author.lastName || ''}`.trim() || reply.author.email;
        }
      });
      
      // Ajouter un champ name virtuel pour le commentaire principal
      if (comment.author) {
        comment.author.name = `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim() || comment.author.email;
      }
      
      comment.replies = replies;
    }

    const total = await ForumComment.countDocuments({
      post: req.params.id,
      isDeleted: false,
      parentComment: null
    });

    sendSuccessResponse(res, 200, 'Commentaires récupérés', {
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Create a new comment
// @route   POST /api/forum/posts/:id/comments
// @access  Private
router.post('/posts/:id/comments', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    if (post.isLocked && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Ce post est verrouillé');
    }

    const { content, parentComment } = req.body;

    if (!content || content.trim().length === 0) {
      return sendErrorResponse(res, 400, 'Le contenu du commentaire est requis');
    }

    if (content.length > 2000) {
      return sendErrorResponse(res, 400, 'Le commentaire ne peut pas dépasser 2000 caractères');
    }

    // Vérifier le commentaire parent si spécifié
    if (parentComment) {
      const parent = await ForumComment.findById(parentComment);
      if (!parent || parent.isDeleted || parent.post.toString() !== req.params.id) {
        return sendErrorResponse(res, 400, 'Commentaire parent invalide');
      }
    }

    const comment = new ForumComment({
      content: content.trim(),
      author: req.user.id,
      post: req.params.id,
      parentComment: parentComment || null
    });

    await comment.save();

    // Populer les données pour la réponse
    await comment.populate('author', 'firstName lastName email avatar role');
    // Ajouter un champ name virtuel pour la compatibilité frontend
    if (comment.author) {
      comment.author.name = `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim() || comment.author.email;
    }

    sendSuccessResponse(res, 201, 'Commentaire créé avec succès', comment);
  } catch (error) {
    console.error('Create comment error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Toggle like on a comment
// @route   POST /api/forum/comments/:id/like
// @access  Private
router.post('/comments/:id/like', protect, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);
    if (!comment || comment.isDeleted) {
      return sendErrorResponse(res, 404, 'Commentaire non trouvé');
    }

    await comment.toggleLike(req.user.id);

    sendSuccessResponse(res, 200, 'Like mis à jour', {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount
    });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Mark comment as solution
// @route   POST /api/forum/comments/:id/solution
// @access  Private
router.post('/comments/:id/solution', protect, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);
    if (!comment || comment.isDeleted) {
      return sendErrorResponse(res, 404, 'Commentaire non trouvé');
    }

    // Vérifier que l'utilisateur est l'auteur du post ou admin
    const post = await ForumPost.findById(comment.post);
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    // Désactiver les autres solutions du même post
    await ForumComment.updateMany(
      { post: comment.post, _id: { $ne: comment._id } },
      { isSolution: false }
    );

    await comment.markAsSolution();

    sendSuccessResponse(res, 200, 'Commentaire marqué comme solution');
  } catch (error) {
    console.error('Mark comment as solution error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Delete a comment
// @route   DELETE /api/forum/comments/:id
// @access  Private
router.delete('/comments/:id', protect, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);
    if (!comment || comment.isDeleted) {
      return sendErrorResponse(res, 404, 'Commentaire non trouvé');
    }

    // Vérifier les permissions (auteur ou admin)
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    // Soft delete
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.deletedBy = req.user.id;
    await comment.save();

    sendSuccessResponse(res, 200, 'Commentaire supprimé avec succès');
  } catch (error) {
    console.error('Delete comment error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== ADMIN ROUTES ====================

// @desc    Get all reported posts and comments (Admin only)
// @route   GET /api/forum/admin/reports
// @access  Private/Admin
router.get('/admin/reports', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const reportedPosts = await ForumPost.find({
      'reports.status': 'pending',
      isDeleted: false
    })
      .populate('author', 'firstName lastName email')
      .populate('category', 'name')
      .populate('reports.user', 'firstName lastName email')
      .select('title reports createdAt');

    const reportedComments = await ForumComment.find({
      'reports.status': 'pending',
      isDeleted: false
    })
      .populate('author', 'firstName lastName email')
      .populate('post', 'title')
      .populate('reports.user', 'firstName lastName email')
      .select('content reports createdAt');

    sendSuccessResponse(res, 200, 'Signalements récupérés', {
      posts: reportedPosts,
      comments: reportedComments
    });
  } catch (error) {
    console.error('Get reports error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update report status (Admin only)
// @route   PUT /api/forum/admin/reports/:type/:id
// @access  Private/Admin
router.put('/admin/reports/:type/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const { type, id } = req.params;
    const { action, reportId } = req.body;

    let item;
    if (type === 'post') {
      item = await ForumPost.findById(id);
    } else if (type === 'comment') {
      item = await ForumComment.findById(id);
    } else {
      return sendErrorResponse(res, 400, 'Type invalide');
    }

    if (!item) {
      return sendErrorResponse(res, 404, 'Contenu non trouvé');
    }

    const report = item.reports.id(reportId);
    if (!report) {
      return sendErrorResponse(res, 404, 'Signalement non trouvé');
    }

    if (action === 'dismiss') {
      report.status = 'dismissed';
    } else if (action === 'approve') {
      report.status = 'reviewed';
      // Supprimer le contenu
      item.isDeleted = true;
      item.deletedAt = new Date();
      item.deletedBy = req.user.id;
    }

    await item.save();

    sendSuccessResponse(res, 200, 'Signalement traité');
  } catch (error) {
    console.error('Update report status error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Pin/Unpin a post (Admin only)
// @route   POST /api/forum/admin/posts/:id/pin
// @access  Private/Admin
router.post('/admin/posts/:id/pin', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    post.isPinned = !post.isPinned;
    await post.save();

    sendSuccessResponse(res, 200, `Post ${post.isPinned ? 'épinglé' : 'désépinglé'}`);
  } catch (error) {
    console.error('Pin post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Lock/Unlock a post (Admin only)
// @route   POST /api/forum/admin/posts/:id/lock
// @access  Private/Admin
router.post('/admin/posts/:id/lock', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    post.isLocked = !post.isLocked;
    await post.save();

    sendSuccessResponse(res, 200, `Post ${post.isLocked ? 'verrouillé' : 'déverrouillé'}`);
  } catch (error) {
    console.error('Lock post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get forum statistics (Admin only)
// @route   GET /api/forum/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const totalPosts = await ForumPost.countDocuments({ isDeleted: false });
    const totalComments = await ForumComment.countDocuments({ isDeleted: false });
    const totalUsers = await User.countDocuments({ isActive: true });
    const pendingReports = await ForumPost.countDocuments({ 'reports.status': 'pending' }) +
                          await ForumComment.countDocuments({ 'reports.status': 'pending' });

    const recentPosts = await ForumPost.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'firstName lastName email')
      .populate('category', 'name');

    const topContributors = await UserReputation.find()
      .sort({ points: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email avatar');

    sendSuccessResponse(res, 200, 'Statistiques récupérées', {
      overview: {
        totalPosts,
        totalComments,
        totalUsers,
        pendingReports
      },
      recentPosts,
      topContributors
    });
  } catch (error) {
    console.error('Get forum stats error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== REPUTATION & BADGES ====================

// @desc    Get user reputation
// @route   GET /api/forum/reputation/:userId
// @access  Public
router.get('/reputation/:userId', async (req, res) => {
  try {
    let reputation = await UserReputation.findOne({ user: req.params.userId })
      .populate('user', 'firstName lastName email avatar');

    if (!reputation) {
      // Créer une réputation par défaut si elle n'existe pas
      reputation = new UserReputation({
        user: req.params.userId
      });
      await reputation.save();
      await reputation.populate('user', 'firstName lastName email avatar');
    }

    sendSuccessResponse(res, 200, 'Réputation récupérée', reputation);
  } catch (error) {
    console.error('Get reputation error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get leaderboard
// @route   GET /api/forum/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaderboard = await UserReputation.getLeaderboard(limit, skip);
    const total = await UserReputation.countDocuments();

    sendSuccessResponse(res, 200, 'Classement récupéré', {
      leaderboard,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== NOTIFICATIONS ====================

// @desc    Get user notifications
// @route   GET /api/forum/notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unreadOnly === 'true';

    const filter = { recipient: req.user.id };
    if (unreadOnly) {
      filter.isRead = false;
    }

    const notifications = await ForumNotification.find(filter)
      .populate('sender', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ForumNotification.countDocuments(filter);
    const unreadCount = await ForumNotification.getUnreadCount(req.user.id);

    sendSuccessResponse(res, 200, 'Notifications récupérées', {
      notifications,
      unreadCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Mark notification as read
// @route   PUT /api/forum/notifications/:id/read
// @access  Private
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    const notification = await ForumNotification.findOne({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return sendErrorResponse(res, 404, 'Notification non trouvée');
    }

    await notification.markAsRead();

    sendSuccessResponse(res, 200, 'Notification marquée comme lue');
  } catch (error) {
    console.error('Mark notification as read error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/forum/notifications/read-all
// @access  Private
router.put('/notifications/read-all', protect, async (req, res) => {
  try {
    await ForumNotification.markAllAsRead(req.user.id);

    sendSuccessResponse(res, 200, 'Toutes les notifications marquées comme lues');
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get unread notifications count
// @route   GET /api/forum/notifications/unread-count
// @access  Private
router.get('/notifications/unread-count', protect, async (req, res) => {
  try {
    const count = await ForumNotification.getUnreadCount(req.user.id);

    sendSuccessResponse(res, 200, 'Nombre de notifications non lues', { count });
  } catch (error) {
    console.error('Get unread count error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== SEARCH & FILTERS ====================

// @desc    Advanced search
// @route   GET /api/forum/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, category, tags, author, dateFrom, dateTo, hasReplies, isResolved } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = { isDeleted: false };

    // Recherche textuelle
    if (query) {
      filter.$text = { $search: query };
    }

    // Filtres
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (author) filter.author = author;
    if (isResolved !== undefined) filter.isResolved = isResolved === 'true';
    
    // Filtre de date
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const posts = await ForumPost.find(filter)
      .populate('author', 'firstName lastName avatar')
      .populate('category', 'name color icon')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filtrer par nombre de réponses si nécessaire
    let filteredPosts = posts;
    if (hasReplies === 'true') {
      filteredPosts = [];
      for (const post of posts) {
        const commentCount = await ForumComment.countDocuments({ post: post._id, isDeleted: false });
        if (commentCount > 0) {
          filteredPosts.push(post);
        }
      }
    }

    const total = await ForumPost.countDocuments(filter);

    sendSuccessResponse(res, 200, 'Résultats de recherche', {
      posts: filteredPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get search suggestions
// @route   GET /api/forum/search/suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return sendSuccessResponse(res, 200, 'Suggestions', { suggestions: [] });
    }

    // Rechercher dans les titres avec regex
    const posts = await ForumPost.find({
      title: { $regex: query, $options: 'i' },
      isDeleted: false
    })
      .select('title')
      .limit(5);

    // Rechercher les tags correspondants
    const tags = await ForumPost.distinct('tags', {
      tags: { $regex: query, $options: 'i' },
      isDeleted: false
    });

    sendSuccessResponse(res, 200, 'Suggestions récupérées', {
      posts: posts.map(p => ({ id: p._id, title: p.title })),
      tags: tags.slice(0, 5)
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get popular tags
// @route   GET /api/forum/tags/popular
// @access  Public
router.get('/tags/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const tags = await ForumPost.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    sendSuccessResponse(res, 200, 'Tags populaires récupérés', tags);
  } catch (error) {
    console.error('Get popular tags error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== FOLLOW/UNFOLLOW POSTS ====================

// @desc    Follow a post
// @route   POST /api/forum/posts/:id/follow
// @access  Private
router.post('/posts/:id/follow', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    const user = await User.findById(req.user.id);
    
    if (!user.forumSettings.followedPosts.includes(req.params.id)) {
      user.forumSettings.followedPosts.push(req.params.id);
      await user.save();
    }

    sendSuccessResponse(res, 200, 'Sujet suivi');
  } catch (error) {
    console.error('Follow post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Unfollow a post
// @route   DELETE /api/forum/posts/:id/follow
// @access  Private
router.delete('/posts/:id/follow', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.forumSettings.followedPosts = user.forumSettings.followedPosts.filter(
      postId => postId.toString() !== req.params.id
    );
    await user.save();

    sendSuccessResponse(res, 200, 'Sujet non suivi');
  } catch (error) {
    console.error('Unfollow post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// ==================== UPDATE & DELETE POSTS ====================

// @desc    Update a forum post
// @route   PUT /api/forum/posts/:id
// @access  Private
router.put('/posts/:id', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    // Vérifier les permissions
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const { title, content, category, tags } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;

    await post.save();
    await post.populate('author', 'firstName lastName avatar');
    await post.populate('category', 'name color icon');

    sendSuccessResponse(res, 200, 'Post mis à jour', post);
  } catch (error) {
    console.error('Update post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Delete a forum post
// @route   DELETE /api/forum/posts/:id
// @access  Private
router.delete('/posts/:id', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post || post.isDeleted) {
      return sendErrorResponse(res, 404, 'Post non trouvé');
    }

    // Vérifier les permissions
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    // Soft delete
    post.isDeleted = true;
    post.deletedAt = new Date();
    post.deletedBy = req.user.id;
    await post.save();

    sendSuccessResponse(res, 200, 'Post supprimé');
  } catch (error) {
    console.error('Delete post error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Update a comment
// @route   PUT /api/forum/comments/:id
// @access  Private
router.put('/comments/:id', protect, async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);
    
    if (!comment || comment.isDeleted) {
      return sendErrorResponse(res, 404, 'Commentaire non trouvé');
    }

    // Vérifier les permissions
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Accès refusé');
    }

    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return sendErrorResponse(res, 400, 'Le contenu est requis');
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    await comment.populate('author', 'firstName lastName avatar role');

    sendSuccessResponse(res, 200, 'Commentaire mis à jour', comment);
  } catch (error) {
    console.error('Update comment error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

module.exports = router;