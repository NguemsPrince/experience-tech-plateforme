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
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import ModernStatsCards from '../components/Dashboard/ModernStatsCards';
import ModernSidebar from '../components/Dashboard/ModernSidebar';
import ModernHeader from '../components/Dashboard/ModernHeader';
import ModernCharts from '../components/Dashboard/ModernCharts';
import QuickActions from '../components/Dashboard/QuickActions';
import RecentActivity from '../components/Dashboard/RecentActivity';
import NotificationPanel from '../components/Dashboard/NotificationPanel';
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
import dashboardService from '../services/dashboardService';
import adminService from '../services/adminService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';

function ModernAdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // SÉCURITÉ CRITIQUE : Vérifier IMMÉDIATEMENT le token AVANT tous les hooks useState
  // Cette vérification doit bloquer l'accès dès le premier rendu si pas de token
  const tokenInStorage = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const hasValidToken = tokenInStorage && 
    tokenInStorage !== 'null' && 
    tokenInStorage !== 'undefined' && 
    tokenInStorage.trim() !== '';

  // SÉCURITÉ CRITIQUE : Si pas de token, rediriger IMMÉDIATEMENT (même avant les hooks)
  // Mais on doit respecter les règles des hooks React, donc on le fait après les hooks useAuth
  // mais avant les useState

  // Tous les hooks doivent être appelés en premier (règle des hooks React)
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

  // SÉCURITÉ CRITIQUE : Vérification supplémentaire dans useEffect pour les changements dynamiques
  // Cette vérification est une double vérification après ProtectedRoute
  // IMPORTANT: Ce useEffect doit être appelé AVANT les early returns pour respecter les règles des hooks
  useEffect(() => {
    // Ne pas vérifier pendant le chargement
    if (authLoading) {
      return;
    }

    // Si l'utilisateur n'est pas authentifié, rediriger immédiatement
    if (!isAuthenticated) {
      console.warn('🚫 BLOCAGE: Tentative d\'accès au dashboard admin sans authentification');
      navigate('/admin/login', { replace: true });
      return;
    }

    // Si l'utilisateur n'a pas le rôle admin, rediriger immédiatement vers la page d'accueil
    // SÉCURITÉ : Seuls admin, super_admin et moderator peuvent accéder
    const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
    if (!user || !allowedAdminRoles.includes(user.role)) {
      console.error('🚫 BLOCAGE: Tentative d\'accès au dashboard admin par un non-admin:', {
        user: user?.email || 'unknown',
        role: user?.role || 'none',
        isAuthenticated,
        hasUser: !!user
      });
      navigate('/', { replace: true });
      return;
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  // SÉCURITÉ CRITIQUE : Ne charger les données que si l'utilisateur est authentifié et admin
  // Cette vérification est une double vérification de sécurité
  useEffect(() => {
    // SÉCURITÉ : Ne JAMAIS charger les données si l'utilisateur n'est pas authentifié ou n'est pas admin
    // Vérifier TOUS les critères avant de charger
    if (authLoading) {
      console.log('⏳ En attente de vérification d\'authentification...');
      return;
    }
    
    if (!isAuthenticated) {
      console.warn('🚫 Tentative de chargement des données sans authentification');
      return;
    }
    
    if (!user) {
      console.warn('🚫 Tentative de chargement des données sans utilisateur');
      return;
    }
    
    // SÉCURITÉ : Vérifier que l'utilisateur a un rôle admin autorisé
    const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
    if (!allowedAdminRoles.includes(user.role)) {
      console.warn('🚫 Tentative de chargement des données par un non-admin:', user.role);
      return;
    }
    
    // Toutes les vérifications sont OK, on peut charger les données
    console.log('✅ Chargement des données du dashboard pour:', user.email);

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Charger toutes les données en parallèle
        const [stats, chartData, activities, notifications] = await Promise.all([
          adminService.getDashboardStats('30days').catch(() => dashboardService.getDashboardStats()),
          dashboardService.getChartData('7days'),
          dashboardService.getRecentActivities(),
          dashboardService.getNotifications()
        ]);

        // Transform backend stats to match component expectations
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
        // Fallback to mock data
        const [stats, chartData, activities, notifications] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getChartData('7days'),
          dashboardService.getRecentActivities(),
          dashboardService.getNotifications()
        ]);
        setDashboardData({ stats, chartData, activities, notifications });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, user, authLoading]);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // SÉCURITÉ CRITIQUE : Bloquer complètement l'affichage si l'utilisateur n'est pas authentifié ou admin
  // IMPORTANT: Ces vérifications sont APRÈS tous les hooks pour respecter les règles des hooks React
  // Les redirections sont gérées par les useEffect ci-dessus, mais on bloque aussi le rendu ici
  
  // 0. SÉCURITÉ CRITIQUE : Vérifier le token IMMÉDIATEMENT (même pendant isLoading)
  // Ne jamais attendre la fin du chargement pour bloquer l'accès sans token
  if (!hasValidToken) {
    console.error('🚫 [SECURITY] BLOCAGE: Pas de token valide, redirection IMMÉDIATE vers /admin/login', {
      hasToken: hasValidToken,
      tokenInStorage: !!tokenInStorage,
      authLoading
    });
    return <Navigate to="/admin/login" replace />;
  }
  
  // 1. Pendant le chargement de l'authentification, ne rien afficher
  if (authLoading) {
    console.log('🔒 [SECURITY] En attente de vérification d\'authentification...', {
      hasToken: hasValidToken
    });
    return <LoadingSpinner size="large" text="Vérification des permissions..." />;
  }

  // 2. SÉCURITÉ CRITIQUE : Si pas authentifié, rediriger immédiatement
  if (!isAuthenticated) {
    console.error('🚫 [SECURITY] BLOCAGE: Tentative d\'accès au dashboard sans authentification', {
      isAuthenticated,
      hasToken: hasValidToken
    });
    return <Navigate to="/admin/login" replace />;
  }

  // 3. SÉCURITÉ CRITIQUE : Si pas admin, rediriger immédiatement
  // SÉCURITÉ : Seuls admin, super_admin et moderator peuvent accéder
  const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
  if (!user || !allowedAdminRoles.includes(user.role)) {
    console.error('🚫 [SECURITY] BLOCAGE: Tentative d\'accès au dashboard par un non-admin:', {
      email: user?.email || 'unknown',
      role: user?.role || 'none',
      isAuthenticated,
      hasToken: hasValidToken
    });
    return <Navigate to="/" replace />;
  }

  // Toutes les vérifications sont passées
  console.log('✅ [SECURITY] Accès autorisé au dashboard pour:', user.email, 'Rôle:', user.role);

  // Gestionnaire pour les actions rapides
  const handleQuickAction = async (actionId) => {
    try {
      const result = await dashboardService.executeQuickAction(actionId);
      if (result.success) {
        console.log('Action exécutée avec succès:', result.message);
        // Vous pouvez ajouter une notification de succès ici
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error);
    }
  };

  // Gestionnaire pour la recherche
  const handleSearch = async (query) => {
    if (query.trim()) {
      try {
        const results = await dashboardService.searchDashboard(query);
        console.log('Résultats de recherche:', results);
        // Vous pouvez afficher les résultats dans un modal ou une section dédiée
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      }
    }
  };

  // Gestionnaire pour le changement de vue
  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    console.log(`Changement de vue vers: ${viewId}`);
    // Vous pouvez ajouter la logique de navigation ici
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon, active: true },
    { id: 'users', name: 'Utilisateurs', icon: UsersIcon },
    { id: 'orders', name: 'Commandes', icon: DocumentTextIcon },
    { id: 'products', name: 'Produits', icon: DocumentTextIcon },
    { id: 'training', name: 'Formations', icon: AcademicCapIcon },
    { id: 'quotes', name: 'Demandes de devis', icon: EnvelopeIcon },
    { id: 'messages', name: 'Messages de contact', icon: ChatBubbleLeftRightIcon },
    { id: 'chatbot-questions', name: 'Questions Chatbot', icon: QuestionMarkCircleIcon },
    { id: 'job-applications', name: 'Candidatures', icon: BriefcaseIcon },
    { id: 'support', name: 'Support', icon: BellIcon },
    { id: 'settings', name: 'Paramètres', icon: CogIcon }
  ];

  // SÉCURITÉ CRITIQUE : Ne JAMAIS afficher le contenu si les vérifications de sécurité échouent
  // Cette vérification doit être faite AVANT le rendu du contenu
  
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
    <div className={`min-h-screen transition-colors duration-300 ${
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
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
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
        />

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Désactiver AnimatePresence pour éviter le démontage des composants */}
          {/* <AnimatePresence mode="wait" initial={false}> */}
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
                        Dashboard
                      </h1>
                      <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
                        Centre de contrôle complet de la plateforme
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bonjour,</p>
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

            {/* Rendre les composants persistants pour éviter le démontage */}
            {/* Toujours garder les composants montés - les modals fonctionnent via createPortal dans document.body */}
            <div 
              key="product-management-wrapper"
              style={{ 
                display: activeView === 'products' ? 'block' : 'none'
              }}
            >
              <ProductManagement darkMode={darkMode} />
            </div>

            <div 
              key="training-management-wrapper"
              style={{ 
                display: activeView === 'training' ? 'block' : 'none'
              }}
            >
              <TrainingManagement darkMode={darkMode} />
            </div>

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

            {activeView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsManagement darkMode={darkMode} />
              </motion.div>
            )}
          {/* </AnimatePresence> */}
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
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 z-40"
      >
        <PlusIcon className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

export default ModernAdminDashboard;
