const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ['airtel_money', 'moov_money', 'bank_transfer', 'prepaid_card'],
      required: [true, 'La méthode de paiement est requise'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      index: true,
    },
    provider: {
      type: String,
      trim: true,
    },
    paidAt: Date,
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Le nom complet est requis'],
      trim: true,
      maxlength: [120, 'Le nom ne peut pas dépasser 120 caractères'],
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'L\'adresse de livraison est requise'],
      trim: true,
      maxlength: [200, 'L\'adresse ne peut pas dépasser 200 caractères'],
    },
    city: {
      type: String,
      trim: true,
      default: 'N\'Djamena',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Les instructions ne peuvent pas dépasser 300 caractères'],
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1'],
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Le prix unitaire doit être positif'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Le sous-total doit être positif'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      index: true,
    },
    customer: customerSchema,
    items: [orderItemSchema],
    payment: paymentSchema,
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Le sous-total doit être positif'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'La réduction ne peut pas être négative'],
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Le total doit être positif'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('validate', function (next) {
  if (!this.reference) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    this.reference = `CMD-${new Date().getFullYear()}-${randomDigits}`;
  }

  next();
});

// Additional indexes for better performance
orderSchema.index({ user: 1, status: 1 }); // For user orders by status
orderSchema.index({ status: 1, createdAt: -1 }); // For orders by status and date
orderSchema.index({ 'customer.email': 1 }); // For customer lookup
orderSchema.index({ createdAt: -1 }); // For newest orders
orderSchema.index({ 'payment.status': 1 }); // For payment status filtering
orderSchema.index({ total: 1 }); // For total sorting
orderSchema.index({ reference: 1 }); // Already indexed but explicit

module.exports = mongoose.model('Order', orderSchema);

