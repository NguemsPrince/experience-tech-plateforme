// Global chunk loading error handler
// This utility provides fallback mechanisms for failed chunk loads
import React from 'react';

// Track failed chunks to avoid infinite retry loops
const failedChunks = new Set();

// Global error handler for chunk loading failures
export const handleChunkError = (error) => {
  console.error('Chunk loading error detected:', error);
  
  // Check if this is a chunk loading error
  if (error.message && error.message.includes('Loading chunk')) {
    const chunkMatch = error.message.match(/vendors-node_modules_[^-\s]+/);
    if (chunkMatch) {
      const chunkName = chunkMatch[0];
      
      if (failedChunks.has(chunkName)) {
        console.warn(`Chunk ${chunkName} has already failed, not retrying`);
        return;
      }
      
      failedChunks.add(chunkName);
      console.warn(`Chunk ${chunkName} failed to load, added to failed chunks list`);
    }
  }
  
  // Provide user-friendly error message
  return {
    type: 'CHUNK_LOAD_ERROR',
    message: 'Une erreur de chargement s\'est produite. Veuillez actualiser la page.',
    canRetry: true,
    retryAction: () => {
      console.log('Manual reload requested by user');
      // Only reload if explicitly requested by user, not automatically
    }
  };
};

// Retry mechanism for failed chunks
export const retryFailedChunks = async () => {
  console.log('Attempting to retry failed chunks...');
  
  // Clear failed chunks cache
  failedChunks.clear();
  
  // Don't automatically reload - let user control when to reload
  console.log('Failed chunks cleared. User can manually reload if needed.');
};

// Check if a chunk has previously failed
export const hasChunkFailed = (chunkName) => {
  return failedChunks.has(chunkName);
};

// Get list of failed chunks
export const getFailedChunks = () => {
  return Array.from(failedChunks);
};

// Clear failed chunks cache
export const clearFailedChunks = () => {
  failedChunks.clear();
};

// Global error boundary for chunk errors
export const ChunkErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (event) => {
      if (event.error && event.error.message && event.error.message.includes('Loading chunk')) {
        setError(handleChunkError(event.error));
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-gray-600 mb-6">
              Une erreur s'est produite lors du chargement de la page. 
              Veuillez actualiser pour réessayer.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // User must manually reload by pressing F5 or using browser controls
                  console.log('User requested reload - manual reload required');
                  setHasError(false);
                  setError(null);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => {
                  setHasError(false);
                  setError(null);
                  // Clear failed chunks and continue
                  clearFailedChunks();
                }}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Continuer malgré l'erreur
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

// Utility to preload critical chunks
export const preloadCriticalChunks = async () => {
  const criticalChunks = [
    'vendors-node_modules_jspdf_dist_jspdf_es_min_js',
    'vendors-node_modules_heroicons_react_24_outline_esm_A'
  ];

  for (const chunkName of criticalChunks) {
    try {
      // Try to preload the chunk by creating a temporary script tag
      const script = document.createElement('script');
      script.src = `/static/js/${chunkName}.chunk.js`;
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
        
        // Clean up after a short delay
        setTimeout(() => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        }, 1000);
      });
      
      console.log(`Successfully preloaded chunk: ${chunkName}`);
    } catch (error) {
      console.warn(`Failed to preload chunk ${chunkName}:`, error);
    }
  }
};
