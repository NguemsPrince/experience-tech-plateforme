import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { v4 as uuid } from 'uuid';
import defaultProducts from '../data/defaultProducts';

const STORAGE_KEY = 'et:catalog:v1';
const ORDER_KEY = 'et:orders:v1';

const ProductContext = createContext(null);

const initialState = {
  products: [],
  orders: [],
  preferences: {
    lowStockThreshold: 5,
  },
  meta: {
    lastSyncedAt: null,
  },
};

const persistState = (state) => {
  try {
    const data = {
      products: state.products,
      preferences: state.preferences,
      meta: state.meta,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.localStorage.setItem(
      ORDER_KEY,
      JSON.stringify({ orders: state.orders }),
    );
  } catch (error) {
    console.warn('Unable to persist product state', error);
  }
};

const loadPersistedState = () => {
  try {
    const storedCatalog = window.localStorage.getItem(STORAGE_KEY);
    const storedOrders = window.localStorage.getItem(ORDER_KEY);

    const catalog = storedCatalog ? JSON.parse(storedCatalog) : null;
    const orders = storedOrders ? JSON.parse(storedOrders) : null;

    return {
      products: catalog?.products?.length ? catalog.products : defaultProducts,
      orders: orders?.orders?.length ? orders.orders : [],
      preferences: {
        ...initialState.preferences,
        ...(catalog?.preferences || {}),
      },
      meta: {
        ...initialState.meta,
        ...(catalog?.meta || {}),
      },
    };
  } catch (error) {
    console.warn('Unable to load stored catalog', error);
    return {
      ...initialState,
      products: defaultProducts,
    };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...state, ...action.payload };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        meta: { ...state.meta, lastSyncedAt: new Date().toISOString() },
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? { ...product, ...action.payload.updates }
            : product,
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.id),
      };
    case 'RECORD_ORDER': {
      const { order } = action.payload;

      const updatedProducts = state.products.map((product) => {
        const orderEntry = order.items.find(
          (item) => item.id === product.id && item.type === 'product',
        );
        if (!orderEntry) {
          return product;
        }

        const newStock = Math.max((product.stock || 0) - orderEntry.quantity, 0);

        return {
          ...product,
          stock: newStock,
          totalSold: (product.totalSold || 0) + orderEntry.quantity,
          updatedAt: new Date().toISOString(),
        };
      });

      return {
        ...state,
        products: updatedProducts,
        orders: [order, ...state.orders],
      };
    }
    case 'UPDATE_STOCK':
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? {
                ...product,
                stock: Math.max(action.payload.stock, 0),
                updatedAt: new Date().toISOString(),
              }
            : product,
        ),
      };
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loaded = loadPersistedState();
    dispatch({ type: 'INITIALIZE', payload: loaded });
  }, []);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const categories = useMemo(() => {
    const base = [
      'Matériels informatiques',
      'Accessoires',
      'Réseaux',
      'Impression',
    ];
    const dynamic = new Set(state.products.map((product) => product.category));
    base.forEach((item) => dynamic.add(item));
    return Array.from(dynamic);
  }, [state.products]);

  const brands = useMemo(() => {
    const distinct = new Set(
      state.products
        .map((product) => product.brand)
        .filter((brand) => Boolean(brand)),
    );
    return Array.from(distinct).sort();
  }, [state.products]);

  const lowStockProducts = useMemo(() => {
    const threshold = state.preferences.lowStockThreshold;

    return state.products.filter((product) => {
      const productThreshold = product.lowStockThreshold ?? threshold;
      return typeof product.stock === 'number' && product.stock <= productThreshold;
    });
  }, [state.products, state.preferences.lowStockThreshold]);

  const totalInventoryValue = useMemo(
    () =>
      state.products.reduce(
        (sum, product) =>
          sum + (product.stock || 0) * Number(product.price || 0),
        0,
      ),
    [state.products],
  );

  const addProduct = useCallback((payload) => {
    const id = payload.id || payload.sku || uuid();
    const now = new Date().toISOString();
    const newProduct = {
      id,
      sku: payload.sku || id.toString().slice(0, 12).toUpperCase(),
      name: payload.name,
      description: payload.description,
      category: payload.category,
      brand: payload.brand,
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      type: payload.type || 'produit',
      images: payload.images?.length ? payload.images : payload.image ? [payload.image] : [],
      tags: payload.tags || payload.features || [],
      rating: payload.rating || 0,
      totalSold: payload.totalSold || 0,
      previousPrice: payload.previousPrice || null,
      lowStockThreshold:
        typeof payload.lowStockThreshold === 'number'
          ? payload.lowStockThreshold
          : undefined,
      createdAt: now,
      updatedAt: now,
    };

    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: {
        id,
        updates: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }, []);

  const deleteProduct = useCallback((id) => {
    dispatch({ type: 'DELETE_PRODUCT', id });
  }, []);

  const updateStock = useCallback((id, stock) => {
    dispatch({ type: 'UPDATE_STOCK', payload: { id, stock } });
  }, []);

  const recordOrder = useCallback((orderPayload) => {
    const order = {
      id: orderPayload.id || uuid(),
      reference:
        orderPayload.reference ||
        `CMD-${Date.now().toString(36).toUpperCase()}`,
      customerId: orderPayload.customerId || null,
      customerName: orderPayload.customerName || 'Client',
      items: orderPayload.items || [],
      total: orderPayload.total || 0,
      paymentMethod: orderPayload.paymentMethod || 'mobile_money',
      status: orderPayload.status || 'pending',
      createdAt: new Date().toISOString(),
      metadata: orderPayload.metadata || {},
    };

    dispatch({ type: 'RECORD_ORDER', payload: { order } });
    return order;
  }, []);

  const setPreferences = useCallback((preferences) => {
    dispatch({ type: 'SET_PREFERENCES', payload: preferences });
  }, []);

  const getProductById = useCallback(
    (id) => state.products.find((product) => product.id === id) || null,
    [state.products],
  );

  const filterProducts = useCallback(
    (filters = {}) => {
      const {
        search = '',
        category = 'all',
        brand = 'all',
        priceRange = [0, Number.MAX_SAFE_INTEGER],
        onlyAvailable = false,
        tags = [],
      } = filters;

      const normalizedSearch = search.trim().toLowerCase();
      const [minPrice, maxPrice] = priceRange;

      return state.products.filter((product) => {
        const matchesSearch =
          !normalizedSearch ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch) ||
          (product.tags || []).some((tag) =>
            tag.toLowerCase().includes(normalizedSearch),
          );

        const matchesCategory =
          category === 'all' || product.category === category;

        const matchesBrand = brand === 'all' || product.brand === brand;

        const price = Number(product.price || 0);
        const matchesPrice = price >= minPrice && price <= maxPrice;

        const matchesAvailability = !onlyAvailable || (product.stock || 0) > 0;

        const matchesTags =
          !tags.length ||
          tags.every((tag) =>
            (product.tags || []).map((entry) => entry.toLowerCase()).includes(tag.toLowerCase()),
          );

        return (
          matchesSearch &&
          matchesCategory &&
          matchesBrand &&
          matchesPrice &&
          matchesAvailability &&
          matchesTags
        );
      });
    },
    [state.products],
  );

  const salesByMonth = useMemo(() => {
    const buckets = {};

    state.orders.forEach((order) => {
      const monthKey = order.createdAt?.slice(0, 7) || 'unknown';
      buckets[monthKey] = (buckets[monthKey] || 0) + Number(order.total || 0);
    });

    return Object.entries(buckets)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => (a.month > b.month ? -1 : 1));
  }, [state.orders]);

  const value = useMemo(
    () => ({
      products: state.products,
      orders: state.orders,
      categories,
      brands,
      lowStockProducts,
      totalInventoryValue,
      salesByMonth,
      preferences: state.preferences,
      meta: state.meta,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      recordOrder,
      setPreferences,
      getProductById,
      filterProducts,
    }),
    [
      state.products,
      state.orders,
      categories,
      brands,
      lowStockProducts,
      totalInventoryValue,
      salesByMonth,
      state.preferences,
      state.meta,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      recordOrder,
      setPreferences,
      getProductById,
      filterProducts,
    ],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductCatalog = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductProvider');
  }
  return context;
};

