import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CubeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useProductCatalog } from '../contexts/ProductContext';
import { useAuth } from '../hooks/useAuth';

const Orders = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { orders } = useProductCatalog();

  // Filtrer les commandes de l'utilisateur connecté
  const userOrders = React.useMemo(() => {
    if (!user) return [];
    return orders.filter(order => 
      order.customerId === user.id || 
      order.customerName?.toLowerCase().includes(`${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().trim())
    );
  }, [orders, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
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
        <title>Mes Commandes - Expérience Tech</title>
        <meta name="description" content="Consultez l'historique de vos commandes." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes Commandes
            </h1>
            <p className="text-gray-600">
              {userOrders.length > 0
                ? `${userOrders.length} commande${userOrders.length > 1 ? 's' : ''} au total`
                : 'Aucune commande pour le moment'}
            </p>
          </div>

          {/* Orders List */}
          {userOrders.length > 0 ? (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <ShoppingBagIcon className="w-6 h-6 text-gray-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande {order.reference || order.id}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="w-5 h-5 text-gray-600" />
                          <span className="text-xl font-bold text-gray-900">
                            {order.total?.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status || 'pending'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
                      Articles commandés
                    </h4>
                    <div className="space-y-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {item.type === 'product' ? (
                                <CubeIcon className="w-5 h-5 text-primary-600" />
                              ) : (
                                <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.name || item.title || 'Article'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantité: {item.quantity} × {item.price?.toLocaleString('fr-FR')} FCFA
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          Aucun article dans cette commande
                        </p>
                      )}
                    </div>

                    {/* Payment Method */}
                    {order.paymentMethod && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Méthode de paiement:</span>{' '}
                          {order.paymentMethod === 'mobile_money' ? 'Mobile Money' :
                           order.paymentMethod === 'prepaid_card' ? 'Carte prépayée' :
                           order.paymentMethod === 'bank_transfer' ? 'Virement bancaire' :
                           order.paymentMethod === 'stripe' ? 'Carte bancaire' :
                           order.paymentMethod}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Aucune commande
              </h3>
              <p className="text-gray-600 mb-8">
                Vous n'avez pas encore passé de commande. Parcourez notre catalogue pour découvrir nos produits et formations.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/products"
                  className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Voir les produits
                </a>
                <a
                  href="/training"
                  className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Voir les formations
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;

