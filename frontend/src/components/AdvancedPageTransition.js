import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AdvancedPageTransition = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setLoadingProgress(0);

    // Simulation du chargement progressif
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [location.pathname]);

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      filter: "blur(10px)"
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)"
    },
    out: {
      opacity: 0,
      scale: 1.05,
      y: -20,
      filter: "blur(10px)"
    }
  };

  const pageTransition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.6
  };

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 1.2,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Écran de chargement */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="text-center text-white">
              {/* Logo animé */}
              <motion.div
                className="w-20 h-20 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.div
                  className="w-8 h-8 bg-white rounded-full"
                  animate={{ 
                    scale: [1, 0.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>

              {/* Barre de progression */}
              <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Texte de chargement */}
              <motion.p
                className="text-lg font-medium"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Chargement...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu de la page */}
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
};

// Composant pour les transitions de section
export const SectionTransition = ({ children, direction = 'up', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 100, opacity: 0, scale: 0.9 };
      case 'down':
        return { y: -100, opacity: 0, scale: 0.9 };
      case 'left':
        return { x: 100, opacity: 0, scale: 0.9 };
      case 'right':
        return { x: -100, opacity: 0, scale: 0.9 };
      default:
        return { y: 100, opacity: 0, scale: 0.9 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isVisible ? { 
        x: 0, 
        y: 0, 
        opacity: 1, 
        scale: 1 
      } : getInitialPosition()}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de révélation en cascade
export const CascadeReveal = ({ children, stagger = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isVisible ? { 
            opacity: 1, 
            y: 0, 
            scale: 1 
          } : { 
            opacity: 0, 
            y: 30, 
            scale: 0.9 
          }}
          transition={{
            duration: 0.6,
            delay: index * stagger,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AdvancedPageTransition;
export { SectionTransition, CascadeReveal };
