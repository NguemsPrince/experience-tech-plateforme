const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  rating: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [1, 'La note doit être au moins 1'],
    max: [5, 'La note ne peut pas dépasser 5']
  },
  testimonial: {
    type: String,
    required: [true, 'Le témoignage est requis'],
    trim: true,
    minlength: [10, 'Le témoignage doit contenir au moins 10 caractères'],
    maxlength: [1000, 'Le témoignage ne peut pas dépasser 1000 caractères']
  },
  category: {
    type: String,
    enum: ['service', 'formation', 'support', 'plateforme', 'autre'],
    default: 'plateforme'
  },
  isApproved: {
    type: Boolean,
    default: false // Les témoignages doivent être approuvés par un admin
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false // Pour mettre en avant certains témoignages
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  response: {
    text: String,
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les requêtes de performance
testimonialSchema.index({ user: 1, createdAt: -1 });
testimonialSchema.index({ isApproved: 1, isPublic: 1, createdAt: -1 });
testimonialSchema.index({ rating: 1 });
testimonialSchema.index({ category: 1 });

// Virtual pour le nom complet de l'utilisateur
testimonialSchema.virtual('userName').get(function() {
  if (this.user && typeof this.user === 'object' && this.user.firstName) {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  return 'Utilisateur';
});

// Méthode statique pour obtenir les statistiques globales
testimonialSchema.statics.getGlobalStats = async function() {
  try {
    const stats = await this.aggregate([
      { $match: { isApproved: true, isPublic: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalTestimonials: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (stats.length > 0) {
      const { averageRating, totalTestimonials } = stats[0];
      
      // Calculer la distribution des notes
      const distribution = stats[0].ratingDistribution.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      // Calculer le pourcentage de satisfaction (notes 4 et 5)
      const satisfied = (distribution[4] || 0) + (distribution[5] || 0);
      const satisfactionRate = (satisfied / totalTestimonials) * 100;

      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalTestimonials,
        distribution,
        satisfactionRate: Math.round(satisfactionRate)
      };
    }

    return {
      averageRating: 0,
      totalTestimonials: 0,
      distribution: {},
      satisfactionRate: 0
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};

// Méthode statique pour obtenir les statistiques par catégorie
testimonialSchema.statics.getStatsByCategory = async function(category) {
  try {
    const stats = await this.aggregate([
      { $match: { category, isApproved: true, isPublic: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalTestimonials: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      return {
        category,
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        totalTestimonials: stats[0].totalTestimonials
      };
    }

    return {
      category,
      averageRating: 0,
      totalTestimonials: 0
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques par catégorie:', error);
    throw error;
  }
};

module.exports = mongoose.model('Testimonial', testimonialSchema);


