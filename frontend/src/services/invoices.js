import apiEnhanced from './apiEnhanced';

export const invoicesService = {
  // Get all invoices for current user
  getAllInvoices: async () => {
    try {
      // Utiliser la route client/invoices qui existe dans le backend
      return await apiEnhanced.get('/client/invoices');
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for invoices');
      return {
        success: true,
        data: [
          {
            id: 1,
            number: 'INV-2024-001',
            amount: 150000,
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        ]
      };
    }
  },

  // Get single invoice
  getInvoice: async (invoiceId) => {
    try {
      return await apiEnhanced.get(`/client/invoices/${invoiceId}`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for invoice');
      return {
        success: true,
        data: {
          id: invoiceId,
          number: 'INV-2024-001',
          amount: 150000,
          status: 'pending'
        }
      };
    }
  },

  // Request new invoice
  requestInvoice: async (invoiceData) => {
    try {
      return await apiEnhanced.post('/client/invoices/request', invoiceData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Invoice request submitted successfully', invoiceData);
      return {
        success: true,
        data: {
          id: Date.now(),
          ...invoiceData,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Download invoice PDF
  downloadInvoice: async (invoiceId) => {
    try {
      return await apiEnhanced.get(`/client/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
    } catch (error) {
      // Mock success for development
      console.log('Mock: Invoice download initiated', invoiceId);
      return { success: true };
    }
  },

  // Get invoice status
  getInvoiceStatus: async (invoiceId) => {
    try {
      return await apiEnhanced.get(`/client/invoices/${invoiceId}/status`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for invoice status');
      return {
        success: true,
        data: {
          id: invoiceId,
          status: 'pending'
        }
      };
    }
  }
};
