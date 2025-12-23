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
import CourseCurriculumSidebar from '../components/CourseCurriculumSidebar';
import PaymentModal from '../components/PaymentModal';
import settingsService from '../services/settingsService';
import CourseCard from '../components/CourseCard';

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [showCurriculumSidebar, setShowCurriculumSidebar] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated) {
      fetchEnrollment();
    }
    loadPaymentSettings();
  }, [id, isAuthenticated]);

  const loadPaymentSettings = async () => {
    try {
      const response = await settingsService.getPaymentSettings();
      if (response && response.data) {
        setPaymentSettings(response.data.payment);
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  };

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
      
      // Charger les leçons complétées
      if (response.data.enrollment) {
        try {
          const detailsResponse = await trainingService.getEnrollmentDetails(id);
          if (detailsResponse.data?.completedLessonsIds) {
            setCompletedLessons(new Set(detailsResponse.data.completedLessonsIds));
          }
          // Restaurer la leçon actuelle si disponible
          if (detailsResponse.data?.currentLesson) {
            const currentLessonData = detailsResponse.data.currentLesson;
            // Trouver la leçon dans le curriculum
            if (course?.curriculum) {
              for (const section of course.curriculum) {
                if (section.lessons) {
                  const foundLesson = section.lessons.find(
                    l => (l._id && l._id.toString() === currentLessonData.lessonId) ||
                         l.title === currentLessonData.lessonId ||
                         l.title === currentLessonData.lessonTitle
                  );
                  if (foundLesson) {
                    setCurrentLesson(foundLesson);
                    break;
                  }
                }
              }
            }
          }
        } catch (detailsError) {
          console.error('Error fetching enrollment details:', detailsError);
        }
      }
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      // Don't show error for 404 (user not enrolled) - this is normal
      if (error.response && error.response.status !== 404) {
        console.warn('Non-404 error fetching enrollment:', error.response.status);
      }
    }
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Ouvrir le modal de paiement au lieu d'inscrire directement
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    // Après paiement réussi, inscrire l'utilisateur
    try {
      await trainingService.enrollInCourse(id);
      await fetchEnrollment();
      toast.success('Paiement effectué et inscription confirmée !');
      addNotification({
        type: 'success',
        title: 'Inscription confirmée !',
        message: `Vous êtes maintenant inscrit au cours "${course?.title || 'cours'}". Bon apprentissage !`
      });
    } catch (error) {
      console.error('Error enrolling after payment:', error);
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

  const handleLessonClick = async (lesson) => {
    // Vérifier si la leçon est accessible
    if (!enrollment && !lesson.isPreview) {
      toast.error('Cette leçon nécessite l\'achat du cours. Veuillez acheter le cours pour y accéder.');
      setShowPaymentModal(true);
      return;
    }
    
    // Charger la leçon depuis le backend pour vérifier l'accès
    try {
      const lessonId = lesson._id?.toString() || lesson.title;
      const response = await trainingService.getLesson(id, lessonId);
      if (response.data?.lesson) {
        setCurrentLesson(response.data.lesson);
        
        // Si l'utilisateur est inscrit, sauvegarder la progression
        if (enrollment && response.data.lesson.videoUrl) {
          // La progression vidéo sera sauvegardée par le VideoPlayer
        }
      }
    } catch (error) {
      // Si erreur 403, c'est normal - la leçon est verrouillée
      if (error.response?.status === 403) {
        toast.error('Cette leçon nécessite l\'achat du cours.');
        setShowPaymentModal(true);
      } else {
        // Sinon, utiliser la leçon locale
        setCurrentLesson(lesson);
      }
    }
  };

  // Trouver la première leçon d'échantillon ou la première leçon si inscrit
  const getPreviewLesson = () => {
    if (!course?.curriculum) return null;
    
    for (const section of course.curriculum) {
      if (section.lessons) {
        for (const lesson of section.lessons) {
          if (lesson.isPreview || enrollment) {
            return lesson;
          }
        }
      }
    }
    return null;
  };

  // Charger la leçon d'échantillon au chargement si non inscrit
  useEffect(() => {
    if (course && !enrollment && !currentLesson) {
      const previewLesson = getPreviewLesson();
      if (previewLesson) {
        setCurrentLesson(previewLesson);
      }
    }
  }, [course, enrollment]);

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
                  onClick={() => setShowCurriculumSidebar(!showCurriculumSidebar)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                  title="Afficher/Masquer le programme"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFavorite}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-5 h-5 text-blue-500" />
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

        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Curriculum Sidebar (Left) - Style Udemy */}
            {showCurriculumSidebar && (
              <div className="lg:col-span-3 order-2 lg:order-1">
                <CourseCurriculumSidebar
                  course={course}
                  enrollment={enrollment}
                  currentLesson={currentLesson}
                  onLessonClick={handleLessonClick}
                  completedLessons={completedLessons}
                  onLessonComplete={async (lessonId) => {
                    try {
                      await trainingService.completeLesson(id, lessonId);
                      setCompletedLessons(prev => new Set([...prev, lessonId]));
                      toast.success('Leçon marquée comme complétée !');
                    } catch (error) {
                      console.error('Error completing lesson:', error);
                    }
                  }}
                />
              </div>
            )}

            {/* Main Content */}
            <div className={`${showCurriculumSidebar ? 'lg:col-span-6' : 'lg:col-span-9'} order-1 lg:order-2 space-y-8`}>
              {/* Course Header */}
              <div>
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <button onClick={() => navigate('/training')} className="hover:text-blue-600 transition-colors">Cours</button>
                  <span>/</span>
                  <span className="text-gray-400">{course.category}</span>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{course.title}</span>
                </nav>

                {/* Badges du cours - Style Mahrasoft */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {course.category}
                  </span>
                  {course.isBestSeller && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      Best Seller
                    </span>
                  )}
                  {course.isNew && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      Nouveau
                    </span>
                  )}
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Accès à Vie
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Support 24/7
                  </span>
                  {course.isFeatured && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      Cours Vedette
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{course.title}</h1>
                
                {/* Statistiques du cours - Style Mahrasoft */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <StarSolidIcon className="w-5 h-5 text-yellow-400 mr-1.5" />
                    <span className="font-semibold text-gray-900">{course.rating?.average || 0}</span>
                    <span className="text-gray-500 ml-1">({course.rating?.count || 0} avis)</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-gray-400 mr-1.5" />
                    <span>{course.studentsCount || 0} Étudiants inscrits</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-gray-400 mr-1.5" />
                    <span>{course.totalHours || 0}h {course.totalHours ? 'de contenu' : '0m'}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="w-5 h-5 text-gray-400 mr-1.5" />
                    <span>{course.lessons || 0} Leçons</span>
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="w-5 h-5 text-gray-400 mr-1.5" />
                    <span className="font-medium">{course.level || 'Tous niveaux'}</span>
                  </div>
                </div>

                {/* Tags du cours */}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-sm font-medium text-gray-700">Tags:</span>
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Formateur - Style Mahrasoft */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <img
                    src={course.instructor?.image || '/images/default-instructor.jpg'}
                    alt={course.instructor?.name || 'Formateur'}
                    className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{course.instructor?.name || 'Formateur'}</p>
                    <p className="text-sm text-gray-600 mb-1">{course.instructor?.experience || 'Instructor'}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{course.studentsCount || 0} Étudiants</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <StarSolidIcon className="w-3 h-3 text-yellow-400 mr-1" />
                        {course.instructor?.rating || 4.8} Note moyenne
                      </span>
                      <span>•</span>
                      <span>{course.instructor?.coursesCount || 5}+ Cours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              {currentLesson ? (
                <div className="bg-black rounded-lg overflow-hidden relative">
                  {!enrollment && !currentLesson.isPreview && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
                      <div className="text-center text-white p-8">
                        <LockClosedIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-2xl font-bold mb-2">Cette leçon est verrouillée</h3>
                        <p className="text-gray-300 mb-6">Achetez le cours pour accéder à toutes les leçons</p>
                        <button
                          onClick={() => setShowPaymentModal(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Acheter le cours
                        </button>
                      </div>
                    </div>
                  )}
                  {currentLesson.isPreview && !enrollment && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Échantillon gratuit
                      </span>
                    </div>
                  )}
                  <VideoPlayer
                    src={currentLesson.videoUrl || course.introVideo?.url}
                    title={currentLesson.title}
                    courseId={id}
                    lessonId={currentLesson._id?.toString() || currentLesson.title}
                    onProgressSave={async (courseId, lessonId, videoTime) => {
                      if (enrollment) {
                        try {
                          await trainingService.saveVideoProgress(courseId, lessonId, videoTime);
                        } catch (error) {
                          console.error('Error saving video progress:', error);
                        }
                      }
                    }}
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
              ) : course.introVideo?.url ? (
                <div className="bg-black rounded-lg overflow-hidden relative">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Vidéo d'introduction
                    </span>
                  </div>
                  <VideoPlayer
                    src={course.introVideo.url}
                    title="Introduction au cours"
                    courseId={id}
                    lessonId="intro"
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
              ) : (
                <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <PlayIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400">Aucune vidéo disponible</p>
                  </div>
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
                      <h3 className="text-xl font-bold mb-4 text-gray-900">Ce Que Vous Allez Apprendre</h3>
                      {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                          <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">Les compétences à acquérir seront bientôt disponibles.</p>
                        </div>
                      )}
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
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">Programme du Cours</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {course.curriculum?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0} leçons • {course.totalHours || 0}h {course.totalHours ? '' : '0m'}
                      </p>
                      {!enrollment && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-800 text-center">
                            <LockClosedIcon className="w-4 h-4 inline mr-2" />
                            Inscrivez-vous pour accéder à toutes les leçons
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="lg:hidden">
                      <CourseProgress
                        course={course}
                        enrollment={enrollment}
                        onLessonClick={handleLessonClick}
                        currentLesson={currentLesson}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'discussions' && (
                  <CourseDiscussion courseId={course._id} />
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <CourseReviews courseId={course._id} />
                    {!enrollment && (
                      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                        <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">Inscrivez-vous pour donner votre avis</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Rejoignez ce cours et partagez votre expérience avec la communauté.
                        </p>
                        <button
                          onClick={handleEnroll}
                          className="btn-modern-primary"
                        >
                          Rejoindre la Formation
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'materials' && (
                  <CourseMaterials courseId={course._id} />
                )}
              </div>
            </div>

            {/* Purchase Sidebar (Right) - Style Mahrasoft */}
            <div className={`${showCurriculumSidebar ? 'lg:col-span-3' : 'lg:col-span-3'} order-3`}>
              <div className="sticky top-24 space-y-6">
              {/* Course Card - Style Mahrasoft */}
              <div className="card-modern border-2 border-gray-200 shadow-xl">
                {enrollment ? (
                  <div className="p-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
                        <div>
                          <p className="font-bold text-green-900 text-lg">Vous êtes inscrit à ce cours</p>
                          <p className="text-sm text-green-700 mt-1">Accédez à toutes les leçons et ressources d'apprentissage.</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/my-courses`)}
                      className="w-full btn-modern-primary py-3 text-base"
                    >
                      Accéder au Cours
                    </button>
                  </div>
                ) : (
                  <div className="p-6">
                    {/* Prix */}
                    <div className="mb-6">
                      <div className="flex items-baseline space-x-2 mb-2">
                        <span className="text-4xl font-bold text-blue-600">
                          {course.price.toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-600">FCFA</span>
                        <span className="text-sm text-gray-500">/ à vie</span>
                      </div>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg text-gray-500 line-through">
                            {course.originalPrice.toLocaleString()} FCFA
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                            -{getDiscountPercentage()}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Boutons d'action */}
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={handleEnroll}
                        className="w-full btn-modern-primary py-3.5 text-base font-bold"
                      >
                        Rejoindre la Formation
                      </button>
                      <button
                        onClick={() => {
                          toast.success('Cours ajouté au panier');
                        }}
                        className="w-full btn-modern-outline py-3.5 text-base"
                      >
                        Ajouter au panier
                      </button>
                    </div>

                    {/* Liste des avantages - Style Mahrasoft */}
                    <div className="border-t border-gray-200 pt-6 mb-6">
                      <h4 className="font-bold text-gray-900 mb-4">Ce cours comprend :</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Accès à vie au cours</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{course.lessons || 0} leçons complètes</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Accès sur mobile et TV</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Support de la communauté</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Mises à jour gratuites</span>
                        </li>
                        {course.certificate && (
                          <li className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Certificat de fin de formation</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Garantie */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                      <p className="text-xs text-center text-blue-800 font-medium">
                        <TrophyIcon className="w-4 h-4 inline mr-1" />
                        Garantie de remboursement de 30 jours
                      </p>
                    </div>
                  </div>
                )}

                {/* Informations du cours - Style Mahrasoft */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-900 mb-4">Informations du Cours</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Niveau:</span>
                      <span className="text-gray-900 font-semibold">{course.level || 'Tous niveaux'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Étudiants:</span>
                      <span className="text-gray-900 font-semibold">{course.studentsCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Langue:</span>
                      <span className="text-gray-900 font-semibold">{course.language || 'Français'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Leçons:</span>
                      <span className="text-gray-900 font-semibold">{course.lessons || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Durée:</span>
                      <span className="text-gray-900 font-semibold">{course.totalHours || 0}h {course.totalHours ? '' : '0m'}</span>
                    </div>
                  </div>
                </div>

                {/* Partage du cours */}
                <div className="border-t border-gray-200 p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Partager ce Cours</h4>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: course.title,
                            text: course.shortDescription,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Lien copié dans le presse-papier');
                        }
                      }}
                      className="flex-1 btn-modern-secondary py-2 text-sm"
                    >
                      <ShareIcon className="w-4 h-4 inline mr-2" />
                      Partager
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructor Card - Style Mahrasoft */}
              <div className="card-modern">
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-4 text-gray-900">Votre Formateur</h3>
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={course.instructor?.image || '/images/default-instructor.jpg'}
                      alt={course.instructor?.name || 'Formateur'}
                      className="w-20 h-20 rounded-full border-2 border-gray-200 shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{course.instructor?.name || 'Formateur'}</h4>
                      <p className="text-sm text-gray-600 mb-2">{course.instructor?.experience || 'Instructor'}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <span className="flex items-center">
                          <UserIcon className="w-3 h-3 mr-1" />
                          {course.instructor?.studentsCount || course.studentsCount || 0} Étudiants
                        </span>
                        <span className="flex items-center">
                          <StarSolidIcon className="w-3 h-3 text-yellow-400 mr-1" />
                          {course.instructor?.rating || 4.8} Note Moyenne
                        </span>
                        <span>{course.instructor?.coursesCount || 5}+ Cours</span>
                      </div>
                    </div>
                  </div>
                  {course.instructor?.bio && (
                    <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        item={{
          ...course,
          type: 'course',
          price: course?.price || 0,
          title: course?.title || 'Formation'
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Cours Similaires - Style Mahrasoft */}
      {course && (
        <SimilarCoursesSection 
          courseId={course._id} 
          category={course.category} 
          currentCourseTitle={course.title} 
        />
      )}
    </>
  );
};

// Composant pour les cours similaires
const SimilarCoursesSection = ({ courseId, category, currentCourseTitle }) => {
  const [similarCourses, setSimilarCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilarCourses = async () => {
      try {
        setLoading(true);
        const response = await trainingService.getAllCourses({ category, limit: 4 });
        if (response.data && response.data.courses) {
          // Filtrer le cours actuel
          const filtered = response.data.courses
            .filter(c => c._id !== courseId && c.title !== currentCourseTitle)
            .slice(0, 3);
          setSimilarCourses(filtered);
        }
      } catch (error) {
        console.error('Error fetching similar courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchSimilarCourses();
    }
  }, [courseId, category, currentCourseTitle]);

  if (loading || similarCourses.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Cours Similaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarCourses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
