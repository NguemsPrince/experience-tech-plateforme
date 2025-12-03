import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const STORAGE_KEY = 'cart';

const buildKey = (item) => `${item.type}:${item.id}`;

const normalizeItem = (raw) => {
  if (!raw) return null;

  const id =
    raw.id ||
    raw._id ||
    raw.productId ||
    raw.courseId ||
    raw.slug ||
    null;

  if (!id) {
    return null;
  }

  const type =
    raw.type ||
    raw.itemType ||
    (raw.courseId || raw.instructor ? 'course' : 'product');

  const quantity = Math.max(Number(raw.quantity || 1), 1);
  const price = Number(
    raw.price ??
      raw.currentPrice ??
      raw.offerPrice ??
      raw.originalPrice ??
      0
  );

  const originalPrice =
    raw.originalPrice && raw.originalPrice < price
      ? price
      : Number(raw.originalPrice ?? price);

  const normalized = {
    id: id.toString(),
    _id: id.toString(), // backward compatibility
    type,
    title: raw.title || raw.name || raw.courseTitle || 'Produit',
    description: raw.description || raw.shortDescription || '',
    price,
    originalPrice,
    quantity,
    image:
      raw.image ||
      raw.thumbnail ||
      (Array.isArray(raw.images) ? raw.images[0] : null) ||
      '',
    brand: raw.brand || raw.instructor?.name || raw.instructor || '',
    availability: raw.availability || 'in_stock',
    stock:
      typeof raw.stock === 'number'
        ? raw.stock
        : typeof raw.availableSeats === 'number'
        ? raw.availableSeats
        : null,
    sku: raw.sku || null,
    data: raw,
  };

  return normalized;
};

const migrateStoredItems = (items) =>
  items
    .map((item) => normalizeItem(item))
    .filter(Boolean);

const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (!savedCart) return;

    try {
      const parsed = JSON.parse(savedCart);
      if (Array.isArray(parsed)) {
        setCartItems(migrateStoredItems(parsed));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((rawItem, quantity = 1) => {
    const normalized = normalizeItem({ ...rawItem, quantity });
    if (!normalized) return;

    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (item) =>
          item.id === normalized.id && item.type === normalized.type
      );

      if (existing) {
        return prevItems.map((item) =>
          item.id === normalized.id && item.type === normalized.type
            ? {
                ...item,
                quantity: item.quantity + normalized.quantity,
              }
            : item
        );
      }

      return [...prevItems, normalized];
    });
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity, itemType) => {
    const safeQuantity = Math.max(Number(newQuantity || 0), 0);

    if (safeQuantity === 0) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => {
          if (item.id !== itemId) return true;
          if (itemType && item.type !== itemType) return true;
          return false;
        })
      );
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== itemId) return item;
        if (itemType && item.type !== itemType) return item;

        return {
          ...item,
          quantity: safeQuantity,
        };
      })
    );
  }, []);

  const removeFromCart = useCallback((itemId, itemType) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        if (item.id !== itemId) return true;
        if (itemType && item.type !== itemType) return true;
        return false;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const getCartTotal = useCallback(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const getCartItemsCount = useCallback(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const isInCart = useCallback(
    (itemId, itemType) =>
      cartItems.some((item) => {
        if (item.id !== itemId) return false;
        if (itemType && item.type !== itemType) return false;
        return true;
      }),
    [cartItems]
  );

  const getItemQuantity = useCallback(
    (itemId, itemType) => {
      const item = cartItems.find((current) => {
        if (current.id !== itemId) return false;
        if (itemType && current.type !== itemType) return false;
        return true;
      });

      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const groupByType = useCallback(
    () =>
      cartItems.reduce(
        (acc, item) => {
          acc[item.type] = acc[item.type] || [];
          acc[item.type].push(item);
          return acc;
        },
        { product: [], course: [] }
      ),
    [cartItems]
  );

  return {
    cartItems,
    groupedItems: groupByType(),
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getItemQuantity,
    buildItemKey: buildKey,
    currentUser: user,
  };
};

export default useCart;
