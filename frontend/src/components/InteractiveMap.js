import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon, GlobeAltIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMap = ({ 
  locations = [], 
  center = { lat: 12.1348, lng: 15.0557 }, // N'Djamena, Tchad par défaut
  zoom = 6,
  height = '400px',
  showControls = true,
  onLocationClick = null,
  className = ''
}) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [mapType, setMapType] = useState('google'); // 'google' ou 'leaflet'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Configuration Google Maps
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

  useEffect(() => {
    initializeMap();
  }, [mapType, locations]);

  const initializeMap = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (mapType === 'google' && !googleLoaded) {
        await loadGoogleMaps();
      } else if (mapType === 'google' && googleLoaded) {
        initializeGoogleMap();
      } else {
        initializeLeafletMap();
      }
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Erreur lors du chargement de la carte');
      // Fallback automatique vers Leaflet
      if (mapType === 'google') {
        setMapType('leaflet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadGoogleMaps = async () => {
    try {
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      await loader.load();
      setGoogleLoaded(true);
      initializeGoogleMap();
    } catch (error) {
      console.warn('Google Maps failed to load, falling back to Leaflet:', error);
      setMapType('leaflet');
    }
  };

  const initializeGoogleMap = () => {
    if (!mapRef.current || !googleLoaded) return;

    // Nettoyer la carte existante
    if (googleMapRef.current) {
      googleMapRef.current = null;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    googleMapRef.current = map;

    // Ajouter les marqueurs
    addGoogleMarkers(map);
  };

  const initializeLeafletMap = () => {
    if (!mapRef.current) return;

    // Nettoyer la carte existante
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
    }

    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    leafletMapRef.current = map;

    // Ajouter les marqueurs
    addLeafletMarkers(map);
  };

  const addGoogleMarkers = (map) => {
    locations.forEach((location, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.title,
        icon: {
          url: location.icon || 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(location)
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onLocationClick) {
          onLocationClick(location, index);
        }
      });
    });
  };

  const addLeafletMarkers = (map) => {
    locations.forEach((location, index) => {
      const marker = L.marker([location.lat, location.lng], {
        title: location.title
      }).addTo(map);

      // Popup
      marker.bindPopup(createLeafletPopupContent(location));

      marker.on('click', () => {
        if (onLocationClick) {
          onLocationClick(location, index);
        }
      });
    });
  };

  const createInfoWindowContent = (location) => {
    return `
      <div class="p-2">
        <h3 class="font-semibold text-gray-900">${location.title}</h3>
        ${location.description ? `<p class="text-sm text-gray-600 mt-1">${location.description}</p>` : ''}
        ${location.address ? `<p class="text-xs text-gray-500 mt-1">${location.address}</p>` : ''}
        ${location.phone ? `<p class="text-xs text-blue-600 mt-1">📞 ${location.phone}</p>` : ''}
        ${location.website ? `<p class="text-xs text-blue-600 mt-1">🌐 <a href="${location.website}" target="_blank">Site web</a></p>` : ''}
      </div>
    `;
  };

  const createLeafletPopupContent = (location) => {
    return `
      <div class="p-2">
        <h3 class="font-semibold text-gray-900">${location.title}</h3>
        ${location.description ? `<p class="text-sm text-gray-600 mt-1">${location.description}</p>` : ''}
        ${location.address ? `<p class="text-xs text-gray-500 mt-1">${location.address}</p>` : ''}
        ${location.phone ? `<p class="text-xs text-blue-600 mt-1">📞 ${location.phone}</p>` : ''}
        ${location.website ? `<p class="text-xs text-blue-600 mt-1">🌐 <a href="${location.website}" target="_blank">Site web</a></p>` : ''}
      </div>
    `;
  };

  const switchMapType = () => {
    setMapType(mapType === 'google' ? 'leaflet' : 'google');
  };

  if (error) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Erreur de carte</h3>
            <p className="text-sm text-blue-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Contrôles de la carte */}
      {showControls && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={switchMapType}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {mapType === 'google' ? (
              <>
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                OpenStreetMap
              </>
            ) : (
              <>
                <MapPinIcon className="h-4 w-4 mr-2" />
                Google Maps
              </>
            )}
          </button>
        </div>
      )}

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">
              Chargement de la carte...
            </p>
          </div>
        </div>
      )}

      {/* Conteneur de la carte */}
      <div
        ref={mapRef}
        style={{ height: height }}
        className="w-full rounded-lg border border-gray-200"
      />

      {/* Informations sur le type de carte */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {mapType === 'google' ? (
          <span>Powered by Google Maps</span>
        ) : (
          <span>Powered by OpenStreetMap</span>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
