import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ModalContext = createContext(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState(new Map());
  const modalsRef = useRef(new Map());

  const registerModal = useCallback((id, content) => {
    modalsRef.current.set(id, { content, isOpen: true });
    setModals(new Map(modalsRef.current));
  }, []);

  const unregisterModal = useCallback((id) => {
    modalsRef.current.delete(id);
    setModals(new Map(modalsRef.current));
  }, []);

  const updateModal = useCallback((id, updates) => {
    const modal = modalsRef.current.get(id);
    if (modal) {
      modalsRef.current.set(id, { ...modal, ...updates });
      setModals(new Map(modalsRef.current));
    }
  }, []);

  return (
    <ModalContext.Provider value={{ registerModal, unregisterModal, updateModal, modals }}>
      {children}
      {/* Render all modals in a portal */}
      {Array.from(modals.entries()).map(([id, modal]) => 
        modal.isOpen && createPortal(
          modal.content,
          document.body,
          id
        )
      )}
    </ModalContext.Provider>
  );
};

