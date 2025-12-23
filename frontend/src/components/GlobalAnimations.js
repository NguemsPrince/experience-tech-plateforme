import React from 'react';
import { motion } from 'framer-motion';

// Composant pour appliquer automatiquement les animations Solar Journey
export const AnimatedDiv = ({ 
  children, 
  variant = 'solar', 
  delay = 0, 
  className = '',
  ...props 
}) => {
  const animationVariants = {
    solar: {
      initial: { opacity: 0, scale: 0.8, rotateY: 90 },
      animate: { opacity: 1, scale: 1, rotateY: 0 },
      transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    energy: {
      initial: { opacity: 0, scale: 0.5, filter: "blur(10px)" },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
      transition: { duration: 0.8, delay, type: "spring", stiffness: 200, damping: 15 }
    },
    magnetic: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      whileHover: { 
        scale: 1.05, 
        rotate: 2, 
        transition: { type: "spring", stiffness: 400, damping: 17 }
      },
      transition: { duration: 0.6, delay }
    },
    wave: {
      initial: { opacity: 0, y: 50, skewY: 5 },
      animate: { opacity: 1, y: 0, skewY: 0 },
      transition: { duration: 0.8, delay, ease: [0.6, -0.05, 0.01, 0.99] }
    },
    morph: {
      initial: { opacity: 0, scale: 0.7, borderRadius: "60%" },
      animate: { opacity: 1, scale: 1, borderRadius: "10%" },
      transition: { duration: 1.2, delay, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      className={className}
      variants={animationVariants[variant]}
      initial="initial"
      animate="animate"
      whileHover={variant === 'magnetic' ? "whileHover" : undefined}
      viewport={{ once: true, amount: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les boutons animés
export const AnimatedButton = ({ 
  children, 
  variant = 'solar',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    solar: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 hover-solar",
    energy: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 hover-glow",
    magnetic: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 hover-magnetic",
    wave: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Composant pour les cartes animées
export const AnimatedCard = ({ 
  children, 
  variant = 'solar',
  className = '',
  ...props 
}) => {
  const baseClasses = "bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300";
  
  const variantClasses = {
    solar: "hover-solar",
    energy: "hover-glow",
    magnetic: "hover-magnetic",
    wave: "hover-lift"
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les icônes animées
export const AnimatedIcon = ({ 
  children, 
  variant = 'solar',
  className = '',
  ...props 
}) => {
  const variantClasses = {
    solar: "hover-solar",
    energy: "hover-glow",
    magnetic: "hover-magnetic",
    wave: "hover-lift"
  };

  return (
    <motion.div
      className={`${variantClasses[variant]} ${className}`}
      whileHover={{ 
        scale: 1.1,
        rotate: variant === 'magnetic' ? 5 : 0,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// HOC pour wrapper automatiquement les composants avec des animations
export const withSolarAnimation = (Component, animationVariant = 'solar') => {
  return React.forwardRef((props, ref) => (
    <AnimatedDiv variant={animationVariant}>
      <Component ref={ref} {...props} />
    </AnimatedDiv>
  ));
};

// Hook pour les animations personnalisées
export const useSolarAnimation = (variant = 'solar', delay = 0) => {
  const animationVariants = {
    solar: {
      initial: { opacity: 0, scale: 0.8, rotateY: 90 },
      animate: { opacity: 1, scale: 1, rotateY: 0 },
      exit: { opacity: 0, scale: 0.8, rotateY: -90 }
    },
    energy: {
      initial: { opacity: 0, scale: 0.5, filter: "blur(10px)" },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, scale: 0.5, filter: "blur(10px)" }
    },
    magnetic: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 }
    },
    wave: {
      initial: { opacity: 0, y: 50, skewY: 5 },
      animate: { opacity: 1, y: 0, skewY: 0 },
      exit: { opacity: 0, y: -50, skewY: -5 }
    }
  };

  return {
    variants: animationVariants[variant],
    transition: {
      duration: 0.8,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  };
};

export default {
  AnimatedDiv,
  AnimatedButton,
  AnimatedCard,
  AnimatedIcon,
  withSolarAnimation,
  useSolarAnimation
};
