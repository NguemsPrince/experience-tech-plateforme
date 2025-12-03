import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Détecter iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isStandalone) {
      // Pour iOS
      if (iOS && !localStorage.getItem('pwa-install-dismissed-ios')) {
        // Afficher le prompt iOS après 5 secondes
        setTimeout(() => {
          setShowIOSPrompt(true);
        }, 5000);
      }

      // Pour Android/Desktop
      const handler = (e) => {
        e.preventDefault();
        setInstallPrompt(e);
        
        // Afficher le prompt seulement si l'utilisateur ne l'a pas déjà refusé
        if (!localStorage.getItem('pwa-install-dismissed')) {
          setTimeout(() => {
            setShowPrompt(true);
          }, 3000); // Afficher après 3 secondes
        }
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      console.log('✅ PWA installée');
    } else {
      console.log('❌ Installation refusée');
    }
    
    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleDismissIOS = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-install-dismissed-ios', 'true');
  };

  // Prompt pour iOS
  if (isIOS && showIOSPrompt) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <ArrowDownTrayIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Installer l'application
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Accès rapide depuis votre écran d'accueil
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismissIOS}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium text-gray-900 dark:text-white">
                📱 Pour installer sur iOS :
              </p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Appuyez sur l'icône de partage <span className="inline-block">⬆️</span></li>
                <li>Faites défiler et appuyez sur "Sur l'écran d'accueil"</li>
                <li>Appuyez sur "Ajouter"</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Prompt pour Android/Desktop
  if (showPrompt && installPrompt) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <ArrowDownTrayIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Installer Expérience Tech
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Accédez rapidement à nos services
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500">✓</span>
                <span>Accès hors ligne</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500">✓</span>
                <span>Notifications en temps réel</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500">✓</span>
                <span>Expérience optimisée</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Plus tard
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/50"
              >
                Installer
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

export default InstallPWA;

