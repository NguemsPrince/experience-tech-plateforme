import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const RevealAnimation = ({ 
  children,
  direction = 'up',
  distance = 30,
  duration = 0.6,
  delay = 0,
  className = '',
  ...props 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: distance, scale: 0.95, filter: "blur(10px)" },
    down: { y: -distance, scale: 0.95, filter: "blur(10px)" },
    left: { x: distance, scale: 0.95, filter: "blur(10px)" },
    right: { x: -distance, scale: 0.95, filter: "blur(10px)" }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0,
        scale: 1,
        filter: "blur(0px)"
      } : { 
        opacity: 0, 
        ...directions[direction]
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default RevealAnimation;
