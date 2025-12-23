import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import settingsService from '../services/settingsService';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les données de paiement depuis l'état de navigation ou les paramètres URL
  const paymentData = location.state?.paymentData || {};
  const paymentMethod = paymentData.paymentMethod || location.search.match(/method=([^&]+)/)?.[1] || 'bank_transfer';
  const transactionId = paymentData.transactionId || paymentData.data?.transactionId || location.search.match(/transaction=([^&]+)/)?.[1] || '';
  const amount = paymentData.amount || paymentData.data?.amount || 0;
  const itemName = paymentData.itemName || paymentData.data?.itemName || 'Article';
  const itemType = paymentData.itemType || paymentData.data?.itemType || 'course';

  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsService.getPaymentSettings();
        if (response && response.data) {
          setPaymentSettings(response.data.payment);
        }
      } catch (error) {
        console.error('Error loading payment settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentSettings();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Chargement des instructions de paiement..." />
      </div>
    );
  }

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'airtel_money':
        return <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600" />;
      case 'moov_money':
        return <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600" />;
      case 'bank_transfer':
        return <BuildingLibraryIcon className="w-8 h-8 text-purple-600" />;
      case 'prepaid_card':
        return <CreditCardIcon className="w-8 h-8 text-green-600" />;
      default:
        return <CreditCardIcon className="w-8 h-8 text-gray-600" />;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'airtel_money':
        return 'Airtel Money';
      case 'moov_money':
        return 'Moov Money / Tigo Money';
      case 'bank_transfer':
        return 'Virement Bancaire';
      case 'prepaid_card':
        return 'Carte Prépayée';
      default:
        return 'Paiement';
    }
  };

  const renderMobileMoneyInstructions = () => {
    const numbers = paymentMethod === 'airtel_money' 
      ? (paymentSettings?.airtelNumbers || []).filter(n => n.isActive !== false)
      : (paymentSettings?.moovNumbers || []).filter(n => n.isActive !== false);

    if (numbers.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Aucun numéro configuré</p>
              <p className="text-xs text-yellow-700 mt-1">
                Veuillez contacter l'administration pour obtenir les informations de paiement.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Instructions de paiement {getPaymentMethodName()}
          </h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Étape 1 : Effectuez le paiement</p>
              <p className="text-sm text-gray-600 mb-3">
                Envoyez le montant de <strong className="text-gray-900">{amount.toLocaleString('fr-FR')} FCFA</strong> à l'un des numéros suivants :
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2">
                {numbers.map((num, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div>
                      <p className="font-mono text-lg font-semibold text-gray-900">{num.number}</p>
                      {num.name && <p className="text-xs text-gray-600 mt-1">{num.name}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Actif</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Étape 2 : Référence de transaction</p>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                <p className="text-xs text-gray-600 mb-2">Utilisez cette référence lors du paiement :</p>
                <p className="font-mono text-lg font-bold text-purple-600 text-center">
                  {transactionId || 'En attente...'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Étape 3 : Confirmation</p>
              <p className="text-sm text-gray-600">
                Après avoir effectué le paiement, votre commande sera automatiquement validée. 
                Vous recevrez une confirmation par email une fois le paiement vérifié.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <ClockIcon className="w-5 h-5 text-gray-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Délai de traitement</p>
              <p className="text-xs text-gray-600 mt-1">
                Le traitement du paiement peut prendre de quelques minutes à 24 heures selon votre opérateur.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBankTransferInstructions = () => {
    const bankAccount = paymentSettings?.bankAccount || {};

    if (!bankAccount.isActive || !bankAccount.bankName) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Compte bancaire non configuré</p>
              <p className="text-xs text-yellow-700 mt-1">
                Veuillez contacter l'administration pour obtenir les informations bancaires.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Instructions de virement bancaire
          </h3>
          
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Banque</p>
                <p className="font-semibold text-gray-900">{bankAccount.bankName}</p>
              </div>
              {bankAccount.branch && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agence</p>
                  <p className="font-semibold text-gray-900">{bankAccount.branch}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Numéro de compte</p>
                <p className="font-mono font-semibold text-gray-900 text-lg">{bankAccount.accountNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Titulaire du compte</p>
                <p className="font-semibold text-gray-900">{bankAccount.accountHolderName}</p>
              </div>
              {bankAccount.iban && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">IBAN</p>
                  <p className="font-mono font-semibold text-gray-900">{bankAccount.iban}</p>
                </div>
              )}
              {bankAccount.swiftCode && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Code SWIFT</p>
                  <p className="font-mono font-semibold text-gray-900">{bankAccount.swiftCode}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Montant à transférer</p>
                <p className="font-bold text-purple-600 text-2xl">{amount.toLocaleString('fr-FR')} FCFA</p>
              </div>
              {transactionId && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Référence de transaction</p>
                  <p className="font-mono font-semibold text-gray-900 bg-gray-50 p-2 rounded">
                    {transactionId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <DocumentTextIcon className="w-5 h-5 text-gray-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Instructions importantes</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Utilisez la référence de transaction lors du virement</li>
                <li>Vérifiez que le montant correspond exactement</li>
                <li>Conservez le reçu de virement comme preuve de paiement</li>
                <li>Le traitement peut prendre 1 à 3 jours ouvrés</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPrepaidCardConfirmation = () => {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Paiement effectué avec succès !
          </h3>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          Votre paiement a été traité immédiatement avec votre carte prépayée.
        </p>
        {itemType === 'course' && (
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm font-medium text-gray-900 mb-2">Prochaines étapes :</p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Accédez à vos formations depuis "Mes formations"</li>
              <li>Vous recevrez un email de confirmation</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Confirmation de Paiement - Expérience Tech</title>
        <meta name="description" content="Instructions de paiement et confirmation" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {paymentMethod === 'prepaid_card' ? (
                <CheckCircleIcon className="w-16 h-16 text-green-600" />
              ) : (
                <ClockIcon className="w-16 h-16 text-blue-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {paymentMethod === 'prepaid_card' ? 'Paiement Confirmé' : 'Instructions de Paiement'}
            </h1>
            <p className="text-gray-600">
              {paymentMethod === 'prepaid_card' 
                ? 'Votre transaction a été traitée avec succès'
                : 'Suivez les instructions ci-dessous pour compléter votre paiement'}
            </p>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getPaymentMethodIcon()}
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Méthode de paiement</p>
                  <p className="font-semibold text-gray-900">{getPaymentMethodName()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Montant</p>
                <p className="text-2xl font-bold text-purple-600">
                  {amount.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Article</p>
                  <p className="font-medium text-gray-900">{itemName}</p>
                </div>
                {transactionId && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Référence</p>
                    <p className="font-mono text-sm font-semibold text-gray-700">{transactionId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mb-6">
            {paymentMethod === 'airtel_money' || paymentMethod === 'moov_money' ? (
              renderMobileMoneyInstructions()
            ) : paymentMethod === 'bank_transfer' ? (
              renderBankTransferInstructions()
            ) : paymentMethod === 'prepaid_card' ? (
              renderPrepaidCardConfirmation()
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <PrinterIcon className="w-5 h-5 mr-2" />
                Imprimer les instructions
              </button>
              <div className="flex gap-3">
                <Link
                  to="/"
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Accueil
                </Link>
                {itemType === 'course' ? (
                  <Link
                    to="/my-courses"
                    className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Mes formations
                  </Link>
                ) : (
                  <Link
                    to="/client/orders"
                    className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Mes commandes
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Besoin d'aide ?</p>
                <p className="text-xs text-blue-700">
                  Si vous avez des questions concernant votre paiement, contactez notre support à{' '}
                  <a href="mailto:support@experiencetech.td" className="underline font-medium">
                    support@experiencetech.td
                  </a>
                  {' '}ou appelez-nous au{' '}
                  <a href="tel:+23560123456" className="underline font-medium">
                    +235 60 12 34 56
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button, a {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default PaymentConfirmation;

