const path = require('path');

module.exports = {
  // Configuration pour résoudre les problèmes de source-map-loader
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          // Exclure les modules problématiques
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
        ]
      }
    ]
  },
  
  // Ignorer les warnings de source-map-loader
  ignoreWarnings: [
    /Failed to parse source map/,
    /ENOENT: no such file or directory/
  ],
  
  // Configuration de résolution
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer")
    }
  }
};
