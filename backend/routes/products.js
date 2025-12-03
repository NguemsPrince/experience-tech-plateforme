const express = require('express');
const {
  body,
  query,
  param,
  validationResult,
} = require('express-validator');
const Product = require('../models/Product');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLog');
const { sanitizeSearchQuery, validatePagination, isValidObjectId } = require('../utils/security');

const router = express.Router();

const CATEGORY_LABELS = {
  hardware: 'Matériels informatiques',
  accessories: 'Accessoires',
  networking: 'Réseaux',
  printing: 'Impression',
};

const LABEL_TO_CATEGORY = Object.entries(CATEGORY_LABELS).reduce(
  (acc, [key, value]) => {
    acc[value.toLowerCase()] = key;
    return acc;
  },
  {}
);

const mapCategory = (value) => {
  if (!value) return undefined;

  const normalized = value.toString().trim().toLowerCase();

  if (CATEGORY_LABELS[normalized]) {
    return normalized;
  }

  return LABEL_TO_CATEGORY[normalized] || value;
};

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 422, 'Validation échouée', errors.array());
  }
  return null;
};

const buildProductFilters = (rawQuery = {}) => {
  const {
    category,
    brand,
    availability,
    isNew,
    minPrice,
    maxPrice,
    search,
    tags,
  } = rawQuery;

  const filters = { isActive: true };

  const normalizedCategory = mapCategory(category);
  if (normalizedCategory) {
    filters.category = normalizedCategory;
  }

  if (brand) {
    filters.brand = brand.trim();
  }

  if (availability) {
    filters.availability = availability;
  }

  if (isNew === 'true') {
    filters.isNewProduct = true;
  }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) {
        filters.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filters.price.$lte = Number(maxPrice);
      }
    }
    
    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search);
      if (sanitizedSearch) {
        // Use text search if available, otherwise use regex
        try {
          filters.$text = { $search: sanitizedSearch };
        } catch (error) {
          // Fallback to regex if text index not available
          filters.$or = [
            { name: { $regex: sanitizedSearch, $options: 'i' } },
            { description: { $regex: sanitizedSearch, $options: 'i' } },
            { brand: { $regex: sanitizedSearch, $options: 'i' } }
          ];
        }
      }
    }

  if (tags) {
    filters.tags = {
      $in: Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()),
    };
  }

  return filters;
};

const buildSort = (sortBy) => {
      switch (sortBy) {
    case 'price-asc':
      return { price: 1 };
    case 'price-desc':
      return { price: -1 };
    case 'bestsellers':
      return { sales: -1 };
    case 'newest':
      return { createdAt: -1 };
    case 'promo':
      return { isPromo: -1, createdAt: -1 };
        default:
      return { createdAt: -1 };
  }
};

const serializeProduct = (product) => ({
  id: product._id,
  name: product.name,
  slug: product.slug,
  sku: product.sku,
  category: product.category,
  categoryLabel: CATEGORY_LABELS[product.category] || product.category,
  brand: product.brand,
  price: product.price,
  originalPrice: product.originalPrice,
  stock: product.stock,
  availability: product.availability,
  isNew: product.isNewProduct,
  isFeatured: product.isFeatured,
  isPromo: product.isPromo,
  promoText: product.promoText,
  description: product.description,
  shortDescription: product.shortDescription,
  specifications: product.specifications,
  images: product.images,
  thumbnail: product.thumbnail || product.images?.[0] || null,
  tags: product.tags,
  rating: product.rating,
  reviews: product.reviews,
  sales: product.sales,
  warranty: product.warranty,
  availabilityDate: product.availabilityDate,
  createdAt: product.createdAt,
  meta: product.meta,
});

