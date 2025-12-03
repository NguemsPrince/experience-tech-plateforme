import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  TrophyIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  DocumentArrowDownIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationContext';
import trainingService from '../services/training';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import VideoPlayer from '../components/VideoPlayer';
import CourseDiscussion from '../components/CourseDiscussion';
import CourseReviews from '../components/CourseReviews';
import CourseMaterials from '../components/CourseMaterials';
import CourseProgress from '../components/CourseProgress';

const CourseDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  
  // State management
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated) {
      fetchEnrollment();
    }
  }, [id, isAuthenticated]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await trainingService.getCourseById(id);
      setCourse(response.data.course);
      
      // Set first lesson as current if enrolled
      if (response.data.course.curriculum && response.data.course.curriculum.length > 0) {
        const firstSection = response.data.course.curriculum[0];
        if (firstSection.lessons && firstSection.lessons.length > 0) {
          setCurrentLesson(firstSection.lessons[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      // Fallback to mock data
      setCourse({
        _id: id,
        title: 'Formation React.js Complète',
        description: 'Maîtrisez React.js de A à Z avec des projets pratiques et des exercices concrets. Cette formation complète vous permettra de devenir un développeur React expert.',
        shortDescription: 'Maîtrisez React.js de A à Z avec des projets pratiques',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3',
        duration: '4 semaines',
        price: 75000,
        originalPrice: 95000,
        level: 'Intermédiaire',
        instructor: { 
          name: 'Jean Paul Mballa',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
          bio: 'Développeur senior avec 10 ans d\'expérience en React.js',
          experience: '10 ans d\'expérience'
        },
        startDate: '2024-02-15',
        maxStudents: 15,
        rating: { average: 4.8, count: 120 },
        studentsCount: 120,
        category: 'Développement Web',
        lessons: 45,
        totalHours: 28,
        language: 'Français',
        lastUpdated: '2024-01-15',
        isBestSeller: true,
        isNew: false,
        tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Redux'],
        requirements: [
          'Connaissances de base en JavaScript',
          'HTML et CSS',
          'Un ordinateur avec accès internet'
        ],
        whatYouWillLearn: [
          'Maîtriser les fondamentaux de React.js',
          'Créer des composants réutilisables',
          'Gérer l\'état avec useState et useEffect',
          'Implémenter le routage avec React Router',
          'Intégrer des APIs avec Axios',
          'Déployer une application React'
        ],
        curriculum: [
          {
            section: 'Introduction à React',
            lessons: [
              {
                title: 'Qu\'est-ce que React ?',
                duration: '15:30',
                type: 'video',
                isPreview: true,
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
              },
              {
                title: 'Installation et configuration',
                duration: '22:45',
                type: 'video',
                isPreview: false,
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
              },
              {
                title: 'Votre premier composant',
                duration: '18:20',
                type: 'video',
                isPreview: false,
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'
              }
            ]
          },
          {
            section: 'Composants et Props',
            lessons: [
              {
                title: 'Créer des composants fonctionnels',
                duration: '25:10',
                type: 'video',
                isPreview: false
              },
              {
                title: 'Passer des données avec les props',
                duration: '20:35',
                type: 'video',
                isPreview: false
              },
              {
                title: 'Quiz : Composants et Props',
                duration: '10:00',
                type: 'quiz',
                isPreview: false
              }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollment = async () => {
    try {
      const response = await trainingService.getEnrollmentByCourse(id);
      setEnrollment(response.data.enrollment);
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      // Don't show error for 404 (user not enrolled) - this is normal
      if (error.response && error.response.status !== 404) {
        console.warn('Non-404 error fetching enrollment:', error.response.status);
      }
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await trainingService.enrollInCourse(id);
      await fetchEnrollment();
      
      // Show success notifications
      toast.success('Inscription réussie ! Bienvenue dans ce cours.');
      addNotification({
        type: 'success',
        title: 'Inscription confirmée !',
        message: `Vous êtes maintenant inscrit au cours "${course?.title || 'cours'}". Bon apprentissage !`
      });
    } catch (error) {
      // Fallback simulation for demo purposes
      if (error.response && (error.response.status === 500 || error.response.status === 0)) {
        console.log('API unavailable, simulating enrollment...');
        
        // Simulate enrollment
        setEnrollment({
          _id: `demo_${Date.now()}`,
          user: user._id,
          course: course._id,
          status: 'enrolled',
          enrollmentDate: new Date(),
          progress: 0
        });
        
        toast.success('Inscription simulée réussie ! (Mode démo)');
        addNotification({
          type: 'success',
          title: 'Inscription confirmée ! (Mode démo)',
          message: `Vous êtes maintenant inscrit au cours "${course?.title || 'cours'}". Bon apprentissage !`
        });
        return;
      }
      console.error('Error enrolling in course:', error);
      
      let errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      
      // Handle specific error cases
      if (error.response) {
        // Le serveur a répondu - erreur serveur spécifique
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || 'Vous êtes déjà inscrit à ce cours.';
            break;
          case 404:
            errorMessage = error.response.data?.message || 'Cours non trouvé.';
            break;
          case 401:
            errorMessage = 'Veuillez vous reconnecter.';
            navigate('/login');
            return;
          case 403:
            errorMessage = error.response.data?.message || 'Accès refusé.';
            break;
          case 500:
            errorMessage = error.response.data?.message || 'Erreur serveur. Veuillez réessayer plus tard.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (!error.response) {
        // Erreur réseau - apiEnhanced affiche déjà le toast pour les POST
        // Ne pas afficher de toast supplémentaire ici pour éviter le doublon
        const isNetworkError = error.code === 'ECONNREFUSED' || 
                              error.code === 'ERR_NETWORK' || 
                              error.message?.includes('Network Error') ||
                              error.message?.includes('Failed to fetch');
        
        if (isNetworkError) {
          // apiEnhanced affiche déjà le toast pour les erreurs réseau sur les POST
          // On affiche seulement la notification dans l'UI (pas de toast)
          addNotification({
            type: 'error',
            title: 'Échec de l\'inscription',
            message: 'Impossible de se connecter au serveur. Vérifiez votre connexion ou réessayez plus tard.'
          });
          return; // Ne pas continuer pour éviter le double affichage du toast
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      // Show error notifications (toast + notification pour les erreurs serveur spécifiques)
      toast.error(errorMessage);
      addNotification({
        type: 'error',
        title: 'Échec de l\'inscription',
        message: errorMessage
      });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
  };

  const getDiscountPercentage = () => {
    if (course?.originalPrice && course.originalPrice > course.price) {
      return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cours non trouvé</h2>
        <p className="text-gray-600 mb-6">Le cours que vous recherchez n'existe pas.</p>
        <button
          onClick={() => navigate('/training')}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Retour aux formations
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.title} - Expérience Tech</title>
        <meta name="description" content={course.shortDescription} />
      </Helmet>

      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/training')}
                className={`flex items-center text-sm hover:underline ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Retour aux formations
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleFavorite}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ShareIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Header */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    {course.category}
                  </span>
                  {course.isBestSeller && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                      Best Seller
                    </span>
                  )}
                  {course.isNew && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      Nouveau
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <StarSolidIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    {course.rating.average} ({course.rating.count} avis)
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    {course.studentsCount} étudiants
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {course.totalHours}h total
                  </div>
                  <div className="flex items-center">
                    <VideoCameraIcon className="w-4 h-4 mr-1" />
                    {course.lessons} leçons
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{course.instructor.name}</p>
                    <p className="text-sm text-gray-600">{course.instructor.experience}</p>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              {currentLesson && (
                <div className="bg-black rounded-lg overflow-hidden">
                  <VideoPlayer
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    playbackRate={playbackRate}
                    volume={volume}
                    isMuted={isMuted}
                    showSubtitles={showSubtitles}
                    onPlaybackRateChange={setPlaybackRate}
                    onVolumeChange={setVolume}
                    onMuteToggle={setIsMuted}
                    onSubtitlesToggle={setShowSubtitles}
                  />
                </div>
              )}

              {/* Course Navigation Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Aperçu', icon: BookOpenIcon },
                    { id: 'curriculum', label: 'Programme', icon: DocumentTextIcon },
                    { id: 'discussions', label: 'Discussions', icon: ChatBubbleLeftRightIcon },
                    { id: 'reviews', label: 'Avis', icon: StarIcon },
                    { id: 'materials', label: 'Ressources', icon: DocumentArrowDownIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-3">À propos de ce cours</h3>
                      <p className="text-gray-600 leading-relaxed">{course.description}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3">Ce que vous apprendrez</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3">Prérequis</h3>
                      <ul className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <CourseProgress
                    course={course}
                    enrollment={enrollment}
                    onLessonClick={handleLessonClick}
                    currentLesson={currentLesson}
                  />
                )}

                {activeTab === 'discussions' && (
                  <CourseDiscussion courseId={course._id} />
                )}

                {activeTab === 'reviews' && (
                  <CourseReviews courseId={course._id} />
                )}

                {activeTab === 'materials' && (
                  <CourseMaterials courseId={course._id} />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Card */}
              <div className={`border rounded-lg p-6 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {course.price.toLocaleString()} FCFA
                  </div>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg text-gray-500 line-through">
                        {course.originalPrice.toLocaleString()} FCFA
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                        -{getDiscountPercentage()}%
                      </span>
                    </div>
                  )}
                </div>

                {enrollment ? (
                  <div className="space-y-3">
                    <CourseProgress
                      course={course}
                      enrollment={enrollment}
                      onLessonClick={handleLessonClick}
                      currentLesson={currentLesson}
                      compact={true}
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    S'inscrire maintenant
                  </button>
                )}

                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between py-2">
                    <span>Durée</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Niveau</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Langue</span>
                    <span>{course.language}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Accès</span>
                    <span>À vie</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Ce cours comprend :</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <VideoCameraIcon className="w-4 h-4 mr-2 text-green-500" />
                      {course.totalHours}h de vidéo
                    </li>
                    <li className="flex items-center">
                      <DocumentTextIcon className="w-4 h-4 mr-2 text-green-500" />
                      {course.lessons} leçons
                    </li>
                    <li className="flex items-center">
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-green-500" />
                      Ressources téléchargeables
                    </li>
                    <li className="flex items-center">
                      <TrophyIcon className="w-4 h-4 mr-2 text-green-500" />
                      Certificat de fin
                    </li>
                    <li className="flex items-center">
                      <GlobeAltIcon className="w-4 h-4 mr-2 text-green-500" />
                      Accès mobile et desktop
                    </li>
                  </ul>
                </div>
              </div>

              {/* Instructor Card */}
              <div className={`border rounded-lg p-6 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <h3 className="font-bold mb-4">Votre instructeur</h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{course.instructor.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{course.instructor.experience}</p>
                    <p className="text-sm text-gray-600">{course.instructor.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
