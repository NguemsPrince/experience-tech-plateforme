import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DevicePhoneMobileIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MobileMoneyPayment = ({ amount, currency = 'FCFA', onSuccess, onCancel }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'success', 'failed'

  const providers = [
    {
      id: 'momo',
      name: 'MoMo (Moov Money)',
      logo: '💰',
      color: 'bg-blue-600',
      pattern: /^(6[0-9])/,
      prefix: '6',
      description: 'Moov Money Tchad'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      logo: '📱',
      color: 'bg-blue-600',
      pattern: /^(6[2-3]|7[7-9])/,
      prefix: '62, 63, 77, 78, 79',
      description: 'Airtel Money Tchad'
    }
  ];

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

    try {
      // Simulation d'appel API - à remplacer par l'intégration réelle
      const provider = providers.find(p => p.id === selectedProvider);
      const formatted = formatPhoneNumber(phoneNumber);

      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simuler le prompt de paiement sur le téléphone
      toast.success(
        `Un message a été envoyé au ${formatted}. Veuillez confirmer le paiement sur votre téléphone.`,
        { duration: 6000 }
      );

      // Simuler la vérification du paiement
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Simuler succès (75% de chance)
      const success = Math.random() > 0.25;

      if (success) {
        setPaymentStatus('success');
        toast.success('Paiement effectué avec succès !');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess({
              provider: provider.name,
              phone: formatted,
              amount,
              currency,
              transactionId: `TXN${Date.now()}`
            });
          }
        }, 2000);
      } else {
        setPaymentStatus('failed');
        toast.error('Le paiement a échoué. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      setPaymentStatus('failed');
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Si le paiement est en cours ou terminé
  if (paymentStatus) {
    return (
      <div className="text-center py-8">
        {paymentStatus === 'pending' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <ClockIcon className="w-16 h-16 text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Paiement en cours...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Veuillez confirmer le paiement sur votre téléphone
            </p>
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Paiement réussi !
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Votre paiement a été traité avec succès
            </p>
          </>
        )}

        {paymentStatus === 'failed' && (
          <>
            <XCircleIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Paiement échoué
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Le paiement n'a pas pu être traité
            </p>
            <button
              onClick={() => setPaymentStatus(null)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Montant */}
      <div className="text-center py-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Montant à payer</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {amount.toLocaleString()} {currency}
        </p>
      </div>

      {/* Sélection du provider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Choisissez votre moyen de paiement
        </label>
        <div className="grid grid-cols-2 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`p-4 border-2 rounded-xl transition-all ${
                selectedProvider === provider.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <div className="text-4xl mb-2">{provider.logo}</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {provider.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {provider.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Numéro de téléphone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            className="w-full pl-16 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        {selectedProvider && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Numéros commençant par : {providers.find(p => p.id === selectedProvider)?.prefix}
          </p>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
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
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        🔒 Paiement sécurisé via Mobile Money
      </div>
    </div>
  );
};

export default MobileMoneyPayment;

