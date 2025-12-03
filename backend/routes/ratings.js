const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Course = require('../models/Course');
const { protect: auth } = require('../middleware/auth');

// @route   POST /api/ratings/course/:courseId
// @desc    Noter une formation
// @access  Private
router.post('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    // Vérifier que la formation existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    // Vérifier que la note est valide
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    // Vérifier si l'utilisateur a déjà noté cette formation
    let existingRating = await Rating.findOne({ user: userId, course: courseId });

    if (existingRating) {
      // Mettre à jour la note existante
      existingRating.rating = rating;
      if (review) existingRating.review = review;
      await existingRating.save();
    } else {
      // Créer une nouvelle note
      existingRating = new Rating({
        user: userId,
        course: courseId,
        rating,
        review: review || ''
      });
      await existingRating.save();
    }

    // Mettre à jour les statistiques du cours
    await Rating.updateCourseRatingStats(courseId);

    res.json({
      message: 'Note enregistrée avec succès',
      rating: existingRating
    });
  } catch (error) {
    console.error('Erreur lors de la notation:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la notation' });
  }
});

// @route   GET /api/ratings/course/:courseId
// @desc    Obtenir toutes les notes d'une formation
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Vérifier que la formation existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    // Obtenir les notes avec pagination
    const ratings = await Rating.find({ course: courseId, isPublic: true })
      .populate('user', 'firstName lastName avatar')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Obtenir le total des notes
    const totalRatings = await Rating.countDocuments({ course: courseId, isPublic: true });

    // Obtenir les statistiques de notation
    const stats = await Rating.getCourseRatingStats(courseId);

    res.json({
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRatings / limit),
        totalRatings,
        hasNext: page < Math.ceil(totalRatings / limit),
        hasPrev: page > 1
      },
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des notes' });
  }
});

// @route   GET /api/ratings/course/:courseId/user
// @desc    Obtenir la note d'un utilisateur pour une formation
// @access  Private
router.get('/course/:courseId/user', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findOne({ user: userId, course: courseId })
      .populate('user', 'firstName lastName')
      .populate('course', 'title');

    if (!rating) {
      return res.json({ rating: null, message: 'Aucune note trouvée' });
    }

    res.json({ rating });
  } catch (error) {
    console.error('Erreur lors de la récupération de la note utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la note' });
  }
});

// @route   PUT /api/ratings/course/:courseId
// @desc    Mettre à jour une note
// @access  Private
router.put('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    // Vérifier que la note est valide
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    const existingRating = await Rating.findOne({ user: userId, course: courseId });

    if (!existingRating) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    existingRating.rating = rating;
    if (review !== undefined) existingRating.review = review;
    await existingRating.save();

    // Mettre à jour les statistiques du cours
    await Rating.updateCourseRatingStats(courseId);

    res.json({
      message: 'Note mise à jour avec succès',
      rating: existingRating
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la note' });
  }
});

// @route   DELETE /api/ratings/course/:courseId
// @desc    Supprimer une note
// @access  Private
router.delete('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findOneAndDelete({ user: userId, course: courseId });

    if (!rating) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    // Mettre à jour les statistiques du cours
    await Rating.updateCourseRatingStats(courseId);

    res.json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la note' });
  }
});

// @route   GET /api/ratings/user
// @desc    Obtenir toutes les notes d'un utilisateur
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const ratings = await Rating.find({ user: userId })
      .populate('course', 'title image price category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRatings = await Rating.countDocuments({ user: userId });

    res.json({
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRatings / limit),
        totalRatings,
        hasNext: page < Math.ceil(totalRatings / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notes utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des notes' });
  }
});

module.exports = router;
