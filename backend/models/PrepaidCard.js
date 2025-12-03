const mongoose = require('mongoose');

const prepaidCardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Le code de la carte est requis'],
    uppercase: true,
    trim: true,
    minlength: [6, 'Le code doit contenir au moins 6 caractères'],
    maxlength: [50, 'Le code ne peut pas dépasser 50 caractères']
  },
  value: {
    type: Number,
    required: [true, 'La valeur de la carte est requise'],
    min: [0, 'La valeur ne peut pas être négative']
  },
  currency: {
    type: String,
    default: 'XAF',
    enum: ['XAF', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired', 'disabled'],
    default: 'active'
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  usedAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les requêtes de performance
prepaidCardSchema.index({ code: 1 }, { unique: true });
prepaidCardSchema.index({ status: 1 });
prepaidCardSchema.index({ usedBy: 1 });
prepaidCardSchema.index({ expiresAt: 1 });
prepaidCardSchema.index({ createdAt: -1 });

// Virtual pour vérifier si la carte est valide
prepaidCardSchema.virtual('isValid').get(function() {
  if (this.status !== 'active') {
    return false;
  }
  
  if (this.expiresAt && this.expiresAt < new Date()) {
    return false;
  }
  
  return true;
});

// Virtual pour la valeur restante
prepaidCardSchema.virtual('remainingValue').get(function() {
  if (this.status === 'used' || !this.isValid) {
    return 0;
  }
  return this.value;
});

// Méthode statique pour générer un code unique
prepaidCardSchema.statics.generateCode = function(prefix = 'EXP') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix;
  
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

// Méthode pour utiliser la carte
prepaidCardSchema.methods.use = async function(userId) {
  if (!this.isValid) {
    throw new Error('Cette carte n\'est plus valide');
  }
  
  this.status = 'used';
  this.usedBy = userId;
  this.usedAt = new Date();
  
  return await this.save();
};

module.exports = mongoose.model('PrepaidCard', prepaidCardSchema);

