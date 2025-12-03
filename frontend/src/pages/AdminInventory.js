import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useProductCatalog } from '../contexts/ProductContext';
import { useAuth } from '../hooks/useAuth';
import ProductModal from '../components/ProductModal';
import { toast } from 'react-hot-toast';

const AdminInventory = () => {
  const { user } = useAuth();
  const {
    products,
    lowStockProducts,
    totalInventoryValue,
    salesByMonth,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    categories,
    brands
  } = useProductCatalog();

  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  // Tous les hooks doivent être appelés avant tout retour conditionnel
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      
      const matchesStock = filterStock === 'all' ||
        (filterStock === 'low' && product.stock <= (product.lowStockThreshold || 5)) ||
        (filterStock === 'out' && product.stock === 0) ||
        (filterStock === 'in' && product.stock > (product.lowStockThreshold || 5));

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, filterCategory, filterStock]);

  const totalSales = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [orders]);

  const totalProductsSold = useMemo(() => {
    return orders.reduce((sum, order) => {
      return sum + (order.items?.reduce((itemSum, item) => {
        return itemSum + (item.type === 'product' ? item.quantity : 0);
      }, 0) || 0);
    }, 0);
  }, [orders]);

  // Vérifier que l'utilisateur est admin (après tous les hooks)
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(productId);
      toast.success('Produit supprimé avec succès');
    }
  };

  const handleProductSubmit = (productData) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);
      toast.success('Produit mis à jour avec succès');
    } else {
      addProduct(productData);
      toast.success('Produit ajouté avec succès');
    }
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleStockUpdate = (productId, newStock) => {
    updateStock(productId, Number(newStock));
    toast.success('Stock mis à jour');
  };

  return (
    <>
      <Helmet>
        <title>Gestion d'Inventaire - Admin - Expérience Tech</title>
        <meta name="description" content="Gérez l'inventaire des produits technologiques." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestion d'Inventaire
                </h1>
                <p className="text-gray-600">
                  Gérez vos produits, stocks et ventes
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setShowProductModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                <PlusIcon className="w-5 h-5" />
                Ajouter un produit
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <CubeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Produits</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Stock Faible</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Valeur Inventaire</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalInventoryValue / 1000).toFixed(0)}k FCFA
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCartIcon className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Ventes</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalSales / 1000).toFixed(0)}k FCFA
              </p>
            </div>
          </div>

          {/* Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                <p className="font-semibold text-yellow-800">
                  {lowStockProducts.length} produit{lowStockProducts.length > 1 ? 's' : ''} avec stock faible
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tous les stocks</option>
                <option value="low">Stock faible</option>
                <option value="out">Rupture</option>
                <option value="in">En stock</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ventes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded mr-3"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded mr-3 flex items-center justify-center">
                              <CubeIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            {product.sku && (
                              <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {typeof product.category === 'string' ? product.category : (product.category?.name || 'Non défini')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {product.price?.toLocaleString('fr-FR')} FCFA
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={product.stock || 0}
                            onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            min="0"
                          />
                          {product.stock <= (product.lowStockThreshold || 5) && (
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {product.totalSold || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Modifier"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun produit trouvé</p>
              </div>
            )}
          </div>

          {/* Sales History */}
          {salesByMonth.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Historique des ventes</h2>
              <div className="space-y-2">
                {salesByMonth.slice(0, 6).map((sale, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{sale.month}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {sale.total.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          isOpen={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={handleProductSubmit}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default AdminInventory;

