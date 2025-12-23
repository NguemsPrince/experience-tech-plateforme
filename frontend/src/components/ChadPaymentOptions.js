import React, { useState } from 'react';
import { 
  DevicePhoneMobileIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ChadPaymentOptions = ({ course, onPaymentSuccess, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setError(null);
  };

  const handlePayment = async () => {
    if (!selectedProvider) {
      setError('Veuillez sélectionner un opérateur');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simuler l'appel API pour le paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 3000);
    } catch (error) {
      setError('Erreur lors du traitement du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const getProviderInfo = (provider) => {
    switch (provider) {
      case 'airtel':
        return {
          name: 'Airtel Money',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          instructions: 'Composez *126# sur votre téléphone Airtel et suivez les instructions'
        };
      case 'tigo':
        return {
          name: 'Tigo Money',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          instructions: 'Composez *144# sur votre téléphone Tigo et suivez les instructions'
        };
      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Paiement en cours de traitement
        </h3>
        <p className="text-gray-600 mb-4">
          Votre paiement est en cours de validation. Vous recevrez une confirmation par SMS.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700">
            <strong>Montant:</strong> {course.price.toLocaleString('fr-FR')} FCFA<br />
            <strong>Opérateur:</strong> {getProviderInfo(selectedProvider)?.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <img
            src={course.image}
            alt={course.title}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.instructor?.name || course.instructor}</p>
            <p className="text-lg font-bold text-purple-600">
              {course.price.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
        </div>
      </div>

      {/* Provider Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choisissez votre opérateur Mobile Money
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={() => handleProviderSelect('airtel')}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
              selectedProvider === 'airtel'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Airtel Money</div>
                <div className="text-sm text-gray-600">Composez *126# pour effectuer le paiement</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleProviderSelect('tigo')}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
              selectedProvider === 'tigo'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <DevicePhoneMobileIcon className="w-6 h-6 text-orange-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Tigo Money</div>
                <div className="text-sm text-gray-600">Composez *144# pour effectuer le paiement</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Phone Number Input */}
      {selectedProvider && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ex: +235 66 12 34 56"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Provider Instructions */}
      {selectedProvider && (
        <div className={`p-4 rounded-lg ${getProviderInfo(selectedProvider)?.bgColor} ${getProviderInfo(selectedProvider)?.borderColor} border`}>
          <h4 className="font-medium text-gray-900 mb-2">
            Instructions pour {getProviderInfo(selectedProvider)?.name}
          </h4>
          <p className="text-sm text-gray-700">
            {getProviderInfo(selectedProvider)?.instructions}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800">{error}</span>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={!selectedProvider || !phoneNumber.trim() || isProcessing}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Traitement en cours...
          </>
        ) : (
          `Payer ${course.price.toLocaleString('fr-FR')} FCFA`
        )}
      </button>
    </div>
  );
};

export default ChadPaymentOptions;
