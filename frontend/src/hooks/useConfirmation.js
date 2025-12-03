import { useState, useCallback } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

/**
 * Hook pour faciliter l'utilisation des confirmations
 * Usage:
 * const { showConfirmation, ConfirmationComponent } = useConfirmation();
 * showConfirmation({
 *   onConfirm: async () => { console.log('action'); },
 *   message: "Êtes-vous sûr ?"
 * });
 */
const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(null);

  const showConfirmation = useCallback((options) => {
    setConfig(options);
    setIsOpen(true);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsOpen(false);
    setConfig(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (config?.onConfirm) {
      await config.onConfirm();
    }
    hideConfirmation();
  }, [config, hideConfirmation]);

  const ConfirmationComponent = config ? (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={hideConfirmation}
      onConfirm={handleConfirm}
      title={config.title}
      message={config.message}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      variant={config.variant}
      isLoading={config.isLoading}
    />
  ) : null;

  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationComponent
  };
};

export default useConfirmation;

