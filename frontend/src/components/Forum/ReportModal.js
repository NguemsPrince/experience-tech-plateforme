import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Modal pour signaler un contenu du forum
 */
const ReportModal = ({ isOpen, onClose, onReport, contentType = 'post' }) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: 'spam', label: 'Spam', description: 'Contenu promotionnel ou répétitif' },
    { value: 'inappropriate', label: 'Contenu inapproprié', description: 'Contenu offensant ou non conforme' },
    { value: 'off-topic', label: 'Hors sujet', description: 'Le contenu ne correspond pas à la catégorie' },
    { value: 'harassment', label: 'Harcèlement', description: 'Contenu harcelant ou menaçant' },
    { value: 'other', label: 'Autre', description: 'Autre raison' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason) {
      toast.error('Veuillez sélectionner une raison');
      return;
    }

    setLoading(true);
    try {
      await onReport(formData);
      setFormData({ reason: '', description: '' });
      onClose();
      toast.success('Signalement envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      toast.error('Erreur lors de l\'envoi du signalement');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ reason: '', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black bg-opacity-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Signaler ce {contentType === 'post' ? 'sujet' : 'commentaire'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Aidez-nous à maintenir la qualité du forum
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Raisons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Raison du signalement *
              </label>
              <div className="space-y-2">
                {reasons.map((reason) => (
                  <label
                    key={reason.value}
                    className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.reason === reason.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason.value}
                      checked={formData.reason === reason.value}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{reason.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{reason.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (optionnel)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Fournissez plus de détails sur la raison du signalement..."
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 caractères
              </p>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important</p>
                  <p>
                    Les signalements sont examinés par notre équipe de modération. 
                    Les faux signalements peuvent entraîner des sanctions.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !formData.reason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                    Signaler
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;

