/**
 * Gestionnaire global de modals qui persiste même si les composants sont démontés
 * Utilise le DOM directement pour éviter toute dépendance au cycle de vie React
 */

class ModalManager {
  constructor() {
    this.modals = new Map();
    this.container = null;
    this.init();
  }

  init() {
    // Créer un conteneur pour les modals s'il n'existe pas
    if (!document.getElementById('global-modal-container')) {
      this.container = document.createElement('div');
      this.container.id = 'global-modal-container';
      this.container.style.position = 'fixed';
      this.container.style.top = '0';
      this.container.style.left = '0';
      this.container.style.width = '100%';
      this.container.style.height = '100%';
      this.container.style.pointerEvents = 'none';
      this.container.style.zIndex = '99999';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('global-modal-container');
    }
  }

  show(id, content) {
    // Supprimer le modal existant s'il y en a un
    this.hide(id);

    // Créer le modal
    const modalElement = document.createElement('div');
    modalElement.id = `modal-${id}`;
    modalElement.style.position = 'fixed';
    modalElement.style.top = '0';
    modalElement.style.left = '0';
    modalElement.style.width = '100%';
    modalElement.style.height = '100%';
    modalElement.style.display = 'flex';
    modalElement.style.alignItems = 'center';
    modalElement.style.justifyContent = 'center';
    modalElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalElement.style.pointerEvents = 'auto';
    modalElement.style.zIndex = '99999';

    // Ajouter le contenu
    if (typeof content === 'string') {
      modalElement.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      modalElement.appendChild(content);
    }

    // Ajouter au conteneur
    this.container.appendChild(modalElement);
    this.modals.set(id, modalElement);

    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';

    console.log('✅ [ModalManager] Modal shown:', id);
  }

  hide(id) {
    const modal = this.modals.get(id);
    if (modal) {
      modal.remove();
      this.modals.delete(id);
      
      // Réautoriser le scroll si aucun modal n'est ouvert
      if (this.modals.size === 0) {
        document.body.style.overflow = '';
      }
      
      console.log('✅ [ModalManager] Modal hidden:', id);
    }
  }

  isVisible(id) {
    return this.modals.has(id);
  }

  hideAll() {
    this.modals.forEach((modal, id) => {
      this.hide(id);
    });
  }
}

// Instance singleton
export const modalManager = new ModalManager();

