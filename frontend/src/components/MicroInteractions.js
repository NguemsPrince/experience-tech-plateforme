import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Composant pour les effets de particules
export const ParticleEffect = ({ children, intensity = 1 }) => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  const createParticle = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 4 * intensity,
      vy: (Math.random() - 0.5) * 4 * intensity,
      life: 1,
      decay: 0.02
    };

    setParticles(prev => [...prev, newParticle]);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - p.decay
        })).filter(p => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      onMouseMove={createParticle}
    >
      {children}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-500 rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}
    </div>
  );
};

// Composant pour les effets magnétiques
export const MagneticButton = ({ children, strength = 0.3, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        x: springX,
        y: springY
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de liquide
export const LiquidButton = ({ children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden rounded-lg"
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ scale: 0, borderRadius: "50%" }}
        animate={isHovered ? { scale: 1, borderRadius: "8px" } : { scale: 0, borderRadius: "50%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="relative z-10"
        animate={isHovered ? { color: "white" } : { color: "inherit" }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
};

// Composant pour les effets de vague
export const WaveEffect = ({ children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden"
      {...props}
    >
      {children}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
};

// Composant pour les effets de morphing
export const MorphingCard = ({ children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"
        animate={isHovered ? {
          scale: 1.05,
          rotate: 2,
          borderRadius: "20px"
        } : {
          scale: 1,
          rotate: 0,
          borderRadius: "8px"
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
      <motion.div
        className="relative z-10"
        animate={isHovered ? {
          y: -5,
          scale: 1.02
        } : {
          y: 0,
          scale: 1
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Composant pour les effets de révélation progressive
export const ProgressiveReveal = ({ children, delay = 0, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default {
  ParticleEffect,
  MagneticButton,
  LiquidButton,
  WaveEffect,
  MorphingCard,
  ProgressiveReveal
};
