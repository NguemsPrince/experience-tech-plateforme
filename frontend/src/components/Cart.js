import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  XMarkIcon, 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

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

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showToast = (message, type = 'success') => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCheckout = () => {
    if (!user) {
      showToast('Veuillez vous connecter pour procéder au paiement', 'error');
      return;
    }
    
    if (cartItems.length === 0) {
      showToast('Votre panier est vide', 'error');
      return;
    }
    
    // Ici, vous pouvez rediriger vers la page de paiement
    showToast('Redirection vers le paiement...', 'success');
    console.log('Redirection vers le paiement...');
  };

  const handleRemoveItem = (courseId) => {
    onRemoveItem(courseId);
    showToast('Formation supprimée du panier', 'success');
  };

  const handleUpdateQuantity = (courseId, newQuantity) => {
    onUpdateQuantity(courseId, newQuantity);
    showToast('Quantité mise à jour', 'success');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-60 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
              <span className="text-gray-900 font-medium">{notificationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Cart Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-full max-w-full md:max-w-md bg-white shadow-xl modal-content"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <ShoppingCartIcon className="w-6 h-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Panier ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Fermer le panier"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex flex-col h-full">
            {cartItems.length === 0 ? (
              /* Empty Cart */
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-600">
                    Ajoutez des formations pour commencer votre apprentissage
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Course Image */}
                          <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Course Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.category}
                            </p>
                            
                            {/* Price */}
                            <div className="mt-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">
                                  {item.price.toLocaleString('fr-FR')} FCFA
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {item.originalPrice.toLocaleString('fr-FR')} FCFA
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                  disabled={item.quantity <= 1}
                                  aria-label="Diminuer la quantité"
                                >
                                  <MinusIcon className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="w-12 text-center font-medium flex items-center justify-center min-h-[44px]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                  aria-label="Augmenter la quantité"
                                >
                                  <PlusIcon className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(item._id)}
                                className="p-1 hover:bg-blue-100 rounded transition-colors duration-200"
                              >
                                <TrashIcon className="w-4 h-4 text-blue-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Cart Summary */}
                <div className="border-t border-gray-200 p-6">
                  {/* Clear Cart Button */}
                  <div className="mb-4">
                    <button
                      onClick={onClearCart}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      Vider le panier
                    </button>
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-medium">
                        {calculateTotal().toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                    
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Économies:</span>
                        <span className="font-medium text-green-600">
                          -{calculateDiscount().toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        {calculateTotal().toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[48px] touch-target"
                    aria-label="Procéder au paiement"
                  >
                    <CreditCardIcon className="w-5 h-5" />
                    <span>Procéder au paiement</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </>
  );
};

export default Cart;
