import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

/**
 * Modal de confirmation pour les actions critiques
 * Empêche les actions accidentelles
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer l'action",
  message = "Êtes-vous sûr de vouloir continuer ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "warning",
  isLoading = false
}) => {
  if (!isOpen) return null;

  const variants = {
    warning: {
      icon: ExclamationTriangleIcon,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      borderColor: "border-yellow-200"
    },
    danger: {
      icon: ExclamationTriangleIcon,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      borderColor: "border-red-200"
    },
    success: {
      icon: CheckCircleIcon,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      borderColor: "border-green-200"
    },
    info: {
      icon: CheckCircleIcon,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      borderColor: "border-blue-200"
    }
  };

  const config = variants[variant] || variants.warning;
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in confirmation:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center mr-4`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-sm">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white ${config.buttonColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                En cours...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
