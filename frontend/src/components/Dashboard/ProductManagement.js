import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useStableModal } from '../../hooks/useStableModal';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
  CubeIcon,
  CurrencyDollarIcon,
  TagIcon,
  PhotoIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

const ProductManagement = React.memo(({ darkMode = false }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    availability: '',
    brand: '',
  });
  // Utiliser le hook stable pour les modals
  const createModal = useStableModal(false);
  const editModal = useStableModal(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    availability: 'in_stock',
    image: '',
    tags: '',
    specifications: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productStats, setProductStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const isMountedRef = useRef(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        search: searchQuery || undefined,
      };
      Object.keys(params).forEach((key) => params[key] === '' && delete params[key]);

      const response = await adminService.getProducts(params);
      
      // Le backend retourne { success: true, data: { products: [...], pagination: {...} } }
      if (response && response.data) {
        const productsList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.products || []);
        setProducts(productsList);
        setFilteredProducts(productsList);
      } else if (response && Array.isArray(response)) {
        setProducts(response);
        setFilteredProducts(response);
      } else if (response && response.products) {
        // Format alternatif avec products directement
        setProducts(response.products);
        setFilteredProducts(response.products);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors du chargement des produits';
      
      // Vérifier si c'est vraiment une erreur réseau (pas de réponse)
      const isNetworkError = !error.response && (
        error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' || 
        error.message?.includes('Network Error') ||
        error.message?.includes('Failed to fetch')
      );
      
      if (isNetworkError) {
        errorMessage = 'Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://localhost:5000';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.response?.status === 404) {
        // 404 n'est pas une erreur critique - juste aucune donnée
        errorMessage = null;
      } else if (error.response?.status >= 500) {
        errorMessage = 'Erreur serveur lors du chargement des produits. Veuillez réessayer plus tard.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Afficher l'erreur seulement pour les erreurs critiques
      if (errorMessage && (isNetworkError || error.response?.status >= 500)) {
        toast.error(errorMessage);
      } else if (errorMessage) {
        // Pour les autres erreurs non-critiques, juste logger
        console.warn('Non-critical error loading products:', errorMessage);
      }
      
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  // Vérifier si un produit avec le même nom existe déjà
  const checkProductNameExists = useCallback(async (productName) => {
    try {
      if (!productName || productName.trim().length < 3) {
        return false;
      }
      
      const response = await adminService.getProducts({ search: productName.trim() });
      const productsList = response?.data?.products || response?.products || (Array.isArray(response?.data) ? response.data : []) || (Array.isArray(response) ? response : []);
      
      // Vérifier si un produit avec exactement le même nom (insensible à la casse) existe
      const existingProduct = productsList.find(
        (p) => p.name.toLowerCase().trim() === productName.toLowerCase().trim()
      );
      
      return !!existingProduct;
    } catch (error) {
      console.error('Error checking product name:', error);
      return false;
    }
  }, []);

  const [nameExistsError, setNameExistsError] = useState(false);
  const [nameExistsMessage, setNameExistsMessage] = useState('');

  // Vérifier si un modal est ouvert
  const isModalOpen = createModal.isOpen || editModal.isOpen;

  // Protéger contre le démontage
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Debug: Surveiller les changements d'état du modal
  useEffect(() => {
    if (createModal.isOpen) {
      console.log('✅ [ProductManagement] Create modal is now OPEN');
    } else {
      console.log('❌ [ProductManagement] Create modal is now CLOSED');
    }
  }, [createModal.isOpen]);

  // Utiliser une ref pour éviter les re-renders inutiles
  const loadProductsRef = useRef(loadProducts);
  useEffect(() => {
    loadProductsRef.current = loadProducts;
  }, [loadProducts]);

  // Utiliser une ref pour isModalOpen pour éviter les re-renders
  const isModalOpenRef = useRef(false);
  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);
  
  useEffect(() => {
    // Ne pas recharger si un modal est ouvert ou si le composant n'est pas monté
    if (!isMountedRef.current || isModalOpenRef.current) {
      console.log('⏸️ [ProductManagement] Skipping loadProducts:', { 
        isMounted: isMountedRef.current, 
        isModalOpen: isModalOpenRef.current 
      });
      return;
    }
    console.log('🔄 [ProductManagement] Loading products...');
    loadProductsRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery]); // Retirer isModalOpen des dépendances

  useEffect(() => {
    if (products.length > 0 && !isModalOpen) {
      loadProductStats();
    }
  }, [products, isModalOpen]);

  // Empêcher le scroll du body quand un modal est ouvert et gérer Escape
  // Utiliser des refs pour éviter les dépendances qui changent
  const createModalRefForEscape = useRef(createModal);
  const editModalRefForEscape = useRef(editModal);
  const isCreatingRef = useRef(isCreating);
  const isUpdatingRef = useRef(isUpdating);
  
  useEffect(() => {
    createModalRefForEscape.current = createModal;
    editModalRefForEscape.current = editModal;
    isCreatingRef.current = isCreating;
    isUpdatingRef.current = isUpdating;
  }, [createModal, editModal, isCreating, isUpdating]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      // Vérifier que l'événement n'est pas déjà géré
      if (e.defaultPrevented || e.isPropagationStopped) {
        return;
      }
      
      if (e.key === 'Escape') {
        const createModal = createModalRefForEscape.current;
        const editModal = editModalRefForEscape.current;
        const isCreating = isCreatingRef.current;
        const isUpdating = isUpdatingRef.current;
        
        // Empêcher la fermeture si on est en train de créer ou mettre à jour
               if (isCreating || isUpdating) {
                 e.preventDefault();
                 e.stopPropagation();
                 return;
               }
               
               if (createModal.isOpen) {
                 e.preventDefault();
                 e.stopPropagation();
                 createModal.close();
               } else if (editModal.isOpen) {
                 e.preventDefault();
                 e.stopPropagation();
                 editModal.close();
                 setSelectedProduct(null);
               }
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      // Utiliser capture phase pour intercepter avant que d'autres handlers ne le fassent
      document.addEventListener('keydown', handleEscape, { capture: true, passive: false });
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape, { capture: true });
    };
  }, [isModalOpen]); // Seulement dépendre de isModalOpen

  const loadProductStats = async () => {
    try {
      setStatsLoading(true);
      // Calculate stats from products
      const stats = {
        total: products.length,
        inStock: products.filter(p => p.availability === 'in_stock').length,
        outOfStock: products.filter(p => p.availability === 'out_of_stock').length,
        lowStock: products.filter(p => (p.stock || 0) <= 10 && p.availability === 'in_stock').length,
        totalValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0),
        topSelling: products
          .filter(p => p.sales || p.salesCount)
          .sort((a, b) => (b.sales || b.salesCount || 0) - (a.sales || a.salesCount || 0))
          .slice(0, 5),
      };
      setProductStats(stats);
    } catch (error) {
      console.error('Error loading product stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Vérifier si le nom existe déjà lorsque l'utilisateur tape
    if (name === 'name' && value.trim().length >= 3) {
      checkProductNameExists(value).then((exists) => {
        if (exists) {
          setNameExistsError(true);
          setNameExistsMessage(`Un produit avec le nom "${value}" existe déjà. Veuillez utiliser un nom différent.`);
        } else {
          setNameExistsError(false);
          setNameExistsMessage('');
        }
      });
    } else if (name === 'name' && value.trim().length < 3) {
      setNameExistsError(false);
      setNameExistsMessage('');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Empêcher la fermeture pendant la création
    createModal.preventClose();

    // Validation des champs obligatoires
    if (!createFormData.name || !createFormData.description || !createFormData.price || !createFormData.category || !createFormData.brand) {
      toast.error('Veuillez remplir tous les champs obligatoires (nom, description, prix, catégorie, marque)');
      return;
    }

    // Vérifier si le nom existe déjà
    if (nameExistsError) {
      toast.error(nameExistsMessage || 'Un produit avec ce nom existe déjà. Veuillez utiliser un nom différent.');
      return;
    }

    // Vérifier à nouveau si le nom existe (double vérification)
    const nameExists = await checkProductNameExists(createFormData.name);
    if (nameExists) {
      setNameExistsError(true);
      setNameExistsMessage(`Un produit avec le nom "${createFormData.name}" existe déjà. Veuillez utiliser un nom différent.`);
      toast.error(`Un produit avec le nom "${createFormData.name}" existe déjà. Veuillez utiliser un nom différent.`, {
        duration: 6000,
      });
      return;
    }

    // Validation de la longueur de la description (backend requiert au moins 20 caractères)
    if (createFormData.description.length < 20) {
      toast.error('La description doit contenir au moins 20 caractères');
      return;
    }

    // Validation de la longueur du nom (backend requiert entre 3 et 150 caractères)
    if (createFormData.name.length < 3 || createFormData.name.length > 150) {
      toast.error('Le nom doit contenir entre 3 et 150 caractères');
      return;
    }

    // Validation de la marque (backend requiert entre 2 et 80 caractères)
    if (createFormData.brand.length < 2 || createFormData.brand.length > 80) {
      toast.error('La marque doit contenir entre 2 et 80 caractères');
      return;
    }

    setIsCreating(true);

    try {
      // Préparer les images - le modèle attend un tableau d'images avec au moins une image
      const images = createFormData.image 
        ? [createFormData.image] 
        : ['/images/default-product.jpg'];
      
      const productData = {
        name: createFormData.name.trim(),
        description: createFormData.description.trim(),
        category: createFormData.category,
        brand: createFormData.brand.trim(),
        price: parseFloat(createFormData.price),
        stock: parseInt(createFormData.stock) || 0,
        availability: createFormData.availability,
        images: images,
        thumbnail: images[0],
        tags: createFormData.tags ? createFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        specifications: [], // Les spécifications peuvent être ajoutées plus tard
        isActive: true,
      };

      const response = await adminService.createProduct(productData);

      if (response.success || response.data) {
        toast.success('Produit créé avec succès !');
        createModal.close();
        setNameExistsError(false);
        setNameExistsMessage('');
        setCreateFormData({
          name: '',
          description: '',
          category: '',
          brand: '',
          price: '',
          stock: '',
          availability: 'in_stock',
          image: '',
          tags: '',
          specifications: '',
        });
        await loadProducts();
      } else {
        toast.error(response.message || 'Erreur lors de la création du produit');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      
      let errorMessage = 'Erreur lors de la création du produit';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage = errorData.message || errorMessage;
        
        // Si c'est une erreur de duplication, afficher un message plus clair
        if (error.response.status === 409 || errorMessage.includes('existe déjà') || errorMessage.includes('déjà utilisé')) {
          errorMessage = errorMessage || 'Un produit avec ce nom existe déjà. Veuillez utiliser un nom différent.';
          
          // Suggérer de modifier le nom
          toast.error(errorMessage, {
            duration: 6000,
            style: {
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
            },
          });
          
          // Mettre en surbrillance le champ nom
          const nameInput = document.querySelector('input[name="name"]');
          if (nameInput) {
            nameInput.focus();
            nameInput.style.borderColor = '#ef4444';
            setTimeout(() => {
              nameInput.style.borderColor = '';
            }, 3000);
          }
          
          return;
        }
      }
      
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setIsCreating(false);
      // Réautoriser la fermeture après la création
      createModal.allowClose();
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    editModal.open();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedProduct) return;

    // Empêcher la fermeture pendant la mise à jour
    editModal.preventClose();
    setIsUpdating(true);

    try {
      // Préparer les images - le modèle attend un tableau d'images
      const images = selectedProduct.images && selectedProduct.images.length > 0
        ? selectedProduct.images
        : (selectedProduct.image ? [selectedProduct.image] : ['/images/default-product.jpg']);
      
      const productData = {
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        brand: selectedProduct.brand,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        availability: selectedProduct.availability,
        images: images,
        thumbnail: images[0],
        tags: selectedProduct.tags || [],
        specifications: selectedProduct.specifications || [],
      };

      const productId = selectedProduct._id || selectedProduct.id;
      const response = await adminService.updateProduct(productId, productData);

      if (response.success || response.data) {
        toast.success('Produit mis à jour avec succès !');
        editModal.close();
        setSelectedProduct(null);
        await loadProducts();
      } else {
        toast.error(response.message || 'Erreur lors de la mise à jour du produit');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du produit';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
      // Réautoriser la fermeture après la mise à jour
      editModal.allowClose();
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
      return;
    }

    try {
      await adminService.deleteProduct(productId);
      toast.success('Produit supprimé avec succès');
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression du produit';
      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      availability: '',
      brand: '',
    });
    setSearchQuery('');
  };

  const getCategoryLabel = (category) => {
    const labels = {
      hardware: 'Matériels informatiques',
      accessories: 'Accessoires',
      networking: 'Réseaux',
      printing: 'Impression',
    };
    return labels[category] || category;
  };

  const getAvailabilityLabel = (availability) => {
    const labels = {
      in_stock: 'En stock',
      out_of_stock: 'Rupture de stock',
      pre_order: 'Précommande',
    };
    return labels[availability] || availability;
  };

  const getAvailabilityBadge = (availability) => {
    const badges = {
      in_stock: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      out_of_stock: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pre_order: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return badges[availability] || 'bg-gray-100 text-gray-800';
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner size="large" text="Chargement des produits..." />;
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Produits</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez votre catalogue de produits
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ [ProductManagement] Add button clicked');
            console.log('🔍 [ProductManagement] Before open - isOpen:', createModal.isOpen);
            
            // Ouvrir le modal
            createModal.forceOpen();
            
            // Vérifier après un court délai
            setTimeout(() => {
              console.log('🔍 [ProductManagement] After open - isOpen:', createModal.isOpen);
              if (!createModal.isOpen) {
                console.warn('⚠️ [ProductManagement] Modal did not open, forcing again...');
                createModal.forceOpen();
              }
            }, 100);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          Nouveau produit
        </button>
      </div>

      {/* Statistics Cards */}
      {productStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <CubeIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total produits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {productStats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <ShoppingCartIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">En stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {productStats.inStock}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Stock faible</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {productStats.lowStock}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Valeur totale</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {productStats.totalValue?.toLocaleString('fr-FR') || 0} XAF
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Selling Products */}
      {productStats && productStats.topSelling && productStats.topSelling.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Produits les plus vendus</h3>
          <div className="space-y-2">
            {productStats.topSelling.map((product, index) => (
              <div key={product._id || product.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  <span className="text-sm text-gray-900 dark:text-white">{product.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {product.sales || product.salesCount || 0} ventes
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Toutes les catégories</option>
            <option value="hardware">Matériels informatiques</option>
            <option value="accessories">Accessoires</option>
            <option value="networking">Réseaux</option>
            <option value="printing">Impression</option>
          </select>

          {/* Availability Filter */}
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="in_stock">En stock</option>
            <option value="out_of_stock">Rupture de stock</option>
            <option value="pre_order">Précommande</option>
          </select>

          {/* Clear Filters */}
          {(filters.category || filters.availability || filters.brand || searchQuery) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 justify-center"
            >
              <XMarkIcon className="w-5 h-5" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const productId = product._id || product.id;
                  return (
                    <tr key={productId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.thumbnail || product.images?.[0] || product.image || '/images/default-product.jpg'}
                              alt={product.name}
                              onError={(e) => {
                                e.target.src = '/images/default-product.jpg';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.brand || 'Sans marque'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {getCategoryLabel(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.price?.toLocaleString('fr-FR')} XAF
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityBadge(product.availability)}`}>
                          {getAvailabilityLabel(product.availability)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(productId)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal - Rendu directement dans le DOM pour éviter le démontage */}
      {createModal.isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onFocus={(e) => {
            // Empêcher la perte de focus qui pourrait causer des problèmes
            e.stopPropagation();
          }}
          onBlur={(e) => {
            // Empêcher la perte de focus qui pourrait causer des problèmes
            e.stopPropagation();
          }}
          onClick={(e) => {
            // Fermer seulement si on clique sur le backdrop, pas sur le contenu
            // ET seulement si l'utilisateur clique explicitement (pas un événement programmé)
            if (e.target === e.currentTarget && !isCreating && e.isTrusted) {
              e.preventDefault();
              e.stopPropagation();
              createModal.close();
            } else if (e.target === e.currentTarget && !e.isTrusted) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onMouseDown={(e) => {
            // Empêcher la fermeture accidentelle
            if (e.target === e.currentTarget && isCreating) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onContextMenu={(e) => {
            // Empêcher le menu contextuel qui pourrait causer des problèmes
            e.preventDefault();
          }}
          tabIndex={-1}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nouveau produit</h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isCreating) {
                    createModal.close();
                  }
                }}
                disabled={isCreating}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nom du produit *</label>
                <input
                  type="text"
                  name="name"
                  value={createFormData.name}
                  onChange={handleCreateFormChange}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    nameExistsError
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ex: Kit de connexion internet"
                />
                {nameExistsError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {nameExistsMessage || 'Un produit avec ce nom existe déjà.'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
                <textarea
                  name="description"
                  value={createFormData.description}
                  onChange={handleCreateFormChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Catégorie *</label>
                  <select
                    name="category"
                    value={createFormData.category}
                    onChange={handleCreateFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner</option>
                    <option value="hardware">Matériels informatiques</option>
                    <option value="accessories">Accessoires</option>
                    <option value="networking">Réseaux</option>
                    <option value="printing">Impression</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Marque *</label>
                  <input
                    type="text"
                    name="brand"
                    value={createFormData.brand}
                    onChange={handleCreateFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Prix (XAF) *</label>
                  <input
                    type="number"
                    name="price"
                    value={createFormData.price}
                    onChange={handleCreateFormChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={createFormData.stock}
                    onChange={handleCreateFormChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Statut</label>
                <select
                  name="availability"
                  value={createFormData.availability}
                  onChange={handleCreateFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="in_stock">En stock</option>
                  <option value="out_of_stock">Rupture de stock</option>
                  <option value="pre_order">Précommande</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={createFormData.image}
                  onChange={handleCreateFormChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  name="tags"
                  value={createFormData.tags}
                  onChange={handleCreateFormChange}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isCreating) {
                      createModal.close();
                    }
                  }}
                  disabled={isCreating}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isCreating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Product Modal - Rendu directement dans le DOM pour éviter le démontage */}
      {editModal.isOpen && selectedProduct && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            // Fermer seulement si on clique sur le backdrop, pas sur le contenu
            if (e.target === e.currentTarget && !isUpdating) {
              e.preventDefault();
              e.stopPropagation();
              editModal.close();
              setSelectedProduct(null);
            }
          }}
          onMouseDown={(e) => {
            // Empêcher la fermeture accidentelle
            if (e.target === e.currentTarget && isUpdating) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onContextMenu={(e) => {
            // Empêcher le menu contextuel qui pourrait causer des problèmes
            e.preventDefault();
          }}
          tabIndex={-1}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Modifier le produit</h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isUpdating) {
                    editModal.close();
                    setSelectedProduct(null);
                  }
                }}
                disabled={isUpdating}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nom du produit *</label>
                <input
                  type="text"
                  value={selectedProduct.name || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
                <textarea
                  value={selectedProduct.description || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Prix (XAF) *</label>
                  <input
                    type="number"
                    value={selectedProduct.price || ''}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Stock</label>
                  <input
                    type="number"
                    value={selectedProduct.stock || ''}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Statut</label>
                  <select
                    value={selectedProduct.availability || 'in_stock'}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, availability: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="in_stock">En stock</option>
                    <option value="out_of_stock">Rupture de stock</option>
                    <option value="pre_order">Précommande</option>
                  </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isUpdating) {
                      editModal.close();
                      setSelectedProduct(null);
                    }
                  }}
                  disabled={isUpdating}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
});

ProductManagement.displayName = 'ProductManagement';

export default ProductManagement;

