import React, { useEffect, useState, useRef } from 'react';
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
const MobileMenu = ({ navigation, servicesMenu, newsMenu, communityMenu, infoMenu }) => {
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

  // Gérer l'affichage du menu et le scroll lock quand isOpen change
  useEffect(() => {
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    console.log('[MobileMenu] useEffect triggered, isOpen:', isOpen, 'isMobile:', isMobileDevice);
    
    if (isOpen && isMobileDevice) {
      // Forcer l'affichage du menu via DOM
      const overlay = document.getElementById('mobile-menu-overlay');
      const panel = document.getElementById('mobile-menu-panel');
      
      console.log('[MobileMenu] Opening menu, elements found:', { overlay: !!overlay, panel: !!panel });
      
      if (overlay) {
        overlay.style.display = 'block';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
      if (panel) {
        panel.style.display = 'block';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        panel.style.pointerEvents = 'auto';
        panel.style.transform = 'translateX(0)';
      }
      
      // Lock scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
      
      return () => {
        // Cleanup quand le menu se ferme
        if (overlay) {
          overlay.style.display = 'none';
          overlay.style.visibility = 'hidden';
          overlay.style.opacity = '0';
        }
        if (panel) {
          panel.style.display = 'none';
          panel.style.visibility = 'hidden';
          panel.style.opacity = '0';
        }
        
        // Unlock scroll
        const savedScrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        if (savedScrollY) {
          window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
        }
      };
    } else if (!isOpen) {
      // Fermer le menu
      const overlay = document.getElementById('mobile-menu-overlay');
      const panel = document.getElementById('mobile-menu-panel');
      
      if (overlay) {
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
      }
      if (panel) {
        panel.style.display = 'none';
        panel.style.visibility = 'hidden';
        panel.style.opacity = '0';
      }
      
      // Unlock scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
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
      console.log('[MobileMenu] Toggle clicked, new state:', newState ? 'OPEN' : 'CLOSED');
      
      // Forcer l'affichage immédiatement via DOM pour garantir que ça fonctionne
      setTimeout(() => {
        const overlay = document.getElementById('mobile-menu-overlay');
        const panel = document.getElementById('mobile-menu-panel');
        console.log('[MobileMenu] DOM elements found:', { overlay: !!overlay, panel: !!panel });
        
        if (newState) {
          // Ouvrir
          if (overlay) {
            overlay.style.display = 'block';
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
            console.log('[MobileMenu] Overlay opened');
          }
          if (panel) {
            panel.style.display = 'block';
            panel.style.visibility = 'visible';
            panel.style.opacity = '1';
            panel.style.pointerEvents = 'auto';
            console.log('[MobileMenu] Panel opened');
          }
        } else {
          // Fermer
          if (overlay) {
            overlay.style.display = 'none';
            overlay.style.visibility = 'hidden';
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
          }
          if (panel) {
            panel.style.display = 'none';
            panel.style.visibility = 'hidden';
            panel.style.opacity = '0';
            panel.style.pointerEvents = 'none';
          }
        }
      }, 0);
      
      return newState;
    });
  };

  const closeMenu = () => {
    console.log('[MobileMenu] closeMenu called');
    setIsOpen(false);
    // Forcer la fermeture via DOM aussi
    setTimeout(() => {
      const overlay = document.getElementById('mobile-menu-overlay');
      const panel = document.getElementById('mobile-menu-panel');
      if (overlay) {
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
      }
      if (panel) {
        panel.style.display = 'none';
        panel.style.visibility = 'hidden';
        panel.style.opacity = '0';
      }
    }, 0);
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
          toggleMenu(e);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        aria-label="Menu mobile"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
        type="button"
        data-mobile-only="true"
        style={{
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
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(255, 255, 255, 0.2)',
          display: isMobile ? 'flex' : 'none',
          visibility: isMobile ? 'visible' : 'hidden',
          opacity: isMobile ? 1 : 0,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform, box-shadow'
        }}
        onMouseEnter={(e) => {
          if (isMobile) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (isMobile) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }
        }}
        onMouseDown={(e) => {
          if (isMobile) {
            e.currentTarget.style.transform = 'scale(0.95)';
          }
        }}
        onMouseUp={(e) => {
          if (isMobile) {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
      >
        {isOpen ? (
          <XMarkIcon style={{ width: '28px', height: '28px', color: 'white', pointerEvents: 'none' }} aria-hidden="true" />
        ) : (
          <Bars3Icon style={{ width: '28px', height: '28px', color: 'white', pointerEvents: 'none' }} aria-hidden="true" />
        )}
      </button>

      {/* Overlay - Rendu conditionnel simple et robuste */}
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
            e.stopPropagation();
            closeMenu();
          }}
          role="button"
          aria-label="Fermer le menu"
          tabIndex={-1}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10001,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            width: '100%',
            height: '100%',
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            pointerEvents: 'auto',
            touchAction: 'manipulation',
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'opacity'
          }}
        />
      )}

      {/* Menu Panel - Rendu conditionnel simple et robuste */}
      {isOpen && (
        <div
          id="mobile-menu-panel"
          className="mobile-menu-panel"
          role="navigation"
          aria-label="Menu de navigation mobile"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10002,
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            overflowY: 'hidden',
            overflowX: 'hidden',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            borderTop: '1px solid #e5e7eb',
            width: '100%',
            height: 'calc(100vh - 64px)',
            maxHeight: 'calc(100vh - 64px)',
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            pointerEvents: 'auto',
            transform: 'translateX(0)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform, opacity'
          }}
          onClick={(e) => e.stopPropagation()}
        >
            <div style={{ padding: '1rem', height: '100%', overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
                  aria-label={item.name}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 16px',
                    marginBottom: '4px',
                    borderRadius: '8px',
                    color: location.pathname === item.href ? '#2563eb' : '#1f2937',
                    backgroundColor: location.pathname === item.href ? '#eff6ff' : 'transparent',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: location.pathname === item.href ? 600 : 500,
                    minHeight: '48px',
                    minWidth: '44px',
                    lineHeight: '1.5',
                    touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'rgba(37, 99, 235, 0.1)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'background-color, color'
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#dbeafe' : '#f3f4f6';
                  }}
                  onTouchEnd={(e) => {
                    setTimeout(() => {
                      e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#eff6ff' : 'transparent';
                    }, 150);
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

              {/* Services */}
              {servicesMenu && servicesMenu.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                  Services
                </div>
                {servicesMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    aria-label={item.name}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 16px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      color: location.pathname === item.href ? '#2563eb' : '#1f2937',
                      backgroundColor: location.pathname === item.href ? '#eff6ff' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: location.pathname === item.href ? 600 : 500,
                      minHeight: '48px',
                      minWidth: '44px',
                      lineHeight: '1.5',
                      touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'rgba(37, 99, 235, 0.1)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'background-color, color'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#dbeafe' : '#f3f4f6';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#eff6ff' : 'transparent';
                      }, 150);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              )}

              {/* Actualités - Blog et témoignages */}
              {newsMenu && newsMenu.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                  Actualités
                </div>
                {newsMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    aria-label={item.name}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 16px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      color: location.pathname === item.href ? '#2563eb' : '#1f2937',
                      backgroundColor: location.pathname === item.href ? '#eff6ff' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: location.pathname === item.href ? 600 : 500,
                      minHeight: '48px',
                      minWidth: '44px',
                      lineHeight: '1.5',
                      touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'rgba(37, 99, 235, 0.1)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'background-color, color'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#dbeafe' : '#f3f4f6';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#eff6ff' : 'transparent';
                      }, 150);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              )}

              {/* Communauté - Forum et carrières */}
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
                    aria-label={item.name}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 16px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      color: location.pathname === item.href ? '#2563eb' : '#1f2937',
                      backgroundColor: location.pathname === item.href ? '#eff6ff' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: location.pathname === item.href ? 600 : 500,
                      minHeight: '48px',
                      minWidth: '44px',
                      lineHeight: '1.5',
                      touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'rgba(37, 99, 235, 0.1)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'background-color, color'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#dbeafe' : '#f3f4f6';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#eff6ff' : 'transparent';
                      }, 150);
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
                    aria-label={item.name}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 16px',
                      marginBottom: '4px',
                      borderRadius: '8px',
                      color: location.pathname === item.href ? '#2563eb' : '#1f2937',
                      backgroundColor: location.pathname === item.href ? '#eff6ff' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: location.pathname === item.href ? 600 : 500,
                      minHeight: '48px',
                      minWidth: '44px',
                      lineHeight: '1.5',
                      touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'rgba(37, 99, 235, 0.1)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'background-color, color'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#dbeafe' : '#f3f4f6';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = location.pathname === item.href ? '#eff6ff' : 'transparent';
                      }, 150);
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

