import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpenIcon, 
  CreditCardIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import MyCourses from '../components/MyCourses';
import paymentsService from '../services/payments';
import LoadingSpinner from '../components/LoadingSpinner';

const MyTraining = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab, currentPage]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentsService.getPaymentHistory(currentPage, 10);
      setPayments(response.data.payments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>Mes Formations - Expérience Tech</title>
        <meta name="description" content="Gérez vos formations et suivez votre progression d'apprentissage." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes Formations
            </h1>
            <p className="text-gray-600">
              Gérez vos inscriptions, suivez votre progression et consultez votre historique de paiements
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'courses'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BookOpenIcon className="w-5 h-5 inline mr-2" />
                  Mes Cours
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'payments'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <CreditCardIcon className="w-5 h-5 inline mr-2" />
                  Historique des Paiements
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'courses' ? (
            <MyCourses />
          ) : (
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucun paiement trouvé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Vous n'avez effectué aucun paiement pour le moment.
                  </p>
                  <a
                    href="/training"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Découvrir les formations
                  </a>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Historique des Paiements
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <div key={payment._id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <img
                                src={payment.course.image}
                                alt={payment.course.title}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {payment.course.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {formatDate(payment.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {payment.amount.toLocaleString('fr-FR')} FCFA
                              </div>
                              <div className="text-sm text-gray-600">
                                {payment.paymentMethodDisplay}
                              </div>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                              {getStatusText(payment.status)}
                            </span>
                            
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <EyeIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        {payment.status === 'failed' && payment.failureReason && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center">
                              <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="text-sm text-blue-800">
                                {payment.failureReason}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Précédent
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyTraining;
