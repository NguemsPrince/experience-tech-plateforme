const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Paramètres de paiement
  payment: {
    // Numéros Airtel Money Tchad
    airtelNumbers: [{
      number: {
        type: String,
        required: true,
        trim: true
      },
      name: {
        type: String,
        trim: true,
        default: 'Airtel Money'
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    // Numéros Moov Money Tchad
    moovNumbers: [{
      number: {
        type: String,
        required: true,
        trim: true
      },
      name: {
        type: String,
        trim: true,
        default: 'Moov Money'
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    // Compte bancaire du centre
    bankAccount: {
      bankName: {
        type: String,
        trim: true
      },
      accountNumber: {
        type: String,
        trim: true
      },
      accountHolderName: {
        type: String,
        trim: true
      },
      iban: {
        type: String,
        trim: true
      },
      swiftCode: {
        type: String,
        trim: true
      },
      branch: {
        type: String,
        trim: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    },
    // Autres paramètres de paiement
    currency: {
      type: String,
      default: 'XAF',
      enum: ['XAF', 'USD', 'EUR']
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    allowCashPayment: {
      type: Boolean,
      default: true
    }
  },
  // Autres paramètres système (pour extension future)
  general: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  security: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  email: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
settingsSchema.index({ 'payment.airtelNumbers.number': 1 });
settingsSchema.index({ 'payment.moovNumbers.number': 1 });

// Méthode statique pour obtenir ou créer les paramètres
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Méthode pour mettre à jour les paramètres de paiement
settingsSchema.methods.updatePaymentSettings = async function(paymentData) {
  if (paymentData.airtelNumbers) {
    this.payment.airtelNumbers = paymentData.airtelNumbers;
  }
  if (paymentData.moovNumbers) {
    this.payment.moovNumbers = paymentData.moovNumbers;
  }
  if (paymentData.bankAccount) {
    this.payment.bankAccount = { ...this.payment.bankAccount, ...paymentData.bankAccount };
  }
  if (paymentData.currency !== undefined) {
    this.payment.currency = paymentData.currency;
  }
  if (paymentData.taxRate !== undefined) {
    this.payment.taxRate = paymentData.taxRate;
  }
  if (paymentData.allowCashPayment !== undefined) {
    this.payment.allowCashPayment = paymentData.allowCashPayment;
  }
  return await this.save();
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

