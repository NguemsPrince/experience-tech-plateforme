import React from 'react';
import { motion } from 'framer-motion';

const HeaderDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Démonstration des Boutons d'En-tête
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Bouton de Connexion */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Bouton de Connexion</h3>
            <motion.button
              className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden border border-primary-500/20 btn-glow btn-shimmer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Se connecter</span>
              </span>
            </motion.button>
          </div>

          {/* Bouton de Profil */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Bouton de Profil</h3>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button className="flex items-center space-x-3 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">Utilisateur</span>
                  <span className="text-xs text-white/70">Mon espace</span>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Bouton de Déconnexion */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Bouton de Déconnexion</h3>
            <motion.button
              className="flex items-center space-x-2 px-4 py-2.5 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 hover:bg-red-500/30 hover:border-red-400/50 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Déconnexion</span>
            </motion.button>
          </div>

          {/* Bouton de Notifications */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Bouton de Notifications</h3>
            <motion.button 
              className="p-3 text-white hover:text-primary-400 transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:border-primary-500/50 hover:shadow-xl relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <motion.span 
                className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg notification-badge"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                3
              </motion.span>
            </motion.button>
          </div>

          {/* Bouton de Menu Mobile */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Bouton de Menu Mobile</h3>
            <motion.button
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:text-primary-400 hover:shadow-xl group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </motion.button>
          </div>

          {/* Bouton de Mode de Vue */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Bouton de Mode de Vue</h3>
            <motion.button
              className="flex items-center space-x-2 px-4 py-2.5 text-white hover:text-primary-400 transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:border-primary-500/50 hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Desktop</span>
            </motion.button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/70 text-lg">
            Tous les boutons de l'en-tête ont maintenant un design de qualité professionnel avec :
          </p>
          <ul className="mt-4 text-white/60 space-y-2">
            <li>• Effets de glass morphism</li>
            <li>• Animations fluides</li>
            <li>• Gradients modernes</li>
            <li>• Ombres et effets de profondeur</li>
            <li>• Transitions élégantes</li>
            <li>• Design responsive</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeaderDemo;
