import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useStableModal } from '../../hooks/useStableModal';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

const TrainingManagement = ({ darkMode = false }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    status: '',
  });
  // Utiliser le hook stable pour les modals
  const createModal = useStableModal(false);
  const editModal = useStableModal(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    instructor: '',
    duration: '',
    totalHours: '',
    lessons: '',
    price: '',
    maxStudents: '',
    startDate: '',
    endDate: '',
    language: 'Français',
    image: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Vérifier si un modal est ouvert
  const isModalOpen = createModal.isOpen || editModal.isOpen;

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        search: searchQuery || undefined,
      };
      Object.keys(params).forEach((key) => params[key] === '' && delete params[key]);

      const response = await adminService.getCourses(params);
      
      if (response && response.data) {
        const coursesList = Array.isArray(response.data) ? response.data : (response.data.courses || []);
        setCourses(coursesList);
        setFilteredCourses(coursesList);
      } else if (response && Array.isArray(response)) {
        setCourses(response);
        setFilteredCourses(response);
      } else {
        setCourses([]);
        setFilteredCourses([]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors du chargement des formations';
      
      // Vérifier si c'est vraiment une erreur réseau (pas de réponse)
      const isNetworkError = !error.response && (
        error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' || 
        error.message?.includes('Network Error') ||
        error.message?.includes('Failed to fetch')
      );
      
      if (isNetworkError) {
        errorMessage = 'Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://localhost:5000';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Ne pas afficher le toast si c'est juste une erreur de chargement initial
      // (le composant affichera un message d'erreur dans l'UI)
      if (isNetworkError || error.response?.status >= 500) {
        toast.error(errorMessage);
      }
      
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    // Ne pas recharger si un modal est ouvert
    if (!isModalOpen) {
      loadCourses();
    }
  }, [loadCourses, isModalOpen]);

  // Debug: Surveiller les changements d'état du modal
  useEffect(() => {
    if (createModal.isOpen) {
      console.log('✅ [TrainingManagement] Create modal is now OPEN');
    } else {
      console.log('❌ [TrainingManagement] Create modal is now CLOSED');
    }
  }, [createModal.isOpen]);

  // Empêcher le scroll du body quand un modal est ouvert et gérer Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        if (createModal.isOpen && !isCreating) {
          createModal.close();
        }
        if (editModal.isOpen && !isUpdating) {
          editModal.close();
          setSelectedCourse(null);
        }
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape, true);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape, true);
    };
  }, [isModalOpen, createModal, editModal, isCreating, isUpdating]);

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!createFormData.title || !createFormData.description || !createFormData.price 
        || !createFormData.duration || !createFormData.totalHours || !createFormData.lessons 
        || !createFormData.startDate || !createFormData.maxStudents || !createFormData.category 
        || !createFormData.level || !createFormData.instructor) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Empêcher la fermeture pendant la création
    createModal.preventClose();
    setIsCreating(true);

    try {
      const courseData = {
        title: createFormData.title,
        description: createFormData.description,
        category: createFormData.category,
        level: createFormData.level,
        instructor: createFormData.instructor,
        duration: createFormData.duration,
        totalHours: parseInt(createFormData.totalHours),
        lessons: parseInt(createFormData.lessons),
        price: parseFloat(createFormData.price),
        maxStudents: parseInt(createFormData.maxStudents),
        startDate: createFormData.startDate,
        endDate: createFormData.endDate || undefined,
        language: createFormData.language,
        image: createFormData.image || '/images/default-course.jpg'
      };

      const response = await adminService.createCourse(courseData);
      
      if (response.success || response.data) {
        toast.success('Formation créée avec succès !');
        createModal.close();
        setCreateFormData({
          title: '', description: '', category: '', level: '', instructor: '',
          duration: '', totalHours: '', lessons: '', price: '', maxStudents: '',
          startDate: '', endDate: '', language: 'Français', image: ''
        });
        await loadCourses();
      } else {
        toast.error(response.message || 'Erreur lors de la création de la formation');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création de la formation';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
      // Réautoriser la fermeture après la création
      createModal.allowClose();
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    editModal.open();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedCourse) return;

    // Empêcher la fermeture pendant la mise à jour
    editModal.preventClose();
    setIsUpdating(true);

    try {
      const courseData = {
        title: selectedCourse.title,
        description: selectedCourse.description,
        category: selectedCourse.category,
        level: selectedCourse.level,
        instructor: selectedCourse.instructor?.name || selectedCourse.instructor,
        duration: selectedCourse.duration,
        totalHours: selectedCourse.totalHours,
        lessons: selectedCourse.lessons,
        price: selectedCourse.price,
        maxStudents: selectedCourse.maxStudents,
        startDate: selectedCourse.startDate,
        endDate: selectedCourse.endDate,
        language: selectedCourse.language,
        image: selectedCourse.image,
      };

      const courseId = selectedCourse._id || selectedCourse.id;
      const response = await adminService.updateCourse(courseId, courseData);

      if (response.success || response.data) {
        toast.success('Formation mise à jour avec succès !');
        editModal.close();
        setSelectedCourse(null);
        await loadCourses();
      } else {
        toast.error(response.message || 'Erreur lors de la mise à jour de la formation');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour de la formation';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
      // Réautoriser la fermeture après la mise à jour
      editModal.allowClose();
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.')) {
      return;
    }

    try {
      await adminService.deleteCourse(courseId);
      toast.success('Formation supprimée avec succès');
      await loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression de la formation';
      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      status: '',
    });
    setSearchQuery('');
  };

  const getLevelBadge = (level) => {
    const badges = {
      Débutant: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Intermédiaire: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Avancé: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return badges[level] || 'bg-gray-100 text-gray-800';
  };

  const getInstructorName = (course) => {
    if (typeof course.instructor === 'string') return course.instructor;
    if (course.instructor && course.instructor.name) return course.instructor.name;
    return 'Instructeur';
  };

  if (loading && courses.length === 0) {
    return <LoadingSpinner size="large" text="Chargement des formations..." />;
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Formations</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez votre catalogue de formations
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ [TrainingManagement] Add button clicked');
            console.log('🔍 [TrainingManagement] Before open - isOpen:', createModal.isOpen);
            
            // Ouvrir le modal
            createModal.forceOpen();
            
            // Vérifier après un court délai
            setTimeout(() => {
              console.log('🔍 [TrainingManagement] After open - isOpen:', createModal.isOpen);
              if (!createModal.isOpen) {
                console.warn('⚠️ [TrainingManagement] Modal did not open, forcing again...');
                createModal.forceOpen();
              }
            }, 100);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          Nouvelle formation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Toutes les catégories</option>
            <option value="Développement Web">Développement Web</option>
            <option value="Programmation">Programmation</option>
            <option value="Design">Design</option>
            <option value="Marketing Digital">Marketing Digital</option>
            <option value="Gestion de Projet">Gestion de Projet</option>
            <option value="Cybersécurité">Cybersécurité</option>
          </select>

          {/* Level Filter */}
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tous les niveaux</option>
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
          </select>

          {/* Clear Filters */}
          {(filters.category || filters.level || filters.status || searchQuery) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 justify-center"
            >
              <XMarkIcon className="w-5 h-5" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Formation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Instructeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Étudiants
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Aucune formation trouvée
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => {
                  const courseId = course._id || course.id;
                  return (
                    <tr key={courseId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={course.image || '/images/default-course.jpg'}
                              alt={course.title}
                              onError={(e) => {
                                e.target.src = '/images/default-course.jpg';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {course.duration}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {typeof course.category === 'string' ? course.category : (course.category?.name || 'Non défini')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadge(typeof course.level === 'string' ? course.level : (course.level?.name || ''))}`}>
                          {typeof course.level === 'string' ? course.level : (course.level?.name || 'Non défini')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {getInstructorName(course)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.price?.toLocaleString('fr-FR')} XAF
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {course.currentStudents || 0} / {course.maxStudents || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(courseId)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Course Modal */}
      {createModal.isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            // Fermer seulement si on clique sur le backdrop, pas sur le contenu
            if (e.target === e.currentTarget && !isCreating) {
              e.preventDefault();
              e.stopPropagation();
              createModal.close();
            }
          }}
          onMouseDown={(e) => {
            // Empêcher la fermeture accidentelle
            if (e.target === e.currentTarget && isCreating) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          tabIndex={-1}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nouvelle formation</h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isCreating) {
                    createModal.close();
                  }
                }}
                disabled={isCreating}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Titre de la formation *</label>
                <input
                  type="text"
                  name="title"
                  value={createFormData.title}
                  onChange={handleCreateFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
                <textarea
                  name="description"
                  value={createFormData.description}
                  onChange={handleCreateFormChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Catégorie *</label>
                  <select
                    name="category"
                    value={createFormData.category}
                    onChange={handleCreateFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Développement Web">Développement Web</option>
                    <option value="Programmation">Programmation</option>
                    <option value="Design">Design</option>
                    <option value="Marketing Digital">Marketing Digital</option>
                    <option value="Gestion de Projet">Gestion de Projet</option>
                    <option value="Cybersécurité">Cybersécurité</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Niveau *</label>
                  <select
                    name="level"
                    value={createFormData.level}
                    onChange={handleCreateFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Instructeur *</label>
                <input
                  type="text"
                  name="instructor"
                  value={createFormData.instructor}
                  onChange={handleCreateFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Durée *</label>
                  <input
                    type="text"
                    name="duration"
                    value={createFormData.duration}
                    onChange={handleCreateFormChange}
                    required
                    placeholder="ex: 40 heures"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Total heures *</label>
                  <input
                    type="number"
                    name="totalHours"
                    value={createFormData.totalHours}
                    onChange={handleCreateFormChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Leçons *</label>
                  <input
                    type="number"
                    name="lessons"
                    value={createFormData.lessons}
                    onChange={handleCreateFormChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Prix (XAF) *</label>
                  <input
                    type="number"
                    name="price"
                    value={createFormData.price}
                    onChange={handleCreateFormChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max étudiants *</label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={createFormData.maxStudents}
                    onChange={handleCreateFormChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date début *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={createFormData.startDate}
                    onChange={handleCreateFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date fin</label>
                  <input
                    type="date"
                    name="endDate"
                    value={createFormData.endDate}
                    onChange={handleCreateFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Langue</label>
                <select
                  name="language"
                  value={createFormData.language}
                  onChange={handleCreateFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Arabe">Arabe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={createFormData.image}
                  onChange={handleCreateFormChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isCreating) {
                      createModal.close();
                    }
                  }}
                  disabled={isCreating}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Course Modal */}
      {editModal.isOpen && selectedCourse && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Fermer seulement si on clique sur le backdrop, pas sur le contenu
            if (e.target === e.currentTarget && !isUpdating) {
              e.preventDefault();
              e.stopPropagation();
              editModal.close();
              setSelectedCourse(null);
            }
          }}
          onMouseDown={(e) => {
            // Empêcher la fermeture accidentelle
            if (e.target === e.currentTarget && isUpdating) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          tabIndex={-1}
          style={{ zIndex: 9999 }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Modifier la formation</h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isUpdating) {
                    editModal.close();
                    setSelectedCourse(null);
                  }
                }}
                disabled={isUpdating}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Titre de la formation *</label>
                <input
                  type="text"
                  value={selectedCourse.title || ''}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
                <textarea
                  value={selectedCourse.description || ''}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Prix (XAF) *</label>
                  <input
                    type="number"
                    value={selectedCourse.price || ''}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, price: parseFloat(e.target.value) })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max étudiants *</label>
                  <input
                    type="number"
                    value={selectedCourse.maxStudents || ''}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, maxStudents: parseInt(e.target.value) })}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isUpdating) {
                      editModal.close();
                      setSelectedCourse(null);
                    }
                  }}
                  disabled={isUpdating}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TrainingManagement;

