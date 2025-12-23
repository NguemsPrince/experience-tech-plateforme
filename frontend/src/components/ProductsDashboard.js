import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  CubeIcon,
  CurrencyDollarIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShoppingCartIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ServerIcon,
  LinkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import ProductModal from './ProductModal';
import QuickAddModal from './QuickAddModal';
import { productsService } from '../services/products';

const ProductsDashboard = ({ userRole = 'user' }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadProducts();
    loadStats();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productsService.getAllProducts(filters);
      if (response.success) {
        // S'assurer que response.data est un tableau
        const productsData = response.data;
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData && Array.isArray(productsData.products)) {
          setProducts(productsData.products);
        } else if (productsData && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        } else {
          console.warn('Response data is not an array:', productsData);
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await productsService.getProductStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filteredProducts = useMemo(() => {
    // S'assurer que products est un tableau avant de filtrer
    if (!Array.isArray(products)) {
      console.warn('products is not an array:', products);
      return [];
    }
    
    return products.filter(product => {
      // Vérifier que product existe et a les propriétés nécessaires
      if (!product || !product.name || !product.description) {
        return false;
      }
      
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.technologies && Array.isArray(product.technologies) && 
                            product.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesType = filters.type === 'all' || product.type === filters.type;
      const matchesStatus = filters.status === 'all' || product.status === filters.status;

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [products, searchQuery, filters]);

  const handleProductSubmit = (newProduct) => {
    if (selectedProduct) {
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? newProduct : p));
    } else {
      setProducts(prev => [newProduct, ...prev]);
    }
    setSelectedProduct(null);
    loadStats();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await productsService.deleteProduct(id);
        if (response.success) {
          setProducts(prev => prev.filter(p => p.id !== id));
          loadStats();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handlePurchase = async (id) => {
    try {
      const response = await productsService.purchaseProduct(id);
      if (response.success) {
        // Mettre à jour le nombre de ventes
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, sales: p.sales + 1 } : p
        ));
      }
    } catch (error) {
      console.error('Error purchasing:', error);
    }
  };

  const clearFilters = () => {
    setFilters({ category: 'all', type: 'all', status: 'all' });
    setSearchQuery('');
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'application': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'template': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'api': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'plugin': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'library': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'tool': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'web': return ComputerDesktopIcon;
      case 'mobile': return DevicePhoneMobileIcon;
      case 'backend': return ServerIcon;
      default: return CubeIcon;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Catalogue de Produits
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Découvrez et achetez nos produits numériques
          </p>
        </div>
        {userRole === 'admin' && (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setShowModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouveau produit</span>
            </button>
            <button
              onClick={() => setShowQuickModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Ajout rapide</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Disponibles</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSales || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Ventes</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalRevenue ? `${(stats.totalRevenue / 1000).toFixed(0)}k` : '0'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Revenus (F CFA)</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.averageRating || 0}/5</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Note moyenne</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.soldOut || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Rupture stock</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Toutes catégories</option>
              <option value="application">Application</option>
              <option value="template">Template</option>
              <option value="api">API</option>
              <option value="plugin">Plugin</option>
              <option value="library">Library</option>
              <option value="tool">Outil</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Tous types</option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="backend">Backend</option>
              <option value="desktop">Desktop</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Tous statuts</option>
              <option value="disponible">Disponible</option>
              <option value="en_rupture">En rupture</option>
              <option value="bientôt_disponible">Bientôt disponible</option>
            </select>

            {(searchQuery || Object.values(filters).some(f => f !== 'all')) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                <span className="text-sm">Effacer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const TypeIcon = getTypeIcon(product.type);
          return (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <TypeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {typeof product.category === 'string' ? product.category : (product.category?.name || 'Non défini')} • {typeof product.type === 'string' ? product.type : (product.type?.name || 'Non défini')}
                      </p>
                    </div>
                  </div>
                  
                  {userRole === 'admin' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Features */}
                {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {typeof feature === 'string' ? feature : (feature?.name || String(feature))}
                        </span>
                      ))}
                      {product.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          +{product.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {product.technologies && Array.isArray(product.technologies) && product.technologies.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.technologies.slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                        >
                          {typeof tech === 'string' ? tech : (tech?.name || String(tech))}
                        </span>
                      ))}
                      {product.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                          +{product.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <StarSolid className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.rating}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({product.reviews} avis)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShoppingCartIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.sales} ventes
                    </span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {product.price?.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    {product.demoUrl && (
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handlePurchase(product.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Acheter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || Object.values(filters).some(f => f !== 'all')
              ? 'Aucun produit ne correspond à vos critères de recherche.'
              : 'Aucun produit disponible pour le moment.'}
          </p>
          {userRole === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer un produit
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        onSuccess={handleProductSubmit}
        product={selectedProduct}
      />

      <QuickAddModal
        isOpen={showQuickModal}
        onClose={() => setShowQuickModal(false)}
        onSuccess={(newProduct) => {
          setProducts(prev => [newProduct, ...prev]);
          setShowQuickModal(false);
        }}
        type="product"
      />
    </div>
  );
};

export default ProductsDashboard;
