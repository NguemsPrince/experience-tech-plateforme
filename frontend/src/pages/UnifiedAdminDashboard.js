import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CogIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
  CubeIcon,
  ShoppingBagIcon,
  LifebuoyIcon,
  CreditCardIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

// Modern Dashboard Components
import ModernStatsCards from '../components/Dashboard/ModernStatsCards';
import ModernSidebar from '../components/Dashboard/ModernSidebar';
import ModernHeader from '../components/Dashboard/ModernHeader';
import ModernCharts from '../components/Dashboard/ModernCharts';
import QuickActions from '../components/Dashboard/QuickActions';
import RecentActivity from '../components/Dashboard/RecentActivity';
import NotificationPanel from '../components/Dashboard/NotificationPanel';
import Breadcrumb from '../components/Breadcrumb';
import { showErrorToast } from '../utils/errorMessages';
import UserManagement from '../components/Dashboard/UserManagement';
import OrderManagement from '../components/Dashboard/OrderManagement';
import ProductManagement from '../components/Dashboard/ProductManagement';
import TrainingManagement from '../components/Dashboard/TrainingManagement';
import SupportManagement from '../components/Dashboard/SupportManagement';
import SettingsManagement from '../components/Dashboard/SettingsManagement';
import QuoteRequestsManagement from '../components/Dashboard/QuoteRequestsManagement';
import ContactMessagesManagement from '../components/Dashboard/ContactMessagesManagement';
import ChatbotQuestionsManagement from '../components/Dashboard/ChatbotQuestionsManagement';
import JobApplicationsManagement from '../components/Dashboard/JobApplicationsManagement';
import PaymentMethodsManagement from '../components/Dashboard/PaymentMethodsManagement';
import AdvancedAdminFeatures from '../components/Dashboard/AdvancedAdminFeatures';

// Legacy Dashboard Components (to be integrated)
import AdminContentManagement from '../components/AdminContentManagement';
import AdminTrainingManagement from '../components/AdminTrainingManagement';
import AdminSystemSettings from '../components/AdminSystemSettings';
import AdminNotifications from '../components/AdminNotifications';
import AdminStatsCards from '../components/AdminStatsCards';

// Services
import dashboardService from '../services/dashboardService';
import adminService from '../services/adminService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';

function UnifiedAdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // SÉCURITÉ CRITIQUE : Vérifier le token avant tous les hooks useState
  const tokenInStorage = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const hasValidToken = tokenInStorage && 
    tokenInStorage !== 'null' && 
    tokenInStorage !== 'undefined' && 
    tokenInStorage.trim() !== '';

  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    chartData: null,
    activities: null,
    notifications: null
  });

  // SÉCURITÉ CRITIQUE : Vérification d'authentification et de rôle
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      console.warn('🚫 BLOCAGE: Tentative d\'accès au dashboard admin sans authentification');
      navigate('/admin/login', { replace: true });
      return;
    }

    // SÉCURITÉ CRITIQUE : Vérifier explicitement que l'utilisateur a un rôle admin autorisé
    // Bloquer explicitement les rôles client, student et tout autre rôle non-admin
    const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
    if (!user || !allowedAdminRoles.includes(user.role)) {
      console.error('🚫 BLOCAGE: Tentative d\'accès au dashboard admin par un non-admin:', {
        user: user?.email || 'unknown',
        role: user?.role || 'none',
        isAuthenticated,
        hasUser: !!user,
        allowedRoles: allowedAdminRoles
      });
      navigate('/', { replace: true });
      return;
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  // Charger les données du dashboard uniquement si l'utilisateur est authentifié et admin
  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated || !user) {
      return;
    }
    
    // SÉCURITÉ : Vérifier que l'utilisateur a un rôle admin autorisé
    const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
    if (!allowedAdminRoles.includes(user.role)) {
      return;
    }
    
    console.log('✅ Chargement des données du dashboard pour:', user.email);

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Charger toutes les données en parallèle avec gestion d'erreur individuelle
        const results = await Promise.allSettled([
          adminService.getDashboardStats('30days').catch(() => dashboardService.getDashboardStats()),
          dashboardService.getChartData('7days'),
          dashboardService.getRecentActivities(),
          dashboardService.getNotifications()
        ]);
        
        const [stats, chartData, activities, notifications] = results.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.warn(`Erreur lors du chargement des données ${index}:`, result.reason);
            // Retourner des valeurs par défaut selon le type
            if (index === 0) return {}; // stats
            if (index === 1) return []; // chartData
            if (index === 2) return []; // activities
            if (index === 3) return []; // notifications
            return null;
          }
        });

        // Transformer les stats du backend pour correspondre aux attentes des composants
        const transformedStats = stats.data ? {
          revenue: { total: stats.data.revenue?.total || 0 },
          users: {
            total: stats.data.users?.total || 0,
            new: stats.data.users?.new || 0,
            active: stats.data.users?.active || 0,
          },
          orders: {
            total: stats.data.orders?.total || 0,
            pending: stats.data.orders?.pending || 0,
            completed: stats.data.orders?.completed || 0,
          },
          products: {
            total: stats.data.products?.total || 0,
            active: stats.data.products?.active || 0,
            lowStock: stats.data.products?.lowStock || 0,
          },
          courses: {
            total: stats.data.courses?.total || 0,
            active: stats.data.courses?.active || 0,
            enrollments: stats.data.courses?.enrollments || 0,
          },
          support: {
            openTickets: stats.data.support?.openTickets || 0,
            resolvedTickets: stats.data.support?.resolvedTickets || 0,
            pendingQuoteRequests: stats.data.support?.pendingQuoteRequests || 0,
            newContactMessages: stats.data.support?.newContactMessages || 0,
          },
        } : stats;

        setDashboardData({
          stats: transformedStats,
          chartData,
          activities,
          notifications
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
        // Fallback to mock data avec gestion d'erreur individuelle
        try {
          const [stats, chartData, activities, notifications] = await Promise.allSettled([
            dashboardService.getDashboardStats(),
            dashboardService.getChartData('7days'),
            dashboardService.getRecentActivities(),
            dashboardService.getNotifications()
          ]).then(results => results.map(result => 
            result.status === 'fulfilled' ? result.value : (result.reason ? null : [])
          ));
          
          setDashboardData({ 
            stats: stats || {}, 
            chartData: chartData || [], 
            activities: activities || [], 
            notifications: notifications || [] 
          });
        } catch (fallbackError) {
          console.error('Erreur lors du chargement des données de fallback:', fallbackError);
          // Données minimales pour éviter un crash
          setDashboardData({ 
            stats: {}, 
            chartData: [], 
            activities: [], 
            notifications: [] 
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, user, authLoading]);

  // Appliquer le dark mode au document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // SÉCURITÉ CRITIQUE : Vérifications avant le rendu
  if (!hasValidToken) {
    console.error('🚫 [SECURITY] BLOCAGE: Pas de token valide, redirection IMMÉDIATE vers /admin/login');
    return <Navigate to="/admin/login" replace />;
  }
  
  if (authLoading) {
    return <LoadingSpinner size="large" text="Vérification des permissions..." />;
  }

  if (!isAuthenticated) {
    console.error('🚫 [SECURITY] BLOCAGE: Utilisateur non authentifié');
    return <Navigate to="/admin/login" replace />;
  }

  // SÉCURITÉ CRITIQUE : Vérifier le rôle depuis plusieurs sources
  const userRole = user?.role || JSON.parse(localStorage.getItem('user') || '{}')?.role || null;
  // SÉCURITÉ : Seuls admin, super_admin et moderator peuvent accéder
  const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
  const isAdmin = allowedAdminRoles.includes(userRole);
  
  if (!user || !isAdmin) {
    console.error('🚫 [SECURITY] BLOCAGE: Tentative d\'accès admin par un non-admin:', {
      user: user?.email || 'unknown',
      role: userRole || 'none',
      isAuthenticated,
      hasUser: !!user,
      allowedRoles: allowedAdminRoles
    });
    // Rediriger vers le dashboard client au lieu de la page d'accueil
    return <Navigate to="/client" replace />;
  }

  console.log('✅ [SECURITY] Accès autorisé au dashboard pour:', user.email, 'Rôle:', user.role);

  // Gestionnaires d'événements
  const handleQuickAction = async (actionId) => {
    try {
      const result = await dashboardService.executeQuickAction(actionId);
      if (result.success) {
        console.log('Action exécutée avec succès:', result.message);
      }
      } catch (error) {
        console.error('Erreur lors de l\'exécution de l\'action:', error);
        const errorMessage = showErrorToast(error, 'Erreur lors de l\'exécution de l\'action');
        toast.error(errorMessage);
      }
  };

  const handleSearch = async (query) => {
    if (query.trim()) {
      try {
        const results = await dashboardService.searchDashboard(query);
        console.log('Résultats de recherche:', results);
        
        // Si des résultats sont trouvés, afficher une notification
        if (results && (results.length > 0 || Object.keys(results).length > 0)) {
          toast.success(`${Object.keys(results).reduce((sum, key) => sum + (results[key]?.length || 0), 0)} résultat(s) trouvé(s)`);
        } else {
          toast.info('Aucun résultat trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        const errorMessage = showErrorToast(error, 'Erreur lors de la recherche');
        toast.error(errorMessage);
      }
    }
  };

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    // Fermer la sidebar sur mobile après sélection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleAddClick = () => {
    // Ouvrir un menu contextuel ou rediriger selon la vue active
    switch (activeView) {
      case 'users':
        navigate('/admin/add-user');
        break;
      case 'products':
        // Le composant ProductManagement gère son propre bouton
        break;
      case 'training':
        // Le composant TrainingManagement gère son propre bouton
        break;
      case 'orders':
        // Pas d'ajout pour les commandes
        break;
      default:
        // Pour le dashboard, ouvrir un menu de sélection rapide
        const action = window.confirm('Que souhaitez-vous ajouter ?\n\nOK = Utilisateur\nAnnuler = Produit');
        if (action) {
          navigate('/admin/add-user');
        } else {
          setActiveView('products');
        }
        break;
    }
  };

  // Configuration des éléments de la sidebar unifiée
  const sidebarItems = [
    { id: 'dashboard', name: t('admin.dashboard.title') || t('admin.dashboard') || 'Dashboard', icon: ChartBarIcon, active: true },
    { id: 'users', name: t('admin.users') || 'Utilisateurs', icon: UsersIcon },
    { id: 'orders', name: t('admin.orders') || 'Commandes', icon: ShoppingBagIcon },
    { id: 'payment-methods', name: t('admin.paymentMethods') || 'Moyens de paiement', icon: CreditCardIcon },
    { id: 'products', name: t('admin.products') || 'Produits', icon: CubeIcon },
    { id: 'training', name: t('admin.training') || 'Formations', icon: AcademicCapIcon },
    { id: 'content', name: t('admin.content') || 'Contenu', icon: DocumentTextIcon },
    { id: 'quotes', name: t('admin.quotes') || 'Demandes de devis', icon: EnvelopeIcon },
    { id: 'messages', name: t('admin.messages') || 'Messages de contact', icon: ChatBubbleLeftRightIcon },
    { id: 'chatbot-questions', name: t('admin.chatbotQuestions') || 'Questions Chatbot', icon: QuestionMarkCircleIcon },
    { id: 'job-applications', name: t('admin.jobApplications') || 'Candidatures', icon: BriefcaseIcon },
    { id: 'support', name: t('admin.support') || 'Support', icon: LifebuoyIcon },
    { id: 'notifications', name: t('admin.notifications') || 'Notifications', icon: BellIcon },
    { id: 'advanced', name: 'Fonctions avancées', icon: CommandLineIcon },
    { id: 'settings', name: t('admin.settings') || 'Paramètres', icon: CogIcon }
  ];

  // Si on charge les données, afficher un loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse" />
          </div>
          <SkeletonLoader type="dashboard" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
      {/* Modern Sidebar */}
      <ModernSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        items={sidebarItems}
        activeView={activeView}
        onViewChange={handleViewChange}
        darkMode={darkMode}
        user={user}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 max-w-[100vw] overflow-x-hidden ${
        sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'
      }`}>
        {/* Modern Header */}
        <ModernHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onDarkModeToggle={() => setDarkMode(!darkMode)}
          darkMode={darkMode}
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            handleSearch(query);
          }}
          onNotificationsClick={() => setNotificationsOpen(!notificationsOpen)}
          notificationsCount={dashboardData.notifications?.filter(n => n.unread).length || 0}
          onAddClick={handleAddClick}
        />

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Breadcrumb Navigation */}
          <Breadcrumb 
            items={[
              { label: 'Admin', path: '/admin' },
              { label: sidebarItems.find(item => item.id === activeView)?.name || 'Dashboard', path: '#' }
            ]}
            darkMode={darkMode}
          />

          {/* Vue Dashboard - Vue d'ensemble */}
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {t('admin.dashboard.title') || t('admin.dashboard') || 'Dashboard'}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
                      {t('admin.dashboardDescription') || t('admin.dashboard.welcome') || 'Centre de contrôle complet de la plateforme'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.hello') || 'Bonjour'},</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.firstName || 'Admin'}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{user?.firstName?.[0]?.toUpperCase() || 'A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <ModernStatsCards 
                darkMode={darkMode} 
                stats={dashboardData.stats}
              />

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ModernCharts 
                  darkMode={darkMode} 
                  chartData={dashboardData.chartData}
                />
                <RecentActivity 
                  darkMode={darkMode} 
                  activities={dashboardData.activities}
                />
              </div>

              {/* Quick Actions */}
              <QuickActions 
                darkMode={darkMode} 
                onActionClick={handleQuickAction}
              />
            </motion.div>
          )}

          {/* Vue Utilisateurs */}
          {activeView === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserManagement darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Commandes */}
          {activeView === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OrderManagement darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Produits */}
          {activeView === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductManagement darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Formations - Utiliser AdminTrainingManagement (plus complet) */}
          {activeView === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={darkMode ? 'dark' : ''}
            >
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
                <AdminTrainingManagement />
              </div>
            </motion.div>
          )}

          {/* Vue Contenu - Depuis le legacy dashboard */}
          {activeView === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={darkMode ? 'dark' : ''}
            >
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
                <AdminContentManagement />
              </div>
            </motion.div>
          )}

          {/* Vue Demandes de devis */}
          {activeView === 'quotes' && (
            <motion.div
              key="quotes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuoteRequestsManagement darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Messages de contact */}
          {activeView === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ContactMessagesManagement darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Questions Chatbot */}
          {activeView === 'chatbot-questions' && (
            <motion.div
              key="chatbot-questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatbotQuestionsManagement darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Candidatures */}
          {activeView === 'job-applications' && (
            <motion.div
              key="job-applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <JobApplicationsManagement darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Support */}
          {activeView === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SupportManagement darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Notifications */}
          {activeView === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdminNotifications darkMode={darkMode} />
            </motion.div>
          )}

          {/* Vue Moyens de paiement */}
          {activeView === 'payment-methods' && (
            <motion.div
              key="payment-methods"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={darkMode ? 'dark' : ''}
            >
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl shadow-xl overflow-hidden p-6`}>
                <PaymentMethodsManagement darkMode={darkMode} />
              </div>
            </motion.div>
          )}

          {/* Vue Fonctions avancées */}
          {activeView === 'advanced' && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={darkMode ? 'dark' : ''}
            >
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl shadow-xl overflow-hidden p-6`}>
                <AdvancedAdminFeatures darkMode={darkMode} />
              </div>
            </motion.div>
          )}

          {/* Vue Paramètres - Utiliser AdminSystemSettings (plus complet) */}
          {activeView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={darkMode ? 'dark' : ''}
            >
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
                <AdminSystemSettings />
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        darkMode={darkMode}
        notifications={dashboardData.notifications}
      />

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddClick();
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 z-40 min-w-[56px] min-h-[56px] touch-target"
        aria-label="Action rapide"
        type="button"
      >
        <PlusIcon className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

export default UnifiedAdminDashboard;

