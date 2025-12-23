import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import trainingService from '../services/training';
import adminService from '../services/adminService';
import Breadcrumb from '../components/Breadcrumb';

const AddTraining = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Débutant',
    duration: '',
    totalHours: '',
    lessons: '',
    price: '',
    instructor: '',
    maxStudents: '',
    startDate: '',
    language: 'Français',
    image: '',
    introVideo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset video duration when video URL is cleared
    if (name === 'introVideo' && !value) {
      setVideoDuration(null);
      setVideoPreview(null);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, WebP, GIF');
      e.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux. Taille maximale: 10MB');
      e.target.value = '';
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const response = await adminService.uploadCourseFile(file, 'image');
      console.log('Image upload response:', response);
      
      // Handle different response formats
      let fileUrl = null;
      if (response?.data?.url) {
        fileUrl = response.data.url;
      } else if (response?.url) {
        fileUrl = response.url;
      } else if (response?.data?.fileUrl) {
        fileUrl = response.data.fileUrl;
      } else if (typeof response === 'string') {
        fileUrl = response;
      } else if (response?.data && typeof response.data === 'string') {
        fileUrl = response.data;
      }
      
      if (fileUrl) {
        setFormData(prev => ({
          ...prev,
          image: fileUrl
        }));
        toast.success('Image uploadée avec succès !');
      } else {
        console.error('No file URL in response:', response);
        toast.error('Erreur: URL de l\'image non reçue du serveur');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'upload de l\'image';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Type de fichier non autorisé. Formats acceptés: MP4, WebM, OGG, QuickTime');
      e.target.value = '';
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux. Taille maximale: 50MB');
      e.target.value = '';
      return;
    }

    // Validate video duration (max 60 seconds)
    const video = document.createElement('video');
    video.preload = 'metadata';
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;
    
    video.onloadedmetadata = async () => {
      const duration = video.duration;
      
      // Clean up the metadata URL
      window.URL.revokeObjectURL(videoUrl);
      
      // Check if duration is valid
      if (isNaN(duration) || duration === 0) {
        toast.error('Impossible de lire la durée de la vidéo. Veuillez vérifier le fichier.');
        e.target.value = '';
        return;
      }
      
      if (duration > 60) {
        toast.error('La vidéo est trop longue. Durée maximale: 60 secondes');
        e.target.value = '';
        return;
      }

      // Store duration for display
      setVideoDuration(Math.round(duration));

      // Create preview URL (separate from metadata URL)
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      setUploadingVideo(true);
      try {
        const response = await adminService.uploadCourseFile(file, 'video');
        console.log('Video upload response:', response);
        
        // Handle different response formats
        let fileUrl = null;
        if (response?.data?.url) {
          fileUrl = response.data.url;
        } else if (response?.url) {
          fileUrl = response.url;
        } else if (response?.data?.fileUrl) {
          fileUrl = response.data.fileUrl;
        } else if (typeof response === 'string') {
          fileUrl = response;
        } else if (response?.data && typeof response.data === 'string') {
          fileUrl = response.data;
        }
        
        if (fileUrl) {
          setFormData(prev => ({
            ...prev,
            introVideo: fileUrl
          }));
          toast.success(`Vidéo uploadée avec succès ! (${Math.round(duration)}s)`);
        } else {
          console.error('No file URL in response:', response);
          toast.error('Erreur: URL de la vidéo non reçue du serveur');
          window.URL.revokeObjectURL(previewUrl);
          setVideoPreview(null);
          setVideoDuration(null);
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'upload de la vidéo';
        toast.error(errorMessage);
        window.URL.revokeObjectURL(previewUrl);
        setVideoPreview(null);
        setVideoDuration(null);
      } finally {
        setUploadingVideo(false);
      }
    };

    video.onerror = () => {
      toast.error('Erreur lors de la lecture de la vidéo. Veuillez vérifier le fichier.');
      e.target.value = '';
      window.URL.revokeObjectURL(videoUrl);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.price || !formData.duration 
        || !formData.totalHours || !formData.lessons || !formData.startDate || !formData.maxStudents) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare course data with image and video
      const courseData = {
        ...formData,
        image: formData.image || '/images/default-course.jpg',
        introVideo: formData.introVideo ? {
          url: formData.introVideo,
          thumbnail: formData.image || '/images/default-course.jpg'
        } : undefined
      };

      const response = await trainingService.createCourse(courseData);
      if (response.success || response.data) {
        toast.success('Formation créée avec succès !');
        navigate('/admin');
      } else {
        toast.error('Erreur lors de la création de la formation');
      }
    } catch (error) {
      console.error('Create course error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création de la formation';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Admin', path: '/admin' },
              { label: 'Nouvelle formation', path: '#' }
            ]}
          />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Nouvelle formation
          </h1>
          <p className="text-gray-600">
            Créer une nouvelle formation
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la formation *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: React Avancé - Développement d'applications modernes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Décrivez le contenu et les objectifs de la formation..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="web-development">Développement Web</option>
                  <option value="mobile-development">Développement Mobile</option>
                  <option value="data-science">Data Science</option>
                  <option value="ai-ml">IA & Machine Learning</option>
                  <option value="devops">DevOps</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Arabe">Arabe</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructeur *
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Jean Dupont"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 3 jours, 40 heures"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 50000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total heures *
                </label>
                <input
                  type="number"
                  name="totalHours"
                  value={formData.totalHours}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 40"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leçons *
                </label>
                <input
                  type="number"
                  name="lessons"
                  value={formData.lessons}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 25"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max étudiants *
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date début *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de la formation (optionnel)
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                {uploadingImage && (
                  <div className="text-sm text-blue-600 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Upload en cours...
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                {formData.image && !imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Course" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.target.src = '/images/default-course.jpg';
                      }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Ou entrez une URL d'image"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vidéo d'introduction (optionnel, max 60 secondes)
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleVideoUpload}
                  disabled={uploadingVideo}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <p className="text-xs text-gray-500">
                  Formats acceptés: MP4, WebM, OGG, QuickTime • Durée maximale: 60 secondes • Taille max: 50MB
                </p>
                {uploadingVideo && (
                  <div className="text-sm text-blue-600 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Upload en cours...
                  </div>
                )}
                {videoPreview && (
                  <div className="mt-2 space-y-2">
                    <video 
                      src={videoPreview} 
                      controls
                      className="w-full h-48 rounded-lg border border-gray-300"
                    />
                    {videoDuration && (
                      <p className="text-xs text-green-600">
                        ✓ Durée: {videoDuration} secondes
                      </p>
                    )}
                  </div>
                )}
                {formData.introVideo && !videoPreview && (
                  <div className="mt-2">
                    <video 
                      src={formData.introVideo} 
                      controls
                      className="w-full h-48 rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                <input
                  type="text"
                  name="introVideo"
                  value={formData.introVideo}
                  onChange={handleInputChange}
                  placeholder="Ou entrez une URL de vidéo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  'Créer la formation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTraining;