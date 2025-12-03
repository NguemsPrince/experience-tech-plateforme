import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '', 
  hoverScale = 1.05,
  hoverShadow = 'lg',
  initialDelay = 0,
  ...props 
}) => {
  return (
    <motion.div
      className={`transition-shadow duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: hoverScale,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay: initialDelay,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
