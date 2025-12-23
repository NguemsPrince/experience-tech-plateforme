import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  XMarkIcon, 
  CreditCardIcon, 
  DevicePhoneMobileIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  GiftIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import paymentsService from '../services/payments';
import prepaidCardsService from '../services/prepaidCards';
import settingsService from '../services/settingsService';
import LoadingSpinner from './LoadingSpinner';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  course,
  item, // Generic item (course or product)
  onPaymentSuccess 
}) => {
  const navigate = useNavigate();
  // Use item if provided, otherwise fall back to course for backward compatibility
  const paymentItem = item || course;
  
  const [paymentMethod, setPaymentMethod] = useState('airtel_money');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [prepaidCardCode, setPrepaidCardCode] = useState('');
  const [validatingCard, setValidatingCard] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Load payment settings
  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        setLoadingSettings(true);
        const response = await settingsService.getPaymentSettings();
        if (response && response.data) {
          setPaymentSettings(response.data.payment);
        }
      } catch (error) {
        console.error('Error loading payment settings:', error);
        // Continue with default settings if API fails
      } finally {
        setLoadingSettings(false);
      }
    };

    if (isOpen) {
      loadPaymentSettings();
    }
  }, [isOpen]);

  // Determine item type
  const itemType = paymentItem?.type || (paymentItem?.courseId || paymentItem?.instructor ? 'course' : 'product');
  const itemPrice = paymentItem?.price || 0;
  const itemTitle = paymentItem?.title || paymentItem?.name || 'Article';
  const itemImage = paymentItem?.image || paymentItem?.thumbnail || paymentItem?.images?.[0] || '';
  
  // Debug logging
  useEffect(() => {
    if (isOpen && paymentItem) {
      console.log('PaymentModal - Item details:', {
        itemType,
        itemId: paymentItem._id || paymentItem.id,
        itemPrice,
        itemTitle,
        paymentItem
      });
    }
  }, [isOpen, paymentItem, itemType, itemPrice, itemTitle]);

  // Set default payment method when modal opens
  useEffect(() => {
    if (isOpen && paymentItem) {
      setError(null);
      setSuccess(false);
      setPaymentData(null);
      setPrepaidCardCode('');
      // Default to Airtel Money
      setPaymentMethod('airtel_money');
    }
  }, [isOpen, paymentItem]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setError(null);
  };

  const handleCreatePayment = async () => {
    if (!paymentItem) return;

    // Validate prepaid card if selected
    if (paymentMethod === 'prepaid_card') {
      if (!prepaidCardCode.trim()) {
        setError('Veuillez entrer un code de carte prépayée');
        return;
      }

      setValidatingCard(true);
      setError(null);

      try {
        const validateResponse = await prepaidCardsService.validate(prepaidCardCode);
        
        if (!validateResponse.data.card.isValid) {
          setError('Cette carte n\'est plus valide');
          setValidatingCard(false);
          return;
        }

        if (validateResponse.data.card.value < itemPrice) {
          setError(`Le montant de la carte (${validateResponse.data.card.value} FCFA) est insuffisant pour payer cet article (${itemPrice} FCFA)`);
          setValidatingCard(false);
          return;
        }

        // Card is valid, proceed with payment
        setValidatingCard(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Code de carte invalide');
        setValidatingCard(false);
        return;
      }
    }

    setIsProcessing(true);
    setError(null);

    try {
      // For courses, use the existing payment system
      if (itemType === 'course') {
        const response = await paymentsService.createPaymentIntent(
          paymentItem._id || paymentItem.id, 
          paymentMethod,
          null,
          paymentMethod === 'prepaid_card' ? prepaidCardCode : null
        );
        
        // Response structure from API: { success: true, message: '...', data: {...} }
        // The axios interceptor already returns response.data, so response is already the object
        // Extract the actual payment data (nested in response.data)
        const paymentResponse = response.data ? response.data : response;
        setPaymentData(paymentResponse);
        
        if (paymentMethod === 'prepaid_card') {
          // Payment completed immediately with prepaid card
          setSuccess(true);
          setTimeout(() => {
            // Redirect to confirmation page
            navigate('/payment/confirmation', {
              state: {
                paymentData: {
                  paymentMethod: 'prepaid_card',
                  transactionId: paymentResponse.transactionId || paymentResponse.data?.transactionId,
                  amount: itemPrice,
                  itemName: itemTitle,
                  itemType: itemType,
                  ...paymentResponse
                }
              }
            });
            onPaymentSuccess?.();
            handleClose();
          }, 2000);
        } else if (paymentMethod === 'airtel_money' || paymentMethod === 'moov_money') {
          // For mobile money, redirect to confirmation page with instructions
          setSuccess(true);
          setTimeout(() => {
            navigate('/payment/confirmation', {
              state: {
                paymentData: {
                  paymentMethod: paymentMethod,
                  transactionId: paymentResponse.transactionId || paymentResponse.data?.transactionId,
                  amount: itemPrice,
                  itemName: itemTitle,
                  itemType: itemType,
                  ...paymentResponse
                }
              }
            });
            handleClose();
          }, 1500);
        } else if (paymentMethod === 'bank_transfer') {
          // For bank transfer, redirect to confirmation page with instructions
          setSuccess(true);
          setTimeout(() => {
            navigate('/payment/confirmation', {
              state: {
                paymentData: {
                  paymentMethod: 'bank_transfer',
                  transactionId: paymentResponse.transactionId || paymentResponse.data?.transactionId,
                  amount: itemPrice,
                  itemName: itemTitle,
                  itemType: itemType,
                  ...paymentResponse
                }
              }
            });
            handleClose();
          }, 1500);
        }
      } else {
        // For products, create a payment record for bank transfer
        if (paymentMethod === 'bank_transfer') {
          // For products with bank transfer, redirect to confirmation
          setSuccess(true);
          setTimeout(() => {
            navigate('/payment/confirmation', {
              state: {
                paymentData: {
                  paymentMethod: 'bank_transfer',
                  transactionId: `TXN-${Date.now()}`,
                  amount: itemPrice,
                  itemName: itemTitle,
                  itemType: itemType
                }
              }
            });
            handleClose();
          }, 1500);
        } else {
          // For other payment methods with products, handle through orders
          setSuccess(true);
          setTimeout(() => {
            navigate('/payment/confirmation', {
              state: {
                paymentData: {
                  paymentMethod: paymentMethod,
                  transactionId: `TXN-${Date.now()}`,
                  amount: itemPrice,
                  itemName: itemTitle,
                  itemType: itemType
                }
              }
            });
            onPaymentSuccess?.();
            handleClose();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Extract error message from different possible structures
      // Note: axios interceptor returns error.response?.data directly, so error might be the response data
      let errorMessage = 'Erreur lors de la création du paiement';
      
      // Check if error is the response data (from axios interceptor)
      if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      // Check if there are validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const validationErrors = error.errors.map(e => e.msg || e.message || e).join(', ');
        if (validationErrors) {
          errorMessage = validationErrors;
        }
      }
      
      // Fallback to error message if available
      if (!errorMessage || errorMessage === 'Erreur lors de la création du paiement') {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setPaymentData(null);
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen || !paymentItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-full md:max-w-md w-full max-h-[90vh] overflow-y-auto modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Paiement
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Item Info */}
        <div className="p-6 border-b">
          <div className="flex items-start space-x-4">
            <img
              src={itemImage}
              alt={itemTitle}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {itemTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {paymentItem?.instructor?.name || paymentItem?.instructor || paymentItem?.brand || ''}
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-purple-600">
                  {itemPrice.toLocaleString('fr-FR')} FCFA
                </span>
                {paymentItem?.originalPrice && paymentItem.originalPrice > itemPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {paymentItem.originalPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Content */}
        <div className="p-6">
          {!paymentData && !success && (
            <>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choisissez votre méthode de paiement
                </h3>
                
                <div className="space-y-3">
                  {/* Airtel Money (Tchad) */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors min-h-[60px]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="airtel_money"
                      checked={paymentMethod === 'airtel_money'}
                      onChange={(e) => handlePaymentMethodChange(e.target.value)}
                      className="mr-3 w-5 h-5 min-w-[20px] min-h-[20px]"
                    />
                    <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Airtel Money</div>
                      <div className="text-sm text-gray-600">Paiement via Airtel Money (Tchad)</div>
                      {paymentSettings?.airtelNumbers && paymentSettings.airtelNumbers.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2 flex-wrap">
                            <PhoneIcon className="w-3 h-3" />
                            {paymentSettings.airtelNumbers
                              .filter(num => num.isActive !== false)
                              .map((num, idx) => (
                                <span key={idx} className="font-mono">
                                  {num.number}
                                  {idx < paymentSettings.airtelNumbers.filter(n => n.isActive !== false).length - 1 && ','}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Tigo Money / Moov Money (Tchad) */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="moov_money"
                      checked={paymentMethod === 'moov_money'}
                      onChange={(e) => handlePaymentMethodChange(e.target.value)}
                      className="mr-3"
                    />
                    <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Tigo Money / Moov Money</div>
                      <div className="text-sm text-gray-600">Paiement via Tigo Money / Moov Money (Tchad)</div>
                      {paymentSettings?.moovNumbers && paymentSettings.moovNumbers.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2 flex-wrap">
                            <PhoneIcon className="w-3 h-3" />
                            {paymentSettings.moovNumbers
                              .filter(num => num.isActive !== false)
                              .map((num, idx) => (
                                <span key={idx} className="font-mono">
                                  {num.number}
                                  {idx < paymentSettings.moovNumbers.filter(n => n.isActive !== false).length - 1 && ','}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Virement bancaire (Carte débit/prépayée) */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => handlePaymentMethodChange(e.target.value)}
                      className="mr-3"
                    />
                    <BanknotesIcon className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Virement bancaire</div>
                      <div className="text-sm text-gray-600">Carte débit ou carte prépayée bancaire</div>
                    </div>
                  </label>

                  {/* Carte prépayée Expérience Tech */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="prepaid_card"
                      checked={paymentMethod === 'prepaid_card'}
                      onChange={(e) => handlePaymentMethodChange(e.target.value)}
                      className="mr-3"
                    />
                    <GiftIcon className="w-6 h-6 text-orange-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Carte prépayée Expérience Tech</div>
                      <div className="text-sm text-gray-600">Code de carte unique</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Prepaid Card Code Input */}
              {paymentMethod === 'prepaid_card' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code de carte prépayée
                  </label>
                  <input
                    type="text"
                    value={prepaidCardCode}
                    onChange={(e) => setPrepaidCardCode(e.target.value.toUpperCase())}
                    placeholder="Entrez votre code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={validatingCard || isProcessing}
                  />
                  {validatingCard && (
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Validation en cours...
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-800">{error}</span>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handleCreatePayment}
                disabled={isProcessing}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px] touch-target"
                aria-label={`Payer ${itemPrice.toLocaleString('fr-FR')} FCFA`}
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Création du paiement...
                  </>
                ) : (
                  `Payer ${itemPrice.toLocaleString('fr-FR')} FCFA`
                )}
              </button>
            </>
          )}

          {/* Mobile Money Payment - Redirect to confirmation page */}
          {paymentData && (paymentMethod === 'airtel_money' || paymentMethod === 'moov_money') && (
            <div className="text-center">
              <div className="mb-4">
                <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Paiement créé avec succès
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Redirection vers les instructions de paiement...
                </p>
              </div>
            </div>
          )}

          {/* Bank Transfer Instructions */}
          {success && paymentMethod === 'bank_transfer' && (
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instructions de virement
              </h3>
              <p className="text-gray-600 mb-4">
                Effectuez un virement bancaire avec les détails suivants :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
                {paymentSettings?.bankAccount && paymentSettings.bankAccount.isActive !== false ? (
                  <p className="text-sm text-gray-700 space-y-1">
                    {paymentSettings.bankAccount.bankName && (
                      <><strong>Banque:</strong> {paymentSettings.bankAccount.bankName}<br /></>
                    )}
                    {paymentSettings.bankAccount.accountNumber && (
                      <><strong>Numéro de compte:</strong> {paymentSettings.bankAccount.accountNumber}<br /></>
                    )}
                    {paymentSettings.bankAccount.accountHolderName && (
                      <><strong>Bénéficiaire:</strong> {paymentSettings.bankAccount.accountHolderName}<br /></>
                    )}
                    {paymentSettings.bankAccount.iban && (
                      <><strong>IBAN:</strong> {paymentSettings.bankAccount.iban}<br /></>
                    )}
                    {paymentSettings.bankAccount.swiftCode && (
                      <><strong>Code SWIFT:</strong> {paymentSettings.bankAccount.swiftCode}<br /></>
                    )}
                    {paymentSettings.bankAccount.branch && (
                      <><strong>Agence:</strong> {paymentSettings.bankAccount.branch}<br /></>
                    )}
                    <strong>Montant:</strong> {itemPrice.toLocaleString('fr-FR')} FCFA<br />
                    {(paymentData?.transactionId || paymentData?.data?.transactionId) && (
                      <><strong>Référence:</strong> {paymentData?.transactionId || paymentData?.data?.transactionId}</>
                    )}
                  </p>
                ) : (
                <p className="text-sm text-gray-700">
                    <strong>Banque:</strong> {paymentSettings?.bankAccount?.bankName || 'Non configuré'}<br />
                    <strong>Compte:</strong> {paymentSettings?.bankAccount?.accountNumber || 'Non configuré'}<br />
                    <strong>Bénéficiaire:</strong> {paymentSettings?.bankAccount?.accountHolderName || 'Expérience Tech'}<br />
                  <strong>Montant:</strong> {itemPrice.toLocaleString('fr-FR')} FCFA<br />
                    {(paymentData?.transactionId || paymentData?.data?.transactionId) && (
                      <><strong>Référence:</strong> {paymentData?.transactionId || paymentData?.data?.transactionId}</>
                    )}
                </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
