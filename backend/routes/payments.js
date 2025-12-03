const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { protect } = require('../middleware/auth');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Order = require('../models/Order');
const Product = require('../models/Product');
const PrepaidCard = require('../models/PrepaidCard');
const paymentProviderService = require('../services/paymentProviders');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// @desc    Create payment intent for course enrollment
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  try {
    console.log('Create payment intent request:', {
      body: req.body,
      userId: req.user?.id,
      paymentMethod: req.body?.paymentMethod
    });
    
    const { courseId, paymentMethod, provider, prepaidCardCode } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!courseId) {
      console.error('Missing courseId in request body');
      return sendErrorResponse(res, 400, 'L\'ID du cours est requis');
    }

    // Validate courseId format (MongoDB ObjectId or numeric ID)
    // Accept both MongoDB ObjectId (24 hex chars) and numeric IDs
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);
    const isValidNumericId = /^\d+$/.test(courseId);
    
    if (!isValidObjectId && !isValidNumericId) {
      console.error('Invalid courseId format:', courseId);
      return sendErrorResponse(res, 400, 'Format d\'ID de cours invalide');
    }

    // Get course details
    // Handle both MongoDB ObjectId and numeric IDs (including demo ID "4")
    let course;
    try {
      if (courseId === '4') {
        // For demo purposes, find the first React course (same logic as training.js)
        course = await Course.findOne({ title: { $regex: /React/i } });
        if (!course) {
          // Fallback: get any active course
          course = await Course.findOne({ isActive: true });
        }
      } else if (isValidObjectId) {
        course = await Course.findById(courseId);
      } else if (isValidNumericId) {
        // Try to find by numeric ID (if your schema has a numeric id field)
        course = await Course.findOne({ 
          $or: [
            { id: parseInt(courseId) },
            { _id: courseId }
          ]
        });
        
        // If not found, try as ObjectId string conversion
        if (!course && mongoose.Types.ObjectId.isValid(courseId)) {
          course = await Course.findById(courseId);
        }
      }
    } catch (dbError) {
      console.error('Database error when finding course:', dbError);
      return sendErrorResponse(res, 500, `Erreur lors de la récupération du cours: ${dbError.message}`);
    }
    if (!course) {
      return sendErrorResponse(res, 404, 'Cours non trouvé');
    }

    // Use the actual course _id from database (important for demo ID "4")
    const actualCourseId = course._id;

    if (!course.isActive) {
      return sendErrorResponse(res, 400, 'Ce cours n\'est plus disponible');
    }

    if (course.currentStudents >= course.maxStudents) {
      return sendErrorResponse(res, 400, 'Ce cours est complet');
    }

    // Validate course price
    if (!course.price || course.price <= 0) {
      return sendErrorResponse(res, 400, 'Le prix du cours n\'est pas valide');
    }

    // Check if user is already enrolled (use actual course ID)
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: actualCourseId,
      status: { $in: ['enrolled', 'completed'] }
    });

    if (existingEnrollment) {
      return sendErrorResponse(res, 400, 'Vous êtes déjà inscrit à ce cours');
    }

    // Validate and process prepaid card if used
    let prepaidCard = null;
    if (paymentMethod === 'prepaid_card' && prepaidCardCode) {
      prepaidCard = await PrepaidCard.findOne({ code: prepaidCardCode.toUpperCase() });
      
      if (!prepaidCard) {
        return sendErrorResponse(res, 404, 'Code de carte prépayée invalide');
      }

      if (prepaidCard.status !== 'active') {
        return sendErrorResponse(res, 400, 'Cette carte a déjà été utilisée ou est désactivée');
      }

      if (prepaidCard.expiresAt && prepaidCard.expiresAt < new Date()) {
        prepaidCard.status = 'expired';
        await prepaidCard.save();
        return sendErrorResponse(res, 400, 'Cette carte a expiré');
      }

      if (prepaidCard.value < course.price) {
        return sendErrorResponse(res, 400, `Le montant de la carte (${prepaidCard.value} FCFA) est insuffisant pour payer ce cours (${course.price} FCFA)`);
      }
    }

    // Validate payment method (only allowed methods for Tchad) - BEFORE creating records
    const allowedMethods = ['airtel_money', 'moov_money', 'bank_transfer', 'prepaid_card'];
    if (paymentMethod && !allowedMethods.includes(paymentMethod)) {
      return sendErrorResponse(res, 400, `Méthode de paiement non autorisée. Méthodes acceptées: ${allowedMethods.join(', ')}`);
    }

    // Create enrollment record (use actual course ID)
    let enrollment;
    try {
      enrollment = await Enrollment.create({
      user: userId,
        course: actualCourseId,
      status: 'pending'
    });
    } catch (enrollmentError) {
      console.error('Enrollment creation error:', enrollmentError);
      return sendErrorResponse(res, 500, `Erreur lors de la création de l'inscription: ${enrollmentError.message}`);
    }

    // Generate transaction ID
    const transactionId = uuidv4();

    // Determine payment provider
    let paymentProviderValue;
    if (paymentMethod === 'prepaid_card') {
      paymentProviderValue = 'prepaid_card';
    } else if (paymentMethod === 'bank_transfer') {
      paymentProviderValue = 'bank';
    } else {
      paymentProviderValue = provider || paymentMethod || 'airtel_money';
    }

    // Create payment record (use actual course ID)
    let payment;
    try {
      payment = await Payment.create({
        user: userId,
        course: actualCourseId,
        enrollment: enrollment._id,
      amount: course.price,
      currency: 'XAF',
      status: 'pending',
      paymentMethod: paymentMethod || 'airtel_money',
        paymentProvider: paymentProviderValue,
      transactionId: transactionId,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      prepaidCard: prepaidCard ? prepaidCard._id : null
    });
    } catch (paymentError) {
      console.error('Payment creation error:', paymentError);
      // Clean up enrollment if payment creation fails
      if (enrollment) {
        await Enrollment.findByIdAndDelete(enrollment._id).catch(() => {});
      }
      return sendErrorResponse(res, 500, `Erreur lors de la création du paiement: ${paymentError.message}`);
    }


    // Handle prepaid card payment
    if (paymentMethod === 'prepaid_card' && prepaidCard) {
      // For prepaid card, complete payment immediately
      try {
        // Use the prepaid card
        await prepaidCard.use(userId);
        
        // Mark payment as completed
        payment.status = 'completed';
        payment.paidAt = new Date();
        await payment.save();
        
        // Update enrollment status
        enrollment.status = 'enrolled';
        await enrollment.save();
        
        // Update course student count (use actual course ID)
        await Course.findByIdAndUpdate(actualCourseId, {
          $inc: { currentStudents: 1 }
        });
        
        sendSuccessResponse(res, 201, 'Paiement effectué avec succès avec la carte prépayée', {
          paymentId: payment._id,
          enrollmentId: enrollment._id,
          amount: course.price,
          currency: 'XAF',
          transactionId: transactionId,
          paymentMethod: paymentMethod,
          cardCode: prepaidCard.code,
          status: 'completed'
        });
      } catch (error) {
        console.error('Prepaid card payment error:', error);
        payment.status = 'failed';
        await payment.save();
        return sendErrorResponse(res, 500, 'Erreur lors du traitement du paiement par carte prépayée');
      }
    } else if (paymentMethod === 'bank_transfer') {
      // For bank transfer (virement bancaire)
      sendSuccessResponse(res, 201, 'Paiement par virement bancaire créé', {
        paymentId: payment._id,
        enrollmentId: enrollment._id,
        amount: course.price,
        currency: 'XAF',
        transactionId: transactionId,
        paymentMethod: paymentMethod,
        message: 'Vous recevrez les instructions de virement par email. Votre inscription sera validée après confirmation du paiement.'
      });
    } else if (paymentMethod === 'airtel_money' || paymentMethod === 'moov_money') {
      // For mobile money (Airtel or Moov)
      sendSuccessResponse(res, 201, 'Paiement Mobile Money créé', {
        paymentId: payment._id,
        enrollmentId: enrollment._id,
        amount: course.price,
        currency: 'XAF',
        transactionId: transactionId,
        paymentMethod: paymentMethod,
        message: `Vous serez redirigé vers le portail ${paymentMethod === 'airtel_money' ? 'Airtel Money' : 'Moov Money'} pour compléter le paiement.`
      });
    } else {
      // Default fallback
      sendSuccessResponse(res, 201, 'Paiement créé', {
        paymentId: payment._id,
        enrollmentId: enrollment._id,
        amount: course.price,
        currency: 'XAF',
        transactionId: transactionId,
        paymentMethod: paymentMethod || 'airtel_money'
      });
    }

  } catch (error) {
    console.error('Create payment intent error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors
    });
    
    // Send more detailed error message in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Erreur serveur: ${error.message}` 
      : 'Erreur serveur';
    
    sendErrorResponse(res, 500, errorMessage, process.env.NODE_ENV === 'development' ? { stack: error.stack } : null);
  }
});

