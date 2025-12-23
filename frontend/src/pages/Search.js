import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import CourseCard from '../components/CourseCard';
import ServiceCard from '../components/ServiceCard';

// Simulated search results - Défini en dehors du composant pour éviter les problèmes de dépendances
const mockResults = {
    courses: [
      {
        _id: 1,
        id: 1,
        title: "Formation Développement Web",
        description: "Apprenez les bases du développement web avec HTML, CSS et JavaScript",
        instructor: { name: "Expérience Tech" },
        duration: "40h",
        level: "Débutant",
        price: 150000,
        originalPrice: null,
        rating: { average: 4.8, count: 120 },
        studentsCount: 120,
        image: "/images/courses/web-dev.jpg",
        category: "Développement Web",
        tags: ["HTML", "CSS", "JavaScript", "Web"]
      },
      {
        _id: 2,
        id: 2,
        title: "Formation React.js",
        description: "Maîtrisez React.js pour créer des applications web modernes",
        instructor: { name: "Expérience Tech" },
        duration: "30h",
        level: "Intermédiaire",
        price: 200000,
        originalPrice: null,
        rating: { average: 4.9, count: 85 },
        studentsCount: 85,
        image: "/images/courses/react.jpg",
        category: "Développement Web",
        tags: ["React", "JavaScript", "Frontend"]
      },
      {
        _id: 3,
        id: 3,
        title: "Formation Node.js",
        description: "Développement backend avec Node.js et Express",
        instructor: { name: "Expérience Tech" },
        duration: "35h",
        level: "Intermédiaire",
        price: 180000,
        originalPrice: null,
        rating: { average: 4.7, count: 95 },
        studentsCount: 95,
        image: "/images/courses/nodejs.jpg",
        category: "Développement Web",
        tags: ["Node.js", "Backend", "Express"]
      },
      {
        _id: 4,
        id: 4,
        title: "Formation Python",
        description: "Programmation Python pour la data science et le web",
        instructor: { name: "Expérience Tech" },
        duration: "45h",
        level: "Débutant",
        price: 160000,
        originalPrice: null,
        rating: { average: 4.6, count: 110 },
        studentsCount: 110,
        image: "/images/courses/python.jpg",
        category: "Programmation",
        tags: ["Python", "Data Science", "Web"]
      },
      {
        _id: 5,
        id: 5,
        title: "Formation DevOps",
        description: "Déploiement et gestion d'infrastructure avec Docker et Kubernetes",
        instructor: { name: "Expérience Tech" },
        duration: "50h",
        level: "Avancé",
        price: 250000,
        originalPrice: null,
        rating: { average: 4.9, count: 65 },
        studentsCount: 65,
        image: "/images/courses/devops.jpg",
        category: "DevOps",
        tags: ["Docker", "Kubernetes", "DevOps"]
      },
      {
        _id: 6,
        id: 6,
        title: "Formation Intelligence Artificielle",
        description: "Introduction à l'IA et au machine learning",
        instructor: { name: "Expérience Tech" },
        duration: "60h",
        level: "Intermédiaire",
        price: 300000,
        originalPrice: null,
        rating: { average: 4.8, count: 45 },
        studentsCount: 45,
        image: "/images/courses/ai.jpg",
        category: "Intelligence Artificielle",
        tags: ["IA", "Machine Learning", "Python"]
      }
    ],
    services: [
      {
        id: 1,
        title: "Développement de Sites Web",
        description: "Création de sites web professionnels et responsives",
        icon: "🌐",
        features: ["Design responsive", "SEO optimisé", "Maintenance"],
        price: "À partir de 500,000 FCFA"
      },
      {
        id: 2,
        title: "Applications Mobiles",
        description: "Développement d'applications iOS et Android",
        icon: "📱",
        features: ["iOS & Android", "Interface native", "Performance optimisée"],
        price: "À partir de 1,000,000 FCFA"
      },
      {
        id: 3,
        title: "Solutions E-commerce",
        description: "Plateformes de vente en ligne complètes",
        icon: "🛒",
        features: ["Paiement sécurisé", "Gestion des stocks", "Analytics"],
        price: "À partir de 800,000 FCFA"
      },
      {
        id: 4,
        title: "Consulting IT",
        description: "Conseil en transformation numérique",
        icon: "💼",
        features: ["Audit technique", "Stratégie digitale", "Formation équipe"],
        price: "À partir de 300,000 FCFA"
      },
      {
        id: 5,
        title: "Maintenance Informatique",
        description: "Support technique et maintenance préventive",
        icon: "🔧",
        features: ["Support 24/7", "Maintenance préventive", "Mise à jour"],
        price: "À partir de 200,000 FCFA"
      }
    ],
    news: [
      {
        id: 1,
        title: "Nouvelles Technologies 2024",
        description: "Découvrez les dernières tendances technologiques",
        date: "2024-01-15",
        category: "Technologie",
        image: "/images/news/tech-2024.jpg"
      },
      {
        id: 2,
        title: "Formation React.js : Nouvelle Session",
        description: "Inscrivez-vous à notre nouvelle session de formation React.js",
        date: "2024-01-10",
        category: "Formation",
        image: "/images/news/react-session.jpg"
      },
      {
        id: 3,
        title: "Intelligence Artificielle : L'Avenir du Développement",
        description: "Comment l'IA transforme le développement logiciel",
        date: "2024-01-08",
        category: "Innovation",
        image: "/images/news/ai-future.jpg"
      },
      {
        id: 4,
        title: "DevOps : Meilleures Pratiques 2024",
        description: "Les meilleures pratiques DevOps pour optimiser vos déploiements",
        date: "2024-01-05",
        category: "Technologie",
        image: "/images/news/devops-practices.jpg"
      },
      {
        id: 5,
        title: "Python : Langage de l'Année",
        description: "Pourquoi Python reste le langage le plus populaire",
        date: "2024-01-03",
        category: "Programmation",
        image: "/images/news/python-popular.jpg"
      }
    ]
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState({
    courses: [],
    services: [],
    news: [],
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const performSearch = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setSearchResults({ courses: [], services: [], news: [], total: 0 });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const searchTerm = query.toLowerCase().trim();
    
      // Enhanced search algorithm with multiple criteria
      const filteredResults = {
        courses: mockResults.courses.filter(item => {
        const searchFields = [
          item.title,
          item.description,
          item.instructor?.name || item.instructor,
          item.level,
          item.category,
          ...(item.tags || [])
        ].filter(Boolean); // Remove undefined/null values
          return searchFields.some(field => 
            field && typeof field === 'string' && field.toLowerCase().includes(searchTerm)
          );
        }),
        services: mockResults.services.filter(item => {
          const searchFields = [
            item.title,
            item.description,
            ...(item.features || [])
          ].filter(Boolean); // Remove undefined/null values
          return searchFields.some(field => 
            field && typeof field === 'string' && field.toLowerCase().includes(searchTerm)
          );
        }),
        news: mockResults.news.filter(item => {
          const searchFields = [
            item.title,
            item.description,
            item.category
          ].filter(Boolean); // Remove undefined/null values
          return searchFields.some(field => 
            field && typeof field === 'string' && field.toLowerCase().includes(searchTerm)
          );
        })
      };
      
      const total = filteredResults.courses.length + 
                   filteredResults.services.length + 
                   filteredResults.news.length;
      
      setSearchResults({
        ...filteredResults,
        total
      });
    } catch (error) {
      console.error('Search error:', error);
      // En cas d'erreur, afficher des résultats vides plutôt que de crasher
      setSearchResults({ courses: [], services: [], news: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else {
      setSearchResults({ courses: [], services: [], news: [], total: 0 });
      setIsLoading(false);
    }
  }, [searchParams, performSearch]);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery && searchQuery.length > 2) {
      const allSuggestions = [
        ...mockResults.courses.map(course => course.title),
        ...mockResults.services.map(service => service.title),
        ...mockResults.news.map(article => article.title),
        'React.js', 'Node.js', 'Python', 'DevOps', 'IA', 'JavaScript', 'HTML', 'CSS'
      ];
      
      const filteredSuggestions = allSuggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ courses: [], services: [], news: [], total: 0 });
    setShowSuggestions(false);
    navigate('/search');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const tabs = [
    { id: 'all', label: 'Tout', count: searchResults.total },
    { id: 'courses', label: 'Formations', count: searchResults.courses.length },
    { id: 'services', label: 'Services', count: searchResults.services.length },
    { id: 'news', label: 'Actualités', count: searchResults.news.length }
  ];

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Recherche en cours...</span>
        </div>
      );
    }

    if (searchResults.total === 0 && searchQuery) {
      return (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-500">
            Essayez avec d'autres mots-clés ou explorez nos catégories
          </p>
        </div>
      );
    }

    if (!searchQuery) {
      return (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Recherchez des formations, services ou actualités
          </h3>
          <p className="text-gray-500">
            Utilisez la barre de recherche ci-dessus pour trouver ce que vous cherchez
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Formations */}
        {activeTab === 'all' || activeTab === 'courses' ? (
          searchResults.courses.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Formations ({searchResults.courses.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.courses.map((course) => (
                  <CourseCard key={course._id || course.id} course={course} />
                ))}
              </div>
            </div>
          )
        ) : null}

        {/* Services */}
        {activeTab === 'all' || activeTab === 'services' ? (
          searchResults.services.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Services ({searchResults.services.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          )
        ) : null}

        {/* Actualités */}
        {activeTab === 'all' || activeTab === 'news' ? (
          searchResults.news.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Actualités ({searchResults.news.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.news.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Image</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {article.category}
                        </span>
                        <span className="ml-2">{article.date}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {article.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        ) : null}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Recherche
          </h1>
          <p className="text-gray-600">
            Trouvez les formations, services et actualités qui vous intéressent
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <input
                type="text"
                placeholder="Rechercher des formations, services, actualités..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="flex-1 px-6 py-4 text-sm border-0 rounded-full focus:outline-none focus:ring-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full mr-2 transition-colors duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center">
                      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-3" />
                      {suggestion}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Results */}
            {renderResults()}
          </motion.div>
        )}

        {/* No Search Query */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {renderResults()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
