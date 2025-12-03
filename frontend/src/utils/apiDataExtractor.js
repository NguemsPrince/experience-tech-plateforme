/**
 * Utilitaire pour extraire les données des réponses API de manière cohérente
 * Gère tous les formats possibles de réponse de l'API
 */

/**
 * Extrait les données d'une réponse API
 * @param {*} response - La réponse de l'API (peut être dans différents formats)
 * @param {string} dataKey - La clé des données à extraire (optionnel, pour les réponses structurées)
 * @returns {*} Les données extraites
 */
export const extractApiData = (response, dataKey = null) => {
  if (!response) {
    return null;
  }

  // Si c'est directement les données (apiEnhanced retourne déjà response.data)
  if (response && !response.success && !response.data && !Array.isArray(response)) {
    // Si c'est un objet simple sans structure de réponse API
    return response;
  }

  // Structure standard : { success: true, data: {...} }
  if (response.success && response.data) {
    // Si on cherche une clé spécifique dans data
    if (dataKey && response.data[dataKey]) {
      return response.data[dataKey];
    }
    // Sinon retourner data directement
    return response.data;
  }

  // Structure avec data directement : { data: {...} }
  if (response.data) {
    if (dataKey && response.data[dataKey]) {
      return response.data[dataKey];
    }
    return response.data;
  }

  // Si c'est directement un tableau ou un objet
  if (Array.isArray(response) || (typeof response === 'object' && !response.success)) {
    return response;
  }

  // Par défaut, retourner la réponse telle quelle
  return response;
};

/**
 * Extrait les données avec pagination
 * @param {*} response - La réponse de l'API
 * @param {string} itemsKey - La clé pour les items (ex: 'users', 'products', etc.)
 * @returns {{ items: Array, pagination: Object }}
 */
export const extractPaginatedData = (response, itemsKey = null) => {
  if (!response) {
    return { items: [], pagination: {} };
  }

  const data = extractApiData(response, itemsKey);

  // Si data contient directement les items et la pagination
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    // Chercher les clés communes pour les items
    const possibleItemKeys = itemsKey ? [itemsKey] : ['items', 'data', 'results', 'list'];
    let items = [];
    let pagination = {};

    for (const key of possibleItemKeys) {
      if (data[key] && Array.isArray(data[key])) {
        items = data[key];
        break;
      }
    }

    // Si items est vide mais data est un tableau
    if (items.length === 0 && Array.isArray(data)) {
      items = data;
    }

    // Extraire la pagination
    pagination = data.pagination || data.paging || {};

    return { items, pagination };
  }

  // Si data est directement un tableau
  if (Array.isArray(data)) {
    return { items: data, pagination: {} };
  }

  return { items: [], pagination: {} };
};

/**
 * Valide et formate une valeur pour l'affichage
 * @param {*} value - La valeur à formater
 * @param {string} type - Le type attendu ('number', 'string', 'date', etc.)
 * @returns {*} La valeur formatée
 */
export const formatValue = (value, type = 'auto') => {
  if (value === null || value === undefined) {
    return type === 'number' ? 0 : (type === 'string' ? '' : null);
  }

  switch (type) {
    case 'number':
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      }
      return 0;

    case 'string':
      return String(value);

    case 'date':
      if (value instanceof Date) return value;
      if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      }
      return null;

    default:
      return value;
  }
};

/**
 * Gère les erreurs API de manière cohérente
 * @param {Error} error - L'erreur à gérer
 * @param {string} context - Le contexte de l'erreur (pour les logs)
 * @returns {Error} L'erreur formatée
 */
export const handleApiError = (error, context = 'API') => {
  console.error(`[${context}] Error:`, error);

  // Extraire le message d'erreur
  let message = 'Une erreur est survenue';

  if (error.response?.data) {
    // Erreur avec réponse du serveur
    const errorData = error.response.data;
    message = errorData.message || errorData.error || message;
  } else if (error.message) {
    // Erreur réseau ou autre
    message = error.message;
  }

  // Créer une nouvelle erreur avec le message formaté
  const formattedError = new Error(message);
  formattedError.originalError = error;
  formattedError.status = error.response?.status;
  formattedError.context = context;

  return formattedError;
};

