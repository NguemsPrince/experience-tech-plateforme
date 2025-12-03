// Configuration des animations et transitions pour le dashboard moderne
export const animationVariants = {
  // Animations de base
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  
  // Animations pour les cards
  cardHover: {
    hover: { 
      y: -5, 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  },
  
  // Animations pour les boutons
  buttonPress: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  },
  
  // Animations pour les icônes
  iconRotate: {
    hover: { rotate: 180 },
    transition: { duration: 0.3 }
  },
  
  // Animations pour les notifications
  notificationSlide: {
    initial: { x: 400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 400, opacity: 0 }
  },
  
  // Animations pour les graphiques
  chartDraw: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 2, ease: "easeInOut" }
  },
  
  // Animations pour les stats
  countUp: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Configuration des transitions
export const transitionConfig = {
  // Transitions rapides
  fast: { duration: 0.2, ease: "easeInOut" },
  
  // Transitions normales
  normal: { duration: 0.3, ease: "easeInOut" },
  
  // Transitions lentes
  slow: { duration: 0.5, ease: "easeInOut" },
  
  // Transitions avec spring
  spring: { type: "spring", damping: 25, stiffness: 200 },
  
  // Transitions pour les listes
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

// Configuration des délais d'animation
export const animationDelays = {
  // Délais pour les éléments de liste
  listItem: (index) => index * 0.1,
  
  // Délais pour les sections
  section: (index) => index * 0.2,
  
  // Délais pour les cards
  card: (index) => index * 0.15
};

// Configuration des easings
export const easingFunctions = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55]
};

// Configuration des durées d'animation
export const animationDurations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 1.0
};

// Configuration pour les animations de chargement
export const loadingAnimations = {
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },
  
  pulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  },
  
  bounce: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
  }
};

// Configuration pour les animations de notification
export const notificationAnimations = {
  slideIn: {
    initial: { x: 400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 400, opacity: 0 },
    transition: { type: "spring", damping: 25, stiffness: 200 }
  },
  
  fadeIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3 }
  }
};

// Configuration pour les animations de graphiques
export const chartAnimations = {
  lineDraw: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 2, ease: "easeInOut" }
  },
  
  barGrow: {
    initial: { scaleY: 0 },
    animate: { scaleY: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  
  donutDraw: {
    initial: { strokeDasharray: "0 1000" },
    animate: { strokeDasharray: "1000 0" },
    transition: { duration: 1.5, ease: "easeInOut" }
  }
};

// Configuration pour les animations de sidebar
export const sidebarAnimations = {
  slideIn: {
    initial: { x: -320 },
    animate: { x: 0 },
    exit: { x: -320 },
    transition: { type: "spring", damping: 25, stiffness: 200 }
  },
  
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }
};

// Configuration pour les animations de modal
export const modalAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Configuration pour les animations de hover
export const hoverAnimations = {
  lift: {
    hover: { y: -5, scale: 1.02 },
    transition: { duration: 0.2 }
  },
  
  glow: {
    hover: { boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" },
    transition: { duration: 0.3 }
  },
  
  rotate: {
    hover: { rotate: 5 },
    transition: { duration: 0.2 }
  }
};

// Configuration pour les animations de focus
export const focusAnimations = {
  ring: {
    focus: { 
      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.5)",
      outline: "none"
    }
  },
  
  scale: {
    focus: { scale: 1.05 },
    transition: { duration: 0.2 }
  }
};

// Configuration pour les animations de loading states
export const loadingStates = {
  skeleton: {
    animate: { 
      backgroundPosition: ["200% 0", "-200% 0"],
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)"
    },
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      ease: "linear" 
    }
  },
  
  shimmer: {
    animate: { 
      backgroundPosition: ["200% 0", "-200% 0"]
    },
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      ease: "linear" 
    }
  }
};

// Configuration pour les animations de page transition
export const pageTransitions = {
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default {
  animationVariants,
  transitionConfig,
  animationDelays,
  easingFunctions,
  animationDurations,
  loadingAnimations,
  notificationAnimations,
  chartAnimations,
  sidebarAnimations,
  modalAnimations,
  hoverAnimations,
  focusAnimations,
  loadingStates,
  pageTransitions
};
