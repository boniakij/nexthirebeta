import apiClient from './client';

export const trainerApi = {
  // Trainer public endpoints
  listTrainers: async (filters?: any) => {
    return apiClient.get('/trainers', { params: filters });
  },

  getTrainer: async (id: number) => {
    return apiClient.get(`/trainers/${id}`);
  },

  getAvailability: async (id: number, date?: string) => {
    return apiClient.get(`/trainers/${id}/availability`, { params: { date } });
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

  // Skills
  getSkills: async () => {
    return apiClient.get('/trainers/me/skills');
  },

  addSkill: async (data: any) => {
    return apiClient.post('/trainers/me/skills', data);
  },

  updateSkill: async (id: number, data: any) => {
    return apiClient.put(`/trainers/me/skills/${id}`, data);
  },

  deleteSkill: async (id: number) => {
    return apiClient.delete(`/trainers/me/skills/${id}`);
  },

  // Education
  getEducations: async () => {
    return apiClient.get('/trainers/me/educations');
  },

  addEducation: async (data: any) => {
    return apiClient.post('/trainers/me/educations', data);
  },

  updateEducation: async (id: number, data: any) => {
    return apiClient.put(`/trainers/me/educations/${id}`, data);
  },

  deleteEducation: async (id: number) => {
    return apiClient.delete(`/trainers/me/educations/${id}`);
  },

  // Achievements
  getAchievements: async () => {
    return apiClient.get('/trainers/me/achievements');
  },

  addAchievement: async (data: any) => {
    return apiClient.post('/trainers/me/achievements', data);
  },

  updateAchievement: async (id: number, data: any) => {
    return apiClient.put(`/trainers/me/achievements/${id}`, data);
  },

  deleteAchievement: async (id: number) => {
    return apiClient.delete(`/trainers/me/achievements/${id}`);
  },
};
