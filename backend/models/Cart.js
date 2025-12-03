const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Le cours est requis']
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [1, 'La quantité doit être au moins 1'],
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis'],
    unique: true
  },
  items: [cartItemSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les requêtes de performance
cartSchema.index({ user: 1 });
cartSchema.index({ 'items.course': 1 });

// Virtual pour le nombre total d'articles
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual pour le total du panier
cartSchema.virtual('totalAmount').get(function() {
  return this.items.reduce((total, item) => {
    const coursePrice = item.course && item.course.price ? item.course.price : 0;
    return total + (coursePrice * item.quantity);
  }, 0);
});

// Méthode pour ajouter un article au panier
cartSchema.methods.addItem = function(courseId, quantity = 1) {
  const existingItem = this.items.find(item => item.course.toString() === courseId.toString());
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      course: courseId,
      quantity: quantity
    });
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// Méthode pour mettre à jour la quantité d'un article
cartSchema.methods.updateItemQuantity = function(courseId, quantity) {
  const item = this.items.find(item => item.course.toString() === courseId.toString());
  
  if (item) {
    if (quantity <= 0) {
      this.removeItem(courseId);
    } else {
      item.quantity = quantity;
      this.lastUpdated = new Date();
    }
  }
  
  return this.save();
};

// Méthode pour supprimer un article du panier
cartSchema.methods.removeItem = function(courseId) {
  this.items = this.items.filter(item => item.course.toString() !== courseId.toString());
  this.lastUpdated = new Date();
  return this.save();
};

// Méthode pour vider le panier
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.lastUpdated = new Date();
  return this.save();
};

// Méthode pour vérifier si un cours est dans le panier
cartSchema.methods.hasItem = function(courseId) {
  return this.items.some(item => item.course.toString() === courseId.toString());
};

// Méthode pour obtenir la quantité d'un cours dans le panier
cartSchema.methods.getItemQuantity = function(courseId) {
  const item = this.items.find(item => item.course.toString() === courseId.toString());
  return item ? item.quantity : 0;
};

// Middleware pour peupler les cours lors de la récupération
cartSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.course',
    select: 'title price originalPrice image category instructor level duration totalHours lessons'
  });
  next();
});

// Méthode statique pour obtenir ou créer un panier
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId });
  
  if (!cart) {
    cart = new this({ user: userId, items: [] });
    await cart.save();
  }
  
  return cart;
};

module.exports = mongoose.model('Cart', cartSchema);
