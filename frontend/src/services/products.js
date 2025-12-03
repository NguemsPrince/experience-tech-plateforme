import api from './api';

const buildQueryString = (filters = {}) => {
      const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'all'
    ) {
      if (Array.isArray(value)) {
        value.forEach((entry) => params.append(key, entry));
      } else {
        params.append(key, value);
      }
    }
  });
  return params.toString();
};

export const productsService = {
  async getAllProducts(filters = {}) {
    try {
      const query = buildQueryString(filters);
      const url = query ? `/products?${query}` : '/products';
      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return mock data for development
      return {
        success: true,
        data: {
          products: [],
          pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
          filters: { price: { min: 0, max: 0 }, brands: [], categories: [] }
        }
      };
    }
  },

  async getCatalog(filters = {}) {
    return this.getAllProducts(filters);
  },

  async getHighlights() {
    try {
      return await api.get('/products/highlights');
    } catch (error) {
      console.error('Error fetching highlights:', error);
      return {
        success: true,
        data: { featured: [], promotions: [], bestsellers: [] }
      };
    }
  },

  async getProduct(id) {
    try {
      return await api.get(`/products/${id}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        message: 'Produit non trouvé'
      };
    }
  },

  async createProduct(payload) {
    return api.post('/products', payload);
  },

  async updateProduct(id, payload) {
    return api.put(`/products/${id}`, payload);
  },

  async deleteProduct(id) {
    return api.delete(`/products/${id}`);
  },
};