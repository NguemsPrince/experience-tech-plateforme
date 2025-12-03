const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Le cours est requis']
  },
  rating: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [1, 'La note doit être au moins 1'],
    max: [5, 'La note ne peut pas dépasser 5']
  },
  review: {
    type: String,
    trim: true,
    maxlength: [1000, 'L\'avis ne peut pas dépasser 1000 caractères']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour éviter les doublons (un utilisateur ne peut noter qu'une fois par cours)
ratingSchema.index({ user: 1, course: 1 }, { unique: true });

// Index pour les requêtes de performance
ratingSchema.index({ course: 1, rating: 1 });
ratingSchema.index({ user: 1, createdAt: -1 });

// Virtual pour le nom complet de l'utilisateur
ratingSchema.virtual('userName').get(function() {
  return this.user ? `${this.user.firstName} ${this.user.lastName}` : 'Utilisateur supprimé';
});

// Middleware pour mettre à jour les statistiques du cours après sauvegarde
ratingSchema.post('save', async function() {
  await this.constructor.updateCourseRatingStats(this.course);
});

// Middleware pour mettre à jour les statistiques du cours après suppression
ratingSchema.post('deleteOne', { document: true, query: false }, async function() {
  await this.constructor.updateCourseRatingStats(this.course);
});

// Méthode statique pour mettre à jour les statistiques de notation d'un cours
ratingSchema.statics.updateCourseRatingStats = async function(courseId) {
  try {
    const stats = await this.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (stats.length > 0) {
      const { averageRating, totalRatings } = stats[0];
      
      // Calculer la distribution des notes
      const distribution = stats[0].ratingDistribution.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      // Mettre à jour le cours
      await mongoose.model('Course').findByIdAndUpdate(courseId, {
        'rating.average': Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
        'rating.count': totalRatings,
        'rating.distribution': distribution
      });
    } else {
      // Aucune note, réinitialiser les statistiques
      await mongoose.model('Course').findByIdAndUpdate(courseId, {
        'rating.average': 0,
        'rating.count': 0,
        'rating.distribution': {}
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques de notation:', error);
  }
};

// Méthode pour obtenir les statistiques de notation d'un cours
ratingSchema.statics.getCourseRatingStats = async function(courseId) {
  try {
    const stats = await this.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (stats.length > 0) {
      const { averageRating, totalRatings } = stats[0];
      
      // Calculer la distribution des notes
      const distribution = stats[0].ratingDistribution.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
        distribution
      };
    }

    return {
      averageRating: 0,
      totalRatings: 0,
      distribution: {}
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de notation:', error);
    throw error;
  }
};

module.exports = mongoose.model('Rating', ratingSchema);
