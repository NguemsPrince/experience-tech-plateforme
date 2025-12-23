import React, { useState, useEffect } from 'react';
import {
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import paymentsService from '../services/payments';

const MobileMoneyPaymentForm = ({
  items,
  amount,
  currency = 'FCFA',
  onSuccess,
  onCancel,
  orderId = null
}) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'success', 'failed'
  const [paymentId, setPaymentId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [error, setError] = useState(null);

  const providers = [
    {
      id: 'moov_money',
      name: 'Moov Money',
      logo: '💰',
      color: 'bg-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      pattern: /^(6[0-9]|7[0-6])/,
      prefix: '60-76',
      description: 'Moov Money Tchad',
      instructions: 'Un message sera envoyé sur votre téléphone Moov Money. Confirmez le paiement en saisissant votre code PIN.'
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      logo: '📱',
      color: 'bg-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      pattern: /^(6[2-3]|7[7-9])/,
      prefix: '62, 63, 77, 78, 79',
      description: 'Airtel Money Tchad',
      instructions: 'Un message sera envoyé sur votre téléphone Airtel Money. Confirmez le paiement en saisissant votre code PIN.'
    }
  ];

  // Nettoyer le polling lors du démontage
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const formatPhoneNumber = (number) => {
    // Enlever tous les caractères non numériques
    let cleaned = number.replace(/\D/g, '');
    
    // Enlever le préfixe +235 ou 235 si présent
    if (cleaned.startsWith('235')) {
      cleaned = cleaned.substring(3);
    }
    
    return cleaned;
  };

  const validatePhoneNumber = (number) => {
    const formatted = formatPhoneNumber(number);
    
    // Vérifier la longueur (8 chiffres pour le Tchad)
    if (formatted.length !== 8) {
      return { valid: false, message: 'Le numéro doit contenir 8 chiffres' };
    }

    // Vérifier le format selon le provider
    if (selectedProvider) {
      const provider = providers.find(p => p.id === selectedProvider);
      if (provider && !provider.pattern.test(formatted)) {
        return {
          valid: false,
          message: `Numéro invalide pour ${provider.name}. Doit commencer par ${provider.prefix}`
        };
      }
    }

    return { valid: true };
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // Auto-détection du provider basé sur le numéro
    const formatted = formatPhoneNumber(value);
    if (formatted.length >= 2) {
      const detected = providers.find(p => p.pattern.test(formatted));
      if (detected && detected.id !== selectedProvider) {
        setSelectedProvider(detected.id);
      }
    }
  };

  // Fonction pour vérifier le statut du paiement
  const checkPaymentStatus = async () => {
    if (!paymentId) return;

    try {
      const response = await paymentsService.checkPaymentStatus(paymentId);
      const status = response.data?.status || response.status;

      if (status === 'completed') {
        // Paiement réussi
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setPaymentStatus('success');
        toast.success('Paiement effectué avec succès !');

        setTimeout(() => {
          if (onSuccess) {
            onSuccess({
              paymentId: paymentId,
              status: 'completed',
              amount: amount,
              currency: currency
            });
          }
        }, 2000);
      } else if (status === 'failed' || status === 'cancelled') {
        // Paiement échoué
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setPaymentStatus('failed');
        toast.error('Le paiement a échoué. Veuillez réessayer.');
      }
      // Sinon, continuez le polling pour 'pending' ou 'processing'
    } catch (error) {
      console.error('Error checking payment status:', error);
      // Continuez le polling même en cas d'erreur
    }
  };

  // Démarrer le polling du statut du paiement
  const startPolling = (id) => {
    setPaymentId(id);
    
    // Vérifier immédiatement
    checkPaymentStatus();

    // Vérifier toutes les 3 secondes
    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 3000);

    setPollingInterval(interval);

    // Arrêter après 5 minutes maximum
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        if (paymentStatus === 'pending') {
          setPaymentStatus(null);
          toast.error('Le paiement a expiré. Veuillez réessayer.');
        }
      }
    }, 5 * 60 * 1000);
  };

  const initiatePayment = async () => {
    // Validation
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    if (!selectedProvider) {
      toast.error('Veuillez sélectionner un moyen de paiement');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('pending');
    setError(null);

    try {
      // Préparer les items pour l'API
      const paymentItems = items.map(item => ({
        type: item.type || (item.courseId || item.instructor ? 'course' : 'product'),
        itemId: item._id || item.id || item.itemId,
        quantity: item.quantity || 1
      }));

      // Appel API pour créer le paiement mobile money
      const response = await paymentsService.createMobileMoneyPayment(
        paymentItems,
        selectedProvider,
        phoneNumber,
        orderId
      );

      const paymentData = response.data || response;

      if (paymentData.paymentId) {
        toast.success(
          paymentData.message || `Un message a été envoyé sur votre téléphone. Veuillez confirmer le paiement.`,
          { duration: 6000 }
        );

        // Démarrer le polling pour vérifier le statut
        startPolling(paymentData.paymentId);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err) {
      console.error('Erreur de paiement:', err);
      setPaymentStatus('failed');
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  // Si le paiement est en cours ou terminé
  if (paymentStatus === 'pending') {
    const provider = providers.find(p => p.id === selectedProvider);
    return (
      <div className="text-center py-8">
        <div className="inline-block mb-4 animate-spin">
          <ClockIcon className="w-16 h-16 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Paiement en cours...
        </h3>
        <p className="text-gray-600 mb-4">
          Veuillez confirmer le paiement sur votre téléphone {provider?.name || ''}
        </p>
        <div className={`${
          provider?.id === 'moov_money' ? 'bg-blue-50 border-blue-500' : 
          provider?.id === 'airtel_money' ? 'bg-blue-50 border-blue-500' : 
          'bg-gray-50 border-gray-300'
        } border rounded-lg p-4 mb-4`}>
          <p className="text-sm text-gray-700">
            <strong>Montant:</strong> {amount.toLocaleString()} {currency}<br />
            <strong>Numéro:</strong> {formatPhoneNumber(phoneNumber)}<br />
            <strong>Opérateur:</strong> {provider?.name || selectedProvider}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          Un message de confirmation sera envoyé une fois le paiement validé.
        </p>
        <button
          onClick={() => {
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
            setPaymentStatus(null);
            setPaymentId(null);
          }}
          className="mt-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Paiement réussi !
        </h3>
        <p className="text-gray-600">
          Votre paiement a été traité avec succès
        </p>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="text-center py-8">
        <XCircleIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Paiement échoué
        </h3>
        <p className="text-gray-600 mb-4">
          {error || 'Le paiement n\'a pas pu être traité'}
        </p>
        <button
          onClick={() => {
            setPaymentStatus(null);
            setError(null);
            setPaymentId(null);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Montant */}
      <div className="text-center py-4 bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-600 mb-1">Montant à payer</p>
        <p className="text-3xl font-bold text-gray-900">
          {amount.toLocaleString()} {currency}
        </p>
      </div>

      {/* Sélection du provider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choisissez votre moyen de paiement
        </label>
        <div className="grid grid-cols-2 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`p-4 border-2 rounded-xl transition-all ${
                selectedProvider === provider.id
                  ? (provider.id === 'moov_money' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-blue-500 bg-blue-50')
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-4xl mb-2">{provider.logo}</div>
              <div className="font-semibold text-gray-900 text-sm">
                {provider.name}
              </div>
              <div className="text-xs text-gray-500">
                {provider.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Numéro de téléphone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            +235
          </span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="60 29 05 10"
            maxLength={10}
            className="w-full pl-16 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {selectedProvider && (
          <p className="mt-2 text-sm text-gray-500">
            Numéros commençant par : {providers.find(p => p.id === selectedProvider)?.prefix}
          </p>
        )}
      </div>

      {/* Instructions */}
      {selectedProvider && (() => {
        const currentProvider = providers.find(p => p.id === selectedProvider);
        if (!currentProvider) return null;
        
        const bgClass = currentProvider.id === 'moov_money' ? 'bg-blue-50' : 'bg-blue-50';
        const borderClass = currentProvider.id === 'moov_money' ? 'border-blue-500' : 'border-blue-500';
        
        return (
          <div className={`p-4 rounded-lg ${bgClass} border ${borderClass}`}>
            <p className="text-sm text-gray-700">
              {currentProvider.instructions}
            </p>
          </div>
        );
      })()}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Annuler
        </button>
        <button
          onClick={initiatePayment}
          disabled={isProcessing || !selectedProvider || !phoneNumber}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
        >
          {isProcessing ? 'Traitement...' : 'Payer maintenant'}
        </button>
      </div>

      {/* Info sécurité */}
      <div className="text-center text-sm text-gray-500">
        🔒 Paiement sécurisé via Mobile Money
      </div>
    </div>
  );
};

export default MobileMoneyPaymentForm;

