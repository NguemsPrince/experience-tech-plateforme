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
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile avec vérification continue
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const mobile = width < 768;
      console.log('Checking mobile, width:', width, 'isMobile:', mobile);
      setIsMobile(mobile);
      
      // FORCER la visibilité du bouton
      const btn = document.getElementById('mobile-menu-btn');
      if (btn) {
        if (mobile) {
          btn.style.setProperty('display', 'flex', 'important');
          btn.style.setProperty('visibility', 'visible', 'important');
          btn.style.setProperty('opacity', '1', 'important');
          btn.style.setProperty('pointer-events', 'auto', 'important');
        } else {
          btn.style.setProperty('display', 'none', 'important');
        }
      }
    };

    // Vérifier immédiatement
    checkMobile();
    
    // Vérifier après un court délai
    setTimeout(checkMobile, 100);
    
    const interval = setInterval(checkMobile, 500);
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Gestion de l'ouverture/fermeture
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.classList.remove('menu-open');
    }
  }, [isOpen, isMobile]);

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current isOpen:', isOpen, 'isMobile:', isMobile);
    const newState = !isOpen;
    setIsOpen(newState);
    console.log('Setting isOpen to:', newState);
    
    // FORCER l'affichage immédiat avec manipulation DOM
    if (newState && isMobile) {
      setTimeout(() => {
        const overlay = document.querySelector('.mobile-menu-overlay');
        const panel = document.querySelector('.mobile-menu-panel');
        console.log('Forcing display, overlay:', overlay, 'panel:', panel);
        if (overlay) {
          overlay.style.setProperty('display', 'block', 'important');
          overlay.style.setProperty('visibility', 'visible', 'important');
          overlay.style.setProperty('opacity', '1', 'important');
        }
        if (panel) {
          panel.style.setProperty('display', 'block', 'important');
          panel.style.setProperty('visibility', 'visible', 'important');
          panel.style.setProperty('opacity', '1', 'important');
          panel.style.setProperty('transform', 'translateX(0)', 'important');
        }
      }, 10);
    }
  };

  const closeMenu = () => {
    console.log('Closing menu');
    setIsOpen(false);
  };

  const handleLinkClick = (href) => {
    closeMenu();
    setTimeout(() => navigate(href), 100);
  };

  // Ne pas retourner null même si isMobile n'est pas encore détecté
  // Le bouton sera caché par les styles si ce n'est pas mobile
  const shouldShow = isMobile || window.innerWidth < 768;
  
  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {/* Bouton Hamburger - TOUJOURS VISIBLE SUR MOBILE */}
      <button
        id="mobile-menu-btn"
        onClick={toggleMenu}
        onTouchStart={toggleMenu}
        aria-label="Menu mobile"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          visibility: 'visible',
          opacity: 1,
          position: 'relative',
          zIndex: 10003,
          minWidth: '48px',
          minHeight: '48px',
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
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {isOpen ? (
          <XMarkIcon style={{ width: '28px', height: '28px', color: 'white' }} />
        ) : (
          <Bars3Icon style={{ width: '28px', height: '28px', color: 'white' }} />
        )}
      </button>

      {/* Overlay - FORCER l'affichage */}
      {isOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMenu}
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
            pointerEvents: 'auto'
          }}
        />
      )}

      {/* Menu Panel - FORCER l'affichage avec styles inline */}
      {isOpen && (
        <div
          className="mobile-menu-panel"
          style={{
            position: 'fixed',
            top: '4rem',
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
            transition: 'transform 0.3s ease'
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

