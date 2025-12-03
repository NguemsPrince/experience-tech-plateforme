import { loadStripe } from '@stripe/stripe-js';

// Configuration Stripe
export const STRIPE_CONFIG = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
  // En production, utilisez une vraie clé API Stripe
  // Pour le développement, on utilise une clé de test placeholder
};

// Fonction pour initialiser Stripe de manière sécurisée
export const initializeStripe = () => {
  // Vérifier si on a une vraie clé API
  if (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && 
      !process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY.includes('placeholder')) {
    return loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  }
  
  // Retourner null si pas de vraie clé (pour éviter l'erreur)
  return null;
};
