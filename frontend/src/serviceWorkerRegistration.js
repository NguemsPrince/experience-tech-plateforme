// Service Worker Registration for PWA
// This file handles the registration of the service worker

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Cette application web est servie en mode cache-first par un service worker.'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker enregistré avec succès:', registration.scope);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                'Nouveau contenu disponible, veuillez rafraîchir.'
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
              
              // Afficher notification de mise à jour
              showUpdateNotification();
            } else {
              console.log('Contenu mis en cache pour utilisation hors ligne.');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            console.log('Service Worker unregistered. Manual reload required.');
            // Don't auto-reload to prevent infinite loops
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Pas de connexion Internet. L\'application fonctionne en mode hors ligne.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Fonction pour afficher une notification de mise à jour
function showUpdateNotification() {
  const updateBanner = document.createElement('div');
  updateBanner.id = 'sw-update-banner';
  updateBanner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #3b82f6;
    color: white;
    padding: 16px 24px;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 16px;
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 90%;
    animation: slideUp 0.3s ease-out;
  `;
  
  updateBanner.innerHTML = `
    <span style="flex: 1;">🎉 Nouvelle version disponible !</span>
    <button 
      onclick="window.location.reload()" 
      style="
        background: white;
        color: #3b82f6;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;
      "
      onmouseover="this.style.transform='scale(1.05)'"
      onmouseout="this.style.transform='scale(1)'"
    >
      Actualiser
    </button>
    <button 
      onclick="document.getElementById('sw-update-banner').remove()" 
      style="
        background: transparent;
        color: white;
        border: none;
        padding: 8px;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
      "
    >
      ×
    </button>
  `;
  
  // Ajouter l'animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(updateBanner);
  
  // Auto-dismiss après 30 secondes
  setTimeout(() => {
    if (document.getElementById('sw-update-banner')) {
      updateBanner.style.animation = 'slideUp 0.3s ease-out reverse';
      setTimeout(() => updateBanner.remove(), 300);
    }
  }, 30000);
}

// Détecter quand l'application est en ligne/hors ligne
window.addEventListener('online', () => {
  console.log('🌐 Connexion rétablie');
  const offlineBanner = document.getElementById('offline-banner');
  if (offlineBanner) {
    offlineBanner.remove();
  }
});

window.addEventListener('offline', () => {
  console.log('📡 Connexion perdue - Mode hors ligne');
  showOfflineNotification();
});

function showOfflineNotification() {
  if (document.getElementById('offline-banner')) return;
  
  const offlineBanner = document.createElement('div');
  offlineBanner.id = 'offline-banner';
  offlineBanner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #f59e0b;
    color: white;
    padding: 12px 24px;
    text-align: center;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-weight: 500;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  `;
  
  offlineBanner.innerHTML = `
    📡 Vous êtes hors ligne. Certaines fonctionnalités peuvent ne pas être disponibles.
  `;
  
  document.body.prepend(offlineBanner);
}

