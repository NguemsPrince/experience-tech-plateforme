// Utilitaires d'optimisation des performances
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Lazy loading des composants
export const lazyLoadComponent = (importFunc) => {
  return React.lazy(importFunc);
};

// Lazy loading des images
export const lazyLoadImage = (src, alt, className = '') => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [isInView, src]);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}
      {isLoaded && (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
};

// Debounce pour les recherches
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle pour les événements
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Mémorisation des calculs coûteux
export const useMemoizedValue = (computeValue, dependencies) => {
  return useMemo(() => computeValue(), dependencies);
};

// Virtualisation pour les listes longues
export const VirtualizedList = ({ items, itemHeight, containerHeight, renderItem }) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Optimisation des re-renders
export const useOptimizedCallback = (callback, dependencies) => {
  return useCallback(callback, dependencies);
};

export const useOptimizedMemo = (factory, dependencies) => {
  return useMemo(factory, dependencies);
};

// Preloading des ressources critiques
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Prefetching des routes
export const prefetchRoute = (route) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};

// Compression des images
export const compressImage = (file, quality = 0.8, maxWidth = 1920) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Cache des données
export const useDataCache = (key, fetcher, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem(`cache_${key}`);
    const cachedData = cached ? JSON.parse(cached) : null;
    
    if (cachedData && Date.now() - cachedData.timestamp < ttl) {
      setData(cachedData.data);
      return;
    }

    setLoading(true);
    fetcher()
      .then((result) => {
        setData(result);
        localStorage.setItem(`cache_${key}`, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [key, fetcher, ttl]);

  return { data, loading, error };
};

// Optimisation des bundles
export const codeSplitting = {
  // Lazy loading des pages
  Home: lazyLoadComponent(() => import('../pages/Home')),
  About: lazyLoadComponent(() => import('../pages/About')),
  Services: lazyLoadComponent(() => import('../pages/Services')),
  Contact: lazyLoadComponent(() => import('../pages/Contact')),
  AdminDashboard: lazyLoadComponent(() => import('../pages/AdminDashboard')),
};

// Service Worker pour le cache
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Optimisation des animations
export const useOptimizedAnimation = (isVisible, duration = 300) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }
  }, [isVisible, duration]);

  return { shouldRender, isAnimating };
};

// Monitoring des performances
export const performanceMonitor = {
  // Mesure du temps de rendu
  measureRenderTime: (componentName, renderFunction) => {
    const start = performance.now();
    const result = renderFunction();
    const end = performance.now();
    
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  },

  // Mesure de la mémoire
  measureMemory: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  },

  // Mesure du FPS
  measureFPS: (callback) => {
    let lastTime = performance.now();
    let frameCount = 0;

    const measure = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        callback(fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measure);
    };
    
    measure();
  }
};

// Optimisation des requêtes
export const queryOptimizer = {
  // Batching des requêtes
  batchRequests: (requests, batchSize = 5) => {
    const batches = [];
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }
    return batches;
  },

  // Cache des requêtes
  cacheRequest: (key, request, ttl = 5 * 60 * 1000) => {
    const cached = sessionStorage.getItem(`request_${key}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return Promise.resolve(data);
      }
    }

    return request().then((data) => {
      sessionStorage.setItem(`request_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      return data;
    });
  }
};

export default {
  lazyLoadComponent,
  lazyLoadImage,
  useDebounce,
  useThrottle,
  useMemoizedValue,
  VirtualizedList,
  useOptimizedCallback,
  useOptimizedMemo,
  preloadResource,
  prefetchRoute,
  compressImage,
  useDataCache,
  codeSplitting,
  registerServiceWorker,
  useOptimizedAnimation,
  performanceMonitor,
  queryOptimizer
};
