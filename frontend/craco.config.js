const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Désactiver les source maps pour éviter les erreurs
      webpackConfig.devtool = false;
      
      // Ignorer les warnings de source-map-loader
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /ENOENT: no such file or directory/,
        /source-map-loader/
      ];
      
      // Configuration pour optimiser le code splitting et résoudre les problèmes de chunk loading
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
              enforce: true,
            },
            // Séparer jsPDF dans son propre chunk avec configuration spéciale
            jspdf: {
              test: /[\\/]node_modules[\\/]jspdf[\\/]/,
              name: 'jspdf',
              priority: 20,
              chunks: 'all',
              enforce: true,
              reuseExistingChunk: true,
            },
            // Séparer heroicons dans son propre chunk
            heroicons: {
              test: /[\\/]node_modules[\\/]@heroicons[\\/]/,
              name: 'heroicons',
              priority: 20,
              chunks: 'all',
              enforce: true,
              reuseExistingChunk: true,
            },
            // Séparer les autres bibliothèques lourdes
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 20,
              chunks: 'all',
              enforce: true,
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              priority: 20,
              chunks: 'all',
              enforce: true,
            },
            // Chunk pour les utilitaires d'export
            exportUtils: {
              test: /[\\/]node_modules[\\/](xlsx|html2canvas)[\\/]/,
              name: 'export-utils',
              priority: 15,
              chunks: 'all',
              enforce: true,
            }
          }
        },
        // Configuration pour éviter les erreurs de chunk loading
        runtimeChunk: {
          name: 'runtime'
        }
      };
      
      // Exclure les modules problématiques du source-map-loader
      if (webpackConfig.module && webpackConfig.module.rules) {
        webpackConfig.module.rules.forEach(rule => {
          if (rule.use && Array.isArray(rule.use)) {
            rule.use.forEach(use => {
              if (use.loader && use.loader.includes('source-map-loader')) {
                use.exclude = [
                  /node_modules\/react-hot-toast/,
                  /node_modules\/@stripe/,
                  /node_modules\/jspdf/,
                  /node_modules\/react-countup/,
                  /node_modules\/react-helmet-async/,
                  /node_modules\/date-fns/,
                  /node_modules\/i18next-browser-languagedetector/,
                  /node_modules\/react-hook-form/,
                  /node_modules\/react-intersection-observer/,
                  /node_modules\/xlsx/,
                  /node_modules\/react-ga4/,
                  /node_modules\/crypto-js/
                ];
              }
            });
          }
        });
      }
      
      return webpackConfig;
    }
  }
};
