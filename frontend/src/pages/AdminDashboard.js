import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CogIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import AdminStatsCards from '../components/AdminStatsCards';
import AdminUserManagement from '../components/AdminUserManagement';
import AdminContentManagement from '../components/AdminContentManagement';
import AdminTrainingManagement from '../components/AdminTrainingManagement';
import AdminSystemSettings from '../components/AdminSystemSettings';
import AdminNotifications from '../components/AdminNotifications';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Tous les hooks doivent être appelés en premier, avant toute vérification conditionnelle
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // VÉRIFICATION DE SÉCURITÉ : Bloquer l'accès si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/admin/login', { replace: true });
        return;
      }
      
      // SÉCURITÉ : Seuls admin, super_admin et moderator peuvent accéder
      const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
      if (user && !allowedAdminRoles.includes(user.role)) {
        console.error('Tentative d\'accès au dashboard admin (legacy) par un non-admin:', {
          user: user.email,
          role: user.role
        });
        navigate('/access-denied', { replace: true });
        return;
      }
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Afficher un loader pendant la vérification d'authentification
  if (authLoading) {
    return <LoadingSpinner size="large" text="Vérification des permissions..." />;
  }

  // Ne pas rendre le contenu si l'utilisateur n'est pas admin
  // SÉCURITÉ : Seuls admin, super_admin et moderator peuvent accéder
  const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
  if (!isAuthenticated || (user && !allowedAdminRoles.includes(user.role))) {
    return null; // Le useEffect redirigera
  }

  const tabs = [
    { id: 'overview', name: t('admin.overview'), icon: ChartBarIcon },
    { id: 'users', name: t('admin.users'), icon: UsersIcon },
    { id: 'content', name: t('admin.content'), icon: DocumentTextIcon },
    { id: 'training', name: t('admin.training'), icon: AcademicCapIcon },
    { id: 'notifications', name: t('admin.notifications'), icon: BellIcon },
    { id: 'settings', name: t('admin.settings'), icon: CogIcon }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
          </div>
          <SkeletonLoader type="dashboard" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
          <p className="mt-2 text-gray-600">{t('admin.dashboardDescription')}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <AdminStatsCards stats={{
                totalUsers: 1250,
                userGrowth: 12,
                totalRevenue: 45000000,
                monthlyGrowth: 8,
                totalProjects: 156,
                projectGrowth: 15,
                totalTrainings: 12,
                trainingGrowth: 3
              }} />
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="p-6">
              <AdminUserManagement />
            </div>
          )}
          
          {activeTab === 'content' && (
            <div className="p-6">
              <AdminContentManagement />
            </div>
          )}
          
          {activeTab === 'training' && (
            <div className="p-6">
              <AdminTrainingManagement />
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="p-6">
              <AdminNotifications />
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="p-6">
              <AdminSystemSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
