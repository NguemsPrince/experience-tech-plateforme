import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';
import { useTranslation } from 'react-i18next';

/**
 * Composant Menu Mobile - Solution garantie à 100%
 * Utilise uniquement des styles inline et JavaScript
 * Ne dépend pas de Tailwind pour la visibilité
 */
const MobileMenu = ({ navigation, newsMenu, communityMenu, infoMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const [isMobile, setIsMobile] = useState(() => {
    // Initialiser avec la valeur actuelle
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Détection mobile et FORCE l'affichage du bouton sur mobile uniquement
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      
      // FORCER l'affichage du bouton sur mobile uniquement
      const button = document.getElementById('mobile-menu-button');
      if (button) {
        if (mobile) {
          // Sur mobile : FORCER l'affichage
          button.style.setProperty('display', 'flex', 'important');
          button.style.setProperty('visibility', 'visible', 'important');
          button.style.setProperty('opacity', '1', 'important');
          button.style.setProperty('pointer-events', 'auto', 'important');
        } else {
          // Sur desktop : CACHER le bouton
          button.style.setProperty('display', 'none', 'important');
          button.style.setProperty('visibility', 'hidden', 'important');
          button.style.setProperty('opacity', '0', 'important');
          button.style.setProperty('pointer-events', 'none', 'important');
        }
      }
    };

    // Vérifier immédiatement
    checkMobile();
    
    // Vérifier après un court délai pour s'assurer que le DOM est prêt
    setTimeout(checkMobile, 100);
    setTimeout(checkMobile, 500);
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Gérer le scroll lock quand isOpen change
  useEffect(() => {
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isOpen && isMobileDevice) {
      // Lock scroll quand le menu est ouvert
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Unlock scroll quand le composant se démonte ou le menu se ferme
        const savedScrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (savedScrollY) {
          window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
        }
      };
    } else if (!isOpen) {
      // Unlock scroll quand le menu est fermé
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [isOpen]);

  // Synchroniser le ref avec l'état
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);
  

  const toggleMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      // Empêcher la propagation immédiatement
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    
    // Changer l'état de manière simple et directe
    setIsOpen(prev => {
      const newState = !prev;
      isOpenRef.current = newState;
      console.log('Menu toggle:', newState ? 'OPEN' : 'CLOSED');
      return newState;
    });
  };

  const closeMenu = () => {
    console.log('Closing menu');
    setIsOpen(false);
  };

  const handleLinkClick = (href) => {
    closeMenu();
    setTimeout(() => navigate(href), 100);
  };

  // Le bouton sera toujours rendu, le CSS gérera l'affichage/cache
  // Pas besoin de shouldShowButton car le CSS avec media queries le gère

  return (
    <>
      {/* Bouton Hamburger - TOUJOURS RENDU avec classes Tailwind + CSS + JS */}
      {/* Triple protection : Tailwind (md:hidden), CSS (!important), JS (force display) */}
      {/* Utilisation de classes séparées pour éviter la purge Tailwind en production */}
      <button
        id="mobile-menu-button"
        className="mobile-menu-btn flex md:hidden lg:hidden"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Button clicked, current isOpen:', isOpen);
          toggleMenu(e);
        }}
        onTouchStart={(e) => {
          // Support tactile pour mobile
          e.stopPropagation();
        }}
        aria-label="Menu mobile"
        aria-expanded={isOpen}
        type="button"
        data-mobile-only="true"
        style={{
          // Styles inline pour garantir l'affichage même si CSS ne charge pas
          position: 'relative',
          zIndex: 10003,
          minWidth: '48px',
          minHeight: '48px',
          width: '48px',
          height: '48px',
          padding: '0.625rem',
          marginLeft: '4px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          // touch-action: manipulation améliore la réactivité tactile
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          // Forcer l'affichage sur mobile - le CSS avec !important prendra le dessus
          display: isMobile ? 'flex' : 'none',
          visibility: isMobile ? 'visible' : 'hidden',
          opacity: isMobile ? 1 : 0,
          // Améliorer la réactivité
          userSelect: 'none',
          WebkitUserSelect: 'none',
          // Empêcher le double-tap zoom sur mobile
          touchAction: 'manipulation'
        }}
      >
        {isOpen ? (
          <XMarkIcon style={{ width: '28px', height: '28px', color: 'white', pointerEvents: 'none' }} />
        ) : (
          <Bars3Icon style={{ width: '28px', height: '28px', color: 'white', pointerEvents: 'none' }} />
        )}
      </button>

      {/* Overlay - S'affiche si isOpen est vrai */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-overlay"
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeMenu();
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10001,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: '100%',
              height: '100%',
              touchAction: 'manipulation'
            }}
          />
        )}
      </AnimatePresence>

      {/* Menu Panel - S'affiche si isOpen est vrai */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-panel"
            className="mobile-menu-panel"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10002,
              backgroundColor: 'white',
              overflowY: 'auto',
              overflowX: 'hidden',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              borderTop: '1px solid #e5e7eb',
              width: '100%',
              height: 'calc(100vh - 64px)',
              maxHeight: 'calc(100vh - 64px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem' }}>
              {/* Navigation principale */}
              {navigation && navigation.length > 0 ? (
                navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.href);
                  }}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    marginBottom: '4px',
                    borderRadius: '8px',
                    color: location.pathname === item.href ? '#111827' : '#374151',
                    backgroundColor: location.pathname === item.href ? '#f3f4f6' : 'transparent',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    minHeight: '48px',
                    touchAction: 'manipulation'
                  }}
                >
                  {item.name}
                </Link>
              ))
              ) : (
                <div style={{ padding: '12px 16px', color: '#6b7280' }}>
                  Aucun élément de navigation disponible
                </div>
              )}

              {/* Actualités */}
              {newsMenu && newsMenu.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                  Actualités & Blog
                </div>
                {newsMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      color: location.pathname === item.href ? '#111827' : '#374151',
                      backgroundColor: location.pathname === item.href ? '#f3f4f6' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      minHeight: '48px',
                      touchAction: 'manipulation'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              )}

              {/* Communauté */}
              {communityMenu && communityMenu.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                  Communauté
                </div>
                {communityMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      color: location.pathname === item.href ? '#111827' : '#374151',
                      backgroundColor: location.pathname === item.href ? '#f3f4f6' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      minHeight: '48px',
                      touchAction: 'manipulation'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              )}

              {/* Contact & Info */}
              {infoMenu && infoMenu.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                  Contact & Info
                </div>
                {infoMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      color: location.pathname === item.href ? '#111827' : '#374151',
                      backgroundColor: location.pathname === item.href ? '#f3f4f6' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      minHeight: '48px',
                      touchAction: 'manipulation'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              )}

              {/* Section utilisateur */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                {isAuthenticated ? (
                  <>
                    <div style={{ padding: '8px 12px', fontSize: '0.875rem', color: '#6b7280' }}>
                      Bonjour, {user?.firstName}
                    </div>
                    <Link
                      to="/profile"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick('/profile');
                      }}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        marginBottom: '4px',
                        borderRadius: '8px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        minHeight: '48px',
                        touchAction: 'manipulation'
                      }}
                    >
                      Mon profil
                    </Link>
                    <Link
                      to="/my-courses"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick('/my-courses');
                      }}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        marginBottom: '4px',
                        borderRadius: '8px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        minHeight: '48px',
                        touchAction: 'manipulation'
                      }}
                    >
                      Mes formations
                    </Link>
                    {isAdmin(user?.role) && (
                      <Link
                        to="/admin"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick('/admin');
                        }}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          marginBottom: '4px',
                          borderRadius: '8px',
                          color: '#2563eb',
                          textDecoration: 'none',
                          fontSize: '1rem',
                          fontWeight: 500,
                          minHeight: '48px',
                          touchAction: 'manipulation'
                        }}
                      >
                        Dashboard Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 16px',
                        marginTop: '8px',
                        borderRadius: '8px',
                        color: '#374151',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                        minHeight: '48px',
                        touchAction: 'manipulation'
                      }}
                    >
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/login');
                    }}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      minHeight: '48px',
                      touchAction: 'manipulation'
                    }}
                  >
                    {t('common.seConnecter') || 'Se connecter'}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;

