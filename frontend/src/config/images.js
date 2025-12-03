// Configuration centralisée des chemins d'images
export const IMAGES = {
  // Logo de l'entreprise
  logo: '/images/logo.png',
  
  // Images du slider hero
  hero: {
    training: '/images/hero/training-hero.jpg',
    digital: '/images/hero/digital-hero.jpg',
    network: '/images/hero/network-hero.svg'
  },
  
  // Images des témoignages
  testimonials: {
    avatar1: '/images/testimonials/avatar-1.svg',
    avatar2: '/images/testimonials/avatar-2.svg',
    avatar3: '/images/testimonials/avatar-3.svg'
  },
  
  // Images de l'équipe
  team: {
    main: '/images/team/team-image.jpg'
  },
  
  // Images de fallback
  fallback: {
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNCIgZmlsbD0iIzljYTNhZiIvPgo8cGF0aCBkPSJNNiAxNmMwLTQuNDE4IDMuNTgyLTggOC04czggMy41ODIgOCA4IiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K',
    team: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ3MCIgaGVpZ2h0PSI5ODAiIHZpZXdCb3g9IjAgMCAxNDcwIDk4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0ZjQ2YjU7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE0NzAiIGhlaWdodD0iOTgwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8dGV4dCB4PSI3MzUiIHk9IjQ5MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiPk5vdHJlIMOpcXVpcGU8L3RleHQ+Cjwvc3ZnPgo='
  }
};

// Fonction utilitaire pour gérer les erreurs d'images
export const handleImageError = (e, fallbackSrc) => {
  if (e.target.src !== fallbackSrc) {
    e.target.src = fallbackSrc;
  }
};

// Fonction pour obtenir l'URL d'une image avec fallback
export const getImageUrl = (primarySrc, fallbackSrc = IMAGES.fallback.avatar) => {
  return primarySrc || fallbackSrc;
};

