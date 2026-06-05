import apiClient from './client';

export const studentApi = {
  // Get authenticated student profile
  getProfile: async () => {
    return apiClient.get('/students/me');
  },

  // Update student profile
  updateProfile: async (data: any) => {
    return apiClient.put('/students/me', data);
  },

  // Upload resume
  uploadResume: async (formData: FormData) => {
    return apiClient.post('/students/me/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get student dashboard
  getDashboard: async () => {
    return apiClient.get('/students/me/dashboard');
  },

  // Get student sessions
  getSessions: async (filters?: { status?: string; per_page?: number; cursor?: string }) => {
    return apiClient.get('/students/me/sessions', { params: filters });
  },

  // Get student evaluations
  getEvaluations: async (filters?: { per_page?: number; cursor?: string }) => {
    return apiClient.get('/students/me/evaluations', { params: filters });
  },

  // Get student badges
  getBadges: async () => {
    return apiClient.get('/students/me/badges');
  },

  // Get XP history
  getXpHistory: async (filters?: { per_page?: number; cursor?: string }) => {
    return apiClient.get('/students/me/xp-history', { params: filters });
  },

  // Get public student profile
  getPublicProfile: async (studentId: number) => {
    return apiClient.get(`/students/${studentId}/public`);
  },
};
