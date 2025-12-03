import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const SolarAnimation = ({ 
  children,
  variant = 'solar',
  delay = 0,
  duration = 0.8,
  className = '',
  ...props 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const variants = {
    solar: {
      initial: { 
        opacity: 0, 
        scale: 0.8, 
        rotateY: 15,
        filter: "blur(15px) brightness(0.5)"
      },
      animate: { 
        opacity: 1, 
        scale: 1, 
        rotateY: 0,
        filter: "blur(0px) brightness(1)",
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }
    },
    energy: {
      initial: { 
        opacity: 0, 
        scale: 0.5, 
        rotate: -10,
        filter: "blur(20px) hue-rotate(180deg)"
      },
      animate: { 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        filter: "blur(0px) hue-rotate(0deg)",
        transition: {
          duration: duration * 1.2,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 400,
          damping: 17
        }
      }
    },
    magnetic: {
      initial: { 
        opacity: 0, 
        x: -100, 
        scale: 0.9,
        rotateX: 45,
        filter: "blur(10px)"
      },
      animate: { 
        opacity: 1, 
        x: 0, 
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 350,
          damping: 22
        }
      }
    },
    morph: {
      initial: { 
        opacity: 0, 
        scale: 0.7, 
        rotateZ: 20,
        filter: "blur(25px) saturate(0)"
      },
      animate: { 
        opacity: 1, 
        scale: 1, 
        rotateZ: 0,
        filter: "blur(0px) saturate(1)",
        transition: {
          duration: duration * 1.5,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 250,
          damping: 25
        }
      }
    },
    wave: {
      initial: { 
        opacity: 0, 
        y: 50, 
        scale: 0.8,
        rotateX: 30,
        filter: "blur(15px)"
      },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }
    }
  };

  const selectedVariant = variants[variant] || variants.solar;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={selectedVariant.initial}
      animate={isInView ? selectedVariant.animate : selectedVariant.initial}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SolarAnimation;