// @desc    Get store catalog
// @route   GET /api/products
// @access  Public
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('minPrice').optional().isNumeric(),
    query('maxPrice').optional().isNumeric(),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      // Use validated pagination
      const { page, limit: validatedLimit } = validatePagination(req.query.page, req.query.limit, 50);
      const limit = validatedLimit || 12;
      const sortBy = req.query.sortBy || 'newest';

      const filters = buildProductFilters(req.query);
      const sort = buildSort(sortBy);

      const [products, total, meta] = await Promise.all([
        Product.find(filters)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Product.countDocuments(filters),
        Product.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: null,
              priceMin: { $min: '$price' },
              priceMax: { $max: '$price' },
              brands: { $addToSet: '$brand' },
              categories: { $addToSet: '$category' },
            },
          },
        ]),
      ]);

      const metadata = meta[0] || {
        priceMin: 0,
        priceMax: 0,
        brands: [],
        categories: [],
      };

      sendSuccessResponse(res, 200, 'Catalogue récupéré', {
        products: products.map(serializeProduct),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
        filters: {
          price: {
            min: metadata.priceMin,
            max: metadata.priceMax,
          },
          brands: metadata.brands.sort(),
          categories: metadata.categories.map((cat) => ({
            value: cat,
            label: CATEGORY_LABELS[cat] || cat,
          })),
        },
      });
    } catch (error) {
      console.error('Get products error:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la récupération des produits');
    }
  }
);

