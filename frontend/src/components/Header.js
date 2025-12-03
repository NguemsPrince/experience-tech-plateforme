import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  HeartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { UserIcon as UserSolidIcon } from '@heroicons/react/24/solid';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../hooks/useAuth';
import { IMAGES } from '../config/images';
import { isAdmin, getAllowedPages } from '../utils/permissions';
import '../styles/view-modes.css';
import '../styles/header.css';
import '../styles/dropdown.css';
import '../styles/mobile-fixes.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer les menus déroulants quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Vérifier si le clic est en dehors de tous les menus déroulants
      if (!event.target.closest('.dropdown-menu') && 
          !event.target.closest('.news-menu-trigger') && 
          !event.target.closest('.community-menu-trigger') && 
          !event.target.closest('.info-menu-trigger') &&
          !event.target.closest('.user-menu')) {
        setShowNewsMenu(false);
        setShowCommunityMenu(false);
        setShowInfoMenu(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonction pour fermer tous les menus
  const closeAllMenus = () => {
    setShowNewsMenu(false);
    setShowCommunityMenu(false);
    setShowInfoMenu(false);
    setShowUserMenu(false);
  };

  // Fonction de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    closeAllMenus();
  };

  // Fermer tous les menus quand on change de page
  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]);

  // Navigation de base pour tous les utilisateurs (non connectés)
  const baseNavigation = [
    { name: t('navigation.training') || 'Formation', href: '/training' },
    { name: t('navigation.services'), href: '/services' },
    { name: t('navigation.products'), href: '/products' },
  ];

  // Navigation pour les utilisateurs connectés
  // Remplace "Formation" par "Mes Formations" quand l'utilisateur est connecté
  const userNavigation = [
    { name: 'Mes Formations', href: '/my-courses' },
    { name: 'Mon Panier', href: '/cart' },
    { name: t('navigation.services'), href: '/services' },
    { name: t('navigation.products'), href: '/products' },
  ];

  // SÉCURITÉ : Les liens admin ne doivent JAMAIS apparaître dans la navigation principale
  // Ils sont uniquement accessibles via le menu utilisateur (protégé par isAdmin)

  // Déterminer la navigation selon le rôle
  // Si connecté : "Mes Formations" au lieu de "Formation"
  // Si non connecté : "Formation"
  let navigation = isAuthenticated ? userNavigation : baseNavigation;

  const newsMenu = [
    { name: t('navigation.news'), href: '/news' },
    { name: 'Témoignages', href: '/testimonials' },
  ];

  const communityMenu = [
    { name: t('navigation.forum'), href: '/forum' },
    { name: t('navigation.careers'), href: '/careers' },
  ];

  const infoMenu = [
    { name: t('navigation.contact'), href: '/contact' },
    { name: t('navigation.about'), href: '/about' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg border-b border-gray-200' 
            : 'bg-white/95 backdrop-blur-sm'
        }`}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'block',
          visibility: 'visible',
          opacity: 1
        }}
      >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center"
            >
              <img 
                src={IMAGES.logo} 
                alt="Expérience Tech" 
                className="h-10 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Expérience Tech</span>
            </Link>
          </div>

          {/* Barre de recherche centrale - Style Airbnb */}
          <div className="flex-1 max-w-xs mx-2 hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm border-0 rounded-full focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full mr-1 transition-colors duration-200"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-1 flex-shrink-0 relative" style={{ minWidth: 0, overflow: 'visible' }}>
            {/* Navigation Desktop */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              {/* Navigation principale */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-xs font-medium transition-all duration-200 hover:text-gray-900 px-2 py-1 rounded ${
                    location.pathname === item.href
                      ? 'text-gray-900 bg-gray-100 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Menu Actualités & Témoignages */}
              <div className="relative dropdown-menu">
                <button
                  onClick={() => {
                    setShowNewsMenu(!showNewsMenu);
                    if (showCommunityMenu) setShowCommunityMenu(false);
                    if (showInfoMenu) setShowInfoMenu(false);
                  }}
                  className={`news-menu-trigger menu-trigger text-xs font-medium transition-colors duration-200 hover:text-gray-900 text-gray-600 flex items-center ${showNewsMenu ? 'active' : ''}`}
                >
                  Actualités & Blog
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showNewsMenu && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[60]">
                    {newsMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`dropdown-link ${
                          location.pathname === item.href ? 'active' : ''
                        }`}
                        onClick={() => setShowNewsMenu(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Menu Communauté */}
              <div className="relative dropdown-menu">
                <button
                  onClick={() => {
                    setShowCommunityMenu(!showCommunityMenu);
                    if (showNewsMenu) setShowNewsMenu(false);
                    if (showInfoMenu) setShowInfoMenu(false);
                  }}
                  className={`community-menu-trigger menu-trigger text-xs font-medium transition-colors duration-200 hover:text-gray-900 text-gray-600 flex items-center ${showCommunityMenu ? 'active' : ''}`}
                >
                  Communauté
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showCommunityMenu && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[60]">
                    {communityMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`dropdown-link ${
                          location.pathname === item.href ? 'active' : ''
                        }`}
                        onClick={() => setShowCommunityMenu(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Menu Contact & À propos */}
              <div className="relative dropdown-menu">
                <button
                  onClick={() => {
                    setShowInfoMenu(!showInfoMenu);
                    if (showNewsMenu) setShowNewsMenu(false);
                    if (showCommunityMenu) setShowCommunityMenu(false);
                  }}
                  className={`info-menu-trigger menu-trigger text-xs font-medium transition-colors duration-200 hover:text-gray-900 text-gray-600 flex items-center ${showInfoMenu ? 'active' : ''}`}
                >
                  Contact & Info
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showInfoMenu && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[60]">
                    {infoMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`dropdown-link ${
                          location.pathname === item.href ? 'active' : ''
                        }`}
                        onClick={() => setShowInfoMenu(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Menu utilisateur ou bouton de connexion */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
                {/* Notifications */}
                <NotificationCenter />
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                <div className="relative user-menu">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Fermer les autres menus d'abord
                      setShowNewsMenu(false);
                      setShowCommunityMenu(false);
                      setShowInfoMenu(false);
                      // Puis ouvrir/fermer le menu utilisateur
                      setShowUserMenu(prev => !prev);
                    }}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    aria-label="Menu utilisateur"
                    aria-expanded={showUserMenu}
                  >
                  <Bars3Icon className="w-4 h-4 text-gray-600" />
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <UserSolidIcon className="w-5 h-5 text-white" />
                  </div>
                </button>

                {/* Dropdown menu utilisateur */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-[70]"
                    >
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3" />
                          Mon profil
                        </Link>
                        
                        {/* Options pour tous les utilisateurs connectés */}
                        <Link
                          to="/my-courses"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <HeartIcon className="w-4 h-4 mr-3" />
                          Mes formations
                        </Link>
                        
                        <Link
                          to="/cart"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <CogIcon className="w-4 h-4 mr-3" />
                          Mon panier
                        </Link>
                        
                        {/* Options réservées aux admins */}
                        {isAdmin(user?.role) && (
                          <>
                            <div className="border-t border-gray-100 my-2"></div>
                            <div className="px-4 py-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</p>
                            </div>
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <CogIcon className="w-4 h-4 mr-3" />
                            Tableau de bord Admin
                          </Link>
                          </>
                        )}
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <XMarkIcon className="w-4 h-4 mr-3" />
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                {/* Langue - Caché sur mobile pour faire de la place */}
                <div className="hidden sm:block">
                <LanguageSelector />
                </div>
                
                {/* Theme Toggle - Caché sur mobile pour faire de la place */}
                <div className="hidden sm:block">
                <ThemeToggle />
                </div>
                
                {/* Bouton de connexion - Icône - Caché sur mobile très petit */}
                <Link
                  to="/login"
                  className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer relative z-[60] items-center justify-center pointer-events-auto"
                  style={{ pointerEvents: 'auto', zIndex: 60 }}
                  title="Se connecter"
                  aria-label="Se connecter"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 pointer-events-none" />
                </Link>
              </>
            )}

            {/* Menu mobile - Recherche - Visible uniquement sur mobile */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSearchBar(!showSearchBar);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSearchBar(!showSearchBar);
              }}
              className="md:hidden p-2.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 z-[10001] relative flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
              aria-label="Rechercher"
              style={{ 
                zIndex: 10001,
                position: 'relative',
                display: 'flex',
                visibility: 'visible',
                opacity: 1,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Menu mobile - Toujours visible sur mobile - DERNIER ÉLÉMENT */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="md:hidden p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all duration-200 z-[10002] relative flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center shadow-lg ml-1"
              aria-label="Menu mobile"
              aria-expanded={isMenuOpen}
              style={{ 
                zIndex: 10002,
                position: 'relative',
                display: 'flex',
                visibility: 'visible',
                opacity: 1,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                cursor: 'pointer',
                pointerEvents: 'auto'
              }}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-7 h-7 text-white" />
              ) : (
                <Bars3Icon className="w-7 h-7 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <AnimatePresence>
          {showSearchBar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="p-4">
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full">
                    <input
                      type="text"
                      placeholder="Rechercher des formations, services, actualités..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-4 py-2 text-sm border-0 rounded-full bg-transparent focus:outline-none focus:ring-0"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full mr-1 transition-colors duration-200"
                    >
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay et Navigation Mobile - Rendu via Portal pour éviter les conflits de z-index */}
        {isMenuOpen && createPortal(
          <>
            {/* Overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/50"
              style={{ 
                zIndex: 10001,
                touchAction: 'manipulation'
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
            />
            {/* Navigation Mobile */}
            <div 
              className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white border-t border-gray-200 overflow-y-auto"
              style={{ 
                zIndex: 10002,
                maxHeight: 'calc(100vh - 4rem)',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                overscrollBehavior: 'contain',
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="p-4 space-y-1">
                {/* Navigation principale */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      setTimeout(() => navigate(item.href), 100);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 min-h-[48px] flex items-center ${
                      location.pathname === item.href
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-600 active:bg-gray-50'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Menu Actualités & Témoignages Mobile */}
                <div className="pt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actualités & Blog
                  </div>
                  {newsMenu.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        setTimeout(() => navigate(item.href), 100);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 min-h-[48px] flex items-center ${
                        location.pathname === item.href
                          ? 'text-gray-900 bg-gray-100'
                          : 'text-gray-600 active:bg-gray-50'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Menu Communauté Mobile */}
                <div className="pt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Communauté
                  </div>
                  {communityMenu.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        setTimeout(() => navigate(item.href), 100);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 min-h-[48px] flex items-center ${
                        location.pathname === item.href
                          ? 'text-gray-900 bg-gray-100'
                          : 'text-gray-600 active:bg-gray-50'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Menu Contact & Info Mobile */}
                <div className="pt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact & Info
                  </div>
                  {infoMenu.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        setTimeout(() => navigate(item.href), 100);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 min-h-[48px] flex items-center ${
                        location.pathname === item.href
                          ? 'text-gray-900 bg-gray-100'
                          : 'text-gray-600 active:bg-gray-50'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              
                {/* Section utilisateur mobile */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm text-gray-600">
                        Bonjour, {user?.firstName}
                      </div>
                      <Link
                        to="/profile"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          setTimeout(() => navigate('/profile'), 100);
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="block px-4 py-3 text-base font-medium text-gray-600 active:bg-gray-50 rounded-lg transition-colors duration-200 min-h-[48px] flex items-center"
                        style={{ touchAction: 'manipulation' }}
                      >
                        Mon profil
                      </Link>
                      <Link
                        to="/my-courses"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          setTimeout(() => navigate('/my-courses'), 100);
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="block px-4 py-3 text-base font-medium text-gray-600 active:bg-gray-50 rounded-lg transition-colors duration-200 min-h-[48px] flex items-center"
                        style={{ touchAction: 'manipulation' }}
                      >
                        Mes formations
                      </Link>
                      <Link
                        to="/cart"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          setTimeout(() => navigate('/cart'), 100);
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="block px-4 py-3 text-base font-medium text-gray-600 active:bg-gray-50 rounded-lg transition-colors duration-200 min-h-[48px] flex items-center"
                        style={{ touchAction: 'manipulation' }}
                      >
                        Mon panier
                      </Link>
                      {isAdmin(user?.role) && (
                        <Link
                          to="/admin"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsMenuOpen(false);
                            setTimeout(() => navigate('/admin'), 100);
                          }}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="block px-4 py-3 text-base font-medium text-blue-600 active:bg-blue-50 rounded-lg transition-colors duration-200 min-h-[48px] flex items-center"
                          style={{ touchAction: 'manipulation' }}
                        >
                          Dashboard Admin
                        </Link>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-gray-600 active:bg-gray-50 rounded-lg transition-colors duration-200 min-h-[48px] flex items-center"
                        style={{ touchAction: 'manipulation' }}
                      >
                        Se déconnecter
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          setTimeout(() => navigate('/login'), 100);
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="block px-4 py-3 text-base font-medium bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-center min-h-[48px] flex items-center justify-center"
                        style={{ touchAction: 'manipulation' }}
                      >
                        {t('common.seConnecter')}
                      </Link>
                    </div>
                  )}
                  </div>
              </div>
            </div>
          </>,
          document.body
        )}
      </nav>
    </header>
    </>
  );
};

export default Header;
