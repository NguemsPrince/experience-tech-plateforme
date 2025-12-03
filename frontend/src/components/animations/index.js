// Animation Components
export { default as PageTransition } from '../PageTransition';
export { default as AnimatedSection } from '../AnimatedSection';
export { default as AnimatedButton } from '../AnimatedButton';
export { default as AnimatedCard } from '../AnimatedCard';
export { default as AnimatedText } from '../AnimatedText';
export { default as AnimatedCounter } from '../AnimatedCounter';
export { default as AnimatedLoader } from '../AnimatedLoader';
export { default as AnimatedIcon } from '../AnimatedIcon';
export { default as ParallaxSection } from '../ParallaxSection';
export { default as RevealAnimation } from '../RevealAnimation';
export { default as SolarAnimation } from '../SolarAnimation';

// Solar Journey Inspired Animation utilities
export const animationVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -30, scale: 0.95, filter: "blur(10px)" }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -30, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, x: 30, scale: 0.95, filter: "blur(10px)" }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 30, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, x: -30, scale: 0.95, filter: "blur(10px)" }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8, rotate: 2 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.8, rotate: -2 }
  },
  slideInDown: {
    initial: { opacity: 0, y: -50, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -50, scale: 0.95, filter: "blur(10px)" }
  },
  // Solar Journey inspired new variants
  elasticScale: {
    initial: { opacity: 0, scale: 0.3, rotate: -5 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    exit: { opacity: 0, scale: 0.3, rotate: 5 }
  },
  morphFade: {
    initial: { opacity: 0, scale: 0.8, rotateY: 10, filter: "blur(20px)" },
    animate: { opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.8, rotateY: -10, filter: "blur(20px)" }
  },
  // Nouvelles animations avancées
  magneticFloat: {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    whileHover: {
      y: -10,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  },
  parallaxReveal: {
    initial: { opacity: 0, y: 100, scale: 0.8, rotateX: 15 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },
  liquidMorph: {
    initial: { 
      opacity: 0, 
      scale: 0.5, 
      borderRadius: "50%",
      rotate: 180
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      borderRadius: "8px",
      rotate: 0,
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  },
  waveRipple: {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    whileHover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  },
  momentumSlide: {
    initial: { opacity: 0, x: -120, scale: 0.9, filter: "blur(15px)" },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1, 
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { opacity: 0, x: 120, scale: 0.9, filter: "blur(15px)" }
  }
};

// Solar Journey inspired transition presets
export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 17
};

export const smoothTransition = {
  type: "tween",
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94]
};

export const elasticTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 1
};

export const momentumTransition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1.2
};

export const morphTransition = {
  type: "tween",
  duration: 1.2,
  ease: [0.25, 0.46, 0.45, 0.94]
};
