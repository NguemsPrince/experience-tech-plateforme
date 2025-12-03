import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { projectsService } from '../services/projects';

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await projectsService.createProject(data);
      toast.success('Projet créé avec succès !');
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      toast.error('Erreur lors de la création du projet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer un nouveau projet" size="medium">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom du projet *
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Le nom du projet est requis' })}
            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Nom de votre projet"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { required: 'La description est requise' })}
            className={`input-field ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Décrivez votre projet en détail..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Type de projet *
          </label>
          <select
            id="type"
            {...register('type', { required: 'Le type de projet est requis' })}
            className={`input-field ${errors.type ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionnez un type</option>
            <option value="web">Site Web</option>
            <option value="mobile">Application Mobile</option>
            <option value="desktop">Application Desktop</option>
            <option value="ecommerce">E-commerce</option>
            <option value="other">Autre</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Budget estimé
          </label>
          <input
            type="number"
            id="budget"
            {...register('budget')}
            className="input-field"
            placeholder="Budget en FCFA"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
            Délai souhaité
          </label>
          <select
            id="timeline"
            {...register('timeline')}
            className="input-field"
          >
            <option value="">Sélectionnez un délai</option>
            <option value="1month">1 mois</option>
            <option value="3months">3 mois</option>
            <option value="6months">6 mois</option>
            <option value="1year">1 an</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Création...' : 'Créer le projet'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
