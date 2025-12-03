const mongoose = require('mongoose');

const chatbotQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'La question est requise'],
    trim: true,
    maxlength: [500, 'La question ne peut pas dépasser 500 caractères']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  status: {
    type: String,
    enum: ['new', 'answered', 'archived'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'chat', 'email', 'other'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  answer: {
    type: String,
    trim: true,
    maxlength: [1000, 'La réponse ne peut pas dépasser 1000 caractères']
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  answeredAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  }
}, {
  timestamps: true
});

// Indexes for better performance
chatbotQuestionSchema.index({ status: 1 });
chatbotQuestionSchema.index({ createdAt: -1 });
chatbotQuestionSchema.index({ user: 1 });
chatbotQuestionSchema.index({ email: 1 });
chatbotQuestionSchema.index({ status: 1, createdAt: -1 }); // Compound index for admin queries

chatbotQuestionSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    new: 'Nouveau',
    answered: 'Répondu',
    archived: 'Archivé'
  };
  return statusMap[this.status] || this.status;
});

module.exports = mongoose.model('ChatbotQuestion', chatbotQuestionSchema);

