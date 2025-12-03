import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CreditCardIcon,
  CloudIcon,
  CircleStackIcon,
  BellIcon,
  GlobeAltIcon,
  KeyIcon,
  ServerIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PlusIcon,
  TrashIcon,
  BuildingLibraryIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import settingsService from '../services/settingsService';

const AdminSystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const tabs = [
    { id: 'general', name: 'Général', icon: CogIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'payment', name: 'Paiements', icon: CreditCardIcon },
    { id: 'integrations', name: 'Intégrations', icon: CloudIcon },
    { id: 'backup', name: 'Sauvegarde', icon: CircleStackIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'api', name: 'API', icon: KeyIcon }
  ];

  // Mock settings data
  const mockSettings = {
    general: {
      siteName: 'Expérience Tech',
      siteDescription: 'Plateforme de formation et services IT',
      siteUrl: 'https://experiencetech-tchad.com',
      defaultLanguage: 'fr',
      timezone: 'Africa/Ndjamena',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      sslRequired: true,
      ipWhitelist: [],
      auditLog: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@experiencetech-tchad.com',
      smtpPassword: '********',
      fromName: 'Expérience Tech',
      fromEmail: 'noreply@experiencetech-tchad.com',
      replyTo: 'contact@experiencetech-tchad.com'
    },
    payment: {
      stripePublicKey: 'pk_test_...',
      stripeSecretKey: 'sk_test_...',
      paypalClientId: '...',
      paypalSecret: '...',
      currency: 'XAF',
      taxRate: 0.18,
      allowCashPayment: true
    },
    integrations: {
      googleAnalytics: 'GA-XXXXXXXXX',
      facebookPixel: 'XXXXXXXXX',
      googleMaps: 'AIza...',
      recaptchaSiteKey: '6Le...',
      recaptchaSecretKey: '6Le...'
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      lastBackup: '2024-01-15 10:30:00',
      backupLocation: 'cloud',
      compressionEnabled: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminNotifications: true,
      userNotifications: true,
      systemAlerts: true
    },
    api: {
      apiEnabled: true,
      rateLimit: 1000,
      apiKeys: [
        { name: 'Frontend App', key: 'sk_...', lastUsed: '2024-01-15' },
        { name: 'Mobile App', key: 'sk_...', lastUsed: '2024-01-14' }
      ],
      webhooks: [
        { url: 'https://webhook.site/...', events: ['user.created', 'payment.completed'] }
      ]
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Essayer de charger les paramètres de paiement directement
      try {
        const paymentResponse = await settingsService.getPaymentSettings();
        console.log('Payment settings loaded:', paymentResponse);
        
        if (paymentResponse) {
          const paymentData = paymentResponse.data?.payment || paymentResponse.payment || paymentResponse;
          setSettings({
            ...mockSettings,
            payment: paymentData || mockSettings.payment
          });
        } else {
          // Essayer de charger tous les paramètres
          const response = await settingsService.getSettings();
          if (response && response.data) {
            setSettings({
              ...mockSettings,
              payment: response.data.payment || mockSettings.payment
            });
          } else {
            setSettings(mockSettings);
          }
        }
      } catch (paymentError) {
        console.error('Error loading payment settings, trying general settings:', paymentError);
        // En cas d'erreur, essayer de charger tous les paramètres
        try {
          const response = await settingsService.getSettings();
          if (response && response.data) {
            setSettings({
              ...mockSettings,
              payment: response.data.payment || mockSettings.payment
            });
          } else {
            setSettings(mockSettings);
          }
        } catch (generalError) {
          console.error('Error loading general settings:', generalError);
          setSettings(mockSettings);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(mockSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (tabId) => {
    setIsLoading(true);
    setSaveStatus('Sauvegarde en cours...');
    
    try {
      if (tabId === 'payment') {
        console.log('Saving payment settings:', settings.payment);
        
        // S'assurer que les données bancaires sont bien structurées
        const paymentDataToSave = {
          ...settings.payment,
          bankAccount: settings.payment?.bankAccount || {}
        };
        
        const result = await settingsService.updatePaymentSettings(paymentDataToSave);
        console.log('Payment settings saved:', result);
        
        toast.success('Paramètres de paiement sauvegardés avec succès !');
        
        // Recharger les paramètres pour s'assurer qu'ils sont à jour
        await loadSettings();
      } else {
        // Pour les autres onglets, on peut implémenter plus tard
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Paramètres sauvegardés avec succès !');
      }
      
      setSaveStatus('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde';
      setSaveStatus(`Erreur: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleReset = (tabId) => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser ces paramètres ?')) {
      setSettings({ ...settings, [tabId]: mockSettings[tabId] });
      setSaveStatus('Paramètres réinitialisés');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du site
          </label>
          <input
            type="text"
            value={settings.general?.siteName || ''}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, siteName: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL du site
          </label>
          <input
            type="url"
            value={settings.general?.siteUrl || ''}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, siteUrl: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description du site
        </label>
        <textarea
          value={settings.general?.siteDescription || ''}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, siteDescription: e.target.value }
          })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Langue par défaut
          </label>
          <select
            value={settings.general?.defaultLanguage || 'fr'}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, defaultLanguage: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuseau horaire
          </label>
          <select
            value={settings.general?.timezone || 'Africa/Ndjamena'}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, timezone: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Africa/Ndjamena">Africa/Ndjamena</option>
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.general?.maintenanceMode || false}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, maintenanceMode: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Mode maintenance
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.general?.allowRegistration || true}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, allowRegistration: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Autoriser les inscriptions
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.general?.requireEmailVerification || true}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, requireEmailVerification: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Vérification email obligatoire
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longueur minimale du mot de passe
          </label>
          <input
            type="number"
            value={settings.security?.passwordMinLength || 8}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeout de session (minutes)
          </label>
          <input
            type="number"
            value={settings.security?.sessionTimeout || 30}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security?.requireSpecialChars || true}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, requireSpecialChars: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Exiger des caractères spéciaux
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security?.twoFactorAuth || false}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, twoFactorAuth: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Authentification à deux facteurs
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security?.sslRequired || true}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, sslRequired: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            SSL obligatoire
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security?.auditLog || true}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, auditLog: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Journal d'audit
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serveur SMTP
          </label>
          <input
            type="text"
            value={settings.email?.smtpHost || ''}
            onChange={(e) => setSettings({
              ...settings,
              email: { ...settings.email, smtpHost: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Port SMTP
          </label>
          <input
            type="number"
            value={settings.email?.smtpPort || 587}
            onChange={(e) => setSettings({
              ...settings,
              email: { ...settings.email, smtpPort: parseInt(e.target.value) }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom d'utilisateur SMTP
          </label>
          <input
            type="text"
            value={settings.email?.smtpUser || ''}
            onChange={(e) => setSettings({
              ...settings,
              email: { ...settings.email, smtpUser: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe SMTP
          </label>
          <input
            type="password"
            value={settings.email?.smtpPassword || ''}
            onChange={(e) => setSettings({
              ...settings,
              email: { ...settings.email, smtpPassword: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'expéditeur
          </label>
          <input
            type="text"
            value={settings.email?.fromName || ''}
            onChange={(e) => setSettings({
              ...settings,
              email: { ...settings.email, fromName: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de l'expéditeur
          </label>
          <input
            type="email"
            value={settings.email?.fromEmail || ''}
            onChange={(e) => setSettings({
              ...settings,
              email: { ...settings.email, fromEmail: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      {/* Numéros Airtel Money */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <PhoneIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Numéros Airtel Money Tchad</h3>
          </div>
          <button
            onClick={() => {
              const newNumbers = [...(settings.payment?.airtelNumbers || []), { number: '', name: 'Airtel Money', isActive: true }];
              setSettings({
                ...settings,
                payment: { ...settings.payment, airtelNumbers: newNumbers }
              });
            }}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {(settings.payment?.airtelNumbers || []).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={item.number || ''}
                onChange={(e) => {
                  const newNumbers = [...(settings.payment?.airtelNumbers || [])];
                  newNumbers[index] = { ...newNumbers[index], number: e.target.value };
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, airtelNumbers: newNumbers }
                  });
                }}
                placeholder="Ex: +235 60 12 34 56"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => {
                  const newNumbers = [...(settings.payment?.airtelNumbers || [])];
                  newNumbers[index] = { ...newNumbers[index], name: e.target.value };
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, airtelNumbers: newNumbers }
                  });
                }}
                placeholder="Nom (optionnel)"
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.isActive !== false}
                  onChange={(e) => {
                    const newNumbers = [...(settings.payment?.airtelNumbers || [])];
                    newNumbers[index] = { ...newNumbers[index], isActive: e.target.checked };
                    setSettings({
                      ...settings,
                      payment: { ...settings.payment, airtelNumbers: newNumbers }
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Actif</span>
              </label>
              <button
                onClick={() => {
                  const newNumbers = (settings.payment?.airtelNumbers || []).filter((_, i) => i !== index);
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, airtelNumbers: newNumbers }
                  });
                }}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          {(!settings.payment?.airtelNumbers || settings.payment.airtelNumbers.length === 0) && (
            <p className="text-sm text-gray-500">Aucun numéro Airtel configuré</p>
          )}
        </div>
      </div>

      {/* Numéros Moov Money */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <PhoneIcon className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Numéros Moov Money Tchad</h3>
          </div>
          <button
            onClick={() => {
              const newNumbers = [...(settings.payment?.moovNumbers || []), { number: '', name: 'Moov Money', isActive: true }];
              setSettings({
                ...settings,
                payment: { ...settings.payment, moovNumbers: newNumbers }
              });
            }}
            className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {(settings.payment?.moovNumbers || []).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={item.number || ''}
                onChange={(e) => {
                  const newNumbers = [...(settings.payment?.moovNumbers || [])];
                  newNumbers[index] = { ...newNumbers[index], number: e.target.value };
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, moovNumbers: newNumbers }
                  });
                }}
                placeholder="Ex: +235 60 12 34 56"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => {
                  const newNumbers = [...(settings.payment?.moovNumbers || [])];
                  newNumbers[index] = { ...newNumbers[index], name: e.target.value };
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, moovNumbers: newNumbers }
                  });
                }}
                placeholder="Nom (optionnel)"
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.isActive !== false}
                  onChange={(e) => {
                    const newNumbers = [...(settings.payment?.moovNumbers || [])];
                    newNumbers[index] = { ...newNumbers[index], isActive: e.target.checked };
                    setSettings({
                      ...settings,
                      payment: { ...settings.payment, moovNumbers: newNumbers }
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Actif</span>
              </label>
              <button
                onClick={() => {
                  const newNumbers = (settings.payment?.moovNumbers || []).filter((_, i) => i !== index);
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, moovNumbers: newNumbers }
                  });
                }}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          {(!settings.payment?.moovNumbers || settings.payment.moovNumbers.length === 0) && (
            <p className="text-sm text-gray-500">Aucun numéro Moov configuré</p>
          )}
        </div>
      </div>

      {/* Compte bancaire */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BuildingLibraryIcon className="w-6 h-6 text-purple-600 mr-2" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Compte bancaire du centre</h3>
              <p className="text-sm text-gray-500 mt-1">
                Configurez les informations bancaires qui seront affichées lors des paiements par virement
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la banque
            </label>
            <input
              type="text"
              value={settings.payment?.bankAccount?.bankName || ''}
              onChange={(e) => setSettings({
                ...settings,
                payment: {
                  ...settings.payment,
                  bankAccount: { ...settings.payment?.bankAccount, bankName: e.target.value }
                }
              })}
              placeholder="Ex: Société Générale Tchad"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de compte
            </label>
            <input
              type="text"
              value={settings.payment?.bankAccount?.accountNumber || ''}
              onChange={(e) => setSettings({
                ...settings,
                payment: {
                  ...settings.payment,
                  bankAccount: { ...settings.payment?.bankAccount, accountNumber: e.target.value }
                }
              })}
              placeholder="Ex: 1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titulaire du compte
            </label>
            <input
              type="text"
              value={settings.payment?.bankAccount?.accountHolderName || ''}
              onChange={(e) => setSettings({
                ...settings,
                payment: {
                  ...settings.payment,
                  bankAccount: { ...settings.payment?.bankAccount, accountHolderName: e.target.value }
                }
              })}
              placeholder="Ex: Expérience Tech"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN (optionnel)
            </label>
            <input
              type="text"
              value={settings.payment?.bankAccount?.iban || ''}
              onChange={(e) => setSettings({
                ...settings,
                payment: {
                  ...settings.payment,
                  bankAccount: { ...settings.payment?.bankAccount, iban: e.target.value }
                }
              })}
              placeholder="Ex: TD..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code SWIFT (optionnel)
            </label>
            <input
              type="text"
              value={settings.payment?.bankAccount?.swiftCode || ''}
              onChange={(e) => setSettings({
                ...settings,
                payment: {
                  ...settings.payment,
                  bankAccount: { ...settings.payment?.bankAccount, swiftCode: e.target.value }
                }
              })}
              placeholder="Ex: SOGETDXT"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agence (optionnel)
            </label>
            <input
              type="text"
              value={settings.payment?.bankAccount?.branch || ''}
              onChange={(e) => setSettings({
                ...settings,
                payment: {
                  ...settings.payment,
                  bankAccount: { ...settings.payment?.bankAccount, branch: e.target.value }
                }
              })}
              placeholder="Ex: N'Djamena Centre"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.payment?.bankAccount?.isActive !== false}
              onChange={(e) => setSettings({
                ...settings,
                payment: {
                  ...settings.payment,
                  bankAccount: { ...settings.payment?.bankAccount, isActive: e.target.checked }
                }
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-900">
              Activer le compte bancaire pour les paiements par virement
            </span>
          </label>
          <p className="text-xs text-gray-600 mt-2 ml-6">
            Si cette option est activée, les informations bancaires s'afficheront dans la modal de paiement par virement.
            {(!settings.payment?.bankAccount?.bankName || !settings.payment?.bankAccount?.accountNumber) && (
              <span className="text-orange-600 font-medium block mt-1">
                ⚠️ Attention : Veuillez remplir au moins le nom de la banque et le numéro de compte pour que le virement bancaire fonctionne.
              </span>
            )}
          </p>
        </div>
        
        {/* Informations supplémentaires */}
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">📝 Exemples pour le Tchad</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Banques :</strong> Société Générale Tchad, Banque Commerciale du Chari, Ecobank Tchad</li>
            <li>• <strong>Codes SWIFT :</strong> SOGETDXT (Société Générale), BCCATDXT (BCC), ECBKTDXT (Ecobank)</li>
            <li>• <strong>Format IBAN :</strong> TD suivi de 2 chiffres + 22 caractères (ex: TD11 1234 5678 9012 3456 7890)</li>
          </ul>
        </div>
      </div>

      {/* Autres paramètres de paiement */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Autres paramètres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <select
              value={settings.payment?.currency || 'XAF'}
              onChange={(e) => setSettings({
                ...settings,
                payment: { ...settings.payment, currency: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="XAF">XAF (Franc CFA)</option>
              <option value="USD">USD (Dollar US)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux de taxe (0-1)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={settings.payment?.taxRate || 0}
              onChange={(e) => setSettings({
                ...settings,
                payment: { ...settings.payment, taxRate: parseFloat(e.target.value) || 0 }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.payment?.allowCashPayment !== false}
              onChange={(e) => setSettings({
                ...settings,
                payment: { ...settings.payment, allowCashPayment: e.target.checked }
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Autoriser les paiements en espèces</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-900">Dernière sauvegarde</h3>
            <p className="text-blue-700">{settings.backup?.lastBackup || 'Aucune sauvegarde'}</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Sauvegarder maintenant
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
              Restaurer
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.backup?.autoBackup || true}
            onChange={(e) => setSettings({
              ...settings,
              backup: { ...settings.backup, autoBackup: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Sauvegarde automatique
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.backup?.compressionEnabled || true}
            onChange={(e) => setSettings({
              ...settings,
              backup: { ...settings.backup, compressionEnabled: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Compression activée
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fréquence de sauvegarde
          </label>
          <select
            value={settings.backup?.backupFrequency || 'daily'}
            onChange={(e) => setSettings({
              ...settings,
              backup: { ...settings.backup, backupFrequency: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hourly">Toutes les heures</option>
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuelle</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rétention (jours)
          </label>
          <input
            type="number"
            value={settings.backup?.backupRetention || 30}
            onChange={(e) => setSettings({
              ...settings,
              backup: { ...settings.backup, backupRetention: parseInt(e.target.value) }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'email':
        return renderEmailSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return (
          <div className="text-center py-12">
            <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Paramètres {activeTab} - En développement</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paramètres Système</h2>
          <p className="text-gray-600">Configuration avancée de la plateforme</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleSave(activeTab)}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 mr-2" />
            )}
            Sauvegarder
          </button>
          <button
            onClick={() => handleReset(activeTab)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Status message */}
      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            saveStatus.includes('succès') ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'
          }`}
        >
          {saveStatus}
        </motion.div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des paramètres */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminSystemSettings;