// @desc    Confirm payment and complete enrollment
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body;
    const userId = req.user.id;

    // Get payment record
    const payment = await Payment.findOne({
      _id: paymentId,
      user: userId
    }).populate('course enrollment');

    if (!payment) {
      return sendErrorResponse(res, 404, 'Paiement non trouvé');
    }

    if (payment.status === 'completed') {
      return sendErrorResponse(res, 400, 'Ce paiement a déjà été traité');
    }

    if (payment.status === 'failed' || payment.status === 'cancelled') {
      return sendErrorResponse(res, 400, 'Ce paiement a échoué ou a été annulé');
    }

    // Verify payment based on method
    if (payment.paymentMethod === 'bank_transfer') {
      // For bank transfers, payment should be marked as completed by admin
      // This route is for manual confirmation
      payment.status = 'completed';
      payment.paidAt = new Date();
      await payment.save();
    } else if (payment.paymentMethod === 'prepaid_card') {
      // Prepaid card is already processed at creation
      if (payment.status !== 'completed') {
        payment.status = 'completed';
        payment.paidAt = new Date();
        await payment.save();
      }
    } else if (payment.paymentMethod === 'airtel_money' || payment.paymentMethod === 'moov_money') {
      // For mobile money, check provider status if transaction ID provided
      if (payment.status === 'pending') {
        // Status will be updated via webhook or status check
        return sendErrorResponse(res, 400, 'Le paiement mobile money est en attente de confirmation du provider');
      }
    } else {
      // For other payment methods, mark as completed
      payment.status = 'completed';
      payment.paidAt = new Date();
      await payment.save();
    }

    // Update enrollment status
    payment.enrollment.status = 'enrolled';
    await payment.enrollment.save();

    // Update course student count
    await Course.findByIdAndUpdate(payment.course._id, {
      $inc: { currentStudents: 1 }
    });

    sendSuccessResponse(res, 200, 'Paiement confirmé et inscription validée', {
      paymentId: payment._id,
      enrollmentId: payment.enrollment._id,
      course: payment.course,
      status: 'enrolled'
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user.id;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('course', 'title image price')
      .populate('enrollment', 'status enrollmentDate progress')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    sendSuccessResponse(res, 200, 'Historique des paiements récupéré', {
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
router.get('/:paymentId', protect, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      user: userId
    }).populate('course enrollment');

    if (!payment) {
      return sendErrorResponse(res, 404, 'Paiement non trouvé');
    }

    sendSuccessResponse(res, 200, 'Détails du paiement récupérés', payment);

  } catch (error) {
    console.error('Get payment details error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Cancel payment
// @route   POST /api/payments/:paymentId/cancel
// @access  Private
router.post('/:paymentId/cancel', protect, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      user: userId,
      status: { $in: ['pending', 'processing'] }
    }).populate('enrollment');

    if (!payment) {
      return sendErrorResponse(res, 404, 'Paiement non trouvé ou ne peut pas être annulé');
    }

    // Cancel payment
    payment.status = 'cancelled';
    await payment.save();

    // Cancel enrollment
    if (payment.enrollment) {
      payment.enrollment.status = 'cancelled';
      await payment.enrollment.save();
    }

    sendSuccessResponse(res, 200, 'Paiement annulé avec succès');

  } catch (error) {
    console.error('Cancel payment error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentIntentFailed(failedPayment);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper functions for webhook handling
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id
    }).populate('enrollment course');

    if (payment && payment.status === 'pending') {
      payment.status = 'completed';
      payment.paidAt = new Date();
      payment.providerTransactionId = paymentIntent.id;
      await payment.save();

      // Update enrollment
      payment.enrollment.status = 'enrolled';
      await payment.enrollment.save();

      // Update course student count
      await Course.findByIdAndUpdate(payment.course._id, {
        $inc: { currentStudents: 1 }
      });
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (payment && payment.status === 'pending') {
      payment.status = 'failed';
      payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
      await payment.save();

      // Cancel enrollment
      if (payment.enrollment) {
        payment.enrollment.status = 'cancelled';
        await payment.enrollment.save();
      }
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

/**
 * @swagger
 * /payments/create-mobile-money:
 *   post:
 *     summary: Créer un paiement Mobile Money (Airtel Money ou Moov Money)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *               - phoneNumber
 *             properties:
 *               items:
 *                 type: array
 *                 description: Liste des articles à payer
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [course, product, cart]
 *                     itemId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                       default: 1
 *               paymentMethod:
 *                 type: string
 *                 enum: [airtel_money, moov_money]
 *                 description: Méthode de paiement mobile money
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^(\+?235)?[0-9]{8}$'
 *                 example: "60290510"
 *                 description: Numéro de téléphone (8 chiffres, avec ou sans +235)
 *               orderId:
 *                 type: string
 *                 description: ID de commande (pour paiements de panier)
 *     responses:
 *       201:
 *         description: Paiement mobile money initié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                     transactionId:
 *                       type: string
 *                     providerTransactionId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     phoneNumber:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, processing]
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/create-mobile-money', protect, async (req, res) => {
  try {
    const { 
      items, // Array of {type: 'course'|'product'|'cart', itemId: ObjectId, quantity: number}
      paymentMethod, // 'airtel_money' or 'moov_money'
      phoneNumber,
      orderId // Optional, for cart payments
    } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendErrorResponse(res, 400, 'Les articles à payer sont requis');
    }

    if (!paymentMethod || !['airtel_money', 'moov_money'].includes(paymentMethod)) {
      return sendErrorResponse(res, 400, 'La méthode de paiement doit être airtel_money ou moov_money');
    }

    if (!phoneNumber || !/^(\+?235)?[0-9]{8}$/.test(phoneNumber.replace(/\s/g, ''))) {
      return sendErrorResponse(res, 400, 'Numéro de téléphone invalide. Format attendu: +235 60 29 05 10 ou 60290510');
    }

    // Normalize phone number
    let normalizedPhone = phoneNumber.replace(/\s/g, '').replace(/^\+?235/, '');

    // Calculate total amount
    let totalAmount = 0;
    const paymentItems = [];

    for (const item of items) {
      if (item.type === 'course') {
        const course = await Course.findById(item.itemId);
        if (!course || !course.isActive) {
          return sendErrorResponse(res, 404, `Cours ${item.itemId} introuvable ou inactif`);
        }
        if (course.currentStudents >= course.maxStudents) {
          return sendErrorResponse(res, 400, `Le cours "${course.title}" est complet`);
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
          user: userId,
          course: item.itemId,
          status: { $in: ['enrolled', 'completed'] }
        });
        if (existingEnrollment) {
          return sendErrorResponse(res, 400, `Vous êtes déjà inscrit au cours "${course.title}"`);
        }

        totalAmount += course.price * (item.quantity || 1);
        paymentItems.push({
          type: 'course',
          itemId: course._id,
          name: course.title,
          quantity: item.quantity || 1,
          unitPrice: course.price
        });
      } else if (item.type === 'product') {
        const product = await Product.findById(item.itemId);
        if (!product || !product.isActive) {
          return sendErrorResponse(res, 404, `Produit ${item.itemId} introuvable ou inactif`);
        }

        const availableStock = typeof product.stock === 'number' ? product.stock : 0;
        const requestedQuantity = item.quantity || 1;
        if (availableStock < requestedQuantity) {
          return sendErrorResponse(res, 400, `Stock insuffisant pour "${product.name}". Disponible: ${availableStock}`);
        }

        totalAmount += product.price * requestedQuantity;
        paymentItems.push({
          type: 'product',
          itemId: product._id,
          name: product.name,
          quantity: requestedQuantity,
          unitPrice: product.price
        });
      } else if (item.type === 'cart') {
        if (!orderId) {
          return sendErrorResponse(res, 400, 'orderId est requis pour les paiements de panier');
        }
        const order = await Order.findById(orderId).populate('items.product');
        if (!order || order.user?.toString() !== userId.toString()) {
          return sendErrorResponse(res, 404, 'Commande non trouvée');
        }

        totalAmount = order.total;
        paymentItems.push({
          type: 'cart',
          itemId: order._id,
          name: `Commande ${order.reference}`,
          quantity: 1,
          unitPrice: order.total
        });
      }
    }

    if (totalAmount <= 0) {
      return sendErrorResponse(res, 400, 'Le montant total doit être supérieur à zéro');
    }

    // Generate transaction ID
    const transactionId = uuidv4();

    // Create payment record
    const payment = await Payment.create({
      user: userId,
      amount: totalAmount,
      currency: 'XAF',
      status: 'pending',
      paymentMethod: paymentMethod,
      paymentProvider: paymentMethod,
      transactionId: transactionId,
      items: paymentItems,
      paymentDetails: {
        phoneNumber: normalizedPhone,
        operator: paymentMethod === 'airtel_money' ? 'Airtel' : 'Moov'
      },
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      order: orderId || null
    });

    // Create payment with provider
    let providerResponse;
    try {
      if (paymentMethod === 'airtel_money') {
        providerResponse = await paymentProviderService.createAirtelMoneyPayment(
          totalAmount,
          normalizedPhone,
          transactionId,
          {
            userId: userId.toString(),
            paymentId: payment._id.toString(),
            items: paymentItems.map(i => ({ type: i.type, itemId: i.itemId.toString() }))
          }
        );
      } else if (paymentMethod === 'moov_money') {
        providerResponse = await paymentProviderService.createMoovMoneyPayment(
          totalAmount,
          normalizedPhone,
          transactionId,
          {
            userId: userId.toString(),
            paymentId: payment._id.toString(),
            items: paymentItems.map(i => ({ type: i.type, itemId: i.itemId.toString() }))
          }
        );
      }
    } catch (providerError) {
      console.error('Provider payment error:', providerError);
      payment.status = 'failed';
      payment.failureReason = providerError.message;
      await payment.save();
      return sendErrorResponse(res, 500, `Erreur lors de la création du paiement: ${providerError.message}`);
    }

    // Update payment with provider transaction reference
    if (providerResponse.transactionReference) {
      payment.providerTransactionId = providerResponse.transactionReference;
      payment.paymentDetails.transactionReference = providerResponse.transactionReference;
      await payment.save();
    }

    // Create enrollments for courses
    if (orderId) {
      // For cart payments, the order already exists
      payment.order = orderId;
      await payment.save();
    } else {
      // Create enrollments and update stock for individual items
      for (const item of paymentItems) {
        if (item.type === 'course') {
          const enrollment = await Enrollment.create({
            user: userId,
            course: item.itemId,
            status: 'pending'
          });
          payment.enrollment = enrollment._id;
          payment.course = item.itemId;
          await payment.save();
        } else if (item.type === 'product') {
          // Stock will be updated when payment is confirmed
        }
      }
    }

    sendSuccessResponse(res, 201, providerResponse.message || 'Paiement mobile money initié', {
      paymentId: payment._id,
      transactionId: transactionId,
      providerTransactionId: providerResponse.transactionReference,
      amount: totalAmount,
      currency: 'XAF',
      phoneNumber: normalizedPhone,
      status: 'pending',
      expiresAt: payment.expiresAt,
      message: providerResponse.message
    });

  } catch (error) {
    console.error('Create mobile money payment error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

/**
 * @swagger
 * /payments/{paymentId}/status:
 *   get:
 *     summary: Vérifier le statut d'un paiement
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du paiement
 *     responses:
 *       200:
 *         description: Statut du paiement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, completed, failed, cancelled]
 *                     amount:
 *                       type: number
 *                     currency:
 *                       type: string
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Paiement non trouvé
 */
router.get('/:paymentId/status', protect, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      user: userId
    });

    if (!payment) {
      return sendErrorResponse(res, 404, 'Paiement non trouvé');
    }

    // If payment is completed or failed, return current status
    if (['completed', 'failed', 'cancelled'].includes(payment.status)) {
      return sendSuccessResponse(res, 200, 'Statut du paiement', {
        paymentId: payment._id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.paidAt,
        failureReason: payment.failureReason
      });
    }

    // For pending payments with mobile money, check provider status
    if (payment.status === 'pending' && ['airtel_money', 'moov_money'].includes(payment.paymentProvider)) {
      try {
        let providerStatus;
        if (payment.paymentProvider === 'airtel_money') {
          providerStatus = await paymentProviderService.checkAirtelMoneyStatus(
            payment.providerTransactionId || payment.paymentDetails?.transactionReference
          );
        } else if (payment.paymentProvider === 'moov_money') {
          providerStatus = await paymentProviderService.checkMoovMoneyStatus(
            payment.providerTransactionId || payment.paymentDetails?.transactionReference
          );
        }

        // Update payment status if provider reports it's completed
        if (providerStatus && providerStatus.status === 'completed') {
          payment.status = 'completed';
          payment.paidAt = new Date();
          await payment.save();

          // Complete enrollments and update stock
          await completePayment(payment);
        } else if (providerStatus && providerStatus.status === 'failed') {
          payment.status = 'failed';
          payment.failureReason = providerStatus.reason || 'Paiement échoué';
          await payment.save();
        }
      } catch (providerError) {
        console.error('Provider status check error:', providerError);
        // Continue with current payment status
      }
    }

    sendSuccessResponse(res, 200, 'Statut du paiement', {
      paymentId: payment._id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      paymentProvider: payment.paymentProvider,
      expiresAt: payment.expiresAt
    });

  } catch (error) {
    console.error('Check payment status error:', error);
    sendErrorResponse(res, 500, 'Erreur serveur');
  }
});

