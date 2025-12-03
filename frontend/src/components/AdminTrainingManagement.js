import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  DocumentTextIcon,
  TableCellsIcon as TableIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { exportToPDF, exportToExcel, trainingColumns } from '../utils/exportUtils';
import useConfirmation from '../hooks/useConfirmation';
import trainingService from '../services/training';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { useStableModal } from '../hooks/useStableModal';

const AdminTrainingManagement = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { showConfirmation, ConfirmationComponent } = useConfirmation();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  // Utiliser le hook stable pour les modals
  const createModal = useStableModal(false);
  const editModal = useStableModal(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const isMountedRef = useRef(true);
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
    image: ''
  });

  // Mock data pour les formations
  const mockCourses = [
    {
      id: 1,
      title: 'Formation React.js Complète',
      description: 'Apprenez React.js de A à Z avec des projets pratiques',
      instructor: 'Jean Dupont',
      duration: '40 heures',
      level: 'Intermédiaire',
      category: 'Développement Web',
      price: 150000,
      maxStudents: 20,
      currentStudents: 15,
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      status: 'active',
      rating: 4.8,
      studentsCount: 15,
      image: '/images/courses/react-course.jpg',
      tags: ['react', 'javascript', 'frontend'],
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      title: 'Formation Node.js Avancée',
      description: 'Maîtrisez Node.js pour le développement backend',
      instructor: 'Marie Martin',
      duration: '35 heures',
      level: 'Avancé',
      category: 'Développement Web',
      price: 180000,
      maxStudents: 15,
      currentStudents: 12,
      startDate: '2024-02-20',
      endDate: '2024-03-20',
      status: 'active',
      rating: 4.9,
      studentsCount: 12,
      image: '/images/courses/node-course.jpg',
      tags: ['nodejs', 'backend', 'javascript'],
      createdAt: '2024-01-12'
    },
    {
      id: 3,
      title: 'Formation Python pour Débutants',
      description: 'Introduction complète à Python',
      instructor: 'Pierre Durand',
      duration: '30 heures',
      level: 'Débutant',
      category: 'Programmation',
      price: 120000,
      maxStudents: 25,
      currentStudents: 8,
      startDate: '2024-03-01',
      endDate: '2024-04-01',
      status: 'draft',
      rating: 0,
      studentsCount: 0,
      image: '/images/courses/python-course.jpg',
      tags: ['python', 'programmation', 'débutant'],
      createdAt: '2024-01-15'
    }
  ];

  const categories = [
    'Développement Web',
    'Programmation',
    'Design',
    'Marketing Digital',
    'Gestion de Projet',
    'Cybersécurité'
  ];

  const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

  // Helper function to get course ID
  const getCourseId = (course) => course._id || course.id;

  // Helper function to get instructor name
  const getInstructorName = (course) => {
    if (typeof course.instructor === 'string') return course.instructor;
    if (course.instructor && course.instructor.name) return course.instructor.name;
    return 'Instructeur';
  };

  // Helper function to get category name (with additional safety)
  const getCategoryName = (course) => {
    if (!course || course.category === undefined || course.category === null) return 'Non défini';
    if (typeof course.category === 'string') return course.category;
    if (course.category && typeof course.category === 'object' && course.category.name) {
      return String(course.category.name);
    }
    return 'Non défini';
  };

  // Helper function to get level name (with additional safety)
  const getLevelName = (course) => {
    if (!course || course.level === undefined || course.level === null) return 'Non défini';
    if (typeof course.level === 'string') return course.level;
    if (course.level && typeof course.level === 'object' && course.level.name) {
      return String(course.level.name);
    }
    return 'Non défini';
  };

  // Helper function to get rating value
  const getRatingValue = (course) => {
    if (typeof course.rating === 'number') return course.rating;
    if (course.rating && typeof course.rating === 'object') {
      if (course.rating.average !== undefined) return course.rating.average;
      if (course.rating.value !== undefined) return course.rating.value;
    }
    return 0;
  };

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return 'Non défini';
    if (typeof date === 'string') {
      try {
        return new Date(date).toLocaleDateString('fr-FR');
      } catch {
        return date;
      }
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('fr-FR');
    }
    if (typeof date === 'object' && date.toString) {
      return date.toString();
    }
    return String(date);
  };

  // Helper function to format duration
  const formatDuration = (duration) => {
    if (typeof duration === 'string') return duration;
    if (typeof duration === 'number') return `${duration} heures`;
    if (duration && typeof duration === 'object' && duration.toString) {
      return duration.toString();
    }
    return String(duration || 'Non défini');
  };

  // Helper function to normalize course data
  const normalizeCourse = (course) => {
    if (!course) return course;
    
    // Helper to safely extract string value from object or string
    const extractStringValue = (value) => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null) {
        if (value.name) return String(value.name);
        if (value.toString && typeof value.toString === 'function') {
          try {
            const str = value.toString();
            if (str !== '[object Object]') return str;
          } catch (e) {
            // Fall through
          }
        }
        return ''; // Return empty string for objects without name property
      }
      return String(value || '');
    };
    
    return {
      ...course,
      // Normalize category to string
      category: extractStringValue(course.category),
      // Normalize level to string
      level: extractStringValue(course.level),
      // Normalize instructor to string
      instructor: extractStringValue(course.instructor),
      // Normalize rating to number
      rating: typeof course.rating === 'number' 
        ? course.rating 
        : (course.rating?.average !== undefined ? course.rating.average : (course.rating?.value !== undefined ? course.rating.value : 0))
    };
  };

  const loadCourses = useCallback(async () => {
    try {
      const response = await trainingService.getAllCourses();
      // Handle different response formats
      let coursesList = [];
      
      if (response && response.success && response.data) {
        // Backend returns { success: true, data: { courses: [...] } }
        coursesList = response.data.courses || response.data || [];
      } else if (response && Array.isArray(response)) {
        // Backend returns array directly
        coursesList = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Backend returns { data: [...] }
        coursesList = response.data;
      } else {
        // Fallback to mock data if API fails
        console.warn('Unexpected response format:', response);
        coursesList = mockCourses;
      }
      
      // Normalize all courses to ensure objects are converted to strings
      const normalizedCourses = coursesList.map(normalizeCourse);
      setCourses(normalizedCourses);
      setFilteredCourses(normalizedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      // Fallback to mock data
      const normalizedMockCourses = mockCourses.map(normalizeCourse);
      setCourses(normalizedMockCourses);
      setFilteredCourses(normalizedMockCourses);
    }
  }, []);

  // Vérifier si un modal est ouvert
  const isModalOpen = createModal.isOpen || editModal.isOpen;

  // Protéger contre le démontage
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Tous les hooks doivent être appelés avant les early returns
  useEffect(() => {
    // SÉCURITÉ : Ne charger les données que si l'utilisateur est authentifié et admin
    if (isLoading) {
      return;
    }
    
    if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      console.warn('🚫 [AdminTrainingManagement] Tentative de chargement des données sans autorisation admin');
      return;
    }

    // Ne pas recharger si un modal est ouvert ou si le composant n'est pas monté
    if (!isMountedRef.current || isModalOpen) {
      return;
    }

    loadCourses();
  }, [isLoading, isAuthenticated, user, loadCourses, isModalOpen]);

  // Empêcher le scroll du body quand un modal est ouvert et gérer Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        if (createModal.isOpen && !isCreating) {
          createModal.close();
        }
        if (editModal.isOpen && !isUpdating) {
          editModal.close();
          setEditingCourse(null);
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

  useEffect(() => {
    let filtered = courses;

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getInstructorName(course).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrer par catégorie
    if (filterCategory !== 'all') {
      filtered = filtered.filter(course => {
        const category = typeof course.category === 'string' 
          ? course.category 
          : (course.category?.name || '');
        return category === filterCategory;
      });
    }

    // Filtrer par niveau
    if (filterLevel !== 'all') {
      filtered = filtered.filter(course => {
        const level = typeof course.level === 'string' 
          ? course.level 
          : (course.level?.name || '');
        return level === filterLevel;
      });
    }

    // Filtrer par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(course => course.status === filterStatus);
    }

    // Normalize all filtered courses to ensure no objects are rendered
    const normalizedFiltered = filtered.map(normalizeCourse);
    setFilteredCourses(normalizedFiltered);
  }, [courses, searchQuery, filterCategory, filterLevel, filterStatus]);

  // SÉCURITÉ CRITIQUE : Vérifier le token dans localStorage (après tous les hooks)
  const tokenInStorage = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const hasValidToken = tokenInStorage && 
    tokenInStorage !== 'null' && 
    tokenInStorage !== 'undefined' && 
    tokenInStorage.trim() !== '';

  // SÉCURITÉ CRITIQUE : Bloquer l'accès si pas de token valide
  if (!hasValidToken) {
    console.warn('🚫 [AdminTrainingManagement] Pas de token valide, redirection vers /admin/login');
    return <Navigate to="/admin/login" replace />;
  }

  // SÉCURITÉ CRITIQUE : Bloquer l'accès pendant la vérification
  if (isLoading) {
    return <LoadingSpinner size="large" text="Vérification des permissions..." />;
  }

  // SÉCURITÉ CRITIQUE : Vérifier l'authentification
  if (!isAuthenticated) {
    console.warn('🚫 [AdminTrainingManagement] Utilisateur non authentifié, redirection vers /admin/login');
    return <Navigate to="/admin/login" replace />;
  }

  // SÉCURITÉ CRITIQUE : Vérifier le rôle admin
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    console.error('🚫 [AdminTrainingManagement] Accès refusé - Rôle insuffisant:', {
      user: user?.email || 'unknown',
      role: user?.role || 'none'
    });
    return <Navigate to="/" replace />;
  }

  const handleCourseAction = (action, courseId) => {
    switch (action) {
      case 'view':
        // Voir les détails du cours
        break;
      case 'edit':
        const course = courses.find(c => getCourseId(c) === courseId);
        setEditingCourse(course);
        editModal.open();
        break;
      case 'delete':
        showConfirmation({
          title: 'Supprimer la formation',
          message: 'Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette formation ?',
          variant: 'danger',
          confirmText: 'Supprimer',
          onConfirm: async () => {
            try {
              await trainingService.deleteCourse(courseId);
              toast.success('Formation supprimée avec succès');
              // Reload courses from backend
              await loadCourses();
            } catch (error) {
              toast.error('Erreur lors de la suppression');
            }
          }
        });
        break;
      case 'activate':
        setCourses(courses.map(c => {
          const updated = getCourseId(c) === courseId ? { ...c, status: 'active' } : c;
          return normalizeCourse(updated);
        }));
        break;
      case 'deactivate':
        setCourses(courses.map(c => {
          const updated = getCourseId(c) === courseId ? { ...c, status: 'inactive' } : c;
          return normalizeCourse(updated);
        }));
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    if (selectedCourses.length === 0) {
      alert('Veuillez sélectionner au moins une formation');
      return;
    }

    switch (action) {
      case 'activate':
        setCourses(courses.map(c => {
          const updated = selectedCourses.includes(getCourseId(c)) ? { ...c, status: 'active' } : c;
          return normalizeCourse(updated);
        }));
        setSelectedCourses([]);
        break;
      case 'deactivate':
        setCourses(courses.map(c => {
          const updated = selectedCourses.includes(getCourseId(c)) ? { ...c, status: 'inactive' } : c;
          return normalizeCourse(updated);
        }));
        setSelectedCourses([]);
        break;
      case 'delete':
        showConfirmation({
          title: 'Supprimer les formations',
          message: `Êtes-vous sûr de vouloir supprimer ${selectedCourses.length} formation(s) ? Cette action est irréversible.`,
          variant: 'danger',
          confirmText: 'Supprimer',
          onConfirm: () => {
            const remainingCourses = courses.filter(c => !selectedCourses.includes(getCourseId(c)));
            const normalizedRemaining = remainingCourses.map(normalizeCourse);
            setCourses(normalizedRemaining);
            setSelectedCourses([]);
          }
        });
        break;
      case 'export':
        const selectedData = courses.filter(c => selectedCourses.includes(getCourseId(c)));
        console.log('Export data:', selectedData);
        break;
      default:
        break;
    }
  };

  const handleExportPDF = () => {
    const dataToExport = selectedCourses.length > 0 
      ? courses.filter(c => selectedCourses.includes(getCourseId(c)))
      : filteredCourses;
    
    exportToPDF(
      dataToExport,
      trainingColumns,
      'formations',
      'Liste des Formations - Expérience Tech'
    );
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const dataToExport = selectedCourses.length > 0 
      ? courses.filter(c => selectedCourses.includes(getCourseId(c)))
      : filteredCourses;
    
    exportToExcel(
      dataToExport,
      trainingColumns,
      'formations',
      'Liste des Formations - Expérience Tech'
    );
    setShowExportMenu(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Débutant': return 'bg-blue-100 text-blue-800';
      case 'Intermédiaire': return 'bg-orange-100 text-orange-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    // Protection contre les soumissions multiples
    if (isCreating) {
      return;
    }
    
    // Validation des champs obligatoires
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
    
    // Vérifier si une formation avec le même titre existe déjà
    const existingCourse = courses.find(c => 
      c.title.toLowerCase().trim() === createFormData.title.toLowerCase().trim()
    );
    
    if (existingCourse) {
      toast.error('Une formation avec ce titre existe déjà');
      setIsCreating(false);
      createModal.allowClose();
      return;
    }

    try {
      // Préparer les données pour l'API
      const courseData = {
        title: createFormData.title.trim(),
        description: createFormData.description.trim(),
        category: createFormData.category,
        level: createFormData.level,
        instructor: createFormData.instructor.trim(),
        duration: createFormData.duration.trim(),
        totalHours: parseInt(createFormData.totalHours),
        lessons: parseInt(createFormData.lessons),
        price: parseFloat(createFormData.price),
        maxStudents: parseInt(createFormData.maxStudents),
        startDate: createFormData.startDate,
        endDate: createFormData.endDate || undefined,
        language: createFormData.language,
        image: createFormData.image || '/images/default-course.jpg'
      };

      const response = await trainingService.createCourse(courseData);
      
      if (response && (response.success || response.data)) {
        toast.success('Formation créée avec succès !');
        
        // Fermer le modal
        createModal.close();
        
        // Réinitialiser le formulaire
        setCreateFormData({
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
          image: ''
        });
        
        // Recharger la liste des formations
        await loadCourses();
      } else {
        toast.error(response?.message || 'Erreur lors de la création de la formation');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création de la formation';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
      createModal.allowClose();
    }
  };

  const renderCreateForm = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ zIndex: 99999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isCreating && e.isTrusted) {
          e.preventDefault();
          e.stopPropagation();
          createModal.close();
        }
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && isCreating) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      tabIndex={-1}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Créer une nouvelle formation</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isCreating) {
                createModal.close();
              }
            }}
            disabled={isCreating}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleCreateSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de la formation *
              </label>
              <input
                type="text"
                name="title"
                value={createFormData.title}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Formation React.js Complète"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instructeur *
              </label>
              <input
                type="text"
                name="instructor"
                value={createFormData.instructor}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Jean Dupont"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={createFormData.description}
              onChange={handleCreateFormChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description détaillée de la formation..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie *
              </label>
              <select 
                name="category"
                value={createFormData.category}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Niveau *
              </label>
              <select 
                name="level"
                value={createFormData.level}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner un niveau</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                name="price"
                value={createFormData.price}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150000"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Durée *
              </label>
              <input
                type="text"
                name="duration"
                value={createFormData.duration}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 40 heures"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total heures *
              </label>
              <input
                type="number"
                name="totalHours"
                value={createFormData.totalHours}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="40"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Leçons *
              </label>
              <input
                type="number"
                name="lessons"
                value={createFormData.lessons}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre max d'étudiants *
              </label>
              <input
                type="number"
                name="maxStudents"
                value={createFormData.maxStudents}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="20"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de début *
              </label>
              <input
                type="date"
                name="startDate"
                value={createFormData.startDate}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                name="endDate"
                value={createFormData.endDate}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Langue
              </label>
              <select 
                name="language"
                value={createFormData.language}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Français">Français</option>
                <option value="English">English</option>
                <option value="العربية">العربية</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={createFormData.image}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isCreating) {
                  createModal.close();
                  setCreateFormData({
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
                    image: ''
                  });
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isCreating}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCreating}
            >
              {isCreating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </span>
              ) : (
                'Créer la formation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Formations</h2>
          <p className="text-gray-600">Gérez toutes les formations de la plateforme</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              createModal.open();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouvelle formation
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Exporter
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-3 text-red-600" />
                    Exporter en PDF
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <TableIcon className="w-4 h-4 mr-3 text-green-600" />
                    Exporter en Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <AcademicCapIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total formations</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Actives</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Étudiants inscrits</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, c) => sum + c.currentStudents, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Revenus potentiels</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, c) => sum + (c.price * c.currentStudents), 0).toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des formations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les niveaux</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>
      </div>

      {/* Actions en lot */}
      {selectedCourses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedCourses.length} formation(s) sélectionnée(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Activer
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Désactiver
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des formations */}
      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <motion.div
            key={getCourseId(course)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(getCourseId(course))}
                    onChange={(e) => {
                      const courseId = getCourseId(course);
                      if (e.target.checked) {
                        setSelectedCourses([...selectedCourses, courseId]);
                      } else {
                        setSelectedCourses(selectedCourses.filter(id => id !== courseId));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(course.status || (course.isActive ? 'active' : 'inactive'))}`}>
                    {course.status === 'active' || course.isActive ? 'Active' : course.status === 'inactive' ? 'Inactive' : 'Brouillon'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(typeof course.level === 'string' ? course.level : (course.level?.name || ''))}`}>
                    {getLevelName(course)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{course.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    {getInstructorName(course)}
                  </span>
                  <span className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {formatDuration(course.duration)}
                  </span>
                  <span className="flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                    {course.price.toLocaleString()} FCFA
                  </span>
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatDate(course.startDate)}
                  </span>
                  <span className="flex items-center">
                    <ChartBarIcon className="w-4 h-4 mr-1" />
                    {course.currentStudents}/{course.maxStudents} étudiants
                  </span>
                  {getRatingValue(course) > 0 && (
                    <span className="flex items-center">
                      <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                      {getRatingValue(course).toFixed(1)}/5
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Array.isArray(course.tags) && course.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      #{typeof tag === 'string' ? tag : (tag?.name || String(tag))}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleCourseAction('view', getCourseId(course))}
                  className="text-blue-600 hover:text-blue-900"
                  title="Voir"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCourseAction('edit', getCourseId(course))}
                  className="text-green-600 hover:text-green-900"
                  title="Modifier"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                {(course.status === 'active' || course.isActive) ? (
                  <button
                    onClick={() => handleCourseAction('deactivate', getCourseId(course))}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Désactiver"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleCourseAction('activate', getCourseId(course))}
                    className="text-green-600 hover:text-green-900"
                    title="Activer"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleCourseAction('delete', getCourseId(course))}
                  className="text-red-600 hover:text-red-900"
                  title="Supprimer"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {filteredCourses.length} formation(s)
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Précédent
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Suivant
          </button>
        </div>
      </div>

      {/* Modals */}
      {createModal.isOpen && createPortal(
        renderCreateForm(),
        document.body
      )}
      {ConfirmationComponent}
    </div>
  );
};

export default AdminTrainingManagement;
