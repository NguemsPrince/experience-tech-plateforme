import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, MicrophoneIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SmartSearch = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Charger les recherches récentes
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Recherche avec autocomplétion
  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(() => {
        performSearch(query);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    // Simulation de recherche - à remplacer par un vrai appel API
    const mockResults = [
      { type: 'course', title: 'Formation Python', url: '/training' },
      { type: 'service', title: 'Développement Web', url: '/services/digital' },
      { type: 'product', title: 'Impression Professionnelle', url: '/services/printing' },
      { type: 'page', title: 'À propos de nous', url: '/about' },
      { type: 'page', title: 'Contact', url: '/contact' }
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    // Sauvegarder dans les recherches récentes
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // Rediriger vers la page de recherche
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    if (onClose) onClose();
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('La recherche vocale n\'est pas supportée par votre navigateur');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        navigate(results[selectedIndex].url);
        if (onClose) onClose();
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'course':
        return '🎓';
      case 'service':
        return '⚙️';
      case 'product':
        return '📦';
      case 'page':
        return '📄';
      default:
        return '🔍';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher des cours, services, produits..."
          className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all"
          autoFocus
        />
        
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-2">
          {/* Voice Search Button */}
          <button
            onClick={handleVoiceSearch}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
            title="Recherche vocale"
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          
          {/* Clear Button */}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {(results.length > 0 || (query.length === 0 && recentSearches.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Recent Searches */}
            {query.length === 0 && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  Recherches récentes
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(result.url);
                      if (onClose) onClose();
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                      index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    <span className="text-2xl">{getIcon(result.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {result.type}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Tips */}
      {query.length === 0 && recentSearches.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          💡 Astuce : Utilisez le microphone pour une recherche vocale
        </div>
      )}
    </div>
  );
};

export default SmartSearch;

