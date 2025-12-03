import React, { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'react-hot-toast';

const JobApplicationsManagement = ({ darkMode = false }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    jobTitle: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    loadApplications();
  }, [filters, pagination.page]);

  const loadApplications = async () => {
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

      const response = await adminService.getJobApplications(params);
      
      // Gérer différents formats de réponse
      if (response && response.success && response.data) {
        setApplications(response.data.applications || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 1,
        }));
      } else if (response && response.applications) {
        // Format alternatif
        setApplications(Array.isArray(response.applications) ? response.applications : []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || response.applications?.length || 0,
          totalPages: response.pagination?.totalPages || 1,
        }));
      } else if (Array.isArray(response)) {
        // Réponse directe sous forme de tableau
        setApplications(response);
        setPagination(prev => ({
          ...prev,
          total: response.length,
          totalPages: 1,
        }));
      } else {
        // Aucune donnée
        setApplications([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalPages: 1,
        }));
      }
    } catch (error) {
      console.error('Error loading job applications:', error);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors du chargement des candidatures';
      
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
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Afficher l'erreur seulement pour les erreurs critiques
      if (isNetworkError || error.response?.status >= 500) {
        toast.error(errorMessage);
      } else {
        // Pour les autres erreurs, ne pas afficher de toast, juste logger
        console.warn('Non-critical error loading applications:', errorMessage);
      }
      
      setApplications([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 1,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, updateData) => {
    try {
      await adminService.updateJobApplication(id, updateData);
      toast.success('Candidature mise à jour avec succès');
      loadApplications();
      if (selectedApplication && selectedApplication._id === id) {
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      interview: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5" />;
      case 'interview':
        return <CalendarIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  if (isLoading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" text="Chargement des candidatures..." />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Candidatures</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pagination.total} candidature{pagination.total > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

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
              <option value="reviewing">En cours d'examen</option>
              <option value="shortlisted">Présélectionné</option>
              <option value="interview">Entretien programmé</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Refusé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Poste</label>
            <input
              type="text"
              value={filters.jobTitle}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, jobTitle: e.target.value }));
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              placeholder="Titre du poste"
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
                placeholder="Nom, email, poste..."
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <BriefcaseIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Aucune candidature pour le moment
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Candidat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Poste</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {applications.map((application) => (
                  <tr key={application._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium">
                          {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {application.personalInfo?.email}
                        </div>
                        {application.personalInfo?.phone && (
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {application.personalInfo.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{application.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.statusDisplay || application.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(application.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
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

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={handleStatusUpdate}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

const ApplicationDetailModal = ({ application, onClose, onUpdate, darkMode }) => {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || '');
  const [interviewDate, setInterviewDate] = useState(application.interviewDate ? new Date(application.interviewDate).toISOString().split('T')[0] : '');
  const [rejectionReason, setRejectionReason] = useState(application.rejectionReason || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(application._id, {
      status,
      notes: notes.trim(),
      interviewDate: interviewDate || undefined,
      rejectionReason: rejectionReason.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <h3 className="text-xl font-bold">Détails de la candidature</h3>
          <button onClick={onClose} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informations personnelles</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                  {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                  {application.personalInfo?.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                  {application.personalInfo?.phone || 'Non fourni'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                  {application.personalInfo?.city || 'Non fournie'}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informations professionnelles</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Poste</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm font-medium`}>
                  {application.jobTitle}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expérience</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm whitespace-pre-wrap`}>
                  {application.professionalInfo?.experience}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Formation</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                  {application.professionalInfo?.education}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Compétences</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                  {application.professionalInfo?.skills}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Motivation</label>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm whitespace-pre-wrap`}>
                  {application.professionalInfo?.motivation}
                </div>
              </div>
              {application.documents?.cv && (
                <div>
                  <label className="block text-sm font-medium mb-1">CV</label>
                  <a
                    href={`/uploads/careers/${application.documents.cv}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 rounded-lg ${
                      darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Télécharger le CV
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4 border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-4">Actions admin</h4>
            
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="pending">En attente</option>
                <option value="reviewing">En cours d'examen</option>
                <option value="shortlisted">Présélectionné</option>
                <option value="interview">Entretien programmé</option>
                <option value="accepted">Accepté</option>
                <option value="rejected">Refusé</option>
              </select>
            </div>

            {status === 'interview' && (
              <div>
                <label className="block text-sm font-medium mb-2">Date d'entretien</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            )}

            {status === 'rejected' && (
              <div>
                <label className="block text-sm font-medium mb-2">Raison du refus</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Expliquez la raison du refus..."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Notes internes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Notes internes..."
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsManagement;

