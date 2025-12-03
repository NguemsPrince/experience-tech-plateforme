// Désactiver les warnings de source-map-loader
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Failed to parse source map') || 
     args[0].includes('ENOENT: no such file or directory') ||
     args[0].includes('source-map-loader'))
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Désactiver les warnings de source-map-loader pour les tests
const originalConsoleError = console.error;
console.error = function(...args) {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Failed to parse source map') || 
     args[0].includes('ENOENT: no such file or directory') ||
     args[0].includes('source-map-loader'))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};
