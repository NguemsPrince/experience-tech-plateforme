import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  Squares2X2Icon,
  UsersIcon,
  CubeIcon,
  CogIcon, 
  CalendarIcon,
  CheckIcon,
  LifebuoyIcon,
  BellIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  StarIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  LightBulbIcon,
  BugAntIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

import Logo from '../components/Logo';
import CreateProjectModal from '../components/CreateProjectModal';
import LoadingButton from '../components/LoadingButton';
import AddTestimonial from '../components/AddTestimonial';
import SuggestionsDashboard from '../components/SuggestionsDashboard';
import AdminSuggestionsDashboard from '../components/AdminSuggestionsDashboard';
import TrainingsDashboard from '../components/TrainingsDashboard';
import ProductsDashboard from '../components/ProductsDashboard';
import Orders from './Orders';
import QuickActions from '../components/QuickActions';
import { projectsService } from '../services/projects';
import { invoicesService } from '../services/invoices';
import { supportService } from '../services/support';
import { authService } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

const Client = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  
  // Advanced features state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [widgets, setWidgets] = useState({
    stats: true,
    charts: true,
    recentProjects: true,
    activities: true,
    trainings: true,
    products: true,
    suggestions: true
  });
  const [chartZoom, setChartZoom] = useState(1);
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  // Dashboard data
  const [stats, setStats] = useState({
    totalProfit: 0,
    budget: 0,
    totalProjects: 0,
    progress: 0
  });
  
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Helper function to add notifications
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: 'Maintenant',
      type: 'success'
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only 5 notifications
  };

  // Handle project creation
  const handleProjectSubmit = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setShowCreateProjectModal(false);
    addNotification('Nouveau projet créé avec succès !');
  };

  useEffect(() => {
    loadDashboardData();
    setupAutoRefresh();
    setupKeyboardShortcuts();
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Auto-refresh data every 30 seconds
  const setupAutoRefresh = useCallback(() => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);
    setRefreshInterval(interval);
  }, []);

  // Keyboard shortcuts
  const setupKeyboardShortcuts = useCallback(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setActiveTab('dashboard');
            break;
          case '2':
            e.preventDefault();
            setActiveTab('projects');
            break;
          case '3':
            e.preventDefault();
            setActiveTab('invoices');
            break;
          case '4':
            e.preventDefault();
            setActiveTab('training');
            break;
          case '5':
            e.preventDefault();
            setActiveTab('products');
            break;
          case '6':
            e.preventDefault();
            setActiveTab('suggestions');
            break;
          case 'k':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
          case 'd':
            e.preventDefault();
            setIsDarkMode(!isDarkMode);
            break;
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
          case 'n':
            e.preventDefault();
            setShowQuickAdd(!showQuickAdd);
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isDarkMode, sidebarCollapsed]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load projects
      const projectsResponse = await projectsService.getAllProjects();
      if (projectsResponse.success) {
        setProjects(projectsResponse.data || []);
      }
      
      // Load invoices
      const invoicesResponse = await invoicesService.getAllInvoices();
      if (invoicesResponse.success) {
        setInvoices(invoicesResponse.data || []);
      }
      
      // Calculate stats
      const totalProjects = projectsResponse.data?.length || 0;
      const completedProjects = projectsResponse.data?.filter(p => p.status === 'completed').length || 0;
      const totalInvoices = invoicesResponse.data?.length || 0;
      const pendingInvoices = invoicesResponse.data?.filter(i => i.status === 'pending').length || 0;
      const totalRevenue = invoicesResponse.data?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0;
      
      setStats({
        totalProfit: totalRevenue,
        budget: totalRevenue,
        totalProjects: totalProjects,
        progress: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
      });
      
      // Mock recent activities
      setRecentActivities([
        { id: 1, type: 'project', message: 'Nouveau projet créé', time: '2h', icon: RocketLaunchIcon },
        { id: 2, type: 'invoice', message: 'Facture #INV-001 envoyée', time: '4h', icon: DocumentTextIcon },
        { id: 3, type: 'support', message: 'Ticket support résolu', time: '6h', icon: LifebuoyIcon },
        { id: 4, type: 'training', message: 'Formation complétée', time: '1j', icon: AcademicCapIcon }
      ]);

      // Mock notifications
      setNotifications([
        { id: 1, type: 'success', message: 'Projet terminé avec succès', time: '5 min', read: false },
        { id: 2, type: 'warning', message: 'Facture en retard de paiement', time: '1h', read: false },
        { id: 3, type: 'info', message: 'Nouvelle formation disponible', time: '2h', read: true }
      ]);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced utility functions
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  }, [isDarkMode]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, filterStatus]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [invoices, searchQuery, filterStatus]);

  const unreadNotifications = useMemo(() => {
    return notifications.filter(notif => !notif.read).length;
  }, [notifications]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const toggleWidget = useCallback((widgetName) => {
    setWidgets(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }));
  }, []);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Squares2X2Icon, active: activeTab === 'dashboard' },
    { id: 'projects', name: t('dashboard.tabs.projects'), icon: CogIcon, active: activeTab === 'projects' },
    { id: 'invoices', name: t('dashboard.tabs.reports'), icon: DocumentTextIcon, active: activeTab === 'invoices' },
    { id: 'training', name: 'Formations', icon: AcademicCapIcon, active: activeTab === 'training' },
    { id: 'products', name: 'Produits', icon: CubeIcon, active: activeTab === 'products' },
    { id: 'orders', name: 'Mes Commandes', icon: ShoppingCartIcon, active: activeTab === 'orders' },
    { id: 'suggestions', name: 'Suggestions', icon: LightBulbIcon, active: activeTab === 'suggestions' },
    { id: 'testimonials', name: 'Témoignages', icon: StarIcon, active: activeTab === 'testimonials' },
    { id: 'support', name: t('common.support'), icon: LifebuoyIcon, active: activeTab === 'support' },
    { id: 'profile', name: t('common.profile'), icon: UserIcon, active: activeTab === 'profile' },
    { id: 'settings', name: t('dashboard.tabs.settings'), icon: Cog6ToothIcon, active: activeTab === 'settings' }
  ];

  // Advanced components
  const NotificationPanel = () => (
    <div className={`absolute top-12 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto ${showNotifications ? 'block' : 'hidden'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          <button
            onClick={() => setShowNotifications(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            onClick={() => markNotificationAsRead(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'warning' ? 'bg-yellow-500' :
                notification.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              } ${!notification.read ? '' : 'opacity-50'}`} />
              <div className="flex-1">
                <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Aucune notification
          </div>
        )}
      </div>
    </div>
  );

  const SearchBar = () => (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        id="search-input"
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const FilterDropdown = () => (
    <div className="relative">
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      >
        <option value="all">{t('client.filters.all')}</option>
        <option value="pending">{t('client.filters.pending')}</option>
        <option value="in_progress">{t('client.filters.inProgress')}</option>
        <option value="completed">{t('client.filters.completed')}</option>
        <option value="paid">{t('client.filters.paid')}</option>
      </select>
      <FunnelIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    </div>
  );

  // StatCard component
  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${color === 'yellow' ? 'bg-yellow-50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color === 'yellow' ? 'bg-yellow-200' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'}`} />
        </div>
        {trend && (
          <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
            <span className="text-sm ml-1">{change}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {!trend && <p className="text-sm text-gray-500 mt-1">{change}</p>}
    </div>
  );

  // Chart components
  const DonutChart = ({ data }) => {
    const total = data.desktop + data.tablet + data.mobile;
    const desktopPercentage = (data.desktop / total) * 100;
    const tabletPercentage = (data.tablet / total) * 100;
    const mobilePercentage = (data.mobile / total) * 100;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${desktopPercentage * 2.51} 251`} strokeDashoffset="0" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="8" strokeDasharray={`${tabletPercentage * 2.51} 251`} strokeDashoffset={`-${desktopPercentage * 2.51}`} />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray={`${mobilePercentage * 2.51} 251`} strokeDashoffset={`-${(desktopPercentage + tabletPercentage) * 2.51}`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">100%</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <ComputerDesktopIcon className="w-4 h-4 mr-2" />
            <span className="text-sm">Desktop: {data.desktop}%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <DeviceTabletIcon className="w-4 h-4 mr-2" />
            <span className="text-sm">Tablet: {data.tablet}%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <DevicePhoneMobileIcon className="w-4 h-4 mr-2" />
            <span className="text-sm">Mobile: {data.mobile}%</span>
          </div>
        </div>
      </div>
    );
  };

  const InteractiveLineChart = ({ data }) => {
    const maxUsers = Math.max(...data.map(d => d.users));
    const minUsers = Math.min(...data.map(d => d.users));
    const range = maxUsers - minUsers;
    const [hoveredPoint, setHoveredPoint] = useState(null);

    const handleMouseEnter = (point, index) => {
      setHoveredPoint({ ...point, index });
    };

    const handleMouseLeave = () => {
      setHoveredPoint(null);
    };

    return (
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i} x1="40" y1={40 + i * 32} x2="360" y2={40 + i * 32} stroke="#e5e7eb" strokeWidth="1" />
          ))}
          
          {/* Line chart */}
          <polyline
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            points={data.map((d, i) => 
              `${60 + i * 60},${200 - 40 - ((d.users - minUsers) / range) * 160}`
            ).join(' ')}
          />
          
          {/* Area under line */}
          <polygon
            fill="url(#gradient)"
            points={`40,200-40 ${data.map((d, i) => 
              `${60 + i * 60},${200 - 40 - ((d.users - minUsers) / range) * 160}`
            ).join(' ')} 360,200-40`}
          />
          
          {/* Data points with hover effects */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={60 + i * 60}
                cy={200 - 40 - ((d.users - minUsers) / range) * 160}
                r="6"
                fill="#8b5cf6"
                className="cursor-pointer transition-all duration-200 hover:r-8"
                onMouseEnter={() => handleMouseEnter(d, i)}
                onMouseLeave={handleMouseLeave}
              />
              {hoveredPoint && hoveredPoint.index === i && (
                <circle
                  cx={60 + i * 60}
                  cy={200 - 40 - ((d.users - minUsers) / range) * 160}
                  r="8"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}
            </g>
          ))}
          
          {/* X-axis labels */}
          {data.map((d, i) => (
            <text key={i} x={60 + i * 60} y={190} textAnchor="middle" className="text-xs fill-gray-600">
              {d.date}
            </text>
          ))}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <text key={i} x="35" y={45 + i * 32} textAnchor="end" className="text-xs fill-gray-600">
              {Math.round((maxUsers - (i * range / 5)) / 1000)}k
            </text>
          ))}
        </svg>
        
        {/* Tooltip */}
        {hoveredPoint && (
          <div className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none z-10"
               style={{
                 left: `${60 + hoveredPoint.index * 60}px`,
                 top: `${200 - 40 - ((hoveredPoint.users - minUsers) / range) * 160 - 40}px`,
                 transform: 'translate(-50%, -100%)'
               }}>
            <div className="font-medium">{hoveredPoint.users.toLocaleString()} utilisateurs</div>
            <div className="text-gray-300">{hoveredPoint.date}</div>
          </div>
        )}
        
        {/* Chart controls */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => setChartZoom(Math.max(0.5, chartZoom - 0.1))}
            className="p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow text-xs">
            {Math.round(chartZoom * 100)}%
          </span>
          <button
            onClick={() => setChartZoom(Math.min(2, chartZoom + 0.1))}
            className="p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartZoom(1)}
            className="p-1 bg-white dark:bg-gray-700 rounded shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar />
            </div>
            <div className="flex gap-4">
              <FilterDropdown />
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                title="Basculer le thème (Ctrl+D)"
              >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => loadDashboardData()}
                className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                title={t('client.actions.refresh')}
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {widgets.stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="REVENUS TOTAUX"
                value={`${stats.totalProfit.toLocaleString()} FCFA`}
                change={`${stats.totalProfit.toLocaleString()} FCFA ce mois`}
                icon={CurrencyDollarIcon}
                color="yellow"
              />
              <StatCard
                title="BUDGET"
                value={`${stats.budget.toLocaleString()} FCFA`}
                change="12% Depuis le mois dernier"
                icon={CurrencyDollarIcon}
                color="white"
                trend="down"
              />
              <StatCard
                title="PROJETS TOTAUX"
                value={stats.totalProjects}
                change="15% Depuis le mois dernier"
                icon={UserGroupIcon}
                color="white"
                trend="up"
              />
              <StatCard
                title="PROGRESSION"
                value={`${stats.progress}%`}
                change="20% Depuis le mois dernier"
                icon={ChartBarIcon}
                color="white"
                trend="up"
              />
            </div>
          )}

          {/* Charts */}
          {widgets.charts && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interactive Line Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Projets par période</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Derniers 7 jours</span>
                    <button
                      onClick={() => toggleWidget('charts')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <InteractiveLineChart data={[
                  { date: '1 Jan', users: 19000 },
                  { date: '2 Jan', users: 22000 },
                  { date: '3 Jan', users: 30000 },
                  { date: '4 Jan', users: 25000 },
                  { date: '5 Jan', users: 22000 },
                  { date: '6 Jan', users: 22000 }
                ]} />
              </div>

              {/* Donut Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accès par appareil</h3>
                  <button
                    onClick={() => toggleWidget('charts')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <DonutChart data={{ desktop: 60, tablet: 20, mobile: 20 }} />
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Projects */}
            {widgets.recentProjects && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Derniers projets</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowCreateProjectModal(true)}
                      className="text-sm bg-blue-600 text-white px-4 py-1 rounded-lg border border-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      NOUVEAU PROJET
                    </button>
                    <button
                      onClick={() => toggleWidget('recentProjects')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                          <CogIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{project.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Mis à jour il y a {Math.floor(Math.random() * 24)}h</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        project.status === 'completed' ? 'bg-green-500' :
                        project.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`} />
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun projet pour le moment</p>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activities */}
            {widgets.activities && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activités récentes</h3>
                  <button
                    onClick={() => toggleWidget('activities')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                        <activity.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Il y a {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Trainings */}
            {widgets.trainings && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Formations récentes</h3>
                  <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setActiveTab('training')}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          {user?.role === 'admin' ? 'Créer' : 'Voir tout'}
                        </button>
                    <button
                      onClick={() => toggleWidget('trainings')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <AcademicCapIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">React Avancé</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">8/15 participants • 899€</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      Avancé
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                      <AcademicCapIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">UI/UX Design</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">12/12 participants • 649€</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      Débutant
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                      <AcademicCapIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">DevOps Docker</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">6/10 participants • 1299€</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                      Intermédiaire
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Products */}
            {widgets.products && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Produits récents</h3>
                  <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setActiveTab('products')}
                          className="text-sm bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          {user?.role === 'admin' ? 'Créer' : 'Voir tout'}
                        </button>
                    <button
                      onClick={() => toggleWidget('products')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <ComputerDesktopIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">E-commerce Web</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">23 ventes • 2499€</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      Application
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                      <DevicePhoneMobileIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">App Livraison</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">15 ventes • 3299€</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      Mobile
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                      <CubeIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Template Admin</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">156 ventes • 299€</p>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                      Template
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Suggestions */}
            {widgets.suggestions && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Suggestions récentes</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setActiveTab('suggestions')}
                      className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Créer
                    </button>
                    <button
                      onClick={() => toggleWidget('suggestions')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <LightBulbIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Notifications push</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">24 votes • Il y a 2h</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                      En attente
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                      <BugAntIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Graphiques mobile</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">18 votes • Il y a 5h</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      En cours
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                      <StarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Interface projets</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">12 votes • Il y a 1j</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      Approuvé
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* Quick Actions */}
            <QuickActions 
              userRole={user?.role || 'user'} 
              onItemCreated={(item) => {
                // Gérer l'ouverture du modal de projet
                if (item.type === 'project' && item.action === 'openModal') {
                  setShowCreateProjectModal(true);
                  return;
                }
                
                // Ajouter l'élément créé à la liste appropriée
                if (item.type === 'project') {
                  setProjects(prev => [item, ...prev]);
                }
                // Ajouter une notification
                addNotification(`Nouveau ${item.type} créé avec succès !`);
              }}
            />

            {/* Widget Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Widgets</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(widgets).map(([key, visible]) => (
                  <button
                    key={key}
                    onClick={() => toggleWidget(key)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      visible 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {visible ? <EyeIcon className="w-3 h-3 inline mr-1" /> : <EyeSlashIcon className="w-3 h-3 inline mr-1" />}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Projets</h2>
              <div className="flex gap-4">
                <div className="w-64">
                  <SearchBar />
                </div>
                <FilterDropdown />
              <LoadingButton
                  variant="callback"
                onClick={() => setShowCreateProjectModal(true)}
                successMessage="Modal ouvert avec succès !"
              >
                Nouveau Projet
              </LoadingButton>
            </div>
            </div>
            
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{filteredProjects.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Projets trouvés</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredProjects.filter(p => p.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">En cours</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {filteredProjects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Terminés</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {filteredProjects.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">En attente</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'completed' ? 'bg-green-500' :
                      project.status === 'in_progress' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Type: {project.type}</span>
                      <span>Mis à jour il y a {Math.floor(Math.random() * 24)}h</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProjects.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <CogIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery || filterStatus !== 'all' 
                      ? 'Aucun projet ne correspond à vos critères' 
                      : 'Aucun projet pour le moment'}
                  </p>
                  {(searchQuery || filterStatus !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterStatus('all');
                      }}
                      className="mt-2 text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes Factures</h2>
              <LoadingButton
                variant="callback"
                onClick={async () => {
                  const invoiceData = {
                    description: 'Demande de facture',
                    amount: 0,
                    type: 'service'
                  };
                  await invoicesService.requestInvoice(invoiceData);
                }}
                successMessage="Demande de facture envoyée avec succès !"
                errorMessage="Erreur lors de la demande de facture"
              >
                Demander une facture
              </LoadingButton>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.amount.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        Aucune facture pour le moment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'training':
        return (
          <TrainingsDashboard userRole={user?.role || 'user'} />
        );

      case 'products':
        return (
          <ProductsDashboard userRole={user?.role || 'user'} />
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
            </div>
            <Orders />
          </div>
        );

      case 'suggestions':
        return user?.role === 'admin' ? (
          <AdminSuggestionsDashboard />
        ) : (
          <SuggestionsDashboard userRole={user?.role || 'user'} />
        );

      case 'testimonials':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes Témoignages</h2>
            </div>
            <AddTestimonial />
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Support</h2>
            </div>
            <div className="text-center py-12">
              <LifebuoyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Fonctionnalité en développement</p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
            </div>
            <div className="text-center py-12">
              <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Fonctionnalité en développement</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
            </div>
            <div className="text-center py-12">
              <Cog6ToothIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Fonctionnalité en développement</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Espace Client - Expérience Tech</title>
        <meta name="description" content="Accédez à votre espace client pour suivre vos projets, consulter vos factures et bénéficier de notre support." />
      </Helmet>

      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}>
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-purple-900 text-white transition-all duration-300`}>
          <div className="p-6">
            <div className="flex items-center mb-8">
              <Squares2X2Icon className="w-6 h-6 mr-3" />
              {!sidebarCollapsed && <h1 className="text-xl font-bold">Dashboard</h1>}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center mr-4">
                <span className="text-lg">👤</span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="font-semibold">{user?.firstName || 'Utilisateur'} {user?.lastName || ''}</p>
                  <p className="text-purple-300 text-sm">{user?.role || 'Client'}</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    tab.active 
                      ? 'bg-purple-700 text-white shadow-lg' 
                      : 'text-purple-200 hover:bg-purple-800 hover:text-white hover:shadow-md'
                  }`}
                  title={sidebarCollapsed ? tab.name : ''}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {!sidebarCollapsed && (
                    <span className="transition-opacity duration-200">{tab.name}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Keyboard Shortcuts Help */}
            {!sidebarCollapsed && (
              <div className="mt-8 p-4 bg-purple-800 rounded-lg">
                <h4 className="text-sm font-medium text-purple-200 mb-2">Raccourcis</h4>
                <div className="space-y-1 text-xs text-purple-300">
                  <div>Ctrl+1-3: Navigation</div>
                  <div>Ctrl+K: Recherche</div>
                  <div>Ctrl+D: Thème</div>
                  <div>Ctrl+B: Sidebar</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Ensemble, nous atteignons plus d'objectifs</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Quick Add Button */}
                <div className="relative group">
                  <button
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    title="Ajouter rapidement (Ctrl+N)"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Ajouter</span>
                </button>
                  
                  {/* Quick Add Dropdown */}
                  {showQuickAdd && (
                    <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowCreateProjectModal(true);
                            setShowQuickAdd(false);
                          }}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <CogIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Nouveau Projet</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Créer un projet</p>
              </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            setActiveTab('training');
                            setShowQuickAdd(false);
                          }}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <AcademicCapIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Nouvelle Formation</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Créer une formation</p>
          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            setActiveTab('products');
                            setShowQuickAdd(false);
                          }}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <CubeIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Nouveau Produit</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Créer un produit</p>
                          </div>
                        </button>
                        
                  <button
                          onClick={() => {
                            setActiveTab('suggestions');
                            setShowQuickAdd(false);
                          }}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <LightBulbIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Nouvelle Suggestion</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Proposer une idée</p>
                    </div>
                  </button>
                        
                        <button
                          onClick={() => {
                            setActiveTab('testimonials');
                            setShowQuickAdd(false);
                          }}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <StarIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Nouveau Témoignage</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ajouter un avis</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
        </div>

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title={t('client.actions.notifications')}
                  >
                    <BellIcon className="w-6 h-6" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  <NotificationPanel />
        </div>
                
                {/* Messages */}
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title={t('client.actions.messages')}>
                  <EnvelopeIcon className="w-6 h-6" />
                </button>
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Basculer le thème (Ctrl+D)"
                >
                  {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                </button>
                
                {/* Sidebar Toggle */}
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Basculer la sidebar (Ctrl+B)"
                >
                  <AdjustmentsHorizontalIcon className="w-6 h-6" />
                </button>
                
                {/* Logout */}
                <button 
                  onClick={() => authService.logout()}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title={t('client.actions.logout')}
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </button>
      </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      {showCreateProjectModal && (
      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
          onSuccess={handleProjectSubmit}
      />
      )}
    </>
  );
};

export default Client;
