const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Le titre du poste est requis'],
    trim: true,
    maxlength: [200, 'Le titre du poste ne peut pas dépasser 200 caractères']
  },
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
      maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
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
      required: [true, 'Le téléphone est requis'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide']
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'L\'adresse ne peut pas dépasser 200 caractères']
    },
    city: {
      type: String,
      required: [true, 'La ville est requise'],
      trim: true,
      maxlength: [100, 'La ville ne peut pas dépasser 100 caractères']
    }
  },
  professionalInfo: {
    experience: {
      type: String,
      required: [true, 'L\'expérience est requise'],
      trim: true,
      maxlength: [1000, 'L\'expérience ne peut pas dépasser 1000 caractères']
    },
    education: {
      type: String,
      required: [true, 'La formation est requise'],
      trim: true,
      maxlength: [500, 'La formation ne peut pas dépasser 500 caractères']
    },
    skills: {
      type: String,
      required: [true, 'Les compétences sont requises'],
      trim: true,
      maxlength: [500, 'Les compétences ne peuvent pas dépasser 500 caractères']
    },
    motivation: {
      type: String,
      required: [true, 'La motivation est requise'],
      trim: true,
      maxlength: [1000, 'La motivation ne peut pas dépasser 1000 caractères']
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [2000, 'La lettre de motivation ne peut pas dépasser 2000 caractères']
    }
  },
  documents: {
    cv: {
      type: String,
      required: [true, 'Le CV est requis']
    },
    cvPath: {
      type: String,
      required: [true, 'Le chemin du CV est requis']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['website', 'email', 'referral', 'other'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  interviewDate: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'La raison du refus ne peut pas dépasser 500 caractères']
  }
}, {
  timestamps: true
});

// Indexes for better performance
jobApplicationSchema.index({ 'personalInfo.email': 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ createdAt: -1 });
jobApplicationSchema.index({ jobTitle: 1 });
jobApplicationSchema.index({ user: 1 });
jobApplicationSchema.index({ reviewedBy: 1 });
jobApplicationSchema.index({ status: 1, createdAt: -1 }); // Compound index for admin queries

jobApplicationSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'En attente',
    reviewing: 'En cours d\'examen',
    shortlisted: 'Présélectionné',
    interview: 'Entretien programmé',
    accepted: 'Accepté',
    rejected: 'Refusé'
  };
  return statusMap[this.status] || this.status;
});

jobApplicationSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);

