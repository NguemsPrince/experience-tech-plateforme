/**
 * Tests pour le composant PaymentModal
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaymentModal from '../../components/PaymentModal';

// Mock des dépendances
jest.mock('../../services/payments', () => ({
  createPaymentIntent: jest.fn(),
  createMobileMoneyPayment: jest.fn(),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div>{children}</div>,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
}));

describe('PaymentModal', () => {
  const mockItems = [
    {
      type: 'course',
      itemId: '507f1f77bcf86cd799439011',
      name: 'React Course',
      quantity: 1,
      unitPrice: 50000
    }
  ];

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
    items: mockItems,
    amount: 50000,
    currency: 'XAF'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render payment modal when open', () => {
    render(<PaymentModal {...defaultProps} />);
    
    expect(screen.getByText(/moyen de paiement/i)).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    const onClose = jest.fn();
    render(<PaymentModal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /fermer|close/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should not render when isOpen is false', () => {
    render(<PaymentModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText(/moyen de paiement/i)).not.toBeInTheDocument();
  });

  it('should display correct amount', () => {
    render(<PaymentModal {...defaultProps} amount={75000} />);
    
    expect(screen.getByText(/75000|75,000/i)).toBeInTheDocument();
  });

  it('should show payment method selection', () => {
    render(<PaymentModal {...defaultProps} />);
    
    // Vérifier que les options de paiement sont affichées
    expect(screen.getByText(/carte bancaire|credit card/i) || 
           screen.getByText(/mobile money/i) ||
           screen.getByText(/airtel|moov/i)).toBeInTheDocument();
  });
});

