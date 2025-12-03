import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  BuildingLibraryIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import settingsService from '../../services/settingsService';
import LoadingSpinner from '../LoadingSpinner';

const PaymentMethodsManagement = ({ darkMode = false }) => {
  const [settings, setSettings] = useState({
    payment: {
      airtelNumbers: [],
      moovNumbers: [],
      bankAccount: {
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
        iban: '',
        swiftCode: '',
        branch: '',
        isActive: false,
      },
      currency: 'XAF',
      taxRate: 0,
      allowCashPayment: true,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsService.getPaymentSettings();
      
      if (response) {
        const paymentData = response.data?.payment || response.payment || response;
        setSettings({
          payment: {
            airtelNumbers: paymentData.airtelNumbers || [],
            moovNumbers: paymentData.moovNumbers || [],
            bankAccount: paymentData.bankAccount || {
              bankName: '',
              accountNumber: '',
              accountHolderName: '',
              iban: '',
              swiftCode: '',
              branch: '',
              isActive: false,
            },
            currency: paymentData.currency || 'XAF',
            taxRate: paymentData.taxRate || 0,
            allowCashPayment: paymentData.allowCashPayment !== false,
          },
        });
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast.error('Erreur lors du chargement des paramètres de paiement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Préparer les données à sauvegarder
      const paymentDataToSave = {
        airtelNumbers: settings.payment.airtelNumbers.filter(item => item.number && item.number.trim() !== ''),
        moovNumbers: settings.payment.moovNumbers.filter(item => item.number && item.number.trim() !== ''),
        bankAccount: settings.payment.bankAccount,
        currency: settings.payment.currency,
        taxRate: settings.payment.taxRate,
        allowCashPayment: settings.payment.allowCashPayment,
      };

      const result = await settingsService.updatePaymentSettings(paymentDataToSave);
      
      toast.success('Paramètres de paiement sauvegardés avec succès !');
      setHasChanges(false);
      
      // Recharger pour s'assurer que tout est à jour
      await loadPaymentSettings();
    } catch (error) {
      console.error('Error saving payment settings:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (path, value) => {
    setSettings(prev => {
      const newSettings = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
    setHasChanges(true);
  };

  const addAirtelNumber = () => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        airtelNumbers: [...(prev.payment.airtelNumbers || []), { number: '', name: 'Airtel Money', isActive: true }],
      },
    }));
    setHasChanges(true);
  };

  const updateAirtelNumber = (index, field, value) => {
    setSettings(prev => {
      const newNumbers = [...(prev.payment.airtelNumbers || [])];
      newNumbers[index] = { ...newNumbers[index], [field]: value };
      return {
        ...prev,
        payment: { ...prev.payment, airtelNumbers: newNumbers },
      };
    });
    setHasChanges(true);
  };

  const removeAirtelNumber = (index) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        airtelNumbers: (prev.payment.airtelNumbers || []).filter((_, i) => i !== index),
      },
    }));
    setHasChanges(true);
  };

  const addMoovNumber = () => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        moovNumbers: [...(prev.payment.moovNumbers || []), { number: '', name: 'Moov Money', isActive: true }],
      },
    }));
    setHasChanges(true);
  };

  const updateMoovNumber = (index, field, value) => {
    setSettings(prev => {
      const newNumbers = [...(prev.payment.moovNumbers || [])];
      newNumbers[index] = { ...newNumbers[index], [field]: value };
      return {
        ...prev,
        payment: { ...prev.payment, moovNumbers: newNumbers },
      };
    });
    setHasChanges(true);
  };

  const removeMoovNumber = (index) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        moovNumbers: (prev.payment.moovNumbers || []).filter((_, i) => i !== index),
      },
    }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" text="Chargement des paramètres de paiement..." />
      </div>
    );
  }

  const bankAccount = settings.payment?.bankAccount || {};
  const isBankAccountValid = bankAccount.bankName && bankAccount.accountNumber && bankAccount.accountHolderName;

  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Moyens de Paiement</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configurez les moyens de paiement acceptés sur la plateforme
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-orange-600 dark:text-orange-400">
              Modifications non sauvegardées
            </span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSaving ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Section Compte Bancaire */}
      <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BuildingLibraryIcon className={`w-8 h-8 mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <h3 className="text-xl font-bold">Virement Bancaire</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Configurez les informations bancaires pour recevoir les paiements par virement
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {bankAccount.isActive ? (
                <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                }`}>
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Actif
                </span>
              ) : (
                <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  <XCircleIcon className="w-4 h-4 mr-1" />
                  Inactif
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations bancaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nom de la banque <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankAccount.bankName || ''}
                onChange={(e) => handleFieldChange('payment.bankAccount.bankName', e.target.value)}
                placeholder="Ex: Société Générale Tchad"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Numéro de compte <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankAccount.accountNumber || ''}
                onChange={(e) => handleFieldChange('payment.bankAccount.accountNumber', e.target.value)}
                placeholder="Ex: 1234567890"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Titulaire du compte <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankAccount.accountHolderName || ''}
                onChange={(e) => handleFieldChange('payment.bankAccount.accountHolderName', e.target.value)}
                placeholder="Ex: Expérience Tech"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                IBAN (optionnel)
              </label>
              <input
                type="text"
                value={bankAccount.iban || ''}
                onChange={(e) => handleFieldChange('payment.bankAccount.iban', e.target.value)}
                placeholder="Ex: TD11 1234 5678 9012 3456 7890"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Code SWIFT (optionnel)
              </label>
              <input
                type="text"
                value={bankAccount.swiftCode || ''}
                onChange={(e) => handleFieldChange('payment.bankAccount.swiftCode', e.target.value)}
                placeholder="Ex: SOGETDXT"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Agence (optionnel)
              </label>
              <input
                type="text"
                value={bankAccount.branch || ''}
                onChange={(e) => handleFieldChange('payment.bankAccount.branch', e.target.value)}
                placeholder="Ex: N'Djamena Centre"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>

          {/* Activation du compte bancaire */}
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-blue-50 border-blue-200'
          }`}>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={bankAccount.isActive || false}
                onChange={(e) => handleFieldChange('payment.bankAccount.isActive', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3 flex-1">
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Activer le compte bancaire pour les paiements par virement
                </span>
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Si activé, les informations bancaires seront affichées aux clients lors du paiement par virement.
                  {!isBankAccountValid && (
                    <span className={`block mt-1 font-medium ${
                      darkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      ⚠️ Veuillez remplir au moins le nom de la banque, le numéro de compte et le titulaire pour activer cette option.
                    </span>
                  )}
                </p>
              </div>
            </label>
          </div>

          {/* Informations utiles */}
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start">
              <InformationCircleIcon className={`w-5 h-5 mr-2 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Informations pour le Tchad
                </h4>
                <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• <strong>Banques principales :</strong> Société Générale Tchad, Banque Commerciale du Chari (BCC), Ecobank Tchad</li>
                  <li>• <strong>Codes SWIFT :</strong> SOGETDXT (Société Générale), BCCATDXT (BCC), ECBKTDXT (Ecobank)</li>
                  <li>• <strong>Format IBAN :</strong> TD + 2 chiffres + 22 caractères (ex: TD11 1234 5678 9012 3456 7890)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Airtel Money */}
      <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PhoneIcon className={`w-8 h-8 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h3 className="text-xl font-bold">Airtel Money Tchad</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Configurez les numéros Airtel Money pour recevoir les paiements
                </p>
              </div>
            </div>
            <button
              onClick={addAirtelNumber}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-blue-700 hover:bg-blue-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Ajouter un numéro
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {(settings.payment?.airtelNumbers || []).length === 0 ? (
            <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aucun numéro Airtel Money configuré. Cliquez sur "Ajouter un numéro" pour commencer.
            </p>
          ) : (
            settings.payment.airtelNumbers.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Numéro <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.number || ''}
                      onChange={(e) => updateAirtelNumber(index, 'number', e.target.value)}
                      placeholder="+235 60 12 34 56"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nom (optionnel)
                    </label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => updateAirtelNumber(index, 'name', e.target.value)}
                      placeholder="Airtel Money"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div className="flex items-end space-x-3">
                    <label className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={item.isActive !== false}
                        onChange={(e) => updateAirtelNumber(index, 'isActive', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Actif
                      </span>
                    </label>
                    <button
                      onClick={() => removeAirtelNumber(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section Moov Money */}
      <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PhoneIcon className={`w-8 h-8 mr-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <h3 className="text-xl font-bold">Moov Money Tchad</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Configurez les numéros Moov Money pour recevoir les paiements
                </p>
              </div>
            </div>
            <button
              onClick={addMoovNumber}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-green-700 hover:bg-green-600 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Ajouter un numéro
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {(settings.payment?.moovNumbers || []).length === 0 ? (
            <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aucun numéro Moov Money configuré. Cliquez sur "Ajouter un numéro" pour commencer.
            </p>
          ) : (
            settings.payment.moovNumbers.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Numéro <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.number || ''}
                      onChange={(e) => updateMoovNumber(index, 'number', e.target.value)}
                      placeholder="+235 60 12 34 56"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nom (optionnel)
                    </label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => updateMoovNumber(index, 'name', e.target.value)}
                      placeholder="Moov Money"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-green-500`}
                    />
                  </div>
                  <div className="flex items-end space-x-3">
                    <label className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={item.isActive !== false}
                        onChange={(e) => updateMoovNumber(index, 'isActive', e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Actif
                      </span>
                    </label>
                    <button
                      onClick={() => removeMoovNumber(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Paramètres généraux */}
      <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <CreditCardIcon className={`w-8 h-8 mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <div>
              <h3 className="text-xl font-bold">Paramètres généraux</h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Configuration générale des paiements
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Devise par défaut
              </label>
              <select
                value={settings.payment?.currency || 'XAF'}
                onChange={(e) => handleFieldChange('payment.currency', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="XAF">XAF (Franc CFA)</option>
                <option value="USD">USD (Dollar US)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Taux de taxe (0-1)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={settings.payment?.taxRate || 0}
                onChange={(e) => handleFieldChange('payment.taxRate', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.payment?.allowCashPayment !== false}
                onChange={(e) => handleFieldChange('payment.allowCashPayment', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Autoriser les paiements en espèces
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde principal */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => loadPaymentSettings()}
          disabled={isSaving || !hasChanges}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isSaving || !hasChanges
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            isSaving || !hasChanges
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSaving ? (
            <>
              <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Sauvegarder les paramètres
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodsManagement;

