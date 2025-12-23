import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ShoppingCartIcon,
  StarIcon,
  FireIcon,
  TagIcon,
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { productsService } from '../services/products';
import useCart from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  { value: 'Tous', label: 'Tous les produits' },
  { value: 'hardware', label: 'Matériels informatiques' },
  { value: 'accessories', label: 'Accessoires' },
  { value: 'networking', label: 'Réseaux' },
  { value: 'printing', label: 'Impression' },
];

const Products = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedBrand, setSelectedBrand] = useState('Tous');
  const [selectedAvailability, setSelectedAvailability] = useState('Tous');
  const [isNewFilter, setIsNewFilter] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Available brands and price range
  const [availableBrands, setAvailableBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, selectedBrand, selectedAvailability, isNewFilter, minPrice, maxPrice, sortBy, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getAllProducts();
      
      if (response.success && response.data) {
        const productsData = response.data.products || response.data || [];
        setProducts(productsData);
        
        // Extract brands
        const brands = [...new Set(productsData.map(p => p.brand).filter(Boolean))].sort();
        setAvailableBrands(brands);
        
        // Calculate price range
        if (productsData.length > 0) {
          const prices = productsData.map(p => p.price).filter(p => p > 0);
          setPriceRange({
            min: Math.min(...prices),
            max: Math.max(...prices)
          });
        }
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'Tous') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Availability filter
    if (selectedAvailability !== 'Tous') {
      const availabilityMap = {
        'En stock': 'in_stock',
        'Rupture de stock': 'out_of_stock',
        'Précommande': 'pre_order'
      };
      filtered = filtered.filter(p => p.availability === availabilityMap[selectedAvailability]);
    }

    // New products filter
    if (isNewFilter) {
      filtered = filtered.filter(p => p.isNew);
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'bestsellers':
          return (b.sales || 0) - (a.sales || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter un produit au panier');
      return;
    }

    if (product.availability === 'out_of_stock') {
      toast.error('Ce produit est en rupture de stock');
      return;
    }

    if (product.stock !== null && product.stock < 1) {
      toast.error('Stock insuffisant');
      return;
    }

    addToCart({
      ...product,
      type: 'product',
      id: product.id || product._id,
      title: product.name,
      image: product.thumbnail || product.images?.[0] || '',
    }, 1);

    toast.success(`${product.name} ajouté au panier !`);
  };

  const resetFilters = () => {
    setSelectedCategory('Tous');
    setSelectedBrand('Tous');
    setSelectedAvailability('Tous');
    setIsNewFilter(false);
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSortBy('newest');
  };

  const featuredProducts = filteredProducts.filter(p => p.isFeatured).slice(0, 3);
  const promoProducts = filteredProducts.filter(p => p.isPromo).slice(0, 3);
  const bestsellers = filteredProducts
    .filter(p => (p.sales || 0) > 0)
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Chargement des produits..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Boutique - Matériels & Accessoires - Expérience Tech</title>
        <meta name="description" content="Découvrez notre sélection de matériels informatiques, accessoires, équipements réseau et imprimantes au Cameroun." />
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Boutique Matériels & Accessoires
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Matériels informatiques, accessoires, réseaux et impression de qualité
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="container-custom">
            <div className="flex items-center mb-6">
              <SparklesIcon className="w-6 h-6 text-yellow-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Produits vedettes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Filtres
                  </h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-gray-600 hover:text-gray-900"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Filter */}
                  {availableBrands.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marque
                      </label>
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="Tous">Toutes les marques</option>
                        {availableBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Availability Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disponibilité
                    </label>
                    <select
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Tous">Tous</option>
                      <option value="En stock">En stock</option>
                      <option value="Rupture de stock">Rupture de stock</option>
                      <option value="Précommande">Précommande</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (FCFA)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* New Products Filter */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isNewFilter}
                        onChange={(e) => setIsNewFilter(e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Nouveautés uniquement</span>
                    </label>
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and Results Count */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <p className="text-gray-600 mb-4 sm:mb-0">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="bestsellers">Plus vendus</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">Aucun produit trouvé</p>
                  <button
                    onClick={resetFilters}
                    className="btn-outline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id || product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      {promoProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-center mb-6">
              <TagIcon className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Promotions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promoProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  promo
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers Section */}
      {bestsellers.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center mb-6">
              <FireIcon className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Meilleures ventes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bestsellers.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  bestseller
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart, featured = false, promo = false, bestseller = false }) => {
  const categoryLabels = {
    hardware: 'Matériels informatiques',
    accessories: 'Accessoires',
    networking: 'Réseaux',
    printing: 'Impression',
  };

  const availabilityLabels = {
    in_stock: { label: 'En stock', color: 'bg-green-100 text-green-800' },
    out_of_stock: { label: 'Rupture', color: 'bg-blue-100 text-blue-800' },
    pre_order: { label: 'Précommande', color: 'bg-blue-100 text-blue-800' },
  };

  const availability = availabilityLabels[product.availability] || availabilityLabels.in_stock;
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400x300'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              Nouveau
            </span>
          )}
          {product.isPromo && discount > 0 && (
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              -{discount}%
            </span>
          )}
          {featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Vedette
            </span>
          )}
          {bestseller && (
            <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-semibold">
              Best-seller
            </span>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${availability.color}`}>
            {availability.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1">
          {(() => {
            const categoryValue = typeof product.category === 'string' ? product.category : (product.category?.name || '');
            return categoryLabels[categoryValue] || categoryValue;
          })()}
        </p>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-gray-600 mb-2">
            {typeof product.brand === 'string' ? product.brand : (product.brand?.name || String(product.brand))}
          </p>
        )}

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              i < Math.floor(product.rating) ? (
                <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
              ) : (
                <StarIcon key={i} className="w-4 h-4 text-gray-300" />
              )
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              {product.price.toLocaleString('fr-FR')} FCFA
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {product.originalPrice.toLocaleString('fr-FR')} FCFA
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.availability === 'out_of_stock' || (product.stock !== null && product.stock < 1)}
          className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCartIcon className="w-5 h-5 mr-2" />
          {product.availability === 'out_of_stock' || (product.stock !== null && product.stock < 1)
            ? 'Indisponible'
            : 'Ajouter au panier'}
        </button>
      </div>
    </motion.div>
  );
};

export default Products;

