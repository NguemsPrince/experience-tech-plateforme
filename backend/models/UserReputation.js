const mongoose = require('mongoose');

const userReputationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Statistiques de réputation
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  
  // Badges obtenus
  badges: [{
    badgeId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    icon: String,
    color: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistiques d'activité
  stats: {
    postsCreated: {
      type: Number,
      default: 0
    },
    commentsCreated: {
      type: Number,
      default: 0
    },
    likesReceived: {
      type: Number,
      default: 0
    },
    solutionsAccepted: {
      type: Number,
      default: 0
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    consecutiveDays: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Historique des points
  pointsHistory: [{
    amount: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      enum: [
        'post_created',
        'comment_created',
        'like_received',
        'solution_accepted',
        'helpful_vote',
        'daily_login',
        'badge_earned',
        'penalty'
      ],
      required: true
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Pénalités
  penalties: [{
    reason: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
  
}, {
  timestamps: true
});

// Index pour améliorer les performances
userReputationSchema.index({ user: 1 });
userReputationSchema.index({ points: -1 });
userReputationSchema.index({ level: -1 });

// Méthode pour ajouter des points
userReputationSchema.methods.addPoints = async function(amount, reason, description) {
  this.points += amount;
  
  // Calculer le niveau basé sur les points
  this.level = Math.floor(Math.sqrt(this.points / 100)) + 1;
  
  // Ajouter à l'historique
  this.pointsHistory.push({
    amount,
    reason,
    description
  });
  
  // Vérifier les badges à débloquer
  await this.checkBadges();
  
  return this.save();
};

// Méthode pour retirer des points (pénalité)
userReputationSchema.methods.removePoints = async function(amount, reason, adminId) {
  this.points = Math.max(0, this.points - amount);
  
  // Recalculer le niveau
  this.level = Math.floor(Math.sqrt(this.points / 100)) + 1;
  
  // Ajouter la pénalité
  this.penalties.push({
    reason,
    points: amount,
    createdBy: adminId
  });
  
  // Ajouter à l'historique
  this.pointsHistory.push({
    amount: -amount,
    reason: 'penalty',
    description: reason
  });
  
  return this.save();
};

// Méthode pour mettre à jour les stats
userReputationSchema.methods.updateStats = async function(statName, increment = 1) {
  if (this.stats[statName] !== undefined) {
    this.stats[statName] += increment;
    
    // Vérifier les badges après mise à jour des stats
    await this.checkBadges();
    
    return this.save();
  }
};

// Méthode pour vérifier et attribuer les badges
userReputationSchema.methods.checkBadges = async function() {
  const badgesToCheck = [
    // Badges de base
    {
      id: 'first_post',
      name: 'Premier Pas',
      description: 'Créer votre premier sujet',
      icon: '🎯',
      color: '#10B981',
      condition: () => this.stats.postsCreated >= 1
    },
    {
      id: 'first_comment',
      name: 'Contributeur',
      description: 'Poster votre premier commentaire',
      icon: '💬',
      color: '#3B82F6',
      condition: () => this.stats.commentsCreated >= 1
    },
    
    // Badges d'activité
    {
      id: 'active_contributor',
      name: 'Contributeur Actif',
      description: 'Créer 10 sujets',
      icon: '⭐',
      color: '#F59E0B',
      condition: () => this.stats.postsCreated >= 10
    },
    {
      id: 'prolific_poster',
      name: 'Auteur Prolifique',
      description: 'Créer 50 sujets',
      icon: '🌟',
      color: '#EF4444',
      condition: () => this.stats.postsCreated >= 50
    },
    {
      id: 'helpful_member',
      name: 'Membre Serviable',
      description: 'Poster 50 commentaires',
      icon: '🤝',
      color: '#8B5CF6',
      condition: () => this.stats.commentsCreated >= 50
    },
    
    // Badges de popularité
    {
      id: 'popular',
      name: 'Populaire',
      description: 'Recevoir 100 likes',
      icon: '❤️',
      color: '#EC4899',
      condition: () => this.stats.likesReceived >= 100
    },
    {
      id: 'very_popular',
      name: 'Très Populaire',
      description: 'Recevoir 500 likes',
      icon: '💖',
      color: '#DC2626',
      condition: () => this.stats.likesReceived >= 500
    },
    
    // Badges d'expertise
    {
      id: 'problem_solver',
      name: 'Résolveur de Problèmes',
      description: '10 solutions acceptées',
      icon: '🎓',
      color: '#059669',
      condition: () => this.stats.solutionsAccepted >= 10
    },
    {
      id: 'expert',
      name: 'Expert',
      description: '50 solutions acceptées',
      icon: '👨‍🏫',
      color: '#7C3AED',
      condition: () => this.stats.solutionsAccepted >= 50
    },
    {
      id: 'guru',
      name: 'Guru',
      description: '100 solutions acceptées',
      icon: '🧙‍♂️',
      color: '#C026D3',
      condition: () => this.stats.solutionsAccepted >= 100
    },
    
    // Badges de niveau
    {
      id: 'level_5',
      name: 'Niveau 5',
      description: 'Atteindre le niveau 5',
      icon: '🥉',
      color: '#CD7F32',
      condition: () => this.level >= 5
    },
    {
      id: 'level_10',
      name: 'Niveau 10',
      description: 'Atteindre le niveau 10',
      icon: '🥈',
      color: '#C0C0C0',
      condition: () => this.level >= 10
    },
    {
      id: 'level_20',
      name: 'Niveau 20',
      description: 'Atteindre le niveau 20',
      icon: '🥇',
      color: '#FFD700',
      condition: () => this.level >= 20
    },
    
    // Badges spéciaux
    {
      id: 'consistent',
      name: 'Assidu',
      description: '7 jours consécutifs d\'activité',
      icon: '📅',
      color: '#14B8A6',
      condition: () => this.stats.consecutiveDays >= 7
    },
    {
      id: 'dedicated',
      name: 'Dévoué',
      description: '30 jours consécutifs d\'activité',
      icon: '🔥',
      color: '#F97316',
      condition: () => this.stats.consecutiveDays >= 30
    }
  ];
  
  let badgesEarned = false;
  
  for (const badge of badgesToCheck) {
    // Vérifier si le badge n'est pas déjà obtenu
    const hasBadge = this.badges.some(b => b.badgeId === badge.id);
    
    if (!hasBadge && badge.condition()) {
      // Attribuer le badge
      this.badges.push({
        badgeId: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        color: badge.color
      });
      
      // Donner des points bonus pour le badge
      this.points += 50;
      this.pointsHistory.push({
        amount: 50,
        reason: 'badge_earned',
        description: `Badge "${badge.name}" obtenu`
      });
      
      badgesEarned = true;
    }
  }
  
  return badgesEarned;
};

// Méthode pour mettre à jour les jours consécutifs
userReputationSchema.methods.updateConsecutiveDays = async function() {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastActive = new Date(this.stats.lastActiveDate).setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Jour consécutif
    this.stats.consecutiveDays += 1;
    await this.addPoints(5, 'daily_login', 'Connexion quotidienne');
  } else if (daysDiff > 1) {
    // Série interrompue
    this.stats.consecutiveDays = 1;
  }
  // Si daysDiff === 0, c'est le même jour, ne rien faire
  
  this.stats.lastActiveDate = new Date();
  
  return this.save();
};

// Méthode statique pour obtenir le classement
userReputationSchema.statics.getLeaderboard = async function(limit = 10, skip = 0) {
  return this.find()
    .sort({ points: -1, level: -1 })
    .populate('user', 'firstName lastName email avatar')
    .skip(skip)
    .limit(limit)
    .lean();
};

module.exports = mongoose.model('UserReputation', userReputationSchema);

