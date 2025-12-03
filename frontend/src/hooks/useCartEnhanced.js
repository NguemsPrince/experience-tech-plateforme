import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';
import apiEnhanced from '../services/apiEnhanced';

/**
 * Hook personnalisé pour gérer le panier de manière avancée
 * - Synchronisation avec le serveur pour les utilisateurs connectés
 * - Persistance locale pour les invités
 * - Calculs automatiques (total, taxes, réductions)
 * - Gestion des coupons de réduction
 */
const useCartEnhanced = () => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Constantes pour les calculs
  const TAX_RATE = 0.18; // 18% TVA
  const SHIPPING_RATES = {
    standard: 2000, // 2000 FCFA
    express: 5000,  // 5000 FCFA
    free: 0
  };

  // Charger le panier au montage
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user]);

  // Charger le panier depuis le serveur ou localStorage
  const loadCart = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated && user) {
        // Charger depuis le serveur
        const response = await apiEnhanced.get('/cart');
        if (response.success && response.data) {
          setCartItems(response.data.items || []);
          setAppliedCoupon(response.data.coupon || null);
        }
      } else {
        // Charger depuis localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart.items || []);
            setAppliedCoupon(parsedCart.coupon || null);
          } catch (error) {
            console.error('Erreur lors du parsing du panier:', error);
            setCartItems([]);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      toast.error('Erreur lors du chargement du panier');
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder le panier
  const saveCart = useCallback(async (items, coupon = appliedCoupon) => {
    try {
      if (isAuthenticated && user) {
        // Sauvegarder sur le serveur
        await apiEnhanced.post('/cart', {
          items,
          coupon
        });
      } else {
        // Sauvegarder en local
        localStorage.setItem('cart', JSON.stringify({
          items,
          coupon,
          updatedAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
      // Ne pas afficher d'erreur à l'utilisateur pour la sauvegarde
    }
  }, [isAuthenticated, user, appliedCoupon]);

  // Ajouter un article au panier
  const addToCart = useCallback(async (item) => {
    try {
      const existingItemIndex = cartItems.findIndex(
        cartItem => cartItem._id === item._id || cartItem.id === item.id
      );

      let newItems;
      if (existingItemIndex > -1) {
        // Augmenter la quantité si l'article existe déjà
        newItems = cartItems.map((cartItem, index) => 
          index === existingItemIndex
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
        toast.success('Quantité mise à jour');
      } else {
        // Ajouter un nouvel article
        newItems = [...cartItems, { ...item, quantity: 1 }];
        toast.success('Article ajouté au panier');
      }

      setCartItems(newItems);
      await saveCart(newItems);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error('Erreur lors de l\'ajout au panier');
      return { success: false, error };
    }
  }, [cartItems, saveCart]);

  // Mettre à jour la quantité d'un article
  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      const newItems = cartItems.map(item =>
        (item._id === itemId || item.id === itemId)
          ? { ...item, quantity: newQuantity }
          : item
      );

      setCartItems(newItems);
      await saveCart(newItems);
      toast.success('Quantité mise à jour');
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
      return { success: false, error };
    }
  }, [cartItems, saveCart]);

  // Supprimer un article du panier
  const removeFromCart = useCallback(async (itemId) => {
    try {
      const newItems = cartItems.filter(
        item => item._id !== itemId && item.id !== itemId
      );

      setCartItems(newItems);
      await saveCart(newItems);
      toast.success('Article retiré du panier');
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
      return { success: false, error };
    }
  }, [cartItems, saveCart]);

  // Vider le panier
  const clearCart = useCallback(async () => {
    try {
      setCartItems([]);
      setAppliedCoupon(null);
      await saveCart([], null);
      toast.success('Panier vidé');
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      toast.error('Erreur lors du vidage du panier');
      return { success: false, error };
    }
  }, [saveCart]);

  // Appliquer un coupon de réduction
  const applyCoupon = useCallback(async (couponCode) => {
    try {
      setIsLoading(true);
      const response = await apiEnhanced.post('/cart/apply-coupon', {
        code: couponCode,
        cartTotal: getSubtotal()
      });

      if (response.success && response.data) {
        setAppliedCoupon(response.data.coupon);
        await saveCart(cartItems, response.data.coupon);
        toast.success(`Coupon "${couponCode}" appliqué avec succès !`);
        return { success: true, coupon: response.data.coupon };
      }
    } catch (error) {
      console.error('Erreur lors de l\'application du coupon:', error);
      toast.error(error.message || 'Coupon invalide ou expiré');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, saveCart]);

  // Retirer un coupon
  const removeCoupon = useCallback(async () => {
    try {
      setAppliedCoupon(null);
      await saveCart(cartItems, null);
      toast.success('Coupon retiré');
      return { success: true };
    } catch (error) {
      console.error('Erreur lors du retrait du coupon:', error);
      return { success: false, error };
    }
  }, [cartItems, saveCart]);

  // Calculer le sous-total (avant réductions et taxes)
  const getSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.price || item.salePrice || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  }, [cartItems]);

  // Calculer la réduction du coupon
  const getCouponDiscount = useCallback(() => {
    if (!appliedCoupon) return 0;

    const subtotal = getSubtotal();
    
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.value, subtotal);
    }
    
    return 0;
  }, [appliedCoupon, getSubtotal]);

  // Calculer le total après réduction mais avant taxes
  const getSubtotalAfterDiscount = useCallback(() => {
    return Math.max(0, getSubtotal() - getCouponDiscount());
  }, [getSubtotal, getCouponDiscount]);

  // Calculer les taxes
  const getTaxes = useCallback(() => {
    return getSubtotalAfterDiscount() * TAX_RATE;
  }, [getSubtotalAfterDiscount]);

  // Calculer les frais de livraison
  const getShippingCost = useCallback(() => {
    const subtotal = getSubtotalAfterDiscount();
    
    // Livraison gratuite si le total dépasse 50000 FCFA
    if (subtotal >= 50000) {
      return 0;
    }
    
    return SHIPPING_RATES[shippingMethod] || SHIPPING_RATES.standard;
  }, [getSubtotalAfterDiscount, shippingMethod]);

  // Calculer le total final
  const getTotal = useCallback(() => {
    return getSubtotalAfterDiscount() + getTaxes() + getShippingCost();
  }, [getSubtotalAfterDiscount, getTaxes, getShippingCost]);

  // Calculer le nombre total d'articles
  const getItemsCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cartItems]);

  // Vérifier si un article est dans le panier
  const isInCart = useCallback((itemId) => {
    return cartItems.some(item => item._id === itemId || item.id === itemId);
  }, [cartItems]);

  // Obtenir la quantité d'un article
  const getItemQuantity = useCallback((itemId) => {
    const item = cartItems.find(item => item._id === itemId || item.id === itemId);
    return item ? item.quantity || 1 : 0;
  }, [cartItems]);

  // Toggle du panier
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Résumé des calculs (mémoïsé pour éviter les recalculs)
  const summary = useMemo(() => ({
    subtotal: getSubtotal(),
    discount: getCouponDiscount(),
    subtotalAfterDiscount: getSubtotalAfterDiscount(),
    taxes: getTaxes(),
    shipping: getShippingCost(),
    total: getTotal(),
    itemsCount: getItemsCount()
  }), [
    getSubtotal, 
    getCouponDiscount, 
    getSubtotalAfterDiscount, 
    getTaxes, 
    getShippingCost, 
    getTotal, 
    getItemsCount
  ]);

  // Valider le panier avant le paiement
  const validateCart = useCallback(() => {
    const errors = [];

    if (cartItems.length === 0) {
      errors.push('Le panier est vide');
    }

    // Vérifier la disponibilité des articles
    cartItems.forEach(item => {
      if (item.stock !== undefined && item.stock < (item.quantity || 1)) {
        errors.push(`Stock insuffisant pour ${item.title || item.name}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [cartItems]);

  return {
    // État
    cartItems,
    isCartOpen,
    isLoading,
    appliedCoupon,
    shippingMethod,
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    toggleCart,
    openCart,
    closeCart,
    setShippingMethod,
    loadCart,
    validateCart,
    
    // Getters
    getSubtotal,
    getCouponDiscount,
    getSubtotalAfterDiscount,
    getTaxes,
    getShippingCost,
    getTotal,
    getItemsCount,
    isInCart,
    getItemQuantity,
    
    // Résumé
    summary,
    
    // Constantes
    TAX_RATE,
    SHIPPING_RATES
  };
};

export default useCartEnhanced;