// Helper function to complete payment and process enrollments/orders
async function completePayment(payment) {
  try {
    // Populate payment with related data
    await payment.populate('items.itemId enrollment course order');

    // Process enrollments
    if (payment.enrollment) {
      payment.enrollment.status = 'enrolled';
      await payment.enrollment.save();

      if (payment.course) {
        await Course.findByIdAndUpdate(payment.course._id, {
          $inc: { currentStudents: 1 }
        });
      }
    }

    // Process items (courses, products)
    for (const item of payment.items || []) {
      if (item.type === 'course') {
        const course = await Course.findById(item.itemId);
        if (course && course.currentStudents < course.maxStudents) {
          // Check if enrollment exists, if not create one
          let enrollment = await Enrollment.findOne({
            user: payment.user,
            course: item.itemId
          });

          if (!enrollment) {
            enrollment = await Enrollment.create({
              user: payment.user,
              course: item.itemId,
              status: 'enrolled'
            });
          } else if (enrollment.status === 'pending') {
            enrollment.status = 'enrolled';
            await enrollment.save();
          }

          await Course.findByIdAndUpdate(item.itemId, {
            $inc: { currentStudents: 1 }
          });
        }
      } else if (item.type === 'product') {
        // Update product stock
        const product = await Product.findById(item.itemId);
        if (product) {
          const currentStock = typeof product.stock === 'number' ? product.stock : 0;
          const newStock = Math.max(currentStock - (item.quantity || 1), 0);
          await Product.findByIdAndUpdate(item.itemId, {
            stock: newStock
          });
        }
      }
    }

    // Process order
    if (payment.order) {
      const order = await Order.findById(payment.order);
      if (order && order.status === 'pending') {
        order.status = 'processing';
        order.payment.status = 'paid';
        order.payment.paidAt = new Date();
        order.payment.transactionId = payment.transactionId;
        await order.save();
      }
    }
  } catch (error) {
    console.error('Complete payment processing error:', error);
    throw error;
  }
}

