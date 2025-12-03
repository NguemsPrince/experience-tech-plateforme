import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  DocumentArrowUpIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  DocumentIcon,
  TableCellsIcon as TableIcon
} from '@heroicons/react/24/outline';
import { exportToPDF, exportToExcel, contentColumns } from '../utils/exportUtils';

const AdminContentManagement = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedContent, setSelectedContent] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Mock data pour le contenu
  const mockContent = {
    articles: [
      {
        id: 1,
        title: 'Nouvelles Technologies 2024',
        content: 'Découvrez les dernières tendances technologiques...',
        category: 'Technologie',
        status: 'published',
        author: 'Admin Expérience Tech',
        publishDate: '2024-01-15',
        views: 1250,
        likes: 45,
        comments: 12,
        tags: ['tech', 'innovation', '2024'],
        featured: true
      },
      {
        id: 2,
        title: 'Formation React.js : Guide Complet',
        content: 'Apprenez React.js de A à Z avec ce guide complet...',
        category: 'Formation',
        status: 'draft',
        author: 'Admin Expérience Tech',
        publishDate: '2024-01-10',
        views: 890,
        likes: 32,
        comments: 8,
        tags: ['react', 'javascript', 'formation'],
        featured: false
      }
    ],
    slides: [
      {
        id: 1,
        title: 'Slide Principal - Formation Web',
        image: '/images/slides/slide1.jpg',
        order: 1,
        status: 'active',
        link: '/training',
        description: 'Slide principal pour les formations web'
      },
      {
        id: 2,
        title: 'Slide Services IT',
        image: '/images/slides/slide2.jpg',
        order: 2,
        status: 'active',
        link: '/services',
        description: 'Slide pour les services IT'
      }
    ],
    media: [
      {
        id: 1,
        name: 'formation-react.jpg',
        type: 'image',
        size: '2.5 MB',
        uploadDate: '2024-01-15',
        url: '/uploads/formation-react.jpg',
        used: true
      },
      {
        id: 2,
        name: 'demo-video.mp4',
        type: 'video',
        size: '15.2 MB',
        uploadDate: '2024-01-14',
        url: '/uploads/demo-video.mp4',
        used: false
      }
    ]
  };

  const tabs = [
    { id: 'articles', name: 'Articles', icon: DocumentTextIcon },
    { id: 'slides', name: 'Slides', icon: PhotoIcon },
    { id: 'media', name: 'Médias', icon: VideoCameraIcon },
    { id: 'categories', name: 'Catégories', icon: TagIcon }
  ];

  useEffect(() => {
    setContent(mockContent[activeTab] || []);
    setFilteredContent(mockContent[activeTab] || []);
  }, [activeTab]);

  useEffect(() => {
    let filtered = content;

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrer par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Filtrer par catégorie
    if (filterCategory !== 'all' && activeTab === 'articles') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    setFilteredContent(filtered);
  }, [content, searchQuery, filterStatus, filterCategory, activeTab]);

  const handleContentAction = (action, contentId) => {
    switch (action) {
      case 'view':
        // Voir le contenu
        break;
      case 'edit':
        const item = content.find(c => c.id === contentId);
        setEditingContent(item);
        setShowEditModal(true);
        break;
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
          setContent(content.filter(c => c.id !== contentId));
        }
        break;
      case 'publish':
        setContent(content.map(c => 
          c.id === contentId ? { ...c, status: 'published' } : c
        ));
        break;
      case 'unpublish':
        setContent(content.map(c => 
          c.id === contentId ? { ...c, status: 'draft' } : c
        ));
        break;
      case 'feature':
        setContent(content.map(c => 
          c.id === contentId ? { ...c, featured: true } : c
        ));
        break;
      case 'unfeature':
        setContent(content.map(c => 
          c.id === contentId ? { ...c, featured: false } : c
        ));
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    if (selectedContent.length === 0) {
      alert('Veuillez sélectionner au moins un élément');
      return;
    }

    switch (action) {
      case 'publish':
        setContent(content.map(c => 
          selectedContent.includes(c.id) ? { ...c, status: 'published' } : c
        ));
        setSelectedContent([]);
        break;
      case 'unpublish':
        setContent(content.map(c => 
          selectedContent.includes(c.id) ? { ...c, status: 'draft' } : c
        ));
        setSelectedContent([]);
        break;
      case 'delete':
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedContent.length} élément(s) ?`)) {
          setContent(content.filter(c => !selectedContent.includes(c.id)));
          setSelectedContent([]);
        }
        break;
      case 'export':
        const selectedData = content.filter(c => selectedContent.includes(c.id));
        console.log('Export data:', selectedData);
        break;
      default:
        break;
    }
  };

  const handleExportPDF = () => {
    const dataToExport = selectedContent.length > 0 
      ? content.filter(c => selectedContent.includes(c.id))
      : filteredContent;
    
    exportToPDF(
      dataToExport,
      contentColumns,
      'contenu',
      'Liste du Contenu - Expérience Tech'
    );
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const dataToExport = selectedContent.length > 0 
      ? content.filter(c => selectedContent.includes(c.id))
      : filteredContent;
    
    exportToExcel(
      dataToExport,
      contentColumns,
      'contenu',
      'Liste du Contenu - Expérience Tech'
    );
    setShowExportMenu(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderArticles = () => (
    <div className="space-y-4">
      {filteredContent.map((article) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedContent.includes(article.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedContent([...selectedContent, article.id]);
                    } else {
                      setSelectedContent(selectedContent.filter(id => id !== article.id));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                {article.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    En vedette
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-3">{article.content.substring(0, 150)}...</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  {article.author}
                </span>
                <span className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {article.publishDate}
                </span>
                <span className="flex items-center">
                  <ChartBarIcon className="w-4 h-4 mr-1" />
                  {article.views} vues
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(article.status)}`}>
                  {article.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {article.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => handleContentAction('view', article.id)}
                className="text-blue-600 hover:text-blue-900"
                title="Voir"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleContentAction('edit', article.id)}
                className="text-green-600 hover:text-green-900"
                title="Modifier"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              {article.status === 'published' ? (
                <button
                  onClick={() => handleContentAction('unpublish', article.id)}
                  className="text-yellow-600 hover:text-yellow-900"
                  title="Dépublier"
                >
                  <EyeSlashIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleContentAction('publish', article.id)}
                  className="text-green-600 hover:text-green-900"
                  title="Publier"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleContentAction('delete', article.id)}
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
  );

  const renderSlides = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContent.map((slide) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-gray-400" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{slide.title}</h3>
              <input
                type="checkbox"
                checked={selectedContent.includes(slide.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedContent([...selectedContent, slide.id]);
                  } else {
                    setSelectedContent(selectedContent.filter(id => id !== slide.id));
                  }
                }}
                className="rounded border-gray-300"
              />
            </div>
            <p className="text-gray-600 text-sm mb-3">{slide.description}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(slide.status)}`}>
                {slide.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleContentAction('edit', slide.id)}
                  className="text-green-600 hover:text-green-900"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleContentAction('delete', slide.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderMedia = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredContent.map((media) => (
        <motion.div
          key={media.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <input
              type="checkbox"
              checked={selectedContent.includes(media.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedContent([...selectedContent, media.id]);
                } else {
                  setSelectedContent(selectedContent.filter(id => id !== media.id));
                }
              }}
              className="rounded border-gray-300"
            />
            {media.type === 'image' ? (
              <PhotoIcon className="w-6 h-6 text-blue-600" />
            ) : (
              <VideoCameraIcon className="w-6 h-6 text-red-600" />
            )}
          </div>
          <h4 className="text-sm font-medium text-gray-900 truncate">{media.name}</h4>
          <p className="text-xs text-gray-500">{media.size}</p>
          <p className="text-xs text-gray-500">{media.uploadDate}</p>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              media.used ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {media.used ? 'Utilisé' : 'Non utilisé'}
            </span>
            <button
              onClick={() => handleContentAction('delete', media.id)}
              className="text-red-600 hover:text-red-900"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCreateContentForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Créer un nouveau contenu</h3>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de contenu *
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Sélectionner un type</option>
                <option value="article">Article</option>
                <option value="slide">Slide</option>
                <option value="media">Média</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Sélectionner une catégorie</option>
                <option value="Technologie">Technologie</option>
                <option value="Formation">Formation</option>
                <option value="Actualités">Actualités</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Nouvelles Technologies 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description du contenu..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auteur *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Admin Expérience Tech"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut *
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: tech, innovation, 2024"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image/URL
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="URL de l'image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lien (pour les slides)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: /training"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Mettre en vedette
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Créer le contenu
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderEditContentForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Modifier le contenu</h3>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de contenu *
              </label>
              <select 
                defaultValue={editingContent?.type || 'article'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="article">Article</option>
                <option value="slide">Slide</option>
                <option value="media">Média</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select 
                defaultValue={editingContent?.category || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Technologie">Technologie</option>
                <option value="Formation">Formation</option>
                <option value="Actualités">Actualités</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              defaultValue={editingContent?.title || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Nouvelles Technologies 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              defaultValue={editingContent?.content || editingContent?.description || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description du contenu..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auteur *
              </label>
              <input
                type="text"
                defaultValue={editingContent?.author || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Admin Expérience Tech"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut *
              </label>
              <select 
                defaultValue={editingContent?.status || 'draft'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              defaultValue={editingContent?.tags?.join(', ') || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: tech, innovation, 2024"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image/URL
              </label>
              <input
                type="url"
                defaultValue={editingContent?.image || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="URL de l'image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lien (pour les slides)
              </label>
              <input
                type="url"
                defaultValue={editingContent?.link || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: /training"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured-edit"
              defaultChecked={editingContent?.featured || false}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured-edit" className="ml-2 text-sm text-gray-700">
              Mettre en vedette
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Mettre à jour
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
          <h2 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h2>
          <p className="text-gray-600">Gérez tous les contenus de la plateforme</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouveau contenu
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
                    <DocumentIcon className="w-4 h-4 mr-3 text-red-600" />
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

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher du contenu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
          {activeTab === 'articles' && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              <option value="Technologie">Technologie</option>
              <option value="Formation">Formation</option>
              <option value="Actualités">Actualités</option>
            </select>
          )}
        </div>
      </div>

      {/* Actions en lot */}
      {selectedContent.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedContent.length} élément(s) sélectionné(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Publier
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Dépublier
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

      {/* Contenu */}
      {activeTab === 'articles' && renderArticles()}
      {activeTab === 'slides' && renderSlides()}
      {activeTab === 'media' && renderMedia()}
      {activeTab === 'categories' && (
        <div className="text-center py-12">
          <TagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Gestion des catégories - En développement</p>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && renderCreateContentForm()}
      {showEditModal && renderEditContentForm()}
    </div>
  );
};

export default AdminContentManagement;
