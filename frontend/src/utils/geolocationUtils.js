/**
 * Utilitaires avancés pour la géolocalisation
 */

// Calculer la distance entre deux points (formule de Haversine)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en km
};

const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

// Formater la distance
export const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(2)} km`;
};

// Géocodage inverse avec Nominatim (OpenStreetMap)
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ExperienceTech/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Erreur de géocodage inverse');
    }
    
    const data = await response.json();
    return {
      address: data.display_name,
      components: data.address || {},
      full: data
    };
  } catch (error) {
    console.error('Erreur de géocodage inverse:', error);
    return null;
  }
};

// Géocodage direct (adresse vers coordonnées)
export const geocode = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'ExperienceTech/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Erreur de géocodage');
    }
    
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur de géocodage:', error);
    return null;
  }
};

// Calculer le bearing (direction) entre deux points
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x);
  return ((bearing * 180) / Math.PI + 360) % 360;
};

// Obtenir le nom de la direction
export const getDirectionName = (bearing) => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  return directions[Math.round(bearing / 22.5) % 16];
};

// Vérifier si une position est dans une zone (rayon)
export const isInRadius = (centerLat, centerLon, lat, lon, radiusKm) => {
  const distance = calculateDistance(centerLat, centerLon, lat, lon);
  return distance <= radiusKm;
};

// Obtenir la vitesse estimée (si disponible)
export const getSpeed = (position) => {
  if (position.coords && position.coords.speed !== null && position.coords.speed !== undefined) {
    return position.coords.speed * 3.6; // Convertir m/s en km/h
  }
  return null;
};

// Formater les coordonnées
export const formatCoordinates = (lat, lng, precision = 6) => {
  return {
    lat: lat.toFixed(precision),
    lng: lng.toFixed(precision),
    dms: {
      lat: decimalToDMS(lat, true),
      lng: decimalToDMS(lng, false)
    }
  };
};

// Convertir décimal en degrés, minutes, secondes
const decimalToDMS = (decimal, isLatitude) => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  const direction = isLatitude
    ? decimal >= 0 ? 'N' : 'S'
    : decimal >= 0 ? 'E' : 'W';
  
  return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`;
};

// Sauvegarder l'historique des positions
export const savePositionHistory = (position) => {
  try {
    const history = getPositionHistory();
    history.push({
      ...position,
      timestamp: Date.now()
    });
    
    // Garder seulement les 50 dernières positions
    const limitedHistory = history.slice(-50);
    localStorage.setItem('geolocation_history', JSON.stringify(limitedHistory));
  } catch (error) {
    console.warn('Impossible de sauvegarder l\'historique:', error);
  }
};

// Récupérer l'historique des positions
export const getPositionHistory = () => {
  try {
    const history = localStorage.getItem('geolocation_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.warn('Impossible de lire l\'historique:', error);
    return [];
  }
};

// Effacer l'historique
export const clearPositionHistory = () => {
  try {
    localStorage.removeItem('geolocation_history');
  } catch (error) {
    console.warn('Impossible d\'effacer l\'historique:', error);
  }
};

// Détecter si l'utilisateur se déplace
export const detectMovement = (previousPosition, currentPosition, thresholdMeters = 10) => {
  if (!previousPosition || !currentPosition) return false;
  
  const distance = calculateDistance(
    previousPosition.lat,
    previousPosition.lng,
    currentPosition.lat,
    currentPosition.lng
  );
  
  return distance * 1000 > thresholdMeters; // Convertir en mètres
};

// Obtenir la précision estimée en fonction de la source
export const getAccuracyDescription = (accuracy) => {
  if (!accuracy) return 'Inconnue';
  
  if (accuracy < 10) return 'Très précise (GPS)';
  if (accuracy < 50) return 'Précise (GPS)';
  if (accuracy < 100) return 'Bonne (WiFi/Cellulaire)';
  if (accuracy < 500) return 'Moyenne (Cellulaire)';
  return 'Faible (Estimation)';
};

// Vérifier si la géolocalisation est disponible
export const isGeolocationAvailable = () => {
  return 'geolocation' in navigator;
};

// Obtenir les permissions de géolocalisation
export const checkGeolocationPermission = async () => {
  if (!('permissions' in navigator)) {
    return 'prompt'; // Pas de support, considérer comme prompt
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state; // 'granted', 'denied', ou 'prompt'
  } catch (error) {
    console.warn('Impossible de vérifier les permissions:', error);
    return 'prompt';
  }
};

