const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect: auth, authorize } = require('../middleware/auth');

// @route   POST /api/testimonials
// @desc    Créer un témoignage
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { rating, testimonial, category } = req.body;
    const userId = req.user.id;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        message: 'La note doit être entre 1 et 5' 
      });
    }

    if (!testimonial || testimonial.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        message: 'Le témoignage doit contenir au moins 10 caractères' 
      });
    }

    // Vérifier si l'utilisateur a déjà un témoignage non supprimé
    const existingTestimonial = await Testimonial.findOne({ user: userId });

    if (existingTestimonial) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà soumis un témoignage. Vous pouvez le modifier depuis votre profil.'
      });
    }

    // Créer le témoignage
    const newTestimonial = new Testimonial({
      user: userId,
      rating,
      testimonial: testimonial.trim(),
      category: category || 'plateforme'
    });

    await newTestimonial.save();

    // Populate les informations de l'utilisateur
    await newTestimonial.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Votre témoignage a été soumis avec succès. Il sera visible après approbation.',
      testimonial: newTestimonial
    });
  } catch (error) {
    console.error('Erreur lors de la création du témoignage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la création du témoignage' 
    });
  }
});

// @route   GET /api/testimonials
// @desc    Obtenir tous les témoignages approuvés
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      rating,
      featured,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Construire le filtre
    const filter = { isApproved: true, isPublic: true };
    
    if (category) filter.category = category;
    if (rating) filter.rating = parseInt(rating);
    if (featured === 'true') filter.isFeatured = true;

    // Obtenir les témoignages avec pagination
    const testimonials = await Testimonial.find(filter)
      .populate('user', 'firstName lastName avatar')
      .populate('response.by', 'firstName lastName')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Obtenir le total
    const totalTestimonials = await Testimonial.countDocuments(filter);

    // Obtenir les statistiques globales
    const stats = await Testimonial.getGlobalStats();

    res.json({
      success: true,
      testimonials,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTestimonials / limit),
        totalTestimonials,
        hasNext: page < Math.ceil(totalTestimonials / limit),
        hasPrev: page > 1
      },
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la récupération des témoignages' 
    });
  }
});

// @route   GET /api/testimonials/featured
// @desc    Obtenir les témoignages mis en avant
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const testimonials = await Testimonial.find({ 
      isApproved: true, 
      isPublic: true,
      isFeatured: true 
    })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages mis en avant:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   GET /api/testimonials/stats
// @desc    Obtenir les statistiques globales des témoignages
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const globalStats = await Testimonial.getGlobalStats();
    
    // Obtenir les statistiques par catégorie
    const categories = ['service', 'formation', 'support', 'plateforme', 'autre'];
    const categoryStats = await Promise.all(
      categories.map(cat => Testimonial.getStatsByCategory(cat))
    );

    res.json({
      success: true,
      stats: {
        global: globalStats,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   GET /api/testimonials/my
// @desc    Obtenir le témoignage de l'utilisateur connecté
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const testimonial = await Testimonial.findOne({ user: userId })
      .populate('user', 'firstName lastName avatar email')
      .populate('response.by', 'firstName lastName');

    if (!testimonial) {
      return res.json({ 
        success: true,
        testimonial: null,
        message: 'Vous n\'avez pas encore soumis de témoignage' 
      });
    }

    res.json({
      success: true,
      testimonial
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du témoignage utilisateur:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   GET /api/testimonials/:id
// @desc    Obtenir un témoignage spécifique
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id)
      .populate('user', 'firstName lastName avatar')
      .populate('response.by', 'firstName lastName');

    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Témoignage non trouvé' 
      });
    }

    // Vérifier si le témoignage est public ou si c'est l'auteur qui le demande
    if (!testimonial.isPublic && (!req.user || req.user.id !== testimonial.user._id.toString())) {
      return res.status(403).json({ 
        success: false,
        message: 'Accès non autorisé' 
      });
    }

    res.json({
      success: true,
      testimonial
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du témoignage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Mettre à jour son témoignage
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, testimonial, category } = req.body;
    const userId = req.user.id;

    const existingTestimonial = await Testimonial.findById(id);

    if (!existingTestimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Témoignage non trouvé' 
      });
    }

    // Vérifier que c'est bien l'auteur
    if (existingTestimonial.user.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Non autorisé à modifier ce témoignage' 
      });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        success: false,
        message: 'La note doit être entre 1 et 5' 
      });
    }

    if (testimonial && testimonial.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        message: 'Le témoignage doit contenir au moins 10 caractères' 
      });
    }

    // Mettre à jour
    if (rating) existingTestimonial.rating = rating;
    if (testimonial) existingTestimonial.testimonial = testimonial.trim();
    if (category) existingTestimonial.category = category;
    
    // Remettre en attente d'approbation si modification majeure
    if (rating || testimonial) {
      existingTestimonial.isApproved = false;
    }

    await existingTestimonial.save();
    await existingTestimonial.populate('user', 'firstName lastName avatar');

    res.json({
      success: true,
      message: 'Témoignage mis à jour avec succès. Il sera à nouveau soumis à approbation.',
      testimonial: existingTestimonial
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du témoignage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Supprimer son témoignage
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Témoignage non trouvé' 
      });
    }

    // Vérifier que c'est bien l'auteur ou un admin
    if (testimonial.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Non autorisé à supprimer ce témoignage' 
      });
    }

    await Testimonial.findByIdAndDelete(id);

    res.json({ 
      success: true,
      message: 'Témoignage supprimé avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du témoignage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   PUT /api/testimonials/:id/approve
// @desc    Approuver un témoignage (Admin)
// @access  Private/Admin
router.put('/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Témoignage non trouvé' 
      });
    }

    testimonial.isApproved = true;
    await testimonial.save();

    res.json({
      success: true,
      message: 'Témoignage approuvé avec succès',
      testimonial
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation du témoignage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   PUT /api/testimonials/:id/feature
// @desc    Mettre en avant un témoignage (Admin)
// @access  Private/Admin
router.put('/:id/feature', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Témoignage non trouvé' 
      });
    }

    testimonial.isFeatured = isFeatured;
    await testimonial.save();

    res.json({
      success: true,
      message: isFeatured ? 'Témoignage mis en avant' : 'Témoignage retiré de la mise en avant',
      testimonial
    });
  } catch (error) {
    console.error('Erreur lors de la mise en avant du témoignage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   POST /api/testimonials/:id/response
// @desc    Répondre à un témoignage (Admin)
// @access  Private/Admin
router.post('/:id/response', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const adminId = req.user.id;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({ 
        success: false,
        message: 'La réponse doit contenir au moins 5 caractères' 
      });
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Témoignage non trouvé' 
      });
    }

    testimonial.response = {
      text: text.trim(),
      by: adminId,
      date: new Date()
    };

    await testimonial.save();
    await testimonial.populate('response.by', 'firstName lastName');

    res.json({
      success: true,
      message: 'Réponse ajoutée avec succès',
      testimonial
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réponse:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

// @route   POST /api/testimonials/:id/helpful
// @desc    Marquer un témoignage comme utile
// @access  Public
router.post('/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Témoignage non trouvé' 
      });
    }

    testimonial.helpfulVotes += 1;
    await testimonial.save();

    res.json({
      success: true,
      message: 'Merci pour votre feedback',
      helpfulVotes: testimonial.helpfulVotes
    });
  } catch (error) {
    console.error('Erreur lors du vote:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

module.exports = router;


