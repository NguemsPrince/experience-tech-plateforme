import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CommandLineIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const KeyboardShortcuts = ({ 
  shortcuts = {}, 
  showHelp = false, 
  onToggleHelp 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K pour afficher les raccourcis
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsVisible(true);
        return;
      }

      // Échap pour fermer
      if (e.key === 'Escape') {
        setIsVisible(false);
        return;
      }

      // Exécuter les raccourcis définis
      const key = e.key.toLowerCase();
      const modifier = e.ctrlKey || e.metaKey ? 'ctrl' : '';
      const shortcutKey = modifier ? `${modifier}+${key}` : key;
      
      if (shortcuts[shortcutKey]) {
        e.preventDefault();
        shortcuts[shortcutKey]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  const defaultShortcuts = {
    'ctrl+s': () => console.log('Sauvegarder'),
    'ctrl+n': () => console.log('Nouveau'),
    'ctrl+z': () => console.log('Annuler'),
    'ctrl+y': () => console.log('Refaire'),
    'escape': () => console.log('Fermer'),
    'ctrl+k': () => setIsVisible(true),
    ...shortcuts
  };

  const getShortcutDisplay = (key) => {
    const parts = key.split('+');
    return parts.map(part => {
      if (part === 'ctrl') return 'Ctrl';
      if (part === 'meta') return 'Cmd';
      return part.toUpperCase();
    }).join(' + ');
  };

  const shortcutCategories = {
    'Navigation': {
      'ctrl+k': 'Afficher les raccourcis',
      'escape': 'Fermer les modales',
      'ctrl+1': 'Aller au dashboard',
      'ctrl+2': 'Aller aux utilisateurs',
      'ctrl+3': 'Aller aux projets'
    },
    'Actions': {
      'ctrl+s': 'Sauvegarder',
      'ctrl+n': 'Nouveau',
      'ctrl+z': 'Annuler',
      'ctrl+y': 'Refaire',
      'ctrl+f': 'Rechercher'
    },
    'Formulaires': {
      'ctrl+enter': 'Soumettre le formulaire',
      'ctrl+shift+s': 'Sauvegarder et continuer',
      'tab': 'Champ suivant',
      'shift+tab': 'Champ précédent'
    }
  };

  return (
    <>
      {/* Bouton d'aide */}
      {showHelp && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 left-4 z-30 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Raccourcis clavier (Ctrl+K)"
        >
          <CommandLineIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Modal des raccourcis */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setIsVisible(false)}
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CommandLineIcon className="w-6 h-6 text-gray-600 dark:text-gray-400 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Raccourcis clavier
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  {Object.entries(shortcutCategories).map(([category, shortcuts]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(shortcuts).map(([key, description]) => (
                          <div key={key} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {description}
                            </span>
                            <div className="flex items-center space-x-1">
                              {getShortcutDisplay(key).split(' + ').map((part, index) => (
                                <React.Fragment key={index}>
                                  <kbd className="px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded">
                                    {part}
                                  </kbd>
                                  {index < getShortcutDisplay(key).split(' + ').length - 1 && (
                                    <span className="text-gray-400">+</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Appuyez sur <kbd className="px-1 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded">Échap</kbd> pour fermer
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;
