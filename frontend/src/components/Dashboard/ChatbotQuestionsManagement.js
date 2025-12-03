import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'react-hot-toast';

const ChatbotQuestionsManagement = ({ darkMode = false }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    loadQuestions();
  }, [filters, pagination.page]);

  const loadQuestions = async () => {
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

      const response = await adminService.getChatbotQuestions(params);
      
      // Gérer différents formats de réponse
      if (response && response.success && response.data) {
        setQuestions(response.data.questions || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 1,
        }));
      } else if (response && response.questions) {
        // Format alternatif
        setQuestions(Array.isArray(response.questions) ? response.questions : []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || response.questions?.length || 0,
          totalPages: response.pagination?.totalPages || 1,
        }));
      } else if (Array.isArray(response)) {
        // Réponse directe sous forme de tableau
        setQuestions(response);
        setPagination(prev => ({
          ...prev,
          total: response.length,
          totalPages: 1,
        }));
      } else {
        // Aucune donnée
        setQuestions([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalPages: 1,
        }));
      }
    } catch (error) {
      console.error('Error loading chatbot questions:', error);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors du chargement des questions';
      
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
        console.warn('Non-critical error loading questions:', errorMessage);
      }
      
      setQuestions([]);
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
      await adminService.updateChatbotQuestion(id, updateData);
      toast.success('Question mise à jour avec succès');
      loadQuestions();
      if (selectedQuestion && selectedQuestion._id === id) {
        setSelectedQuestion(null);
      }
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      answered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[status] || colors.new;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'archived':
        return <ArchiveBoxIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  if (isLoading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" text="Chargement des questions..." />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Questions Chatbot</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pagination.total} question{pagination.total > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="new">Nouveau</option>
              <option value="answered">Répondu</option>
              <option value="archived">Archivé</option>
            </select>
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
                placeholder="Question, nom, email..."
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {questions.length === 0 ? (
          <div className="p-12 text-center">
            <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Aucune question pour le moment
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {questions.map((question) => (
                  <tr key={question._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium max-w-md truncate">{question.question}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {question.name && (
                          <div className="text-sm font-medium">{question.name}</div>
                        )}
                        {question.email && (
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {question.email}
                          </div>
                        )}
                        {!question.name && !question.email && (
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Anonyme
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                        {getStatusIcon(question.status)}
                        <span className="ml-1">{question.statusDisplay || question.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(question.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedQuestion(question)}
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

      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onUpdate={handleStatusUpdate}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

const QuestionDetailModal = ({ question, onClose, onUpdate, darkMode }) => {
  const [status, setStatus] = useState(question.status);
  const [answer, setAnswer] = useState(question.answer || '');
  const [notes, setNotes] = useState(question.notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(question._id, {
      status,
      answer: answer.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <h3 className="text-xl font-bold">Détails de la question</h3>
          <button onClick={onClose} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Question</label>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
              {question.question}
            </div>
          </div>

          {(question.name || question.email) && (
            <div className="grid grid-cols-2 gap-4">
              {question.name && (
                <div>
                  <label className="block text-sm font-medium mb-2">Nom</label>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                    {question.name}
                  </div>
                </div>
              )}
              {question.email && (
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm`}>
                    {question.email}
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="new">Nouveau</option>
                <option value="answered">Répondu</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Réponse</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="Entrez votre réponse..."
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
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

export default ChatbotQuestionsManagement;

