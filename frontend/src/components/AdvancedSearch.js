import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { FormInput, FormSelect } from './forms';
import { useForm } from 'react-hook-form';
import debounce from 'lodash.debounce';

/**
 * Composant de recherche avancée avec filtres et tri
 */
const AdvancedSearch = ({ 
  onSearch, 
  categories = [],
  showFilters = true,
  placeholder = 'Rechercher...',
  className = ''
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { register, watch, setValue, reset } = useForm({
    defaultValues: {
      query: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      sortBy: searchParams.get('sortBy') || 'relevance',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      level: searchParams.get('level') || '',
      duration: searchParams.get('duration') || ''
    }
  });
  
  const watchQuery = watch('query');
  const watchCategory = watch('category');
  const watchSortBy = watch('sortBy');
  const watchFilters = watch();
  
  // Options de tri
  const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'date-desc', label: 'Plus récent' },
    { value: 'date-asc', label: 'Plus ancien' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'name-desc', label: 'Nom Z-A' },
    { value: 'popular', label: 'Popularité' }
  ];
  
  // Options de niveau
  const levelOptions = [
    { value: '', label: 'Tous les niveaux' },
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' },
    { value: 'expert', label: 'Expert' }
  ];
  
  // Options de durée
  const durationOptions = [
    { value: '', label: 'Toutes les durées' },
    { value: '0-5', label: 'Moins de 5 heures' },
    { value: '5-10', label: '5-10 heures' },
    { value: '10-20', label: '10-20 heures' },
    { value: '20+', label: 'Plus de 20 heures' }
  ];
  
  // Fonction de recherche avec debounce
  const debouncedSearch = useCallback(
    debounce(async (searchData) => {
      if (!searchData.query) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      
      try {
        // Mettre à jour les paramètres d'URL
        const params = new URLSearchParams();
        Object.keys(searchData).forEach(key => {
          if (searchData[key]) {
            params.set(key, searchData[key]);
          }
        });
        setSearchParams(params);
        
        // Appeler la fonction de recherche externe
        if (onSearch) {
          const results = await onSearch(searchData);
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [onSearch, setSearchParams]
  );
  
  // Surveiller les changements et déclencher la recherche
  useEffect(() => {
    if (watchQuery || watchCategory || watchSortBy) {
      debouncedSearch(watchFilters);
    }
  }, [watchQuery, watchCategory, watchSortBy, debouncedSearch, watchFilters]);
  
  // Réinitialiser les filtres
  const handleResetFilters = () => {
    reset({
      query: '',
      category: '',
      sortBy: 'relevance',
      priceMin: '',
      priceMax: '',
      level: '',
      duration: ''
    });
    setSearchParams(new URLSearchParams());
    setSearchResults([]);
  };
  
  // Vérifier si des filtres sont actifs
  const hasActiveFilters = () => {
    return watchFilters.category || 
           watchFilters.priceMin || 
           watchFilters.priceMax || 
           watchFilters.level || 
           watchFilters.duration;
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* Barre de recherche principale */}
      <div className="relative">
        <div className="flex gap-2">
          {/* Champ de recherche */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            <input
              type="text"
              placeholder={placeholder}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-400"
              {...register('query')}
            />
            
            {/* Bouton pour effacer */}
            {watchQuery && (
              <button
                type="button"
                onClick={() => setValue('query', '')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            
            {/* Indicateur de recherche en cours */}
            {isSearching && (
              <div className="absolute inset-y-0 right-10 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {/* Bouton Filtres */}
          {showFilters && (
            <button
              type="button"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`px-4 py-3 border rounded-lg flex items-center gap-2
                       transition-colors duration-200
                       ${isFiltersOpen || hasActiveFilters()
                         ? 'bg-blue-500 text-white border-blue-500'
                         : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                       }`}
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Filtres</span>
              {hasActiveFilters() && (
                <span className="bg-white text-blue-500 text-xs rounded-full px-2 py-0.5 font-medium">
                  {Object.values(watchFilters).filter(v => v && v !== 'relevance').length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Panneau de filtres */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                Filtres avancés
              </h3>
              
              {hasActiveFilters() && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Réinitialiser
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Catégorie */}
              {categories.length > 0 && (
                <FormSelect
                  label="Catégorie"
                  name="category"
                  options={[
                    { value: '', label: 'Toutes les catégories' },
                    ...categories.map(cat => ({ value: cat.value, label: cat.label }))
                  ]}
                  register={register}
                />
              )}
              
              {/* Tri */}
              <FormSelect
                label="Trier par"
                name="sortBy"
                options={sortOptions}
                register={register}
              />
              
              {/* Niveau */}
              <FormSelect
                label="Niveau"
                name="level"
                options={levelOptions}
                register={register}
              />
              
              {/* Durée */}
              <FormSelect
                label="Durée"
                name="duration"
                options={durationOptions}
                register={register}
              />
              
              {/* Prix minimum */}
              <FormInput
                label="Prix minimum (FCFA)"
                name="priceMin"
                type="number"
                placeholder="0"
                register={register}
              />
              
              {/* Prix maximum */}
              <FormInput
                label="Prix maximum (FCFA)"
                name="priceMax"
                type="number"
                placeholder="1000000"
                register={register}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Résultats */}
      {searchResults.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {searchResults.length} résultat(s) trouvé(s)
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

