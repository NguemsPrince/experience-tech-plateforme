import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPinIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

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
  onLocationUpdate = null
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

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

    // Ajouter un popup avec les coordonnées
    const popupContent = `
      <div style="padding: 8px; min-width: 200px;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #111827;">
          📍 Votre position
        </h3>
        <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
          <strong>Latitude:</strong> ${userPosition[0].toFixed(6)}
        </p>
        <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
          <strong>Longitude:</strong> ${userPosition[1].toFixed(6)}
        </p>
        ${posAccuracy ? `
          <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
            <strong>Précision:</strong> ±${Math.round(posAccuracy)} m
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

  const requestGeolocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur.');
      setIsLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy: posAccuracy } = position.coords;
        const userPosition = [latitude, longitude];
        
        setPosition(userPosition);
        setAccuracy(posAccuracy);
        setIsLoading(false);
        
        // Mettre à jour la carte avec la position de l'utilisateur
        updateMapWithPosition(userPosition, posAccuracy);
        
        // Appeler le callback si fourni
        if (onLocationUpdate) {
          onLocationUpdate({ lat: latitude, lng: longitude, accuracy: posAccuracy });
        }
      },
      (error) => {
        setIsLoading(false);
        handleGeolocationError(error);
      },
      options
    );
  }, [updateMapWithPosition, onLocationUpdate]);

  useEffect(() => {
    // Initialiser la carte même si la géolocalisation n'est pas encore disponible
    initializeMap();
    
    // Demander la géolocalisation
    requestGeolocation();
    
    // Nettoyer à la destruction du composant
    return () => {
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
  }, [initializeMap, requestGeolocation]);

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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Erreur de géolocalisation
                </h3>
                <p className="text-sm text-red-600 mb-3">
                  {error}
                </p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
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
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors"
            title="Actualiser la position"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      )}

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50 rounded-lg flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm font-medium text-gray-700">
              Localisation en cours...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Veuillez autoriser l'accès à votre position
            </p>
          </div>
        </div>
      )}

      {/* Message d'information */}
      {position && !isLoading && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 border border-gray-200 max-w-xs">
          <div className="flex items-start">
            <MapPinIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-900">
                Position détectée
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Latitude: {position[0].toFixed(6)}
              </p>
              <p className="text-xs text-gray-600">
                Longitude: {position[1].toFixed(6)}
              </p>
              {accuracy && (
                <p className="text-xs text-gray-500 mt-1">
                  Précision: ±{Math.round(accuracy)} m
                </p>
              )}
            </div>
          </div>
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

