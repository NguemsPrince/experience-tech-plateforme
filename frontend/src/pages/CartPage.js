import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import { useProductCatalog } from '../contexts/ProductContext';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recordOrder } = useProductCatalog();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    groupedItems
  } = useCart();

  const [selectedItem, setSelectedItem] = React.useState(null);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour procéder au paiement');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    // Pour le moment, on paie le premier article du panier
    // TODO: Implémenter le paiement multi-articles
    if (cartItems.length > 0) {
      setSelectedItem(cartItems[0]);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    // Enregistrer la commande
    const orderItems = cartItems.map(item => ({
      id: item.id || item._id,
      type: item.type || 'product',
      name: item.title || item.name,
      price: item.price,
      quantity: item.quantity
    }));

    recordOrder({
      customerId: user?.id,
      customerName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Client',
      items: orderItems,
      total: calculateTotal() - calculateDiscount(),
      paymentMethod: 'mobile_money',
      status: 'completed'
    });

    toast.success('Paiement effectué avec succès !');
    clearCart();
    
    // Rediriger selon le type d'articles
    const hasProducts = cartItems.some(item => item.type === 'product');
    const hasCourses = cartItems.some(item => item.type === 'course');
    
    if (hasCourses && !hasProducts) {
      navigate('/my-courses');
    } else {
      navigate('/client/orders');
    }
  };

  return (
    <>
      <Helmet>
        <title>Mon Panier - Expérience Tech</title>
        <meta name="description" content="Gérez votre panier et finalisez votre commande." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/training"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Retour aux formations
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mon Panier
            </h1>
            <p className="text-gray-600">
              {cartItems.length > 0
                ? `${getCartItemsCount()} article${getCartItemsCount() > 1 ? 's' : ''} dans votre panier`
                : 'Votre panier est vide'}
            </p>
          </div>

          {/* Content */}
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <ShoppingCartIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Votre panier est vide
              </h3>
              <p className="text-gray-600 mb-8">
                Ajoutez des produits ou formations à votre panier
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Voir les produits
                </Link>
                <Link
                  to="/training"
                  className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Voir les formations
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm p-6 flex gap-6"
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === 'course' ? (
                          <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                        ) : (
                          <CubeIcon className="w-5 h-5 text-primary-600" />
                        )}
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item.title || item.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {item.type === 'course' 
                          ? (item.instructor || 'Instructeur')
                          : (item.brand ? `Marque: ${item.brand}` : item.description?.substring(0, 50) + '...')
                        }
                      </p>
                      {item.type === 'product' && item.stock !== undefined && (
                        <p className={`text-sm mb-2 ${item.stock > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                          Stock: {item.stock} disponible{item.stock > 1 ? 's' : ''}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">Quantité:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1, item.type)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.type === 'product' && item.stock !== undefined && item.quantity >= item.stock) {
                                  toast.error('Stock insuffisant');
                                  return;
                                }
                                updateQuantity(item._id, item.quantity + 1, item.type);
                              }}
                              disabled={item.type === 'product' && item.stock !== undefined && item.quantity >= item.stock}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            removeFromCart(item._id, item.type);
                            toast.success('Article supprimé du panier');
                          }}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {(item.originalPrice * item.quantity).toLocaleString('fr-FR')} FCFA
                        </div>
                      )}
                      <div className="text-sm text-gray-600 mt-1">
                        {item.price.toLocaleString('fr-FR')} FCFA par {item.type === 'course' ? 'formation' : 'unité'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Récapitulatif
                  </h2>

                  {/* Summary Items */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span className="font-semibold">
                        {calculateTotal().toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction</span>
                        <span className="font-semibold">
                          -{calculateDiscount().toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-purple-600">
                          {(calculateTotal() - calculateDiscount()).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                    Procéder au paiement
                  </button>

                  {/* Info */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Paiement sécurisé</p>
                        <p className="text-blue-700">
                          Plusieurs méthodes de paiement acceptées, y compris les cartes prépayées
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Continue Shopping */}
                  <div className="mt-4 space-y-2">
                    <Link
                      to="/products"
                      className="block text-center text-primary-600 hover:text-primary-700 transition-colors font-medium"
                    >
                      Continuer les achats produits
                    </Link>
                    <Link
                      to="/training"
                      className="block text-center text-purple-600 hover:text-purple-700 transition-colors font-medium"
                    >
                      Continuer les achats formations
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedItem(null);
        }}
        course={selectedItem}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default CartPage;

