import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  TagIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import useCartEnhanced from '../hooks/useCartEnhanced';
import LoadingButton from './LoadingButton';

/**
 * Composant de panier amélioré avec calculs détaillés
 */
const CartEnhanced = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    isLoading,
    appliedCoupon,
    shippingMethod,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShippingMethod,
    summary,
    validateCart,
    SHIPPING_RATES
  } = useCartEnhanced();

  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Formater les prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Gérer l'application du coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Veuillez entrer un code de coupon');
      return;
    }

    setIsApplyingCoupon(true);
    const result = await applyCoupon(couponCode);
    if (result.success) {
      setCouponCode('');
    }
    setIsApplyingCoupon(false);
  };

  // Gérer le passage à la commande
  const handleCheckout = () => {
    const validation = validateCart();
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Panier */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <ShoppingCartIcon className="h-6 w-6 mr-2" />
                Mon Panier ({summary.itemsCount})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Votre panier est vide</p>
                  <Link
                    to="/training"
                    onClick={closeCart}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Découvrir nos formations
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Articles */}
                  {cartItems.map((item) => (
                    <motion.div
                      key={item._id || item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title || item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}

                      {/* Détails */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {item.title || item.name}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          {formatPrice(item.price || item.salePrice || 0)}
                        </p>

                        {/* Contrôles de quantité */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) - 1)}
                            className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            disabled={isLoading}
                          >
                            <MinusIcon className="h-4 w-4 text-gray-600" />
                          </button>

                          <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                            {item.quantity || 1}
                          </span>

                          <button
                            onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) + 1)}
                            className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            disabled={isLoading}
                          >
                            <PlusIcon className="h-4 w-4 text-gray-600" />
                          </button>

                          <button
                            onClick={() => removeFromCart(item._id || item.id)}
                            className="ml-auto p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            disabled={isLoading}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Bouton vider le panier */}
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
                      disabled={isLoading}
                    >
                      Vider le panier
                    </button>
                  )}

                  {/* Code promo */}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code promo
                    </label>
                    
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <TagIcon className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-900">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Retirer
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="CODE"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isApplyingCoupon}
                        />
                        <LoadingButton
                          onClick={handleApplyCoupon}
                          isLoading={isApplyingCoupon}
                          disabled={!couponCode.trim() || isApplyingCoupon}
                          size="sm"
                        >
                          Appliquer
                        </LoadingButton>
                      </div>
                    )}
                  </div>

                  {/* Méthode de livraison */}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <TruckIcon className="h-5 w-5 mr-2" />
                      Mode de livraison
                    </label>
                    
                    <div className="space-y-2">
                      {Object.entries(SHIPPING_RATES).map(([method, cost]) => (
                        <label
                          key={method}
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="shipping"
                              value={method}
                              checked={shippingMethod === method}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-900 capitalize">
                              {method === 'standard' && 'Standard (3-5 jours)'}
                              {method === 'express' && 'Express (1-2 jours)'}
                              {method === 'free' && 'Retrait sur place'}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {cost === 0 ? 'Gratuit' : formatPrice(cost)}
                          </span>
                        </label>
                      ))}
                    </div>
                    
                    {summary.subtotalAfterDiscount >= 50000 && shippingMethod !== 'free' && (
                      <p className="mt-2 text-xs text-green-600 font-medium">
                        🎉 Livraison offerte pour commandes ≥ 50 000 FCFA !
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Résumé et checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-2 mb-4">
                  {/* Sous-total */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>

                  {/* Réduction */}
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Réduction</span>
                      <span>-{formatPrice(summary.discount)}</span>
                    </div>
                  )}

                  {/* Taxes */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>TVA (18%)</span>
                    <span>{formatPrice(summary.taxes)}</span>
                  </div>

                  {/* Livraison */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Livraison</span>
                    <span>
                      {summary.shipping === 0 ? 'Gratuit' : formatPrice(summary.shipping)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                    <span>Total</span>
                    <span>{formatPrice(summary.total)}</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-2">
                  <LoadingButton
                    onClick={handleCheckout}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Commander ({formatPrice(summary.total)})
                  </LoadingButton>

                  <button
                    onClick={closeCart}
                    className="w-full py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartEnhanced;

