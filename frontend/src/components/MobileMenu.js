import React, { useEffect, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(() => {
    // Initialiser avec la valeur actuelle
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Détection mobile pour d'autres usages si nécessaire
  // MAIS on ne force plus l'affichage du bouton - le CSS gère ça
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
    };

    checkMobile();
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

  // Forcer l'affichage du menu quand isOpen devient true
  useEffect(() => {
    if (isOpen) {
      const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
      if (isMobileDevice) {
        // Double vérification pour s'assurer que le menu s'affiche
        const forceDisplay = () => {
          const overlay = document.getElementById('mobile-menu-overlay');
          const panel = document.getElementById('mobile-menu-panel');
          
          if (overlay) {
            overlay.style.setProperty('display', 'block', 'important');
            overlay.style.setProperty('visibility', 'visible', 'important');
            overlay.style.setProperty('opacity', '1', 'important');
            overlay.style.setProperty('z-index', '10001', 'important');
            overlay.style.setProperty('position', 'fixed', 'important');
          }
          if (panel) {
            panel.style.setProperty('display', 'block', 'important');
            panel.style.setProperty('visibility', 'visible', 'important');
            panel.style.setProperty('opacity', '1', 'important');
            panel.style.setProperty('z-index', '10002', 'important');
            panel.style.setProperty('position', 'fixed', 'important');
          }
        };
        
        // Forcer immédiatement et après un court délai
        forceDisplay();
        setTimeout(forceDisplay, 10);
        setTimeout(forceDisplay, 50);
        setTimeout(forceDisplay, 100);
      }
    }
  }, [isOpen]);

  // Gestion de l'ouverture/fermeture
  useEffect(() => {
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isOpen && isMobileDevice) {
      // Sauvegarder la position du scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
      
      // FORCER l'affichage du menu après un court délai
      setTimeout(() => {
        const overlay = document.getElementById('mobile-menu-overlay');
        const panel = document.getElementById('mobile-menu-panel');
        
        if (overlay) {
          overlay.style.setProperty('display', 'block', 'important');
          overlay.style.setProperty('visibility', 'visible', 'important');
          overlay.style.setProperty('opacity', '1', 'important');
          overlay.style.setProperty('z-index', '10001', 'important');
        }
        if (panel) {
          panel.style.setProperty('display', 'block', 'important');
          panel.style.setProperty('visibility', 'visible', 'important');
          panel.style.setProperty('opacity', '1', 'important');
          panel.style.setProperty('z-index', '10002', 'important');
        }
      }, 10);
    } else {
      // Restaurer la position du scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      // Cacher le menu
      const overlay = document.getElementById('mobile-menu-overlay');
      const panel = document.getElementById('mobile-menu-panel');
      if (overlay) {
        overlay.style.setProperty('display', 'none', 'important');
      }
      if (panel) {
        panel.style.setProperty('display', 'none', 'important');
      }
    }
  }, [isOpen]);

  const toggleMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const currentIsMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    console.log('Toggle menu clicked, current isOpen:', isOpen, 'isMobile:', currentIsMobile);
    
    setIsOpen(prev => {
      const newState = !prev;
      console.log('Setting isOpen to:', newState);
      
      // FORCER l'affichage immédiat avec manipulation DOM
      if (newState && currentIsMobile) {
        // Utiliser setTimeout pour s'assurer que React a mis à jour le DOM
        setTimeout(() => {
          const overlay = document.getElementById('mobile-menu-overlay');
          const panel = document.getElementById('mobile-menu-panel');
          console.log('Forcing display, overlay:', overlay, 'panel:', panel);
          
          if (overlay) {
            overlay.style.setProperty('display', 'block', 'important');
            overlay.style.setProperty('visibility', 'visible', 'important');
            overlay.style.setProperty('opacity', '1', 'important');
            overlay.style.setProperty('z-index', '10001', 'important');
            overlay.style.setProperty('position', 'fixed', 'important');
          }
          if (panel) {
            panel.style.setProperty('display', 'block', 'important');
            panel.style.setProperty('visibility', 'visible', 'important');
            panel.style.setProperty('opacity', '1', 'important');
            panel.style.setProperty('transform', 'translateX(0)', 'important');
            panel.style.setProperty('z-index', '10002', 'important');
            panel.style.setProperty('position', 'fixed', 'important');
          }
        }, 50);
      }
      
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
      {/* Bouton Hamburger - TOUJOURS RENDU, CSS GÈRE LA VISIBILITÉ */}
      <button
        id="mobile-menu-button"
        className="mobile-menu-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleMenu(e);
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleMenu(e);
        }}
        aria-label="Menu mobile"
        aria-expanded={isOpen}
        type="button"
        style={{
          // Styles inline de secours pour garantir l'affichage sur mobile
          // Le CSS devrait gérer ça, mais on ajoute des styles inline au cas où
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
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          display: 'flex'
        }}
      >
          {isOpen ? (
            <XMarkIcon style={{ width: '28px', height: '28px', color: 'white' }} />
          ) : (
            <Bars3Icon style={{ width: '28px', height: '28px', color: 'white' }} />
          )}
        </button>

      {/* Overlay - FORCER l'affichage - S'affiche si isOpen est vrai */}
      {isOpen && (
        <div
          id="mobile-menu-overlay"
          className="mobile-menu-overlay"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
          }}
          onTouchStart={(e) => {
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
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            pointerEvents: 'auto',
            width: '100%',
            height: '100%'
          }}
        />
      )}

      {/* Menu Panel - FORCER l'affichage avec styles inline - S'affiche si isOpen est vrai */}
      {isOpen && (
        <div
          id="mobile-menu-panel"
          className="mobile-menu-panel"
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
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            borderTop: '1px solid #e5e7eb',
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease',
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
          </div>
      )}
    </>
  );
};

export default MobileMenu;

