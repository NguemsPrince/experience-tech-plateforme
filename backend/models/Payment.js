const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false // Pas requis pour les paiements de produits
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: false // Pas requis pour les paiements de produits
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false // Pour les paiements de produits
  },
  items: [{
    type: {
      type: String,
      enum: ['course', 'product', 'cart'],
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: Number
  }],
  amount: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  currency: {
    type: String,
    default: 'XAF',
    enum: ['XAF', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['airtel_money', 'moov_money', 'bank_transfer', 'prepaid_card'],
    required: [true, 'La méthode de paiement est requise']
  },
  paymentProvider: {
    type: String,
    enum: ['airtel_money', 'moov_money', 'bank', 'prepaid_card'],
    required: [true, 'Le fournisseur de paiement est requis']
  },
  prepaidCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrepaidCard',
    default: null
  },
  transactionId: {
    type: String,
    required: [true, 'L\'ID de transaction est requis']
  },
  providerTransactionId: String,
  stripePaymentIntentId: String,
  stripeSessionId: String,
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    country: String,
    funding: String,
    phoneNumber: String, // Pour mobile money
    operator: String, // Airtel, Moov, etc.
    transactionReference: String // Référence de transaction du provider
  },
  failureReason: String,
  refundAmount: {
    type: Number,
    default: 0,
    min: [0, 'Le montant de remboursement ne peut pas être négatif']
  },
  refundReason: String,
  refundDate: Date,
  metadata: {
    type: Map,
    of: String
  },
  paidAt: Date,
  expiresAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for payment status display
paymentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Terminé',
    failed: 'Échoué',
    cancelled: 'Annulé',
    refunded: 'Remboursé'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment method display
paymentSchema.virtual('paymentMethodDisplay').get(function() {
  const methodMap = {
    airtel_money: 'Airtel Money (Tchad)',
    moov_money: 'Tigo Money / Moov Money (Tchad)',
    bank_transfer: 'Virement bancaire (Carte débit/prépayée)',
    prepaid_card: 'Carte prépayée'
  };
  return methodMap[this.paymentMethod] || this.paymentMethod;
});

// Indexes for better performance
paymentSchema.index({ user: 1 });
paymentSchema.index({ course: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 }, { unique: true });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
