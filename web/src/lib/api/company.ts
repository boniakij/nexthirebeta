import apiClient from './client';

export const companyApi = {
  // Dashboard
  getDashboard: async () => {
    return apiClient.get('/companies/me/dashboard');
  },

  // Campaigns
  getCampaigns: async (filters: { status?: string; per_page?: number; cursor?: string } = {}) => {
    return apiClient.get('/companies/me/campaigns', { params: filters });
  },

  createCampaign: async (data: {
    title: string;
    job_role: string;
    description: string;
    domain: string;
    requirements?: string[];
  }) => {
    return apiClient.post('/companies/me/campaigns', data);
  },

  updateCampaign: async (id: number, data: any) => {
    return apiClient.put(`/companies/me/campaigns/${id}`, data);
  },

  // Candidates
  getCandidates: async (filters: { skill?: string; domain?: string; min_xp?: number; country_code?: string; per_page?: number } = {}) => {
    return apiClient.get('/companies/me/candidates', { params: filters });
  },

  getCandidatesByCampaign: async (campaignId: number, filters: { per_page?: number } = {}) => {
    return apiClient.get(`/companies/me/campaigns/${campaignId}/candidates`, { params: filters });
  },

  inviteCandidate: async (campaignId: number, data: { student_id: number; message?: string }) => {
    return apiClient.post(`/companies/me/campaigns/${campaignId}/invite`, data);
  },

  updateCandidateStatus: async (candidateId: number, data: { campaign_id: number; stage: string; notes?: string }) => {
    return apiClient.put(`/companies/me/candidates/${candidateId}/status`, data);
  },

  // Inbox
  getInbox: async (filters: { per_page?: number } = {}) => {
    return apiClient.get('/companies/me/inbox', { params: filters });
  },

  sendMessage: async (data: { student_id: number; message: string }) => {
    return apiClient.post('/companies/me/inbox', data);
  },
};
