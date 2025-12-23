import React, { useState, useEffect } from 'react';
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
import MobileMenu from './MobileMenu';
import { useAuth } from '../hooks/useAuth';
import { IMAGES } from '../config/images';
import { isAdmin } from '../utils/permissions';
import '../styles/view-modes.css';
import '../styles/header.css';
import '../styles/dropdown.css';
import '../styles/dropdown-no-scroll.css';
import '../styles/services-menu-blue.css';
import '../styles/mobile-fixes.css';
import '../styles/mobile-menu.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      setIsMobile(width < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('orientationchange', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('orientationchange', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 10);
      
      const header = document.querySelector('header[role="banner"]');
      if (header) {
        if (scrollY > 10) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };
    
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', optimizedScroll);
    };
  }, []);

  // Fermer les menus déroulants quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu') && 
          !event.target.closest('.services-menu-trigger') &&
          !event.target.closest('.news-menu-trigger') &&
          !event.target.closest('.community-menu-trigger') &&
          !event.target.closest('.info-menu-trigger') &&
          !event.target.closest('.user-menu')) {
        setShowServicesMenu(false);
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
    setShowServicesMenu(false);
    setShowNewsMenu(false);
    setShowCommunityMenu(false);
    setShowInfoMenu(false);
    setShowUserMenu(false);
  };

  // Fonction de recherche
  const handleSearch = (e) => {
    if (e) {
    e.preventDefault();
      e.stopPropagation();
    }
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
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

  // Navigation principale - Liens directs (sans Accueil, le logo sert de lien Accueil)
  const baseNavigation = [
    { name: t('navigation.training') || 'Formations', href: '/training' },
    { name: t('navigation.products'), href: '/products' },
  ];

  // Navigation pour utilisateurs connectés
  const userNavigation = [
    { name: t('navigation.training') || 'Formations', href: '/training' },
    { name: 'Mes Formations', href: '/my-courses' },
    { name: 'Mon Panier', href: '/cart' },
    { name: t('navigation.products'), href: '/products' },
  ];

  // Déterminer la navigation selon le rôle
  const navigation = isAuthenticated ? userNavigation : baseNavigation;

  // Menu Services
  const servicesMenu = [
    { name: t('services.digital.title'), href: '/services/digital' },
    { name: t('services.training.title'), href: '/services/training' },
    { name: t('services.printing.title'), href: '/services/printing' },
    { name: 'Maintenance Informatique', href: '/services/maintenance' },
    { name: t('services.networks.title'), href: '/services/networks' },
    { name: t('services.commerce.title'), href: '/services/commerce' },
  ];

  // Menu Actualités
  const newsMenu = [
    { name: t('navigation.news'), href: '/news' },
    { name: 'Témoignages', href: '/testimonials' },
  ];

  // Menu Communauté
  const communityMenu = [
    { name: t('navigation.forum'), href: '/forum' },
    { name: t('navigation.careers'), href: '/careers' },
  ];

  // Menu Contact & Info
  const infoMenu = [
    { name: t('navigation.contact'), href: '/contact' },
    { name: t('navigation.about'), href: '/about' },
  ];

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          width: '100%',
          backgroundColor: '#1e3a8a',
          display: 'block',
          visibility: 'visible',
          opacity: 1,
        }}
        role="banner"
        aria-label="Navigation principale"
      >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-[100vw] overflow-x-hidden" style={{ overflowY: 'visible' }}>
        <div className="flex items-center justify-between h-16 min-w-0">
          
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0">
            <Link 
              to="/" 
              className="flex items-center group transition-transform duration-200 hover:scale-105"
            >
              <img 
                src={IMAGES.logo} 
                alt="Expérience Tech" 
                className="h-8 lg:h-10 w-auto mr-1 lg:mr-2 transition-all duration-200 flex-shrink-0"
              />
              <span className="text-base lg:text-xl font-bold text-white hidden sm:block whitespace-nowrap">Expérience Tech</span>
            </Link>
          </div>

          {/* Barre de recherche - juste après le logo */}
          <div className="hidden lg:block flex-shrink-0 ml-4 mr-4" style={{ width: '200px', zIndex: 1 }}>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                <div className="absolute left-2.5 flex items-center pointer-events-none z-10">
                  <MagnifyingGlassIcon className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                  className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400"
                  style={{
                    width: '100%',
                    height: '32px',
                    fontSize: '13px',
                  }}
                />
              </div>
            </form>
          </div>

          {/* Navigation Desktop - sans Accueil */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0 min-w-0" style={{ zIndex: 10 }}>
            {/* Formations */}
                <Link
              to="/training"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                location.pathname === '/training'
                  ? 'text-white bg-blue-600 font-semibold'
                  : 'text-gray-200 hover:text-white hover:bg-blue-600/50'
                  }`}
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    touchAction: 'manipulation',
                  }}
              aria-label="Formations"
                >
              Formations
                </Link>
              
            {/* Services */}
              <div className="relative dropdown-menu">
                <button
                  onClick={() => {
                    setShowServicesMenu(!showServicesMenu);
                    setShowNewsMenu(false);
                    setShowCommunityMenu(false);
                    setShowInfoMenu(false);
                  }}
                className={`services-menu-trigger menu-trigger text-sm font-medium transition-colors duration-200 flex items-center px-3 py-2 whitespace-nowrap ${
                  showServicesMenu 
                    ? 'text-white bg-blue-600' 
                    : 'text-blue-300 hover:text-white hover:bg-blue-600/50'
                }`}
                  style={{
                    fontSize: '14px',
                    touchAction: 'manipulation',
                  }}
                  aria-label="Menu Services"
                  aria-expanded={showServicesMenu}
                  aria-haspopup="true"
                >
                  Services
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
              <AnimatePresence>
                {showServicesMenu && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                    style={{ 
                      transform: 'none',
                      overflow: 'visible',
                      overflowY: 'visible',
                      overflowX: 'visible',
                      maxHeight: 'none',
                      height: 'auto',
                      scrollBehavior: 'auto',
                      WebkitOverflowScrolling: 'none',
                      contain: 'none',
                      clip: 'auto',
                      clipPath: 'none',
                      position: 'absolute',
                      display: 'block'
                    }}
                  >
                    {servicesMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 min-h-[44px] flex items-center ${
                          location.pathname === item.href ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600' : ''
                        }`}
                        style={{
                          minHeight: '44px',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          touchAction: 'manipulation',
                        }}
                        onClick={() => setShowServicesMenu(false)}
                        aria-label={item.name}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
              
            {/* Produits */}
            <Link
              to="/products"
              className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                location.pathname === '/products'
                  ? 'text-white bg-blue-600 font-semibold'
                  : 'text-gray-200 hover:text-white hover:bg-blue-600/50'
              }`}
              style={{
                fontSize: '14px',
                lineHeight: '1.5',
                touchAction: 'manipulation',
              }}
              aria-label="Produits"
            >
              Produits
            </Link>
            
            {/* Actualités & Blog */}
              <div className="relative dropdown-menu">
                <button
                  onClick={() => {
                    setShowNewsMenu(!showNewsMenu);
                    setShowServicesMenu(false);
                    setShowCommunityMenu(false);
                    setShowInfoMenu(false);
                  }}
                className={`news-menu-trigger menu-trigger text-sm font-medium transition-colors duration-200 flex items-center px-3 py-2 whitespace-nowrap ${
                  showNewsMenu 
                    ? 'text-white bg-blue-600' 
                    : 'text-gray-200 hover:text-white hover:bg-blue-600/50'
                }`}
                  style={{
                    fontSize: '14px',
                    touchAction: 'manipulation',
                  }}
                  aria-label="Menu Actualités"
                  aria-expanded={showNewsMenu}
                  aria-haspopup="true"
                >
                Actualités & Blog
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
              <AnimatePresence>
                {showNewsMenu && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                    style={{ 
                      transform: 'none',
                      overflow: 'visible',
                      overflowY: 'visible',
                      overflowX: 'visible',
                      maxHeight: 'none',
                      height: 'auto',
                      scrollBehavior: 'auto',
                      WebkitOverflowScrolling: 'none'
                    }}
                  >
                    {newsMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 min-h-[44px] flex items-center ${
                          location.pathname === item.href ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600' : ''
                        }`}
                        style={{
                          minHeight: '44px',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          touchAction: 'manipulation',
                        }}
                        onClick={() => setShowNewsMenu(false)}
                        aria-label={item.name}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

            {/* Communauté */}
              <div className="relative dropdown-menu">
                <button
                  onClick={() => {
                    setShowCommunityMenu(!showCommunityMenu);
                    setShowServicesMenu(false);
                    setShowNewsMenu(false);
                    setShowInfoMenu(false);
                  }}
                className={`community-menu-trigger menu-trigger text-sm font-medium transition-colors duration-200 flex items-center px-3 py-2 whitespace-nowrap ${
                  showCommunityMenu 
                    ? 'text-white bg-blue-600' 
                    : 'text-gray-200 hover:text-white hover:bg-blue-600/50'
                }`}
                  style={{
                    fontSize: '14px',
                    touchAction: 'manipulation',
                  }}
                  aria-label="Menu Communauté"
                  aria-expanded={showCommunityMenu}
                  aria-haspopup="true"
                >
                  Communauté
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
              <AnimatePresence>
                {showCommunityMenu && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                    style={{ 
                      transform: 'none',
                      overflow: 'visible',
                      overflowY: 'visible',
                      overflowX: 'visible',
                      maxHeight: 'none',
                      height: 'auto',
                      scrollBehavior: 'auto',
                      WebkitOverflowScrolling: 'none'
                    }}
                  >
                    {communityMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 min-h-[44px] flex items-center ${
                          location.pathname === item.href ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600' : ''
                        }`}
                        style={{
                          minHeight: '44px',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          touchAction: 'manipulation',
                        }}
                        onClick={() => setShowCommunityMenu(false)}
                        aria-label={item.name}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

            {/* Contact & Info */}
              <div className="relative dropdown-menu">
                <button
                  onClick={() => {
                    setShowInfoMenu(!showInfoMenu);
                    setShowServicesMenu(false);
                    setShowNewsMenu(false);
                    setShowCommunityMenu(false);
                  }}
                className={`info-menu-trigger menu-trigger text-sm font-medium transition-colors duration-200 flex items-center px-3 py-2 whitespace-nowrap ${
                  showInfoMenu 
                    ? 'text-white bg-blue-600' 
                    : 'text-gray-200 hover:text-white hover:bg-blue-600/50'
                }`}
                  style={{
                    fontSize: '14px',
                    touchAction: 'manipulation',
                  }}
                  aria-label="Menu Contact & Info"
                  aria-expanded={showInfoMenu}
                  aria-haspopup="true"
                >
                  Contact & Info
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
              <AnimatePresence>
                {showInfoMenu && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                    style={{ 
                      transform: 'none',
                      overflow: 'visible',
                      overflowY: 'visible',
                      overflowX: 'visible',
                      maxHeight: 'none',
                      height: 'auto',
                      scrollBehavior: 'auto',
                      WebkitOverflowScrolling: 'none'
                    }}
                  >
                    {infoMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 min-h-[44px] flex items-center ${
                          location.pathname === item.href ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600' : ''
                        }`}
                        style={{
                          minHeight: '44px',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          touchAction: 'manipulation',
                        }}
                        onClick={() => setShowInfoMenu(false)}
                        aria-label={item.name}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>

            {/* Menu utilisateur ou bouton de connexion */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
                <NotificationCenter />
                <ThemeToggle />
                
                <div className="relative user-menu">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowServicesMenu(false);
                    setShowNewsMenu(false);
                    setShowCommunityMenu(false);
                    setShowInfoMenu(false);
                    setShowUserMenu(prev => !prev);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-50 transition-all duration-200 cursor-pointer group min-w-[44px] min-h-[44px]"
                    aria-label="Menu utilisateur"
                    aria-expanded={showUserMenu}
                  >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                    <UserSolidIcon className="w-5 h-5 text-white" />
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-[70] overflow-hidden"
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
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3" />
                          Mon profil
                        </Link>
                        
                        <Link
                          to="/my-courses"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <HeartIcon className="w-4 h-4 mr-3" />
                          Mes formations
                        </Link>
                        
                        <Link
                          to="/cart"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <CogIcon className="w-4 h-4 mr-3" />
                          Mon panier
                        </Link>
                        
                        {isAdmin(user?.role) && (
                          <>
                            <div className="border-t border-gray-100 my-2"></div>
                            <div className="px-4 py-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</p>
                            </div>
                          <Link
                            to="/admin"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150"
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
                            className="flex items-center w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-all duration-150"
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
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
                <div className="hidden lg:block flex-shrink-0">
                <LanguageSelector />
                </div>
                
                <div className="hidden lg:block flex-shrink-0">
                <ThemeToggle />
                </div>
                
                <Link
                  to="/login"
                className="hidden sm:flex bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex-shrink-0 cursor-pointer relative z-[60] items-center justify-center pointer-events-auto shadow-md hover:shadow-lg font-medium text-sm"
                  style={{ 
                    pointerEvents: 'auto', 
                    zIndex: 60,
                  minHeight: '36px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    touchAction: 'manipulation',
                  }}
                  title="Se connecter"
                  aria-label="Se connecter"
                >
                Connexion
                </Link>
              </>
            )}

          {/* Menu mobile */}
            <MobileMenu 
              navigation={navigation}
              servicesMenu={servicesMenu}
              newsMenu={newsMenu}
              communityMenu={communityMenu}
              infoMenu={infoMenu}
            />
        </div>


      </nav>
    </header>
    </>
  );
};

export default Header;
