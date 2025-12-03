import React, { useState, useEffect } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'react-hot-toast';

const QuoteRequestsManagement = ({ darkMode = false }) => {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    serviceId: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    loadQuoteRequests();
  }, [filters, pagination.page]);

  const loadQuoteRequests = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      // Nettoyer les paramètres vides
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await adminService.getQuoteRequests(params);
      
      // Gérer différents formats de réponse
      let quoteRequests = [];
      let paginationData = {};
      
      if (response) {
        // Structure standard avec success et data : { success: true, data: { quoteRequests: [], pagination: {} } }
        if (response.success && response.data) {
          if (response.data.quoteRequests) {
            quoteRequests = Array.isArray(response.data.quoteRequests) ? response.data.quoteRequests : [];
            paginationData = response.data.pagination || {};
          } else if (Array.isArray(response.data)) {
            // Si data est directement un array
            quoteRequests = response.data;
          }
        }
        // Structure directe : { quoteRequests: [], pagination: {} }
        else if (response.quoteRequests) {
          quoteRequests = Array.isArray(response.quoteRequests) ? response.quoteRequests : [];
          paginationData = response.pagination || {};
        }
        // Si directement un array (ancien format)
        else if (Array.isArray(response)) {
          quoteRequests = response;
        }
        // Si c'est un objet avec un tableau dedans
        else if (response.data && Array.isArray(response.data)) {
          quoteRequests = response.data;
        }
      }
      
      setQuoteRequests(quoteRequests);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || quoteRequests.length,
        totalPages: paginationData.totalPages || 1,
      }));
    } catch (error) {
      console.error('Error loading quote requests:', error);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors du chargement des demandes de devis';
      
      // Vérifier si c'est une erreur réseau
      const isNetworkError = !error.response && (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('Failed to fetch')
      );
      
      if (isNetworkError) {
        errorMessage = 'Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://localhost:5000';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.response?.status === 404) {
        // 404 n'est pas une erreur critique - juste aucune donnée
        errorMessage = null;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Afficher l'erreur seulement pour les erreurs critiques
      if (errorMessage && (isNetworkError || error.response?.status >= 500)) {
        toast.error(errorMessage);
      } else if (errorMessage) {
        // Pour les autres erreurs non-critiques, juste logger
        console.warn('Non-critical error loading quote requests:', errorMessage);
      }
      
      // En cas d'erreur, initialiser avec une liste vide
      setQuoteRequests([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 1,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminService.updateQuoteRequest(id, { status: newStatus });
      toast.success('Statut mis à jour avec succès');
      loadQuoteRequests();
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      quoted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'rejected':
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      case 'in_progress':
        return <ClockIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  if (isLoading && quoteRequests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" text="Chargement des demandes de devis..." />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Demandes de devis</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pagination.total} demande{pagination.total > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, status: e.target.value }));
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="quoted">Devis envoyé</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Refusé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Service</label>
            <input
              type="text"
              value={filters.serviceId}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, serviceId: e.target.value }));
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              placeholder="ID du service"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rechercher</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, search: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                placeholder="Nom, email, service..."
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quote Requests List */}
      <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {quoteRequests.length === 0 ? (
          <div className="p-12 text-center">
            <EnvelopeIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Aucune demande de devis pour le moment
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {quoteRequests.map((request) => (
                  <tr key={request._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium">{request.name}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {request.email}
                        </div>
                        {request.phone && (
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {request.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{request.serviceName || request.serviceId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.budget ? (
                        <span className="text-sm font-medium">
                          {request.budget.toLocaleString('fr-FR')} FCFA
                        </span>
                      ) : (
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Non spécifié
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.statusDisplay || request.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className={`mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Page {pagination.page} sur {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Précédent
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page >= pagination.totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <QuoteRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={handleStatusUpdate}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

const QuoteRequestDetailModal = ({ request, onClose, onUpdate, darkMode }) => {
  const [status, setStatus] = useState(request.status);
  const [notes, setNotes] = useState(request.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await adminService.updateQuoteRequest(request._id, {
        status,
        notes: notes.trim() || undefined,
      });
      toast.success('Demande mise à jour avec succès');
      onUpdate(request._id, status);
      onClose();
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Détails de la demande de devis</h3>
            <button
              onClick={onClose}
              className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div>
            <h4 className="font-semibold mb-3">Informations client</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-32 font-medium">Nom:</span>
                <span>{request.name}</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400" />
                <span>{request.email}</span>
              </div>
              {request.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <span>{request.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Info */}
          <div>
            <h4 className="font-semibold mb-3">Service demandé</h4>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Service:</span> {request.serviceName || request.serviceId}
              </div>
              {request.budget && (
                <div>
                  <span className="font-medium">Budget:</span> {request.budget.toLocaleString('fr-FR')} FCFA
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          {request.requirements && (
            <div>
              <h4 className="font-semibold mb-3">Exigences et besoins</h4>
              <p className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {request.requirements}
              </p>
            </div>
          )}

          {/* Status Update */}
          <div>
            <h4 className="font-semibold mb-3">Statut</h4>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="quoted">Devis envoyé</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Refusé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <h4 className="font-semibold mb-3">Notes internes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Ajouter des notes..."
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Dates */}
          <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Créé le:</span>
                <div>{new Date(request.createdAt).toLocaleString('fr-FR')}</div>
              </div>
              {request.updatedAt && (
                <div>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Modifié le:</span>
                  <div>{new Date(request.updatedAt).toLocaleString('fr-FR')}</div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg ${
                isUpdating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestsManagement;