// @desc    Airtel Money webhook handler
// @route   POST /api/payments/webhook/airtel
// @access  Public
router.post('/webhook/airtel', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-airtel-signature'] || req.headers['authorization'];
    
    // Validate webhook signature
    await paymentProviderService.validateAirtelMoneyWebhook(req.body, signature);

    const webhookData = JSON.parse(req.body.toString());

    // Find payment by transaction reference
    const payment = await Payment.findOne({
      $or: [
        { providerTransactionId: webhookData.transactionReference },
        { 'paymentDetails.transactionReference': webhookData.transactionReference }
      ]
    }).populate('user');

    if (!payment) {
      console.error('Payment not found for Airtel webhook:', webhookData.transactionReference);
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment status based on webhook
    if (webhookData.status === 'success' || webhookData.status === 'completed') {
      payment.status = 'completed';
      payment.paidAt = new Date();
      if (webhookData.transactionReference) {
        payment.providerTransactionId = webhookData.transactionReference;
      }
      await payment.save();

      // Complete payment processing
      await completePayment(payment);
    } else if (webhookData.status === 'failed' || webhookData.status === 'error') {
      payment.status = 'failed';
      payment.failureReason = webhookData.reason || webhookData.message || 'Paiement échoué';
      await payment.save();
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Airtel Money webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// @desc    Moov Money webhook handler
// @route   POST /api/payments/webhook/moov
// @access  Public
router.post('/webhook/moov', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-moov-signature'] || req.headers['authorization'];
    
    // Validate webhook signature
    await paymentProviderService.validateMoovMoneyWebhook(req.body, signature);

    const webhookData = JSON.parse(req.body.toString());

    // Find payment by transaction reference
    const payment = await Payment.findOne({
      $or: [
        { providerTransactionId: webhookData.transactionReference },
        { 'paymentDetails.transactionReference': webhookData.transactionReference }
      ]
    }).populate('user');

    if (!payment) {
      console.error('Payment not found for Moov webhook:', webhookData.transactionReference);
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment status based on webhook
    if (webhookData.status === 'success' || webhookData.status === 'completed') {
      payment.status = 'completed';
      payment.paidAt = new Date();
      if (webhookData.transactionReference) {
        payment.providerTransactionId = webhookData.transactionReference;
      }
      await payment.save();

      // Complete payment processing
      await completePayment(payment);
    } else if (webhookData.status === 'failed' || webhookData.status === 'error') {
      payment.status = 'failed';
      payment.failureReason = webhookData.reason || webhookData.message || 'Paiement échoué';
      await payment.save();
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Moov Money webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
