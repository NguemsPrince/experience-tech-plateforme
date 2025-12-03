const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Course = require('../models/Course');
const { protect: auth } = require('../middleware/auth');

// @route   GET /api/cart
// @desc    Obtenir le panier de l'utilisateur
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.getOrCreateCart(userId);

    res.json({
      cart,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du panier' });
  }
});

// @route   POST /api/cart/items
// @desc    Ajouter un article au panier
// @access  Private
router.post('/items', auth, async (req, res) => {
  try {
    const { courseId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Vérifier que la formation existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    // Vérifier que la quantité est valide
    if (quantity < 1) {
      return res.status(400).json({ message: 'La quantité doit être au moins 1' });
    }

    // Obtenir ou créer le panier
    const cart = await Cart.getOrCreateCart(userId);

    // Ajouter l'article au panier
    await cart.addItem(courseId, quantity);

    res.json({
      message: 'Article ajouté au panier avec succès',
      cart,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout au panier' });
  }
});

// @route   PUT /api/cart/items/:courseId
// @desc    Mettre à jour la quantité d'un article
// @access  Private
router.put('/items/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Vérifier que la quantité est valide
    if (quantity < 0) {
      return res.status(400).json({ message: 'La quantité ne peut pas être négative' });
    }

    // Obtenir le panier
    const cart = await Cart.getOrCreateCart(userId);

    // Mettre à jour la quantité
    await cart.updateItemQuantity(courseId, quantity);

    res.json({
      message: 'Quantité mise à jour avec succès',
      cart,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la quantité:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la quantité' });
  }
});

// @route   DELETE /api/cart/items/:courseId
// @desc    Supprimer un article du panier
// @access  Private
router.delete('/items/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Obtenir le panier
    const cart = await Cart.getOrCreateCart(userId);

    // Supprimer l'article
    await cart.removeItem(courseId);

    res.json({
      message: 'Article supprimé du panier avec succès',
      cart,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'article' });
  }
});

// @route   DELETE /api/cart
// @desc    Vider le panier
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtenir le panier
    const cart = await Cart.getOrCreateCart(userId);

    // Vider le panier
    await cart.clearCart();

    res.json({
      message: 'Panier vidé avec succès',
      cart,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Erreur lors du vidage du panier:', error);
    res.status(500).json({ message: 'Erreur serveur lors du vidage du panier' });
  }
});

// @route   GET /api/cart/items/:courseId
// @desc    Vérifier si un cours est dans le panier
// @access  Private
router.get('/items/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Obtenir le panier
    const cart = await Cart.getOrCreateCart(userId);

    const isInCart = cart.hasItem(courseId);
    const quantity = cart.getItemQuantity(courseId);

    res.json({
      isInCart,
      quantity
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'article:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la vérification de l\'article' });
  }
});

// @route   GET /api/cart/count
// @desc    Obtenir le nombre d'articles dans le panier
// @access  Private
router.get('/count', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtenir le panier
    const cart = await Cart.getOrCreateCart(userId);

    res.json({
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Erreur lors du comptage des articles:', error);
    res.status(500).json({ message: 'Erreur serveur lors du comptage des articles' });
  }
});

module.exports = router;
