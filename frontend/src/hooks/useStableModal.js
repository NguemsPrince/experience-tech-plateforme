import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les modals de manière stable
 * Empêche la fermeture automatique lors des re-renders
 * Version améliorée avec protection complète
 */
export const useStableModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const isOpenRef = useRef(initialState);
  const preventCloseRef = useRef(false);
  const mountedRef = useRef(true);
  const closeTimeoutRef = useRef(null);

  // Synchroniser la ref avec l'état
  useEffect(() => {
    isOpenRef.current = isOpen;
    // Nettoyer tout timeout en cours si le modal est ouvert
    if (isOpen && closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, [isOpen]);

  // Protéger contre le démontage
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Nettoyer les timeouts au démontage
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, []);

  const open = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }
    
    // Annuler toute fermeture en cours
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    preventCloseRef.current = false;
    isOpenRef.current = true;
    
    // Mettre à jour l'état immédiatement
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    // Vérifier si on peut fermer
    if (!mountedRef.current) {
      return;
    }
    
    if (preventCloseRef.current) {
      return;
    }
    
    // Annuler toute fermeture en cours
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    isOpenRef.current = false;
    
    // Mettre à jour l'état immédiatement
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    if (isOpenRef.current) {
      close();
    } else {
      open();
    }
  }, [open, close]);

  const preventClose = useCallback(() => {
    preventCloseRef.current = true;
  }, []);

  const allowClose = useCallback(() => {
    preventCloseRef.current = false;
  }, []);

  // Fonction pour forcer la réouverture si le modal se ferme accidentellement
  const forceOpen = useCallback(() => {
    if (!mountedRef.current) return;
    
    // Annuler toute fermeture en cours
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    preventCloseRef.current = false;
    isOpenRef.current = true;
    setIsOpen(true);
  }, []);

  // Surveiller les changements d'état et empêcher la fermeture accidentelle
  // DÉSACTIVÉ : Ce useEffect peut causer des boucles infinies
  // useEffect(() => {
  //   if (isOpen && !isOpenRef.current) {
  //     // Si l'état dit ouvert mais la ref dit fermé, corriger
  //     console.warn('⚠️ [useStableModal] State mismatch detected (state=true, ref=false), correcting...');
  //     forceOpen();
  //   } else if (!isOpen && isOpenRef.current) {
  //     // Si l'état dit fermé mais la ref dit ouvert, corriger (mais seulement si preventClose n'est pas actif)
  //     if (!preventCloseRef.current) {
  //       console.warn('⚠️ [useStableModal] State mismatch detected (state=false, ref=true), but ref takes precedence');
  //       // Ne pas forcer la fermeture si preventClose est actif
  //     }
  //   }
  // }, [isOpen, forceOpen]);

  // Retourner directement l'objet - useMemo peut causer des problèmes
  // Les fonctions sont déjà stables grâce à useCallback
  return {
    isOpen,
    isOpenRef,
    open,
    close,
    toggle,
    preventClose,
    allowClose,
    forceOpen,
  };
};
