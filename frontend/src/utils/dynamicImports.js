// Dynamic import utility to prevent chunk loading issues
// This file provides a centralized way to handle dynamic imports with error handling

// Cache for loaded modules
const moduleCache = new Map();

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

// Enhanced retry logic with exponential backoff
const retryWithBackoff = async (fn, retries = RETRY_CONFIG.maxRetries) => {
  let lastError = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain types of errors
      if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
        console.warn(`Chunk loading error for attempt ${attempt + 1}:`, error.message);
      }
      
      if (attempt === retries - 1) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
        RETRY_CONFIG.maxDelay
      );
      
      console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Generic dynamic import function with enhanced error handling
export const dynamicImport = async (moduleName, importPath) => {
  try {
    // Check cache first
    if (moduleCache.has(moduleName)) {
      return moduleCache.get(moduleName);
    }

    console.log(`Loading module: ${moduleName} from ${importPath}`);

    const loadModule = async () => {
      const module = await import(importPath);
      const exportedModule = module.default || module;
      
      // Cache the module
      moduleCache.set(moduleName, exportedModule);
      
      console.log(`Successfully loaded module: ${moduleName}`);
      return exportedModule;
    };

    const result = await retryWithBackoff(loadModule);
    return result;

  } catch (error) {
    console.error(`Failed to load module ${moduleName} after ${RETRY_CONFIG.maxRetries} attempts:`, error);
    
    // Provide fallback for critical modules
    if (moduleName === 'jsPDF') {
      console.warn('jsPDF failed to load, providing fallback...');
      return null; // Will be handled by the calling code
    }
    
    throw new Error(`Failed to load ${moduleName}: ${error.message}`);
  }
};

// Specific loaders for commonly used libraries
export const loadJsPDF = async () => {
  try {
    // Check cache first
    if (moduleCache.has('jsPDF')) {
      return moduleCache.get('jsPDF');
    }

    console.log('Loading jsPDF module...');

    const loadModule = async () => {
      // jsPDF v3.x uses named export { jsPDF }
      let jsPDFClass;
      
      try {
        const module = await import('jspdf');
        
        // jsPDF v3.x uses named export: { jsPDF }
        if (module.jsPDF && typeof module.jsPDF === 'function') {
          jsPDFClass = module.jsPDF;
        } 
        // Fallback for v2.x style (default export)
        else if (module.default) {
          if (typeof module.default === 'function') {
            jsPDFClass = module.default;
          } else if (module.default.jsPDF && typeof module.default.jsPDF === 'function') {
            jsPDFClass = module.default.jsPDF;
          } else {
            jsPDFClass = module.default;
          }
        }
        // Last resort: check if module itself is the constructor
        else if (typeof module === 'function') {
          jsPDFClass = module;
        } else {
          throw new Error('jsPDF class not found in module');
        }
        
        // Verify it's a constructor
        if (typeof jsPDFClass !== 'function') {
          throw new Error(`jsPDF is not a constructor, got: ${typeof jsPDFClass}`);
        }
        
        // Cache the module
        moduleCache.set('jsPDF', jsPDFClass);
        
        console.log('Successfully loaded jsPDF module');
        return jsPDFClass;
      } catch (importError) {
        console.error('Error importing jsPDF:', importError);
        throw importError;
      }
    };

    const result = await retryWithBackoff(loadModule);
    return result;

  } catch (error) {
    console.error(`Failed to load jsPDF after ${RETRY_CONFIG.maxRetries} attempts:`, error);
    return null; // Will be handled by the calling code
  }
};
export const loadXLSX = async () => {
  try {
    // Check cache first
    if (moduleCache.has('XLSX')) {
      return moduleCache.get('XLSX');
    }

    console.log('Loading XLSX module...');

    const loadModule = async () => {
      const module = await import('xlsx');
      
      // XLSX peut être exporté de différentes manières
      let XLSXClass;
      if (module.default) {
        XLSXClass = module.default;
      } else if (module.XLSX) {
        XLSXClass = module.XLSX;
      } else {
        XLSXClass = module;
      }
      
      // Cache the module
      moduleCache.set('XLSX', XLSXClass);
      
      console.log('Successfully loaded XLSX module');
      return XLSXClass;
    };

    const result = await retryWithBackoff(loadModule);
    return result;

  } catch (error) {
    console.error(`Failed to load XLSX after ${RETRY_CONFIG.maxRetries} attempts:`, error);
    return null;
  }
};
export const loadHtml2Canvas = () => dynamicImport('html2canvas', 'html2canvas');

// Preload critical modules with better error handling
export const preloadModules = async () => {
  console.log('Starting module preloading...');
  
  const preloadPromises = [
    loadJsPDF().catch(error => {
      console.warn('jsPDF preload failed:', error.message);
      return null;
    }),
    loadXLSX().catch(error => {
      console.warn('XLSX preload failed:', error.message);
      return null;
    }),
    loadHtml2Canvas().catch(error => {
      console.warn('html2canvas preload failed:', error.message);
      return null;
    })
  ];

  try {
    const results = await Promise.allSettled(preloadPromises);
    
    const successful = results.filter(result => result.status === 'fulfilled' && result.value !== null).length;
    const failed = results.filter(result => result.status === 'rejected' || result.value === null).length;
    
    console.log(`Module preloading completed: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      console.warn('Some modules failed to preload. They will be loaded on-demand.');
    }
  } catch (error) {
    console.error('Critical error during module preloading:', error);
  }
};

// Clear cache (useful for testing or memory management)
export const clearModuleCache = () => {
  moduleCache.clear();
};

// Get cache status
export const getCacheStatus = () => {
  return {
    size: moduleCache.size,
    modules: Array.from(moduleCache.keys())
  };
};
