const mongoose = require('mongoose');

const CATEGORY_ENUM = ['hardware', 'accessories', 'networking', 'printing'];
const AVAILABILITY_ENUM = ['in_stock', 'out_of_stock', 'pre_order'];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      trim: true,
      maxlength: [150, 'Le nom du produit ne peut pas dépasser 150 caractères'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    sku: {
      type: String,
      unique: true,
      uppercase: true,
      index: true,
    },
    category: {
      type: String,
      enum: CATEGORY_ENUM,
      required: [true, 'La catégorie est requise'],
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'La marque est requise'],
      trim: true,
      maxlength: [80, 'La marque ne peut pas dépasser 80 caractères'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix doit être positif'],
      index: true,
    },
    originalPrice: {
      type: Number,
      min: [0, 'Le prix de référence doit être positif'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Le stock ne peut pas être négatif'],
    },
    availability: {
      type: String,
      enum: AVAILABILITY_ENUM,
      default: 'in_stock',
      index: true,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPromo: {
      type: Boolean,
      default: false,
    },
    promoText: {
      type: String,
      trim: true,
      maxlength: [120, 'Le texte promotionnel ne peut pas dépasser 120 caractères'],
    },
    availabilityDate: {
      type: Date,
    },
    warranty: {
      type: String,
      trim: true,
      maxlength: [80, 'La garantie ne peut pas dépasser 80 caractères'],
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [180, 'Le résumé ne peut pas dépasser 180 caractères'],
    },
    specifications: [
      {
        key: {
          type: String,
          trim: true,
        },
        value: {
          type: String,
          trim: true,
        },
      },
    ],
    images: {
      type: [String],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Au moins une image est requise',
      },
    },
    thumbnail: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    sales: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    meta: {
      weight: String,
      dimensions: String,
      color: String,
      compatibility: String,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('validate', function (next) {
  if (!this.sku) {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.sku = `SKU-${Date.now().toString().slice(-6)}-${random}`;
  }

  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }

  if (this.originalPrice && this.originalPrice < this.price) {
    this.originalPrice = this.price;
  }

  next();
});

productSchema.pre('save', async function (next) {
  // Vérifier et générer un slug unique si nécessaire
  if (this.isNew || this.isModified('name')) {
    if (!this.slug && this.name) {
      let baseSlug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      let slug = baseSlug;
      let counter = 1;
      
      // Vérifier l'unicité du slug
      const Product = this.constructor;
      while (await Product.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      this.slug = slug;
    }
  }
  
  next();
});

// Text search index
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

// Additional indexes for better performance
productSchema.index({ category: 1, isActive: 1 }); // Compound index for category filtering
productSchema.index({ price: 1 }); // For price sorting
productSchema.index({ sales: -1 }); // For bestsellers sorting
productSchema.index({ createdAt: -1 }); // For newest sorting
productSchema.index({ isFeatured: 1, isActive: 1 }); // For featured products
productSchema.index({ isPromo: 1, isActive: 1 }); // For promotional products
productSchema.index({ brand: 1, category: 1, isActive: 1 }); // Compound index for filtering
productSchema.index({ availability: 1, isActive: 1 }); // For availability filtering
productSchema.index({ stock: 1 }); // For stock management

module.exports = mongoose.model('Product', productSchema);

