import apiClient from './client';

export const paymentApi = {
  // Initiate payment
  initiate: async (data: any) => {
    return apiClient.post('/payments/initiate', data);
  },

  // Get payment history
  getHistory: async (filters?: any) => {
    return apiClient.get('/payments/history', { params: filters });
  },

  // Get specific payment
  get: async (id: number) => {
    return apiClient.get(`/payments/${id}`);
  },

  // Get invoice
  getInvoice: async (paymentId: number) => {
    return apiClient.get(`/payments/${paymentId}/invoice`);
  },

  // Verify payment (for webhook verification)
  verify: async (data: any) => {
    return apiClient.post('/payments/verify', data);
  },
};
