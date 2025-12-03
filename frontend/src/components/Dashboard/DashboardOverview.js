import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import StatCard from './StatCard';
import { LineChart, BarChart, DoughnutChart } from '../charts';
import apiEnhanced from '../../services/apiEnhanced';
import { toast } from 'react-hot-toast';

/**
 * Vue d'ensemble du dashboard avec statistiques et graphiques
 */
const DashboardOverview = ({ userRole = 'client' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiEnhanced.get('/dashboard/stats');
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Erreur lors du chargement des statistiques');
      
      // Données de démonstration en cas d'erreur
      setStats(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  // Données de démonstration
  const getDemoData = () => ({
    users: { total: 1247, change: 12.5 },
    courses: { total: 24, change: 8.3 },
    revenue: { total: '2 450 000', change: 23.1 },
    enrollments: { total: 543, change: 15.7 },
    orders: { total: 89, change: -5.2 },
    completionRate: { total: '78%', change: 3.4 }
  });

  const currentStats = stats || getDemoData();

  // Données pour le graphique de revenus
  const revenueChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [
      {
        label: 'Revenus (FCFA)',
        data: [450000, 523000, 678000, 621000, 789000, 856000, 924000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }
    ]
  };

  // Données pour le graphique des inscriptions
  const enrollmentsChartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Inscriptions',
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      }
    ]
  };

  // Données pour le graphique des catégories
  const categoriesChartData = {
    labels: ['Développement', 'Design', 'Marketing', 'Business', 'Autres'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Utilisateurs"
          value={currentStats.users.total}
          change={currentStats.users.change}
          icon={UserGroupIcon}
          color="blue"
          loading={loading}
        />
        
        <StatCard
          title="Formations"
          value={currentStats.courses.total}
          change={currentStats.courses.change}
          icon={AcademicCapIcon}
          color="green"
          loading={loading}
        />
        
        <StatCard
          title="Revenus"
          value={currentStats.revenue.total + ' FCFA'}
          change={currentStats.revenue.change}
          icon={CurrencyDollarIcon}
          color="purple"
          loading={loading}
        />
        
        <StatCard
          title="Inscriptions"
          value={currentStats.enrollments.total}
          change={currentStats.enrollments.change}
          icon={ChartBarIcon}
          color="orange"
          loading={loading}
        />
        
        <StatCard
          title="Commandes"
          value={currentStats.orders.total}
          change={currentStats.orders.change}
          icon={ShoppingCartIcon}
          color="indigo"
          loading={loading}
        />
        
        <StatCard
          title="Taux de complétion"
          value={currentStats.completionRate.total}
          change={currentStats.completionRate.change}
          icon={DocumentTextIcon}
          color="green"
          loading={loading}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de revenus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution des revenus
          </h3>
          <LineChart
            data={revenueChartData}
            height={300}
            gradient={true}
          />
        </motion.div>

        {/* Graphique des inscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Inscriptions par jour
          </h3>
          <BarChart
            data={enrollmentsChartData}
            height={300}
          />
        </motion.div>
      </div>

      {/* Graphique des catégories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par catégorie
        </h3>
        <div className="max-w-md mx-auto">
          <DoughnutChart
            data={categoriesChartData}
            height={300}
            centerText={{
              value: '100',
              label: 'Total cours'
            }}
          />
        </div>
      </motion.div>

      {/* Activités récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Activités récentes
        </h3>
        <div className="space-y-3">
          {[
            { user: 'Jean Dupont', action: 's\'est inscrit à', item: 'Formation React Avancé', time: 'Il y a 5 min' },
            { user: 'Marie Martin', action: 'a complété', item: 'Formation JavaScript', time: 'Il y a 15 min' },
            { user: 'Pierre Durand', action: 'a acheté', item: 'Pack Premium', time: 'Il y a 1h' },
            { user: 'Sophie Lambert', action: 'a laissé un avis sur', item: 'Formation Node.js', time: 'Il y a 2h' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <UserGroupIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;

