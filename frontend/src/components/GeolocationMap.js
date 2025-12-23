import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPinIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  ShareIcon,
  LocationMarkerIcon,
  ClockIcon,
  ChartBarIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import {
  reverseGeocode,
  calculateDistance,
  formatDistance,
  savePositionHistory,
  getPositionHistory,
  formatCoordinates,
  getAccuracyDescription,
  detectMovement,
  getSpeed
} from '../utils/geolocationUtils';

// Configuration des icônes Leaflet pour éviter les erreurs 404
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Créer une icône personnalisée pour la position de l'utilisateur
const createUserIcon = () => {
  return L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const GeolocationMap = ({ 
  height = '500px',
  zoom = 15,
  showControls = true,
  className = '',
  onLocationUpdate = null,
  enableTracking = false, // Suivi en temps réel
  enableHighAccuracy = false, // Mode haute précision
  showAddress = true, // Afficher l'adresse
  showHistory = false // Afficher l'historique
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);
  const previousPositionRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [address, setAddress] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [speed, setSpeed] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  const updateMapWithPosition = useCallback((userPosition, posAccuracy = null) => {
    if (!mapInstanceRef.current) {
      // Initialiser la carte si elle n'existe pas
      if (!mapRef.current) return;
      
      // Vérifier si le conteneur a déjà une instance Leaflet
      if (mapRef.current._leaflet_id) {
        delete mapRef.current._leaflet_id;
      }
      
      try {
        const map = L.map(mapRef.current).setView(userPosition, zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }).addTo(map);
        
        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
        return;
      }
    }

    const map = mapInstanceRef.current;

    // Centrer la carte sur la position de l'utilisateur
    map.setView(userPosition, zoom);

    // Supprimer l'ancien marqueur s'il existe
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    // Créer un nouveau marqueur à la position de l'utilisateur
    const userIcon = createUserIcon();
    const marker = L.marker(userPosition, { icon: userIcon }).addTo(map);

    // Ajouter un popup avec les coordonnées enrichies
    const coords = formatCoordinates(userPosition[0], userPosition[1]);
    const popupContent = `
      <div style="padding: 8px; min-width: 250px;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #111827;">
          📍 Votre position
        </h3>
        ${address ? `
          <p style="font-size: 12px; color: #2563eb; margin: 4px 0; font-weight: 500;">
            ${address}
          </p>
        ` : ''}
        <p style="font-size: 11px; color: #6b7280; margin: 4px 0;">
          <strong>Lat:</strong> ${coords.lat} | <strong>Lng:</strong> ${coords.lng}
        </p>
        <p style="font-size: 10px; color: #9ca3af; margin: 4px 0;">
          ${coords.dms.lat} ${coords.dms.lng}
        </p>
        ${posAccuracy ? `
          <p style="font-size: 11px; color: #6b7280; margin: 4px 0;">
            <strong>Précision:</strong> ±${Math.round(posAccuracy)} m (${getAccuracyDescription(posAccuracy)})
          </p>
        ` : ''}
        ${speed !== null && speed !== undefined ? `
          <p style="font-size: 11px; color: #6b7280; margin: 4px 0;">
            <strong>Vitesse:</strong> ${speed.toFixed(1)} km/h
          </p>
        ` : ''}
      </div>
    `;
    marker.bindPopup(popupContent).openPopup();

    markerRef.current = marker;

    // Ajouter un cercle de précision si disponible
    if (posAccuracy) {
      // Supprimer l'ancien cercle s'il existe
      const existingCircle = map._precisionCircle;
      if (existingCircle) {
        map.removeLayer(existingCircle);
      }

      const circle = L.circle(userPosition, {
        radius: posAccuracy,
        fillColor: '#3b82f6',
        fillOpacity: 0.2,
        color: '#3b82f6',
        weight: 2,
        opacity: 0.5
      }).addTo(map);

      map._precisionCircle = circle;
    }
  }, [zoom]);

  const initializeMap = useCallback(() => {
    if (!mapRef.current) return;

    // Vérifier si le conteneur a déjà une instance Leaflet
    if (mapRef.current._leaflet_id) {
      // Le conteneur a déjà été utilisé, nettoyer d'abord
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignorer les erreurs de nettoyage
          console.warn('Erreur lors du nettoyage de la carte:', e);
        }
      }
      // Réinitialiser l'ID Leaflet du conteneur
      delete mapRef.current._leaflet_id;
    }

    // Nettoyer la carte existante si elle existe
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      } catch (e) {
        console.warn('Erreur lors du nettoyage de la carte:', e);
      }
    }

    // Position par défaut (Abéché, Tchad) si la géolocalisation n'est pas encore disponible
    const defaultCenter = position || [13.8292, 20.8324];
    const defaultZoom = position ? zoom : 13;

    try {
      const map = L.map(mapRef.current).setView(defaultCenter, defaultZoom);

      // Ajouter les tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
      setError('Erreur lors de l\'initialisation de la carte.');
    }
  }, [position, zoom]);

  // Fonction pour sauvegarder la position dans le cache
  const savePositionToCache = useCallback((position) => {
    try {
      const cacheData = {
        lat: position[0],
        lng: position[1],
        timestamp: Date.now()
      };
      localStorage.setItem('geolocation_cache', JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Impossible de sauvegarder la position dans le cache:', e);
    }
  }, []);

  // Fonction pour récupérer la position depuis le cache
  const getCachedPosition = useCallback(() => {
    try {
      const cached = localStorage.getItem('geolocation_cache');
      if (cached) {
        const data = JSON.parse(cached);
        // Utiliser le cache si il a moins de 5 minutes
        if (Date.now() - data.timestamp < 5 * 60 * 1000) {
          return [data.lat, data.lng];
        }
      }
    } catch (e) {
      console.warn('Impossible de lire le cache:', e);
    }
    return null;
  }, []);

  // Fonction pour traiter une nouvelle position
  const processPosition = useCallback(async (position) => {
    const { latitude, longitude, accuracy: posAccuracy, speed: posSpeed } = position.coords;
    const userPosition = [latitude, longitude];
    
    // Calculer la distance parcourue si on a une position précédente
    if (previousPositionRef.current && isTracking) {
      const distance = calculateDistance(
        previousPositionRef.current[0],
        previousPositionRef.current[1],
        latitude,
        longitude
      );
      setDistanceTraveled(prev => prev + distance);
    }
    
    // Détecter le mouvement
    if (previousPositionRef.current) {
      const moved = detectMovement(
        { lat: previousPositionRef.current[0], lng: previousPositionRef.current[1] },
        { lat: latitude, lng: longitude }
      );
      if (moved) {
        console.log('Mouvement détecté');
      }
    }
    
    // Sauvegarder dans l'historique
    savePositionHistory({ lat: latitude, lng: longitude, accuracy: posAccuracy });
    
    // Mettre à jour les états
    setPosition(userPosition);
    setAccuracy(posAccuracy);
    setSpeed(posSpeed ? posSpeed * 3.6 : null); // Convertir m/s en km/h
    setIsLoading(false);
    previousPositionRef.current = userPosition;
    
    // Sauvegarder dans le cache
    savePositionToCache(userPosition);
    
    // Géocodage inverse pour obtenir l'adresse
    let currentAddress = null;
    if (showAddress) {
      try {
        const addressData = await reverseGeocode(latitude, longitude);
        if (addressData) {
          currentAddress = addressData.address;
          setAddress(addressData.address);
        }
      } catch (err) {
        console.warn('Erreur de géocodage inverse:', err);
      }
    }
    
    // Mettre à jour la carte avec la position de l'utilisateur
    updateMapWithPosition(userPosition, posAccuracy);
    
    // Appeler le callback si fourni
    if (onLocationUpdate) {
      onLocationUpdate({ 
        lat: latitude, 
        lng: longitude, 
        accuracy: posAccuracy,
        speed: posSpeed,
        address: currentAddress
      });
    }
  }, [updateMapWithPosition, onLocationUpdate, savePositionToCache, showAddress, isTracking]);

  const requestGeolocation = useCallback(() => {
    // Ne pas mettre isLoading à true si on a déjà une position (cache)
    if (!position) {
      setIsLoading(true);
    }
    setError(null);

    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur.');
      setIsLoading(false);
      return;
    }

    // Options de géolocalisation optimisées
    const geolocationOptions = {
      enableHighAccuracy: enableHighAccuracy, // Mode haute précision si activé
      timeout: enableHighAccuracy ? 10000 : 5000, // Plus de temps si haute précision
      maximumAge: enableHighAccuracy ? 0 : 5 * 60 * 1000 // Pas de cache si haute précision
    };

    // Demander une nouvelle position pour mise à jour
    navigator.geolocation.getCurrentPosition(
      (position) => {
        processPosition(position);
      },
      (error) => {
        // Si erreur et qu'on a un cache, utiliser le cache
        const cachedPos = getCachedPosition();
        if (cachedPos && !position) {
          setIsLoading(false);
          setPosition(cachedPos);
          updateMapWithPosition(cachedPos);
          if (onLocationUpdate) {
            onLocationUpdate({ lat: cachedPos[0], lng: cachedPos[1], accuracy: null });
          }
          return;
        }
        
        // Si on a déjà une position (cache), ne pas afficher d'erreur
        if (!position) {
          setIsLoading(false);
          handleGeolocationError(error);
        }
      },
      geolocationOptions
    );
  }, [processPosition, updateMapWithPosition, onLocationUpdate, getCachedPosition, position, enableHighAccuracy]);

  // Fonction pour démarrer le suivi en temps réel
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée.');
      return;
    }

    setIsTracking(true);
    setDistanceTraveled(0);
    previousPositionRef.current = position;
    
    const trackingOptions = {
      enableHighAccuracy: enableHighAccuracy,
      timeout: 10000,
      maximumAge: 0
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        processPosition(pos);
      },
      (error) => {
        handleGeolocationError(error);
      },
      trackingOptions
    );
  }, [enableHighAccuracy, processPosition, position]);

  // Fonction pour arrêter le suivi
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  // Fonction pour partager la position
  const sharePosition = useCallback(async () => {
    if (!position) return;

    const coords = formatCoordinates(position[0], position[1]);
    const shareText = `📍 Ma position:\nLatitude: ${coords.lat}\nLongitude: ${coords.lng}\n${address ? `Adresse: ${address}` : ''}\n\nVoir sur la carte: https://www.openstreetmap.org/?mlat=${position[0]}&mlon=${position[1]}&zoom=15`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ma position',
          text: shareText
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Copier dans le presse-papiers si le partage échoue
          navigator.clipboard.writeText(shareText);
          alert('Position copiée dans le presse-papiers!');
        }
      }
    } else {
      // Fallback: copier dans le presse-papiers
      navigator.clipboard.writeText(shareText);
      alert('Position copiée dans le presse-papiers!');
    }
  }, [position, address]);

  // Charger l'historique
  useEffect(() => {
    if (showHistory) {
      const historyData = getPositionHistory();
      setHistory(historyData);
    }
  }, [showHistory]);

  useEffect(() => {
    // Vérifier le cache immédiatement pour afficher rapidement
    const cachedPos = getCachedPosition();
    if (cachedPos) {
      setPosition(cachedPos);
      setIsLoading(false);
    }

    // Initialiser la carte avec position par défaut ou cache
    const initialPos = cachedPos || [13.8292, 20.8324]; // Abéché par défaut
    if (mapRef.current && !mapInstanceRef.current) {
      try {
        const map = L.map(mapRef.current).setView(initialPos, cachedPos ? zoom : 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }).addTo(map);
        mapInstanceRef.current = map;
        
        // Si on a un cache, mettre à jour immédiatement
        if (cachedPos) {
          updateMapWithPosition(cachedPos);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
      }
    }
    
    // Demander la géolocalisation (mise à jour en arrière-plan)
    requestGeolocation();
    
    // Nettoyer à la destruction du composant
    return () => {
      // Arrêter le suivi si actif
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          console.warn('Erreur lors du nettoyage de la carte:', e);
        }
      }
      // Réinitialiser l'ID Leaflet du conteneur si nécessaire
      if (mapRef.current && mapRef.current._leaflet_id) {
        delete mapRef.current._leaflet_id;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dépendances vides pour éviter les re-renders inutiles

  const handleGeolocationError = (error) => {
    let errorMessage = 'Erreur lors de la récupération de votre position.';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'L\'accès à votre position a été refusé. Veuillez autoriser la géolocalisation dans les paramètres de votre navigateur.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Votre position n\'a pas pu être déterminée.';
        break;
      case error.TIMEOUT:
        errorMessage = 'La demande de géolocalisation a expiré. Veuillez réessayer.';
        break;
      default:
        errorMessage = 'Une erreur inattendue s\'est produite lors de la géolocalisation.';
        break;
    }

    setError(errorMessage);
  };

  const handleRefresh = () => {
    requestGeolocation();
  };

  // Affichage d'erreur
  if (error && !position) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800 mb-1">
                  Erreur de géolocalisation
                </h3>
                <p className="text-sm text-blue-600 mb-3">
                  {error}
                </p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Réessayer
                </button>
              </div>
            </div>
          </div>
          
          {/* Afficher la carte avec position par défaut même en cas d'erreur */}
          <div className="mt-4">
            <div
              ref={mapRef}
              style={{ height: height }}
              className="w-full rounded-lg border border-gray-200"
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              Carte affichée avec une position par défaut (Abéché, Tchad)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Contrôles */}
      {showControls && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-[100] flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
            <button
              onClick={handleRefresh}
              className="flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors whitespace-nowrap"
              title="Actualiser la position"
            >
              <ArrowPathIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
            {enableTracking && (
              <button
                onClick={isTracking ? stopTracking : startTracking}
                className={`flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors whitespace-nowrap ${
                  isTracking
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                title={isTracking ? 'Arrêter le suivi' : 'Démarrer le suivi'}
              >
                {isTracking ? (
                  <>
                    <StopIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Arrêter</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Suivre</span>
                  </>
                )}
              </button>
            )}
            {position && (
              <button
                onClick={sharePosition}
                className="flex items-center justify-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors min-w-[32px] sm:min-w-[36px]"
                title="Partager la position"
              >
                <ShareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
            {showHistory && (
              <button
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className="flex items-center justify-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors min-w-[32px] sm:min-w-[36px]"
                title="Afficher l'historique"
              >
                <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Indicateur de chargement */}
      {isLoading && !position && (
        <div className="absolute inset-0 bg-gray-50 rounded-lg flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm font-medium text-gray-700">
              Localisation en cours...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Veuillez autoriser l'accès à votre position
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Utilisation d'une position mise en cache si disponible
            </p>
          </div>
        </div>
      )}

      {/* Message d'information enrichi */}
      {position && !isLoading && (
        <div className="absolute top-4 left-2 sm:left-4 right-20 sm:right-auto z-[100] bg-white rounded-lg shadow-lg p-2.5 sm:p-3 border border-gray-200 max-w-[calc(100%-5rem)] sm:max-w-[280px] md:max-w-xs">
          <div className="flex items-start gap-1.5 sm:gap-2">
            <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 mb-1">
                Position détectée
              </p>
              {address && (
                <p className="text-xs text-blue-600 mb-1.5 sm:mb-2 font-medium line-clamp-2 break-words">
                  {address}
                </p>
              )}
              <div className="space-y-0.5">
                <div className="flex items-start gap-1">
                  <span className="text-xs text-gray-500 font-medium flex-shrink-0">Lat:</span>
                  <span className="text-xs text-gray-600 break-all">{position[0].toFixed(6)}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-xs text-gray-500 font-medium flex-shrink-0">Lng:</span>
                  <span className="text-xs text-gray-600 break-all">{position[1].toFixed(6)}</span>
                </div>
                {accuracy && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Précision:</span> ±{Math.round(accuracy)} m
                    <span className="hidden md:inline"> ({getAccuracyDescription(accuracy)})</span>
                  </p>
                )}
                {speed !== null && speed !== undefined && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Vitesse:</span> {speed.toFixed(1)} km/h
                  </p>
                )}
                {isTracking && distanceTraveled > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    <span className="font-medium">Distance:</span> {formatDistance(distanceTraveled)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panneau d'historique */}
      {showHistoryPanel && showHistory && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 z-[100] bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Historique des positions
            </h3>
            <button
              onClick={() => setShowHistoryPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.slice(-10).reverse().map((item, index) => (
                <div key={index} className="text-xs p-2 bg-gray-50 rounded border border-gray-200">
                  <p className="font-medium text-gray-900">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-gray-600">
                    {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
                  </p>
                  {item.accuracy && (
                    <p className="text-gray-500">
                      Précision: ±{Math.round(item.accuracy)} m
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">
              Aucun historique disponible
            </p>
          )}
        </div>
      )}

      {/* Conteneur de la carte */}
      <div
        ref={mapRef}
        style={{ height: height }}
        className="w-full rounded-lg"
      />

      {/* Attribution OpenStreetMap */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <p className="text-xs text-gray-500 text-center">
          Carte fournie par{' '}
          <a 
            href="https://www.openstreetmap.org/copyright" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            OpenStreetMap
          </a>
        </p>
      </div>
    </div>
  );
};

export default GeolocationMap;

