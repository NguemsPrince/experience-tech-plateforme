import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { IMAGES } from '../config/images';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: IMAGES.hero.training,
      fallbackImage: IMAGES.hero.training,
      title: 'Formations Professionnelles',
      subtitle: 'Développez vos compétences avec nos experts',
      category: 'Formation'
    },
    {
      id: 2,
      image: IMAGES.hero.digital,
      fallbackImage: IMAGES.hero.digital,
      title: 'Services Numériques',
      subtitle: 'Solutions technologiques pour votre entreprise',
      category: 'Services'
    },
    {
      id: 3,
      image: IMAGES.hero.network,
      fallbackImage: IMAGES.hero.network,
      title: 'Solutions Réseaux',
      subtitle: 'Infrastructure et sécurité IT',
      category: 'Technologie'
    }
  ];

  // Auto-slide functionality with pause on hover
  useEffect(() => {
    if (isPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered, slides.length]);

  // Pause/Play functionality
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Drag functionality
  const handleDragStart = (event) => {
    setDragStart(event.clientX);
  };

  const handleDragMove = (event) => {
    if (dragStart) {
      const deltaX = event.clientX - dragStart;
      setDragOffset(deltaX);
    }
  };

  const handleDragEnd = () => {
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    setDragOffset(0);
    setDragStart(0);
  };

  // Fonction pour rechercher avec les suggestions rapides
  const handleQuickSearch = (term) => {
    setSearchQuery(term);
    window.location.href = `/search?q=${encodeURIComponent(term)}`;
  };

  // Animation variants for slides
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)"
    })
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.5 },
    scale: { duration: 0.5 },
    filter: { duration: 0.5 }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Rediriger vers la page de recherche
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleImageError = (slideId) => {
    setImageErrors(prev => ({ ...prev, [slideId]: true }));
  };

  const getImageUrl = (slide) => {
    if (imageErrors[slide.id]) {
      return slide.fallbackImage;
    }
    return slide.image;
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchStart={(e) => setDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => {
        if (dragStart) {
          const deltaX = e.touches[0].clientX - dragStart;
          setDragOffset(deltaX);
        }
      }}
      onTouchEnd={handleDragEnd}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentSlide}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, { offset, velocity }) => {
              if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
                if (offset.x > 0) {
                  goToPrevious();
                } else {
                  goToNext();
                }
              }
            }}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${getImageUrl(slides[currentSlide])})` }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
              {/* Image de préchargement pour détecter les erreurs */}
              <img
                src={slides[currentSlide].image}
                alt=""
                className="hidden"
                onError={() => handleImageError(slides[currentSlide].id)}
                onLoad={() => {
                  // Réinitialiser l'erreur si l'image se charge correctement
                  if (imageErrors[slides[currentSlide].id]) {
                    setImageErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors[slides[currentSlide].id];
                      return newErrors;
                    });
                  }
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Play/Pause Controls */}
      <motion.button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 z-20 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <PauseIcon className="w-5 h-5 text-white" />
        ) : (
          <PlayIcon className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* Navigation Arrows */}
      <motion.button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Slide précédent"
      >
        <ChevronLeftIcon className="w-6 h-6 text-white" />
      </motion.button>

      <motion.button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200"
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Slide suivant"
      >
        <ChevronRightIcon className="w-6 h-6 text-white" />
      </motion.button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Aller au slide ${index + 1}`}
          >
            <motion.div
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              animate={{
                scale: index === currentSlide ? 1.2 : 1,
                opacity: index === currentSlide ? 1 : 0.7
              }}
              transition={{ duration: 0.3 }}
            />
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Hero Content - Style Airbnb */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -50, scale: 0.9, filter: "blur(10px)" }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="text-white"
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 30, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 1, 
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ scale: 1.02 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl mb-12 text-white/90"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.6, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 80,
                  damping: 12
                }}
                whileHover={{ scale: 1.01 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Barre de recherche style Airbnb */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ 
              delay: 0.8, 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            <form onSubmit={handleSearch} className="relative">
              <motion.div 
                className="flex items-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
              >
                <div className="flex-1 px-6 py-4">
                  <input
                    type="text"
                    placeholder="Que voulez-vous apprendre ?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-gray-900 placeholder-gray-500 border-0 rounded-full focus:outline-none focus:ring-0 text-lg"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full mr-2 transition-colors duration-200 flex items-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </form>
            
            {/* Suggestions rapides */}
            <motion.div 
              className="mt-6 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {['React.js', 'Node.js', 'Python', 'DevOps', 'IA'].map((tag, index) => (
                <motion.button
                  key={tag}
                  onClick={() => handleQuickSearch(tag)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-all duration-200 cursor-pointer"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 1.4 + index * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    backgroundColor: "rgba(255, 255, 255, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
