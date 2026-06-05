import apiClient from './client';

export const interviewApi = {
  // Get interview details
  get: async (id: number) => {
    return apiClient.get(`/interviews/${id}`);
  },

  // Get list of interviews for user
  list: async (filters?: any) => {
    return apiClient.get('/interviews', { params: filters });
  },

  // Join interview (get Agora token)
  join: async (id: number) => {
    return apiClient.post(`/interviews/${id}/join`);
  },

  // Complete interview (trainer only)
  complete: async (id: number) => {
    return apiClient.post(`/interviews/${id}/complete`);
  },

  // Rate interview (student only)
  rate: async (id: number, data: any) => {
    return apiClient.post(`/interviews/${id}/rate`, data);
  },

  // Cancel interview
  cancel: async (id: number) => {
    return apiClient.post(`/interviews/${id}/cancel`);
  },
};
