import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  TagIcon,
  DocumentTextIcon,
  EyeIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';
import MarkdownEditor from '../components/Forum/MarkdownEditor';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { user } = useAuth();

  // États
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: categoryId || '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/forum/categories');
      // Gérer différentes structures de réponse
      const categoriesData = response.data?.data || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast.error('Erreur lors du chargement des catégories');
      setCategories([]); // S'assurer que categories est toujours un tableau
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags.length < 5) {
      const tag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Le titre ne peut pas dépasser 200 caractères';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Le contenu doit contenir au moins 10 caractères';
    }

    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Préparer les données à envoyer
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags || []
      };

      console.log('Envoi des données:', postData); // Debug

      const response = await api.post('/forum/posts', postData);
      
      console.log('Réponse du serveur complète:', response); // Debug
      
      // L'intercepteur axios retourne déjà response.data
      // Donc response = { success: true, message: "...", data: post }
      const post = response?.data || response;
      
      if (!post) {
        console.error('Aucune donnée reçue:', response);
        throw new Error('Aucune donnée reçue du serveur');
      }
      
      const postId = post._id || post.id;
      
      if (!postId) {
        console.error('Post ID non trouvé. Structure reçue:', {
          response,
          post,
          keys: Object.keys(post || {})
        });
        throw new Error('ID du sujet non trouvé dans la réponse du serveur');
      }
      
      toast.success('Sujet créé avec succès !');
      navigate(`/forum/topic/${postId}`);
    } catch (error) {
      console.error('Erreur lors de la création du sujet:', error);
      console.error('Type d\'erreur:', typeof error);
      console.error('Erreur complète:', JSON.stringify(error, null, 2)); // Debug
      console.error('Error response:', error.response); // Debug
      console.error('Error response data:', error.response?.data); // Debug
      
      // L'intercepteur axios retourne error.response?.data, donc error peut être la structure { success: false, message: "..." }
      const errorMessage = error?.message || error?.response?.data?.message || error?.response?.message;
      
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        const defaultMessage = 'Erreur lors de la création du sujet. Veuillez vérifier que vous êtes connecté et que tous les champs sont remplis.';
        toast.error(defaultMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/forum');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/forum')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Retour au forum
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <DocumentTextIcon className="w-8 h-8 mr-3 text-blue-600" />
              Créer un nouveau sujet
            </h1>
            <p className="text-gray-600 mt-2">
              Partagez vos questions, idées ou connaissances avec la communauté
            </p>
          </div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Titre */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du sujet *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Donnez un titre clair et descriptif à votre sujet..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-blue-300' : 'border-gray-300'
                  }`}
                  maxLength={200}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-blue-600">{errors.title}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/200 caractères
                </p>
              </div>

              {/* Catégorie */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-blue-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories && Array.isArray(categories) && categories.map((category) => (
                    <option key={category._id || category.id} value={category._id || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-blue-600">{errors.category}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optionnel)
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 relative">
                    <TagIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ajouter un tag..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={30}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || formData.tags.length >= 5}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Maximum 5 tags. Utilisez des mots-clés pertinents pour faciliter la recherche.
                </p>
              </div>

              {/* Contenu */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu *
                </label>
                <MarkdownEditor
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre question ou partagez vos connaissances en détail... Vous pouvez utiliser le Markdown pour formater votre texte."
                  minHeight="300px"
                  maxHeight="600px"
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-blue-600">{errors.content}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 10 caractères. Utilisez le Markdown pour formater votre texte (gras, italique, code, liens, etc.).
                </p>
              </div>

              {/* Conseils */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Conseils pour un bon sujet</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Utilisez un titre clair et descriptif</li>
                  <li>• Choisissez la bonne catégorie</li>
                  <li>• Soyez précis dans votre description</li>
                  <li>• Utilisez des tags pertinents</li>
                  <li>• Respectez les autres membres de la communauté</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Votre sujet sera visible par tous les membres
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span className="ml-2">Création...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Créer le sujet
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreatePostPage;
