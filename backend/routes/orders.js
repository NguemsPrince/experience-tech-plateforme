const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

const router = express.Router();

const PAYMENT_METHODS = ['airtel_money', 'moov_money', 'bank_transfer', 'prepaid_card'];

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 422, 'Validation échouée', errors.array());
  }
  return null;
};

router.post(
  '/',
  protect,
  [
    body('customer.fullName').isString().isLength({ min: 4, max: 120 }),
    body('customer.email').isEmail(),
    body('customer.phone').isString().isLength({ min: 6 }),
    body('customer.address').isString().isLength({ min: 10, max: 200 }),
    body('customer.city').optional().isString().isLength({ min: 2, max: 80 }),
    body('customer.notes').optional().isString().isLength({ max: 300 }),
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isString().isMongoId(),
    body('items.*.quantity').isInt({ min: 1, max: 10 }),
    body('payment.method').isString().isIn(PAYMENT_METHODS),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { customer, items, payment } = req.body;

      const productIds = items.map((item) => item.productId);
      const products = await Product.find({
        _id: { $in: productIds },
        isActive: true,
      });

      if (products.length !== items.length) {
        return sendErrorResponse(
          res,
          404,
          'Certains produits sont introuvables ou inactifs'
        );
      }

      const orderItems = [];
      let subtotal = 0;

      const stockOperations = [];

      for (const item of items) {
        const product = products.find(
          (p) => p._id.toString() === item.productId
        );

        if (!product) {
          return sendErrorResponse(res, 404, `Produit ${item.productId} introuvable`);
        }

        const availableStock =
          typeof product.stock === 'number' ? product.stock : 0;

        if (availableStock < item.quantity) {
          return sendErrorResponse(
            res,
            400,
            `Le produit ${product.name} n'est disponible qu'en ${product.stock} exemplaires`
          );
        }

        const unitPrice = product.price;
        const subtotalItem = unitPrice * item.quantity;
        subtotal += subtotalItem;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          unitPrice,
          subtotal: subtotalItem,
        });

        const newStock = Math.max(availableStock - item.quantity, 0);
        stockOperations.push({
          productId: product._id,
          newStock,
          quantity: item.quantity,
        });
      }

      const discount = req.body.discount && req.body.discount > 0 ? req.body.discount : 0;
      const total = Math.max(subtotal - discount, 0);

      const order = await Order.create({
        customer,
        items: orderItems,
        subtotal,
        discount,
        total,
        payment: {
          method: payment.method,
          provider: payment.provider || null,
          status: payment.method === 'prepaid_card' ? 'paid' : 'pending',
          transactionId: payment.transactionId || null,
        },
        status: 'pending',
        user: req.user.id,
        notes: req.body.notes,
      });

      // Reduce stock
      await Promise.all(
        stockOperations.map((operation) =>
          Product.updateOne(
            { _id: operation.productId },
            {
              $set: {
                stock: operation.newStock,
                availability: operation.newStock > 0 ? 'in_stock' : 'out_of_stock',
              },
              $inc: { sales: operation.quantity },
            },
            { runValidators: false }
          )
        )
      );

      sendSuccessResponse(res, 201, 'Commande créée', {
        order: {
          id: order._id,
          reference: order.reference,
          total: order.total,
          payment: order.payment,
          status: order.status,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      console.error('Create order error:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la création de la commande');
    }
  }
);

router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name price brand images')
      .lean();

    sendSuccessResponse(res, 200, 'Historique des commandes', {
      orders: orders.map((order) => ({
        id: order._id,
        reference: order.reference,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          id: item.product?._id,
          name: item.product?.name,
          brand: item.product?.brand,
          image: item.product?.images?.[0] || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      })),
    });
  } catch (error) {
    console.error('Get orders error:', error);
    sendErrorResponse(res, 500, 'Erreur lors de la récupération des commandes');
  }
});

router.get(
  '/:orderId',
  protect,
  [param('orderId').isMongoId()],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        user: req.user.id,
      })
        .populate('items.product', 'name price brand images specifications')
        .lean();

      if (!order) {
        return sendErrorResponse(res, 404, 'Commande introuvable');
      }

      sendSuccessResponse(res, 200, 'Commande récupérée', order);
    } catch (error) {
      console.error('Get order error:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la récupération de la commande');
    }
  }
);

router.patch(
  '/:orderId/status',
  protect,
  authorize('admin'),
  [
    param('orderId').isMongoId(),
    body('status').isIn(['pending', 'processing', 'shipped', 'completed', 'cancelled']),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { status: req.body.status },
        { new: true }
      ).lean();

      if (!order) {
        return sendErrorResponse(res, 404, 'Commande introuvable');
      }

      sendSuccessResponse(res, 200, 'Statut de la commande mis à jour', {
        id: order._id,
        status: order.status,
      });
    } catch (error) {
      console.error('Update order status error:', error);
      sendErrorResponse(res, 500, 'Erreur lors de la mise à jour du statut');
    }
  }
);

module.exports = router;

