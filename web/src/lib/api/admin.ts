import apiClient from './client';

export const adminApi = {
  // Dashboard
  getDashboard: async () => {
    return apiClient.get('/admin/dashboard');
  },

  // Users
  getUsers: async (filters?: any) => {
    return apiClient.get('/admin/users', { params: filters });
  },

  updateUserStatus: async (userId: number, status: string) => {
    return apiClient.put(`/admin/users/${userId}/status`, { status });
  },

  banUser: async (userId: number) => {
    return apiClient.post(`/admin/users/${userId}/ban`);
  },

  unbanUser: async (userId: number) => {
    return apiClient.post(`/admin/users/${userId}/unban`);
  },

  // Trainers
  getTrainers: async (filters?: any) => {
    return apiClient.get('/admin/trainers', { params: filters });
  },

  getPendingTrainers: async (page?: number, per_page?: number) => {
    return apiClient.get('/admin/trainers/pending', { params: { page, per_page } });
  },

  approveTrainer: async (trainerId: number) => {
    return apiClient.post(`/admin/trainers/${trainerId}/approve`);
  },

  rejectTrainer: async (trainerId: number, reason?: string) => {
    return apiClient.post(`/admin/trainers/${trainerId}/reject`, { reason });
  },

  verifyTrainerKYC: async (trainerId: number) => {
    return apiClient.post(`/admin/trainers/${trainerId}/verify-kyc`);
  },

  // Companies
  getCompanies: async (filters?: any) => {
    return apiClient.get('/admin/companies', { params: filters });
  },

  getPendingCompanies: async (page?: number, per_page?: number) => {
    return apiClient.get('/admin/companies/pending', { params: { page, per_page } });
  },

  verifyCompanyKYC: async (companyId: number) => {
    return apiClient.post(`/admin/companies/${companyId}/verify-kyc`);
  },

  rejectCompanyKYC: async (companyId: number, reason?: string) => {
    return apiClient.post(`/admin/companies/${companyId}/reject-kyc`, { reason });
  },

  verifyCompany: async (companyId: number) => {
    return apiClient.post(`/admin/companies/${companyId}/verify`);
  },

  rejectCompany: async (companyId: number, reason?: string) => {
    return apiClient.post(`/admin/companies/${companyId}/reject`, { reason });
  },

  // Reports
  getRevenueReport: async (filters?: any) => {
    return apiClient.get('/admin/reports/revenue', { params: filters });
  },
};
