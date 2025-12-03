class MobileMoneyService {
  constructor() {
    this.providers = {
      momo: {
        name: 'MoMo',
        apiUrl: process.env.REACT_APP_MOMO_API_URL || 'https://api.momo.td',
        apiKey: process.env.REACT_APP_MOMO_API_KEY,
        merchantId: process.env.REACT_APP_MOMO_MERCHANT_ID
      },
      airtel: {
        name: 'Airtel Money',
        apiUrl: process.env.REACT_APP_AIRTEL_API_URL || 'https://api.airtel.td',
        apiKey: process.env.REACT_APP_AIRTEL_API_KEY,
        merchantId: process.env.REACT_APP_AIRTEL_MERCHANT_ID
      }
    };
  }

  // Détection automatique du provider
  detectProvider(phoneNumber) {
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // MoMo: commence par 60, 61, 62, 63, 64, 65, 66, 67, 68, 69
    if (/^6[0-9]/.test(cleanedNumber)) {
      return 'momo';
    }
    
    // Airtel Money: commence par 70, 71, 72, 73, 74, 75, 76, 77, 78, 79
    if (/^7[0-9]/.test(cleanedNumber)) {
      return 'airtel';
    }
    
    throw new Error('Numéro de téléphone non reconnu. Utilisez un numéro MoMo ou Airtel Money.');
  }

  // Validation du numéro de téléphone tchadien
  validatePhoneNumber(phoneNumber) {
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // Format tchadien: +235XXXXXXXXX ou 0XXXXXXXXX
    const tchadPattern = /^(\+235|0)?[67][0-9]{8}$/;
    
    if (!tchadPattern.test(cleanedNumber)) {
      throw new Error('Format de numéro invalide. Utilisez un numéro tchadien valide.');
    }
    
    return cleanedNumber.startsWith('+235') ? cleanedNumber : '+235' + cleanedNumber;
  }

  // Initialisation d'un paiement
  async initiatePayment(paymentData) {
    const { amount, phoneNumber, description, orderId } = paymentData;
    
    try {
      // Validation des données
      this.validatePaymentData(paymentData);
      
      // Détection du provider
      const provider = this.detectProvider(phoneNumber);
      const providerConfig = this.providers[provider];
      
      // Formatage du numéro
      const formattedNumber = this.validatePhoneNumber(phoneNumber);
      
      // Préparation de la requête
      const requestData = {
        amount: amount,
        phoneNumber: formattedNumber,
        description: description || 'Paiement Expérience Tech',
        orderId: orderId || this.generateOrderId(),
        merchantId: providerConfig.merchantId,
        timestamp: Date.now(),
        currency: 'XOF'
      };
      
      // Signature de la requête
      const signature = this.generateSignature(requestData, providerConfig.apiKey);
      requestData.signature = signature;
      
      // Appel API
      const response = await fetch(`${providerConfig.apiUrl}/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${providerConfig.apiKey}`,
          'X-Merchant-ID': providerConfig.merchantId
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'initiation du paiement');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        transactionId: result.transactionId,
        provider: provider,
        status: result.status,
        message: result.message,
        paymentUrl: result.paymentUrl,
        expiresAt: result.expiresAt
      };
      
    } catch (error) {
      console.error('Erreur initiation paiement:', error);
      return {
        success: false,
        error: error.message,
        provider: this.detectProvider(phoneNumber)
      };
    }
  }

  // Vérification du statut d'un paiement
  async checkPaymentStatus(transactionId, provider) {
    try {
      const providerConfig = this.providers[provider];
      
      const response = await fetch(`${providerConfig.apiUrl}/payment/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${providerConfig.apiKey}`,
          'X-Merchant-ID': providerConfig.merchantId
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du statut');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        status: result.status,
        amount: result.amount,
        phoneNumber: result.phoneNumber,
        timestamp: result.timestamp,
        transactionId: result.transactionId
      };
      
    } catch (error) {
      console.error('Erreur vérification statut:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Annulation d'un paiement
  async cancelPayment(transactionId, provider) {
    try {
      const providerConfig = this.providers[provider];
      
      const response = await fetch(`${providerConfig.apiUrl}/payment/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${providerConfig.apiKey}`,
          'X-Merchant-ID': providerConfig.merchantId
        },
        body: JSON.stringify({
          transactionId,
          timestamp: Date.now()
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation du paiement');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        status: result.status,
        message: result.message
      };
      
    } catch (error) {
      console.error('Erreur annulation paiement:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Remboursement
  async refundPayment(transactionId, amount, provider) {
    try {
      const providerConfig = this.providers[provider];
      
      const requestData = {
        transactionId,
        amount,
        reason: 'Remboursement Expérience Tech',
        timestamp: Date.now()
      };
      
      const signature = this.generateSignature(requestData, providerConfig.apiKey);
      requestData.signature = signature;
      
      const response = await fetch(`${providerConfig.apiUrl}/payment/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${providerConfig.apiKey}`,
          'X-Merchant-ID': providerConfig.merchantId
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du remboursement');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        refundId: result.refundId,
        status: result.status,
        amount: result.amount,
        message: result.message
      };
      
    } catch (error) {
      console.error('Erreur remboursement:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validation des données de paiement
  validatePaymentData(paymentData) {
    const { amount, phoneNumber } = paymentData;
    
    if (!amount || amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }
    
    if (!phoneNumber) {
      throw new Error('Le numéro de téléphone est requis');
    }
    
    if (amount < 100) {
      throw new Error('Le montant minimum est de 100 FCFA');
    }
    
    if (amount > 1000000) {
      throw new Error('Le montant maximum est de 1,000,000 FCFA');
    }
  }

  // Génération de signature
  generateSignature(data, apiKey) {
    const sortedKeys = Object.keys(data).sort();
    const signatureString = sortedKeys
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    // Utilisation de crypto-js pour la signature HMAC
    try {
      const CryptoJS = require('crypto-js');
      return CryptoJS.HmacSHA256(signatureString, apiKey).toString();
    } catch (error) {
      console.warn('crypto-js non disponible, signature simulée');
      // Signature simulée pour le développement
      return btoa(signatureString + apiKey).substring(0, 32);
    }
  }

  // Génération d'ID de commande
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `ET_${timestamp}_${random}`;
  }

  // Formatage du montant pour l'affichage
  formatAmount(amount) {
    return new Intl.NumberFormat('fr-TD', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Vérification de la disponibilité des services
  async checkServiceAvailability() {
    const results = {};
    
    for (const [provider, config] of Object.entries(this.providers)) {
      try {
        const response = await fetch(`${config.apiUrl}/health`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`
          }
        });
        
        results[provider] = {
          available: response.ok,
          status: response.status,
          name: config.name
        };
      } catch (error) {
        results[provider] = {
          available: false,
          error: error.message,
          name: config.name
        };
      }
    }
    
    return results;
  }

  // Historique des transactions
  async getTransactionHistory(filters = {}) {
    try {
      const response = await fetch('/api/payments/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(filters)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'historique');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        transactions: result.transactions,
        total: result.total,
        page: result.page,
        limit: result.limit
      };
      
    } catch (error) {
      console.error('Erreur historique:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instance singleton
const mobileMoneyService = new MobileMoneyService();

export default mobileMoneyService;
