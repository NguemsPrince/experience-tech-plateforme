import React, { useState, useEffect } from 'react';
import { 
  DocumentArrowDownIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PhotoIcon,
  ArchiveBoxIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CloudArrowDownIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const CourseMaterials = ({ courseId }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setMaterials([
        {
          _id: 1,
          title: "Guide de démarrage React.js",
          description: "Document complet pour débuter avec React.js",
          type: "pdf",
          size: "2.5 MB",
          downloadUrl: "/downloads/react-guide.pdf",
          previewUrl: "/previews/react-guide.pdf",
          uploadDate: "2024-01-15T10:30:00Z",
          downloads: 125,
          isDownloadable: true
        },
        {
          _id: 2,
          title: "Codes sources des projets",
          description: "Tous les codes sources utilisés dans les projets du cours",
          type: "zip",
          size: "15.2 MB",
          downloadUrl: "/downloads/projects-source-code.zip",
          previewUrl: null,
          uploadDate: "2024-01-14T14:20:00Z",
          downloads: 89,
          isDownloadable: true
        },
        {
          _id: 3,
          title: "Cheat Sheet React Hooks",
          description: "Référence rapide pour les hooks React les plus utilisés",
          type: "pdf",
          size: "1.1 MB",
          downloadUrl: "/downloads/react-hooks-cheatsheet.pdf",
          previewUrl: "/previews/react-hooks-cheatsheet.pdf",
          uploadDate: "2024-01-13T09:15:00Z",
          downloads: 156,
          isDownloadable: true
        },
        {
          _id: 4,
          title: "Liens utiles et ressources",
          description: "Collection de liens vers des ressources externes utiles",
          type: "link",
          size: "N/A",
          downloadUrl: "https://reactjs.org/docs/getting-started.html",
          previewUrl: null,
          uploadDate: "2024-01-12T16:45:00Z",
          downloads: 67,
          isDownloadable: false
        },
        {
          _id: 5,
          title: "Images et icônes du projet",
          description: "Assets graphiques utilisés dans les projets",
          type: "image",
          size: "8.7 MB",
          downloadUrl: "/downloads/project-assets.zip",
          previewUrl: "/previews/project-assets.jpg",
          uploadDate: "2024-01-11T11:30:00Z",
          downloads: 43,
          isDownloadable: true
        }
      ]);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <DocumentTextIcon className="w-6 h-6 text-blue-500" />;
      case 'zip':
      case 'rar':
        return <ArchiveBoxIcon className="w-6 h-6 text-yellow-500" />;
      case 'image':
      case 'jpg':
      case 'png':
      case 'gif':
        return <PhotoIcon className="w-6 h-6 text-green-500" />;
      case 'video':
      case 'mp4':
      case 'avi':
        return <VideoCameraIcon className="w-6 h-6 text-blue-500" />;
      case 'link':
        return <LinkIcon className="w-6 h-6 text-purple-500" />;
      default:
        return <DocumentTextIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (type) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'zip':
        return 'Archive ZIP';
      case 'rar':
        return 'Archive RAR';
      case 'image':
        return 'Image';
      case 'video':
        return 'Vidéo';
      case 'link':
        return 'Lien externe';
      default:
        return type.toUpperCase();
    }
  };

  const formatFileSize = (size) => {
    if (size === 'N/A') return size;
    const bytes = parseFloat(size) * (size.includes('MB') ? 1024 * 1024 : 1024);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (material) => {
    if (material.type === 'link') {
      window.open(material.downloadUrl, '_blank');
    } else {
      // Simulate download
      const link = document.createElement('a');
      link.href = material.downloadUrl;
      link.download = material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update download count
      setMaterials(materials.map(m => 
        m._id === material._id 
          ? { ...m, downloads: m.downloads + 1 }
          : m
      ));
    }
  };

  const handlePreview = (material) => {
    if (material.previewUrl) {
      setSelectedMaterial(material);
      setShowPreview(true);
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = !searchTerm || 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || material.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ressources du cours</h3>
        <p className="text-gray-600">
          Téléchargez les documents, codes sources et ressources supplémentaires
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher des ressources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les types</option>
          <option value="pdf">PDF</option>
          <option value="zip">Archives</option>
          <option value="image">Images</option>
          <option value="video">Vidéos</option>
          <option value="link">Liens</option>
        </select>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div key={material._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Material Header */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="flex-shrink-0">
                {getFileIcon(material.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {material.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {material.description}
                </p>
              </div>
            </div>

            {/* Material Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Type:</span>
                <span className="font-medium">{getFileTypeLabel(material.type)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Taille:</span>
                <span className="font-medium">{formatFileSize(material.size)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Ajouté:</span>
                <span className="font-medium">{formatDate(material.uploadDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Téléchargements:</span>
                <span className="font-medium">{material.downloads}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {material.isDownloadable && (
                <button
                  onClick={() => handleDownload(material)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CloudArrowDownIcon className="w-4 h-4" />
                  <span>Télécharger</span>
                </button>
              )}
              
              {material.previewUrl && (
                <button
                  onClick={() => handlePreview(material)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title="Aperçu"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(material.downloadUrl);
                  alert('Lien copié dans le presse-papiers');
                }}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                title="Partager"
              >
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <DocumentArrowDownIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune ressource trouvée
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? "Aucune ressource ne correspond à vos critères de recherche."
              : "Aucune ressource n'est disponible pour ce cours pour le moment."
            }
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold">{selectedMaterial.title}</h4>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 h-96 overflow-auto">
              {selectedMaterial.type === 'pdf' ? (
                <iframe
                  src={selectedMaterial.previewUrl}
                  className="w-full h-full border-0"
                  title={selectedMaterial.title}
                />
              ) : selectedMaterial.type === 'image' ? (
                <img
                  src={selectedMaterial.previewUrl}
                  alt={selectedMaterial.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Aperçu non disponible pour ce type de fichier
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download Summary */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Résumé des téléchargements</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{materials.length}</div>
            <div className="text-sm text-blue-800">Ressources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {materials.reduce((acc, material) => acc + material.downloads, 0)}
            </div>
            <div className="text-sm text-blue-800">Téléchargements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {materials.filter(m => m.isDownloadable).length}
            </div>
            <div className="text-sm text-blue-800">Téléchargeables</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {materials.filter(m => m.previewUrl).length}
            </div>
            <div className="text-sm text-blue-800">Avec aperçu</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterials;
