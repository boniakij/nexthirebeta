import apiClient from './client';

export const bookingApi = {
  // Create a new booking
  create: async (data: any) => {
    return apiClient.post('/bookings', data);
  },

  // Get booking details
  get: async (id: number) => {
    return apiClient.get(`/bookings/${id}`);
  },

  // List user's bookings
  list: async (filters?: any) => {
    return apiClient.get('/bookings', { params: filters });
  },

  // Cancel a booking
  cancel: async (id: number) => {
    return apiClient.post(`/bookings/${id}/cancel`);
  },

  // Confirm booking (after payment)
  confirm: async (id: number) => {
    return apiClient.post(`/bookings/${id}/confirm`);
  },
};
