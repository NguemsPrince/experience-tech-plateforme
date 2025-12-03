import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  UserIcon, 
  StarIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  TrophyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  DevicePhoneMobileIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import PaymentModal from '../components/PaymentModal';
import CourseCard from '../components/CourseCard';
import Cart from '../components/Cart';
import CartIcon from '../components/CartIcon';
import { useAuth } from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import trainingService from '../services/training';
import ratingsService from '../services/ratings';
import { SolarAnimation } from '../components/animations';
import toast from 'react-hot-toast';

const Training = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartOpen, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    closeCart,
    openCart,
    getCartItemsCount
  } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedLevel, setSelectedLevel] = useState('Tous');
  const [selectedPrice, setSelectedPrice] = useState('Tous');
  const [selectedLanguage, setSelectedLanguage] = useState('Tous');
  const [selectedRating, setSelectedRating] = useState('Tous');
  const [selectedDuration, setSelectedDuration] = useState('Tous');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const fetchCourses = React.useCallback(async () => {
    try {
      // Ne pas inclure searchTerm dans l'appel API - la recherche se fait côté client
      const filters = {
        category: selectedCategory,
        level: selectedLevel,
        price: selectedPrice,
        sortBy
      };
      const response = await trainingService.getAllCourses(filters);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to mock data
      setCourses([
        {
          _id: 1,
          title: 'Formation React.js Complète',
          description: 'Maîtrisez React.js de A à Z avec des projets pratiques et des exercices concrets.',
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3',
          duration: '4 semaines',
          price: 75000,
          originalPrice: 95000,
          level: 'Intermédiaire',
          instructor: { name: 'Jean Paul Mballa' },
          instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
          startDate: '2024-02-15',
          maxStudents: 15,
          rating: { average: 4.8, count: 120 },
          studentsCount: 120,
          category: 'Développement Web',
          lessons: 45,
          totalHours: 28,
          language: 'Français',
          lastUpdated: '2024-01-15',
          isBestSeller: true,
          isNew: false,
          tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Redux']
        },
        {
          _id: 2,
          title: 'Formation Node.js & Express',
          description: 'Apprenez à créer des APIs robustes avec Node.js et Express.js.',
          image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3',
          duration: '3 semaines',
          price: 65000,
          originalPrice: 85000,
          level: 'Intermédiaire',
          instructor: { name: 'Marie Claire Nguema' },
          instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3',
          startDate: '2024-02-20',
          maxStudents: 12,
          rating: { average: 4.9, count: 95 },
          studentsCount: 95,
          category: 'Développement Backend',
          lessons: 32,
          totalHours: 22,
          language: 'Français',
          lastUpdated: '2024-01-10',
          isBestSeller: false,
          isNew: true,
          tags: ['Node.js', 'Express', 'API', 'Backend', 'JavaScript']
        },
        {
          _id: 3,
          title: 'Formation MongoDB & Base de Données',
          description: 'Maîtrisez MongoDB et les bases de données NoSQL pour vos applications.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3',
          duration: '2 semaines',
          price: 45000,
          originalPrice: 60000,
          level: 'Débutant',
          instructor: 'Fatou Diallo',
          instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3',
          startDate: '2024-03-01',
          maxStudents: 18,
          rating: 4.7,
          studentsCount: 80,
          category: 'Base de Données',
          lessons: 28,
          totalHours: 16,
          language: 'Français',
          lastUpdated: '2024-01-05',
          isBestSeller: false,
          isNew: false,
          tags: ['MongoDB', 'NoSQL', 'Database', 'Backend']
        },
        {
          _id: 4,
          title: 'Certification Microsoft Office',
          description: 'Formation complète sur Microsoft Word, Excel, PowerPoint et Outlook.',
          image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3',
          duration: '1 semaine',
          price: 35000,
          originalPrice: 50000,
          level: 'Débutant',
          instructor: 'Paul Biya',
          instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3',
          startDate: '2024-02-25',
          maxStudents: 20,
          rating: 4.6,
          studentsCount: 150,
          category: 'Bureautique',
          lessons: 20,
          totalHours: 12,
          language: 'Français',
          lastUpdated: '2024-01-20',
          isBestSeller: true,
          isNew: false,
          tags: ['Office', 'Excel', 'Word', 'PowerPoint', 'Bureautique']
        },
        {
          _id: 5,
          title: 'Formation DevOps & Docker',
          description: 'Apprenez les pratiques DevOps et la containerisation avec Docker.',
          image: 'https://images.unsplash.com/photo-1667372393120-2e8b8c4d5b5e?ixlib=rb-4.0.3',
          duration: '5 semaines',
          price: 95000,
          originalPrice: 120000,
          level: 'Avancé',
          instructor: 'David Nguema',
          instructorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3',
          startDate: '2024-03-10',
          maxStudents: 10,
          rating: 4.9,
          studentsCount: 45,
          category: 'DevOps',
          lessons: 55,
          totalHours: 35,
          language: 'Français',
          lastUpdated: '2024-01-12',
          isBestSeller: false,
          isNew: false,
          tags: ['DevOps', 'Docker', 'CI/CD', 'AWS', 'Linux']
        },
        {
          _id: 6,
          title: 'Formation Intelligence Artificielle',
          description: 'Introduction à l\'IA, machine learning et deep learning avec Python.',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3',
          duration: '6 semaines',
          price: 120000,
          originalPrice: 150000,
          level: 'Avancé',
          instructor: 'Dr. Sarah Mballa',
          instructorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3',
          startDate: '2024-03-15',
          maxStudents: 8,
          rating: 5.0,
          studentsCount: 25,
          category: 'Intelligence Artificielle',
          lessons: 60,
          totalHours: 42,
          language: 'Français',
          lastUpdated: '2024-01-18',
          isBestSeller: true,
          isNew: true,
          tags: ['IA', 'Machine Learning', 'Python', 'Deep Learning', 'TensorFlow']
        }
      ]);
    }
  }, [selectedCategory, selectedLevel, selectedPrice, sortBy]);

  // Load courses from API
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, isAuthenticated]);

  const categories = ['Tous', 'Développement Web', 'Développement Backend', 'Base de Données', 'Bureautique', 'DevOps', 'Intelligence Artificielle'];
  const levels = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];
  const priceRanges = ['Tous', 'Gratuit', '0-50000', '50000-100000', '100000+'];
  const languages = ['Tous', 'Français', 'Anglais', 'Espagnol'];
  const ratings = ['Tous', '4.5+ étoiles', '4.0+ étoiles', '3.5+ étoiles', '3.0+ étoiles'];
  const durations = ['Tous', '0-5h', '5-10h', '10-20h', '20h+'];
  const sortOptions = [
    { value: 'popularity', label: 'Plus populaires' },
    { value: 'newest', label: 'Plus récents' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'price-low', label: 'Prix croissant' },
    { value: 'price-high', label: 'Prix décroissant' },
    { value: 'duration-low', label: 'Durée croissante' },
    { value: 'duration-high', label: 'Durée décroissante' }
  ];

  // Filter and search logic
  const filteredCourses = (courses || []).filter(course => {
    if (!course || !course.title) return false;
    
    const matchesSearch = !searchTerm || 
                         course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'Tous' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'Tous' || course.level === selectedLevel;
    const matchesPrice = selectedPrice === 'Tous' || 
                        (selectedPrice === 'Gratuit' && course.price === 0) ||
                        (selectedPrice === '0-50000' && course.price > 0 && course.price <= 50000) ||
                        (selectedPrice === '50000-100000' && course.price > 50000 && course.price <= 100000) ||
                        (selectedPrice === '100000+' && course.price > 100000);
    
    const matchesLanguage = selectedLanguage === 'Tous' || course.language === selectedLanguage;
    
    const matchesRating = selectedRating === 'Tous' || 
                         (selectedRating === '4.5+ étoiles' && course.rating?.average >= 4.5) ||
                         (selectedRating === '4.0+ étoiles' && course.rating?.average >= 4.0) ||
                         (selectedRating === '3.5+ étoiles' && course.rating?.average >= 3.5) ||
                         (selectedRating === '3.0+ étoiles' && course.rating?.average >= 3.0);
    
    const matchesDuration = selectedDuration === 'Tous' ||
                           (selectedDuration === '0-5h' && course.totalHours <= 5) ||
                           (selectedDuration === '5-10h' && course.totalHours > 5 && course.totalHours <= 10) ||
                           (selectedDuration === '10-20h' && course.totalHours > 10 && course.totalHours <= 20) ||
                           (selectedDuration === '20h+' && course.totalHours > 20);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice && 
           matchesLanguage && matchesRating && matchesDuration;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      case 'rating':
        const ratingA = typeof a.rating === 'object' ? a.rating?.average || 0 : a.rating || 0;
        const ratingB = typeof b.rating === 'object' ? b.rating?.average || 0 : b.rating || 0;
        return ratingB - ratingA;
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'duration-low':
        return (a.totalHours || 0) - (b.totalHours || 0);
      case 'duration-high':
        return (b.totalHours || 0) - (a.totalHours || 0);
      default:
        return (b.studentsCount || 0) - (a.studentsCount || 0);
        }
  });



  const handleCourseClick = (course) => {
    navigate(`/course/${course._id}`);
  };

  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = (course) => {
    if (!course) {
      toast.error('Erreur: Impossible d\'ajouter cette formation au panier');
      return;
    }
    
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      // Sauvegarder la formation pour l'ajouter après connexion
      localStorage.setItem('pendingCourseToAdd', JSON.stringify({ ...course, itemType: 'course' }));
      toast.error('Veuillez vous connecter pour ajouter une formation au panier');
      navigate('/login', { 
        state: { 
          from: '/training',
          message: 'Veuillez vous connecter pour ajouter cette formation à votre panier',
          courseToAdd: { ...course, itemType: 'course' } 
        } 
      });
      return;
    }
    
    try {
      addToCart({ ...course, itemType: 'course' });
      setShowCartNotification(true);
      toast.success(`${course.title} a été ajouté au panier !`);
      setTimeout(() => setShowCartNotification(false), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    }
  };

  const handleRateCourse = async (course, rating) => {
    try {
      await ratingsService.rateCourse(course._id, rating);
      // Optionnel: mettre à jour l'état local ou recharger les données
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('Tous');
    setSelectedLevel('Tous');
    setSelectedPrice('Tous');
    setSelectedLanguage('Tous');
    setSelectedRating('Tous');
    setSelectedDuration('Tous');
    setSearchTerm('');
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedCourse(null);
    // Show success message
    alert('Paiement effectué avec succès ! Vous êtes maintenant inscrit à la formation.');
  };


  return (
    <>
      <Helmet>
        <title>Formation - Expérience Tech</title>
        <meta name="description" content="Découvrez nos formations professionnelles en développement web, bureautique, IA et technologies émergentes au Cameroun." />
      </Helmet>

      {/* Hero Section - Udemy Style */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto text-center">
            <SolarAnimation variant="solar" delay={0.2}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Apprenez sans limites
              </h1>
            </SolarAnimation>
            <SolarAnimation variant="energy" delay={0.4}>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Plus de 6 formations professionnelles pour développer vos compétences
              </p>
            </SolarAnimation>
            
            {/* Search Bar - Enhanced Udemy Style */}
            <SolarAnimation variant="wave" delay={0.6}>
              <div className="max-w-3xl mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher parmi 6+ formations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 pr-32 text-gray-900 rounded-lg text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button
                      onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Recherche avancée"
                    >
                      <FunnelIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Advanced Search */}
                {showAdvancedSearch && (
                  <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-3 py-2 bg-white/90 rounded-lg text-gray-900 focus:outline-none"
                      >
                        {languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="px-3 py-2 bg-white/90 rounded-lg text-gray-900 focus:outline-none"
                      >
                        {ratings.map(rating => (
                          <option key={rating} value={rating}>{rating}</option>
                        ))}
                      </select>
                      <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="px-3 py-2 bg-white/90 rounded-lg text-gray-900 focus:outline-none"
                      >
                        {durations.map(duration => (
                          <option key={duration} value={duration}>{duration}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </SolarAnimation>

            {/* Quick Stats */}
            <SolarAnimation variant="magnetic" delay={0.8}>
              <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">6+</div>
                <div className="text-sm opacity-80">Formations</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-80">Étudiants</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm opacity-80">Note moyenne</div>
              </div>
            </div>
            </SolarAnimation>
          </div>
        </div>
      </section>

      {/* Navigation & Filters - Style Airbnb */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort & Filter - Enhanced */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={`Vue ${viewMode === 'grid' ? 'liste' : 'grille'}`}
                >
                  {viewMode === 'grid' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  )}
                </button>
                
                {/* Cart Icon */}
                <CartIcon onOpenCart={openCart} itemCount={getCartItemsCount()} />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200"
              >
                <FunnelIcon className="w-4 h-4" />
                Filtres
                {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Advanced Filters - Enhanced Udemy Style */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {priceRanges.map(price => (
                      <option key={price} value={price}>{price}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
              
              {/* Additional Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note minimale</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {ratings.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="w-full text-sm text-gray-600">
                    {sortedCourses.length} formation{sortedCourses.length > 1 ? 's' : ''} trouvée{sortedCourses.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Courses Grid - Style Airbnb */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {sortedCourses.length} formation{sortedCourses.length > 1 ? 's' : ''} trouvée{sortedCourses.length > 1 ? 's' : ''}
            </h2>
            <p className="text-gray-600">
              {selectedCategory !== 'Tous' && `dans la catégorie "${selectedCategory}"`}
              {searchTerm && ` pour "${searchTerm}"`}
            </p>
          </div>

          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedCourses.map((course, index) => (
              <SolarAnimation key={course._id || course.id} variant="solar" delay={index * 0.1}>
                <div 
                  onClick={() => handleCourseClick(course)}
                  className="cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  <CourseCard 
                    course={course} 
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                    onRateCourse={handleRateCourse}
                  />
                </div>
              </SolarAnimation>
            ))}
          </div>

          {/* No Results */}
          {sortedCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche ou de filtres
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Tous');
                  setSelectedLevel('Tous');
                  setSelectedPrice('Tous');
                  setSearchTerm('');
                }}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Voir toutes les formations
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos formations organisées par domaine d'expertise
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(1).map((category, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AcademicCapIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {category}
                </h3>
                <p className="text-sm text-gray-600">
                  {courses.filter(c => c.category === category).length} formation{courses.filter(c => c.category === category).length > 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Udemy-Style Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une expérience d'apprentissage complète avec toutes les fonctionnalités d'une plateforme moderne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <VideoCameraIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Lecteur vidéo avancé
              </h3>
              <p className="text-gray-600">
                Contrôles complets, vitesse de lecture variable, sous-titres et qualité HD
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Suivi de progression
              </h3>
              <p className="text-gray-600">
                Suivez votre avancement, marquez les leçons terminées et obtenez des certificats
              </p>
            </div>

            {/* Discussions */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Discussions et Q&A
              </h3>
              <p className="text-gray-600">
                Posez vos questions, échangez avec la communauté et obtenez des réponses des instructeurs
              </p>
            </div>

            {/* Reviews */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <StarIcon className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Avis et évaluations
              </h3>
              <p className="text-gray-600">
                Consultez les avis d'autres étudiants et laissez votre propre évaluation
              </p>
            </div>

            {/* Materials */}
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DocumentArrowDownIcon className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Ressources téléchargeables
              </h3>
              <p className="text-gray-600">
                Accédez à des documents, codes sources et ressources complémentaires
              </p>
            </div>

            {/* Mobile Access */}
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DevicePhoneMobileIcon className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Accès mobile
              </h3>
              <p className="text-gray-600">
                Apprenez partout, tout le temps avec notre application mobile responsive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Expérience Tech ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous offrons des formations de qualité supérieure avec des formateurs expérimentés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="w-10 h-10 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Certifications Reconnues
              </h3>
              <p className="text-gray-600">
                Certificats reconnus par l'industrie et les employeurs
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserIcon className="w-10 h-10 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Formateurs Experts
              </h3>
              <p className="text-gray-600">
                Des professionnels expérimentés et certifiés
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="w-10 h-10 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Apprentissage Flexible
              </h3>
              <p className="text-gray-600">
                Formations en ligne et en présentiel selon vos besoins
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <StarIcon className="w-10 h-10 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Support Continu
              </h3>
              <p className="text-gray-600">
                Accompagnement et support après la formation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez plus de 500 étudiants qui ont déjà choisi nos formations pour développer leurs compétences
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                Commencer maintenant
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200">
                Voir le catalogue
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-sm opacity-80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Accès à vie
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Certificat inclus
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Support 24/7
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Garantie 30 jours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Cart Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />

      {/* Global Cart Notification */}
      {showCartNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-3"
        >
          <CheckCircleIcon className="w-6 h-6" />
          <span className="font-semibold">Formation ajoutée au panier !</span>
        </motion.div>
      )}
    </>
  );
};

export default Training;