// @desc    Get highlighted products for homepage
// @route   GET /api/products/highlights
// @access  Public
router.get('/highlights', async (req, res) => {
  try {
    const [featured, promotions, bestsellers] = await Promise.all([
      Product.find({ isActive: true, isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Product.find({ isActive: true, isPromo: true })
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),
      Product.find({ isActive: true })
        .sort({ sales: -1 })
        .limit(6)
        .lean(),
    ]);

    sendSuccessResponse(res, 200, 'Produits mis en avant', {
      featured: featured.map(serializeProduct),
      promotions: promotions.map(serializeProduct),
      bestsellers: bestsellers.map(serializeProduct),
    });
  } catch (error) {
    console.error('Get product highlights error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la récupération des produits mis en avant');
  }
});

// @desc    Get single product details
// @route   GET /api/products/:productId
// @access  Public
router.get(
  '/:productId',
  [
    param('productId')
      .isMongoId()
      .withMessage('ID produit invalide')
      .custom((value) => {
        if (!isValidObjectId(value)) {
          throw new Error('ID produit invalide');
        }
        return true;
      })
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { productId } = req.params;
      
      if (!isValidObjectId(productId)) {
        return sendErrorResponse(res, 400, 'ID produit invalide');
      }
      
      const product = await Product.findOne({
        _id: productId,
        isActive: true,
      }).lean();

    if (!product) {
      return sendErrorResponse(res, 404, 'Produit non trouvé');
    }

      sendSuccessResponse(res, 200, 'Détails du produit récupérés', serializeProduct(product));
  } catch (error) {
    console.error('Get product details error:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la récupération du produit');
    }
  }
);

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').isString().isLength({ min: 3, max: 150 }),
    body('category').isString(),
    body('brand').isString().isLength({ min: 2, max: 80 }),
    body('price').isFloat({ min: 0 }),
    body('description').isString().isLength({ min: 20 }),
    body('images')
      .isArray({ min: 1 })
      .custom((images) => images.every((img) => typeof img === 'string')),
    body('specifications').optional().isArray(),
    body('specifications.*.key').optional().isString(),
    body('specifications.*.value').optional().isString(),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const payload = { ...req.body };
      payload.category = mapCategory(payload.category);
      payload.createdBy = req.user.id;

      // Sanitize and escape the product name for regex
      const sanitizedName = sanitizeSearchQuery(payload.name.trim());
      
      // Vérifier si un produit avec le même nom existe déjà
      const existingProduct = await Product.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${sanitizedName}$`, 'i') } },
          { slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }
        ],
        isActive: true
      });

      if (existingProduct) {
        if (existingProduct.name.toLowerCase() === payload.name.trim().toLowerCase()) {
          return sendErrorResponse(res, 409, `Un produit avec le nom "${payload.name}" existe déjà. Veuillez utiliser un nom différent.`);
        }
        return sendErrorResponse(res, 409, 'Un produit similaire existe déjà. Veuillez utiliser un nom différent.');
      }

      const product = await Product.create(payload);

      // Logger l'action
      await logAction(req, 'CREATE', 'PRODUCT', {
        resourceId: product._id,
        beforeState: null,
        afterState: serializeProduct(product),
        description: `Création du produit ${product.name}`
      });

      sendSuccessResponse(res, 201, 'Produit créé avec succès', serializeProduct(product));
  } catch (error) {
    console.error('Create product error:', error);
      if (error.code === 11000) {
        // Erreur de duplication MongoDB
        const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'champ';
        let message = 'Ce produit existe déjà.';
        
        if (field === 'name' || error.keyPattern?.name) {
          message = `Un produit avec ce nom existe déjà. Veuillez utiliser un nom différent.`;
        } else if (field === 'sku' || error.keyPattern?.sku) {
          message = `Un produit avec ce SKU existe déjà. Veuillez utiliser un SKU différent.`;
        } else if (field === 'slug' || error.keyPattern?.slug) {
          message = `Un produit avec un nom similaire existe déjà. Veuillez utiliser un nom différent.`;
        }
        
        return sendErrorResponse(res, 409, message);
      }
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        return sendErrorResponse(res, 400, 'Erreur de validation', errors);
      }
      
      sendErrorResponse(res, 500, 'Erreur lors de la création du produit');
    }
  }
);

// @desc    Update product
// @route   PUT /api/products/:productId
// @access  Private/Admin
router.put(
  '/:productId',
  protect,
  authorize('admin'),
  [
    param('productId')
      .isMongoId()
      .withMessage('ID produit invalide')
      .custom((value) => {
        if (!isValidObjectId(value)) {
          throw new Error('ID produit invalide');
        }
        return true;
      }),
    body('name').optional().isString().isLength({ min: 3, max: 150 }),
    body('brand').optional().isString().isLength({ min: 2, max: 80 }),
    body('price').optional().isFloat({ min: 0 }),
    body('originalPrice').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('availability').optional().isIn(['in_stock', 'out_of_stock', 'pre_order']),
    body('isNew').optional().isBoolean(),
    body('isFeatured').optional().isBoolean(),
    body('isPromo').optional().isBoolean(),
    body('images')
      .optional()
      .isArray({ min: 1 })
      .custom((images) => images.every((img) => typeof img === 'string')),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { productId } = req.params;
      
      if (!isValidObjectId(productId)) {
        return sendErrorResponse(res, 400, 'ID produit invalide');
      }
      
      // Récupérer l'état avant modification
      const beforeProduct = await Product.findById(productId).lean();
      if (!beforeProduct) {
        return sendErrorResponse(res, 404, 'Produit non trouvé');
      }
      
      const updates = { ...req.body };
      if (updates.category) {
        updates.category = mapCategory(updates.category);
      }

      const product = await Product.findOneAndUpdate(
        { _id: productId },
        updates,
        { new: true, runValidators: true }
      ).lean();

      if (!product) {
        return sendErrorResponse(res, 404, 'Produit non trouvé');
      }

      // Logger l'action
      await logAction(req, 'UPDATE', 'PRODUCT', {
        resourceId: productId,
        beforeState: serializeProduct(beforeProduct),
        afterState: serializeProduct(product),
        description: `Modification du produit ${product.name}`
      });

      sendSuccessResponse(res, 200, 'Produit mis à jour', serializeProduct(product));
  } catch (error) {
    console.error('Update product error:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la mise à jour du produit');
    }
  }
);

// @desc    Soft delete product
// @route   DELETE /api/products/:productId
// @access  Private/Admin
router.delete(
  '/:productId',
  protect,
  authorize('admin'),
  [
    param('productId')
      .isMongoId()
      .withMessage('ID produit invalide')
      .custom((value) => {
        if (!isValidObjectId(value)) {
          throw new Error('ID produit invalide');
        }
        return true;
      })
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { productId } = req.params;
      
      if (!isValidObjectId(productId)) {
        return sendErrorResponse(res, 400, 'ID produit invalide');
      }
      
      // Récupérer l'état avant suppression
      const beforeProduct = await Product.findById(productId).lean();
      if (!beforeProduct) {
        return sendErrorResponse(res, 404, 'Produit non trouvé');
      }
      
      const product = await Product.findOneAndUpdate(
        { _id: productId },
        { isActive: false },
        { new: true }
      ).lean();

      if (!product) {
        return sendErrorResponse(res, 404, 'Produit non trouvé');
      }

      // Logger l'action
      await logAction(req, 'DELETE', 'PRODUCT', {
        resourceId: productId,
        beforeState: serializeProduct(beforeProduct),
        afterState: { isActive: false },
        description: `Suppression (archivage) du produit ${beforeProduct.name}`
      });

      sendSuccessResponse(res, 200, 'Produit archivé avec succès');
  } catch (error) {
      console.error('Archive product error:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la suppression du produit');
    }
  }
);

module.exports = router;
