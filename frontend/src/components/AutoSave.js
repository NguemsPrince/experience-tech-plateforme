import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AutoSave = ({ 
  data, 
  onSave, 
  interval = 30000, // 30 secondes par défaut
  enabled = true,
  showStatus = true 
}) => {
  const [status, setStatus] = useState('idle'); // idle, saving, saved, error
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  const saveData = useCallback(async () => {
    if (!enabled || !data) return;
    
    setStatus('saving');
    setError(null);
    
    try {
      await onSave(data);
      setStatus('saved');
      setLastSaved(new Date());
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (err) {
      setStatus('error');
      setError(err.message);
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  }, [data, onSave, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(saveData, interval);
    return () => clearInterval(timer);
  }, [saveData, interval, enabled]);

  const getStatusConfig = () => {
    const configs = {
      idle: {
        icon: ClockIcon,
        color: 'text-gray-400',
        message: 'Sauvegarde automatique activée'
      },
      saving: {
        icon: CloudArrowUpIcon,
        color: 'text-blue-500',
        message: 'Sauvegarde en cours...'
      },
      saved: {
        icon: CheckCircleIcon,
        color: 'text-green-500',
        message: 'Sauvegardé automatiquement'
      },
      error: {
        icon: ExclamationTriangleIcon,
        color: 'text-red-500',
        message: 'Erreur de sauvegarde'
      }
    };
    return configs[status];
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (!showStatus) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${config.color} ${status === 'saving' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-medium ${config.color}`}>
            {config.message}
          </span>
          {lastSaved && status === 'saved' && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({lastSaved.toLocaleTimeString()})
            </span>
          )}
          {error && status === 'error' && (
            <span className="text-xs text-red-500">
              - {error}
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AutoSave;
