import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InteractiveMap from '../components/InteractiveMap';
import LanguageSelector from '../components/LanguageSelector';
import { MapPinIcon, BuildingOfficeIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const LocationsPage = () => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Données des localisations (bureaux, partenaires, projets)
  const locations = [
    {
      id: 1,
      title: 'Siège Principal - N\'Djamena',
      description: 'Bureau principal d\'Expérience Tech',
      address: 'Avenue Charles de Gaulle, N\'Djamena, Tchad',
      phone: '+235 XX XX XX XX',
      email: 'contact@experiencetech.td',
      website: 'https://experiencetech.td',
      lat: 12.1348,
      lng: 15.0557,
      type: 'office',
      icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    },
    {
      id: 2,
      title: 'Centre de Formation - N\'Djamena',
      description: 'Centre de formation professionnelle',
      address: 'Quartier Moursal, N\'Djamena, Tchad',
      phone: '+235 XX XX XX XX',
      email: 'formation@experiencetech.td',
      lat: 12.1000,
      lng: 15.0500,
      type: 'training',
      icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    },
    {
      id: 3,
      title: 'Atelier d\'Impression - N\'Djamena',
      description: 'Service d\'impression et design',
      address: 'Quartier Chagoua, N\'Djamena, Tchad',
      phone: '+235 XX XX XX XX',
      email: 'impression@experiencetech.td',
      lat: 12.1500,
      lng: 15.0800,
      type: 'printing',
      icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    },
    {
      id: 4,
      title: 'Partenaire - Sarh',
      description: 'Point de service dans le sud du Tchad',
      address: 'Sarh, Tchad',
      phone: '+235 XX XX XX XX',
      email: 'sarh@experiencetech.td',
      lat: 9.1427,
      lng: 18.3923,
      type: 'partner',
      icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    },
    {
      id: 5,
      title: 'Partenaire - Abéché',
      description: 'Point de service dans l\'est du Tchad',
      address: 'Abéché, Tchad',
      phone: '+235 XX XX XX XX',
      email: 'abeche@experiencetech.td',
      lat: 13.8292,
      lng: 20.8324,
      type: 'partner',
      icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
    }
  ];

  const handleLocationClick = (location, index) => {
    setSelectedLocation(location);
  };

  const getLocationTypeLabel = (type) => {
    const labels = {
      office: 'Bureau',
      training: 'Formation',
      printing: 'Impression',
      partner: 'Partenaire'
    };
    return labels[type] || 'Autre';
  };

  const getLocationTypeColor = (type) => {
    const colors = {
      office: 'bg-blue-100 text-blue-800',
      training: 'bg-green-100 text-green-800',
      printing: 'bg-blue-100 text-blue-800',
      partner: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('map.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('map.subtitle')}
              </p>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Carte Interactive
              </h2>
              <InteractiveMap
                locations={locations}
                center={{ lat: 12.1348, lng: 15.0557 }}
                zoom={6}
                height="500px"
                onLocationClick={handleLocationClick}
                className="w-full"
              />
            </div>
          </div>

          {/* Liste des localisations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Nos Localisations
              </h2>
              <div className="space-y-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-colors
                      ${selectedLocation?.id === location.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-gray-900">
                            {location.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {location.description}
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`
                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${getLocationTypeColor(location.type)}
                          `}>
                            {getLocationTypeLabel(location.type)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p className="flex items-center space-x-1">
                            <BuildingOfficeIcon className="h-3 w-3" />
                            <span>{location.address}</span>
                          </p>
                          {location.phone && (
                            <p className="flex items-center space-x-1 mt-1">
                              <PhoneIcon className="h-3 w-3" />
                              <span>{location.phone}</span>
                            </p>
                          )}
                          {location.email && (
                            <p className="flex items-center space-x-1 mt-1">
                              <GlobeAltIcon className="h-3 w-3" />
                              <span>{location.email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informations sur les technologies utilisées */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Technologies Utilisées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cartes Interactives</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Google Maps API avec marqueurs dynamiques</li>
                <li>• Fallback OpenStreetMap pour réduire les coûts</li>
                <li>• Support des marqueurs personnalisés</li>
                <li>• Info windows avec détails complets</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Multilingue</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Français (langue par défaut)</li>
                <li>• Anglais (langue internationale)</li>
                <li>• Arabe avec support RTL</li>
                <li>• Adaptation au contexte tchadien</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;
