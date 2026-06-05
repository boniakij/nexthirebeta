import apiClient from './client';

export const trainerApi = {
  // Trainer public endpoints
  listTrainers: async (filters?: any) => {
    return apiClient.get('/trainers', { params: filters });
  },

  getTrainer: async (id: number) => {
    return apiClient.get(`/trainers/${id}`);
  },

  getAvailability: async (id: number) => {
    return apiClient.get(`/trainers/${id}/availability`);
  },

  // Authenticated trainer endpoints
  getProfile: async () => {
    return apiClient.get('/trainers/me');
  },

  updateProfile: async (data: any) => {
    return apiClient.put('/trainers/me', data);
  },

  getDashboard: async () => {
    return apiClient.get('/trainers/me/dashboard');
  },

  getEarnings: async (period?: string) => {
    return apiClient.get('/trainers/me/earnings', { params: { period } });
  },

  // Packages
  getPackages: async () => {
    return apiClient.get('/trainers/me/packages');
  },

  createPackage: async (data: any) => {
    return apiClient.post('/trainers/me/packages', data);
  },

  updatePackage: async (id: number, data: any) => {
    return apiClient.put(`/trainers/me/packages/${id}`, data);
  },

  deletePackage: async (id: number) => {
    return apiClient.delete(`/trainers/me/packages/${id}`);
  },

  // Availability
  setAvailability: async (data: any) => {
    return apiClient.post('/trainers/me/availability', data);
  },

  // Evaluations
  submitEvaluation: async (interviewId: number, data: any) => {
    return apiClient.post(`/trainers/me/evaluations/${interviewId}`, data);
  },
};
