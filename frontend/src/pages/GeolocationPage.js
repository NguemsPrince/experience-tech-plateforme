import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import GeolocationMap from '../components/GeolocationMap';
import { 
  MapPinIcon, 
  GlobeAltIcon, 
  DevicePhoneMobileIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const GeolocationPage = () => {
  const { t } = useTranslation();

  const handleLocationUpdate = (location) => {
    console.log('Position mise à jour:', location);
    // Vous pouvez ajouter ici une logique pour sauvegarder la position
    // ou envoyer des données au backend si nécessaire
  };

  return (
    <>
      <Helmet>
        <title>Géolocalisation - Expérience Tech</title>
        <meta 
          name="description" 
          content="Trouvez votre position actuelle sur une carte interactive avec géolocalisation HTML5 et OpenStreetMap" 
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Géolocalisation
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez votre position actuelle sur une carte interactive. 
                Cette fonctionnalité utilise l'API HTML5 Geolocation et OpenStreetMap.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Section principale avec la carte */}
          <div className="mb-8">
            <div id="map" className="w-full">
              <GeolocationMap
                height="600px"
                zoom={15}
                showControls={true}
                onLocationUpdate={handleLocationUpdate}
                className="w-full"
              />
            </div>
          </div>

          {/* Informations sur la fonctionnalité */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Géolocalisation HTML5
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Utilise l'API native du navigateur pour détecter automatiquement votre position avec précision.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GlobeAltIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  OpenStreetMap
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Carte gratuite et open-source, sans limitation d'utilisation ni coûts cachés.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Responsive
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Fonctionne parfaitement sur mobile, tablette et desktop avec une interface adaptative.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Respect de la vie privée
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Votre position reste locale et n'est jamais transmise à des serveurs externes.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Comment utiliser la géolocalisation
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  1
                </span>
                <p className="text-sm text-gray-600">
                  Lorsque vous accédez à cette page, votre navigateur vous demandera l'autorisation d'accéder à votre position.
                </p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  2
                </span>
                <p className="text-sm text-gray-600">
                  Cliquez sur "Autoriser" pour que la carte se centre automatiquement sur votre position actuelle.
                </p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  3
                </span>
                <p className="text-sm text-gray-600">
                  Un marqueur bleu indiquera votre position exacte sur la carte. Vous pouvez utiliser le bouton "Actualiser" pour mettre à jour votre position.
                </p>
              </div>
            </div>
          </div>

          {/* Note technique */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Note technique
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Cette fonctionnalité utilise uniquement des technologies gratuites et open-source :
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>
                <strong>API HTML5 Geolocation</strong> : API native du navigateur pour obtenir la position GPS
              </li>
              <li>
                <strong>Leaflet.js</strong> : Bibliothèque JavaScript open-source pour les cartes interactives
              </li>
              <li>
                <strong>OpenStreetMap</strong> : Service de cartographie gratuit et communautaire
              </li>
            </ul>
            <p className="text-xs text-blue-700 mt-4 italic">
              Aucune clé API payante n'est requise. Toutes les données restent locales et privées.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeolocationPage;

