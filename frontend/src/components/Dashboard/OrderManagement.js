import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

const OrderManagement = ({ darkMode = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [orderStats, setOrderStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadOrders();
    loadOrderStats();
  }, [currentPage, filters]);

  const loadOrderStats = async () => {
    try {
      setStatsLoading(true);
      const stats = await adminService.getOrderStats();
      setOrderStats(stats.data || stats);
    } catch (error) {
      console.error('Error loading order stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
        ...filters,
      };
      Object.keys(params).forEach((key) => params[key] === '' && delete params[key]);

      const response = await adminService.getOrders(params);
      setOrders(response.orders || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error loading orders:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des commandes';
      
      // Ne pas afficher de toast si c'est une erreur réseau - apiEnhanced le fait déjà
      if (!errorMessage.includes('réseau') && !errorMessage.includes('network')) {
        toast.error(errorMessage);
      }
      
      // Initialiser avec un tableau vide en cas d'erreur
      setOrders([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success('Statut de la commande mis à jour');
      loadOrders();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.loading('Export CSV en cours...', { id: 'export-csv' });
      await adminService.exportOrdersCSV(filters);
      toast.success('Export CSV réussi ! Le fichier devrait se télécharger automatiquement.', { id: 'export-csv', duration: 3000 });
    } catch (error) {
      console.error('Export CSV error:', error);
      let errorMessage = 'Erreur lors de l\'export CSV';
      
      // Gérer les erreurs réseau spécifiquement
      if (error.message && error.message.includes('Erreur réseau')) {
        errorMessage = error.message;
      } else if (error.message && error.message.includes('Failed to fetch')) {
        errorMessage = 'Erreur réseau. Le serveur backend n\'est pas accessible. Vérifiez que le serveur est démarré sur http://localhost:5000';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { id: 'export-csv', duration: 5000 });
    }
  };

  const handleExportPDF = async () => {
    try {
      toast.loading('Export PDF en cours...', { id: 'export-pdf' });
      await adminService.exportOrdersPDF(filters);
      toast.success('Export PDF réussi ! Le fichier devrait se télécharger automatiquement.', { id: 'export-pdf', duration: 3000 });
    } catch (error) {
      console.error('Export PDF error:', error);
      let errorMessage = 'Erreur lors de l\'export PDF';
      
      // Gérer les erreurs réseau spécifiquement
      if (error.message && error.message.includes('Erreur réseau')) {
        errorMessage = error.message;
      } else if (error.message && error.message.includes('Failed to fetch')) {
        errorMessage = 'Erreur réseau. Le serveur backend n\'est pas accessible. Vérifiez que le serveur est démarré sur http://localhost:5000';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { id: 'export-pdf', duration: 5000 });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédiée',
      completed: 'Terminée',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner size="large" text="Chargement des commandes..." />;
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Commandes</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Suivez et gérez toutes les commandes de la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {orderStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Revenus totaux</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orderStats.totalRevenue?.toLocaleString('fr-FR') || 0} XAF
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Revenus mensuels</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orderStats.monthlyRevenue?.toLocaleString('fr-FR') || 0} XAF
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <ShoppingBagIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Panier moyen</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orderStats.averageOrderValue?.toLocaleString('fr-FR') || 0} XAF
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orderStats.byStatus?.pending?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En traitement</option>
            <option value="shipped">Expédiée</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Date de début"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Date de fin"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Produits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{order.customer?.fullName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {order.items?.length || 0} article(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.total?.toLocaleString('fr-FR')} XAF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                    >
                      <option value="pending">En attente</option>
                      <option value="processing">En traitement</option>
                      <option value="shipped">Expédiée</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page} sur {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border rounded-md disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border rounded-md disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;

