import React, { useState } from 'react';
import { 
  XMarkIcon, 
  PlusIcon, 
  CogIcon, 
  AcademicCapIcon, 
  CubeIcon, 
  LightBulbIcon, 
  StarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const QuickAddModal = ({ isOpen, onClose, onSuccess, type = 'project' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    instructor: '',
    level: 'débutant',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Import API service
      const api = (await import('../services/api')).default;
      
      let response;
      if (type === 'training') {
        response = await api.post('/training', formData);
      } else if (type === 'product') {
        response = await api.post('/products', formData);
      } else {
        // For other types, use simulation for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = {
          data: {
            id: Date.now(),
            ...formData,
            type,
            createdAt: new Date().toISOString(),
            status: type === 'project' ? 'in_progress' : 'active'
          }
        };
      }
      
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormConfig = () => {
    switch (type) {
      case 'training':
        return {
          title: 'Nouvelle Formation',
          icon: AcademicCapIcon,
          color: 'green',
          fields: [
            { key: 'name', label: 'Titre de la formation', placeholder: 'Ex: React Avancé', required: true },
            { key: 'instructor', label: 'Instructeur', placeholder: 'Nom de l\'instructeur', required: true },
            { key: 'duration', label: 'Durée', placeholder: 'Ex: 3 jours', required: true },
            { key: 'price', label: 'Prix (€)', placeholder: 'Ex: 899', type: 'number', required: true },
            { key: 'level', label: 'Niveau', type: 'select', options: ['débutant', 'intermédiaire', 'avancé', 'expert'] },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Description de la formation...' }
          ]
        };
      case 'product':
        return {
          title: 'Nouveau Produit',
          icon: CubeIcon,
          color: 'orange',
          fields: [
            { key: 'name', label: 'Nom du produit', placeholder: 'Ex: Application Web E-commerce', required: true },
            { key: 'category', label: 'Catégorie', placeholder: 'Ex: Application, Template, API', required: true },
            { key: 'price', label: 'Prix (€)', placeholder: 'Ex: 2499', type: 'number', required: true },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Description du produit...', required: true }
          ]
        };
      case 'suggestion':
        return {
          title: 'Nouvelle Suggestion',
          icon: LightBulbIcon,
          color: 'purple',
          fields: [
            { key: 'name', label: 'Titre', placeholder: 'Ex: Amélioration de l\'interface', required: true },
            { key: 'category', label: 'Type', type: 'select', options: ['feature', 'improvement', 'bug', 'ui'], required: true },
            { key: 'priority', label: 'Priorité', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Décrivez votre suggestion...', required: true }
          ]
        };
      case 'testimonial':
        return {
          title: 'Nouveau Témoignage',
          icon: StarIcon,
          color: 'yellow',
          fields: [
            { key: 'name', label: 'Votre nom', placeholder: 'Votre nom', required: true },
            { key: 'description', label: 'Votre témoignage', type: 'textarea', placeholder: 'Partagez votre expérience...', required: true }
          ]
        };
      default: // project
        return {
          title: 'Nouveau Projet',
          icon: CogIcon,
          color: 'blue',
          fields: [
            { key: 'name', label: 'Nom du projet', placeholder: 'Ex: Site Web E-commerce', required: true },
            { key: 'category', label: 'Catégorie', placeholder: 'Ex: Web, Mobile, Desktop', required: true },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Description du projet...', required: true }
          ]
        };
    }
  };

  const config = getFormConfig();
  const Icon = config.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-${config.color}-100 dark:bg-${config.color}-900 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${config.color}-600 dark:text-${config.color}-400`} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {config.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    rows={3}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner...</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required={field.required}
                    type={field.type || 'text'}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                )}
              </div>
            ))}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-${config.color}-600 text-white rounded-lg hover:bg-${config.color}-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4" />
                    <span>Créer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;
