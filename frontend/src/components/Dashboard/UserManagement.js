import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserMinusIcon,
  UserPlusIcon,
  EyeIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const UserManagement = ({ darkMode = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, [currentPage, roleFilter, statusFilter, searchQuery]);

  // Empêcher le scroll du body quand un modal est ouvert
  useEffect(() => {
    if (showEditModal || showStatsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showEditModal, showStatsModal]);

  const loadUserStats = async () => {
    try {
      setStatsLoading(true);
      const stats = await adminService.getUserStats();
      setUserStats(stats.data || stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
      };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter !== '') params.isActive = statusFilter === 'active';
      if (searchQuery) params.search = searchQuery;

      const response = await adminService.getUsers(params);
      setUsers(response.users || []);
      setPagination(response.pagination || {});
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await adminService.updateUser(selectedUser._id, editForm);
      toast.success('Utilisateur mis à jour avec succès');
      setShowEditModal(false);
      loadUsers();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleSuspend = async (user, isActive) => {
    try {
      await adminService.suspendUser(user._id, isActive);
      toast.success(`Utilisateur ${isActive ? 'activé' : 'suspendu'} avec succès`);
      loadUsers();
    } catch (error) {
      toast.error('Erreur lors de la suspension');
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName}?`)) {
      try {
        await adminService.deleteUser(user._id);
        toast.success('Utilisateur supprimé avec succès');
        loadUsers();
        loadUserStats();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleExportPDF = async () => {
    try {
      toast.loading('Export PDF en cours...', { id: 'export-pdf' });
      const params = {
        page: 1,
        limit: 10000, // Export all users
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter !== '' && { isActive: statusFilter === 'active' }),
        ...(searchQuery && { search: searchQuery }),
      };
      
      const response = await adminService.getUsers(params);
      const usersToExport = response.users || response.data?.users || [];
      
      // Préparer les données pour l'export
      const exportData = usersToExport.map(user => ({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        status: user.isActive ? 'Actif' : 'Suspendu',
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'Jamais',
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '',
        address: user.address || '',
        projects: user.projects?.length || 0,
        totalSpent: user.totalSpent || 0,
      }));
      
      // Colonnes adaptées pour les utilisateurs
      const columns = [
        { key: 'firstName', label: 'Prénom' },
        { key: 'lastName', label: 'Nom' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Téléphone' },
        { key: 'role', label: 'Rôle' },
        { key: 'status', label: 'Statut' },
        { key: 'lastLogin', label: 'Dernière connexion' },
        { key: 'joinDate', label: 'Date d\'inscription' },
      ];
      
      await exportToPDF(exportData, columns, 'utilisateurs', 'Liste des Utilisateurs');
      toast.success('Export PDF réussi !', { id: 'export-pdf' });
    } catch (error) {
      console.error('Export PDF error:', error);
      toast.error('Erreur lors de l\'export PDF', { id: 'export-pdf' });
    }
  };

  const handleExportExcel = async () => {
    try {
      toast.loading('Export Excel en cours...', { id: 'export-excel' });
      const params = {
        page: 1,
        limit: 10000, // Export all users
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter !== '' && { isActive: statusFilter === 'active' }),
        ...(searchQuery && { search: searchQuery }),
      };
      
      const response = await adminService.getUsers(params);
      const usersToExport = response.users || response.data?.users || [];
      
      // Préparer les données pour l'export
      const exportData = usersToExport.map(user => ({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        status: user.isActive ? 'Actif' : 'Suspendu',
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'Jamais',
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '',
        address: user.address || '',
        projects: user.projects?.length || 0,
        totalSpent: user.totalSpent || 0,
      }));
      
      // Colonnes adaptées pour les utilisateurs
      const columns = [
        { key: 'firstName', label: 'Prénom' },
        { key: 'lastName', label: 'Nom' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Téléphone' },
        { key: 'role', label: 'Rôle' },
        { key: 'status', label: 'Statut' },
        { key: 'lastLogin', label: 'Dernière connexion' },
        { key: 'joinDate', label: 'Date d\'inscription' },
      ];
      
      await exportToExcel(exportData, columns, 'utilisateurs', 'Liste des Utilisateurs');
      toast.success('Export Excel réussi !', { id: 'export-excel' });
    } catch (error) {
      console.error('Export Excel error:', error);
      toast.error('Erreur lors de l\'export Excel', { id: 'export-excel' });
    }
  };

  const handleViewUserStats = (user) => {
    setSelectedUser(user);
    setShowStatsModal(true);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      super_admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      moderator: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      client: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      student: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        Actif
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        Suspendu
      </span>
    );
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner size="large" text="Chargement des utilisateurs..." />;
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez les comptes utilisateurs, leurs rôles et leurs statuts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.total || pagination.total || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.active || users.filter(u => u.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Connexions (30j)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.recentLogins || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Nouveaux (30j)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.newUsers || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les rôles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="moderator">Modérateur</option>
            <option value="client">Client</option>
            <option value="student">Étudiant</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Suspendus</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.firstName?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.isActive)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewUserStats(user)}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        title="Statistiques"
                      >
                        <ChartBarIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Modifier"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSuspend(user, !user.isActive)}
                        className={`${
                          user.isActive
                            ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400'
                        }`}
                        title={user.isActive ? 'Suspendre' : 'Activer'}
                      >
                        {user.isActive ? <UserMinusIcon className="w-5 h-5" /> : <UserPlusIcon className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page} sur {pagination.totalPages} ({pagination.total} utilisateurs)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Fermer seulement si on clique sur le backdrop, pas sur le contenu
            if (e.target === e.currentTarget) {
              setShowEditModal(false);
            }
          }}
          onKeyDown={(e) => {
            // Fermer avec Escape
            if (e.key === 'Escape') {
              setShowEditModal(false);
            }
          }}
          tabIndex={-1}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Modifier l'utilisateur</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="client">Client</option>
                  <option value="student">Étudiant</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Statistics Modal */}
      {showStatsModal && selectedUser && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Fermer seulement si on clique sur le backdrop, pas sur le contenu
            if (e.target === e.currentTarget) {
              setShowStatsModal(false);
              setSelectedUser(null);
            }
          }}
          onKeyDown={(e) => {
            // Fermer avec Escape
            if (e.key === 'Escape') {
              setShowStatsModal(false);
              setSelectedUser(null);
            }
          }}
          tabIndex={-1}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Statistiques - {selectedUser.firstName} {selectedUser.lastName}
              </h3>
              <button
                onClick={() => {
                  setShowStatsModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dernière connexion
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.lastLogin 
                      ? new Date(selectedUser.lastLogin).toLocaleString('fr-FR')
                      : 'Jamais connecté'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date d'inscription
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.createdAt 
                      ? new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email vérifié
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.isEmailVerified ? 'Oui' : 'Non'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Statut
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.isActive ? 'Actif' : 'Suspendu'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

