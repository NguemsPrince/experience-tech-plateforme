import React from 'react';
import { motion } from 'framer-motion';

const AnimatedIcon = ({ 
  children,
  className = '',
  animation = 'hover',
  delay = 0,
  duration = 0.3,
  ...props 
}) => {
  const animations = {
    hover: {
      whileHover: { 
        scale: 1.15, 
        rotate: 8,
        filter: "brightness(1.1)",
        transition: { type: "spring", stiffness: 400, damping: 17 }
      },
      whileTap: { scale: 0.9, rotate: -2 }
    },
    pulse: {
      animate: { 
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
        filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    rotate: {
      animate: { rotate: 360 },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    },
    bounce: {
      animate: { 
        y: [0, -15, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0]
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    float: {
      animate: { 
        y: [0, -8, 0],
        x: [0, 3, 0],
        rotate: [0, 2, 0]
      },
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    // Solar Journey inspired new animations
    energy: {
      animate: {
        scale: [1, 1.3, 1],
        filter: [
          "brightness(1) drop-shadow(0 0 0px #3b82f6)",
          "brightness(1.5) drop-shadow(0 0 20px #3b82f6)",
          "brightness(1) drop-shadow(0 0 0px #3b82f6)"
        ]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    magnetic: {
      whileHover: {
        scale: 1.2,
        rotate: [0, 5, -5, 0],
        transition: {
          rotate: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            type: "spring",
            stiffness: 400,
            damping: 17
          }
        }
      }
    },
    solar: {
      animate: {
        rotateY: [0, 180, 360],
        scale: [1, 1.1, 1],
        filter: [
          "hue-rotate(0deg)",
          "hue-rotate(180deg)",
          "hue-rotate(360deg)"
        ]
      },
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration }}
      {...animations[animation]}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedIcon;
