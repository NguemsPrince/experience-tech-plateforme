const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'La description courte ne peut pas dépasser 500 caractères']
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Le prix original ne peut pas être négatif']
  },
  duration: {
    type: String,
    required: [true, 'La durée est requise']
  },
  totalHours: {
    type: Number,
    required: [true, 'Le nombre d\'heures total est requis'],
    min: [0, 'Le nombre d\'heures ne peut pas être négatif']
  },
  lessons: {
    type: Number,
    required: [true, 'Le nombre de leçons est requis'],
    min: [0, 'Le nombre de leçons ne peut pas être négatif']
  },
  level: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Avancé'],
    required: [true, 'Le niveau est requis']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise']
  },
  instructor: {
    name: {
      type: String,
      required: [true, 'Le nom de l\'instructeur est requis']
    },
    image: String,
    bio: String,
    experience: String
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: Date,
  maxStudents: {
    type: Number,
    required: [true, 'Le nombre maximum d\'étudiants est requis'],
    min: [1, 'Le nombre maximum d\'étudiants doit être au moins 1']
  },
  currentStudents: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre d\'étudiants actuels ne peut pas être négatif']
  },
  language: {
    type: String,
    default: 'Français'
  },
  tags: [String],
  requirements: [String],
  whatYouWillLearn: [String],
  curriculum: [{
    section: String,
    lessons: [{
      title: String,
      duration: String,
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'assignment'],
        default: 'video'
      },
      isPreview: {
        type: Boolean,
        default: false
      }
    }]
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability
courseSchema.virtual('isAvailable').get(function() {
  return this.currentStudents < this.maxStudents && this.isActive;
});

// Indexes for better performance
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ price: 1 });

// Indexes for better performance
courseSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search
courseSchema.index({ category: 1, isActive: 1 }); // Compound index for category filtering
courseSchema.index({ level: 1, isActive: 1 }); // For level filtering
courseSchema.index({ price: 1 }); // For price sorting
courseSchema.index({ createdAt: -1 }); // For newest sorting
courseSchema.index({ 'rating.average': -1 }); // For rating sorting
courseSchema.index({ category: 1, level: 1, isActive: 1 }); // Compound index for filtering
courseSchema.index({ isActive: 1 }); // For active courses
courseSchema.index({ startDate: 1 }); // For upcoming courses
courseSchema.index({ currentStudents: 1, maxStudents: 1 }); // For enrollment management

module.exports = mongoose.model('Course', courseSchema);
