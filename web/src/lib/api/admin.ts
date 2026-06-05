import apiClient from './client';

export const adminApi = {
  // Dashboard
  getDashboard: async () => {
    return apiClient.get('/admin/dashboard');
  },

  getStats: async () => {
    return apiClient.get('/admin/stats');
  },

  getHealth: async () => {
    return apiClient.get('/admin/health');
  },

  // User Management
  getUsers: async (filters?: { role?: string; status?: string; search?: string; page?: number }) => {
    return apiClient.get('/admin/users', { params: filters });
  },

  getUser: async (id: number) => {
    return apiClient.get(`/admin/users/${id}`);
  },

  updateUser: async (id: number, data: any) => {
    return apiClient.put(`/admin/users/${id}`, data);
  },

  deleteUser: async (id: number) => {
    return apiClient.delete(`/admin/users/${id}`);
  },

  bulkDeleteUsers: async (userIds: number[]) => {
    return apiClient.post('/admin/users/bulk-delete', { user_ids: userIds });
  },

  // Trainer Management
  getTrainers: async (filters?: { status?: string; rating?: number }) => {
    return apiClient.get('/admin/trainers', { params: filters });
  },

  getTrainer: async (id: number) => {
    return apiClient.get(`/admin/trainers/${id}`);
  },

  getPendingTrainers: async () => {
    return apiClient.get('/admin/trainers/pending');
  },

  approveTrainer: async (id: number, data?: any) => {
    return apiClient.post(`/admin/trainers/${id}/approve`, data);
  },

  rejectTrainer: async (id: number, reason?: string) => {
    return apiClient.post(`/admin/trainers/${id}/reject`, { reason });
  },

  getTrainerReviews: async (id: number) => {
    return apiClient.get(`/admin/trainers/${id}/reviews`);
  },

  getTrainerComplaints: async (id: number) => {
    return apiClient.get(`/admin/trainers/${id}/complaints`);
  },

  // Company Management
  getCompanies: async (filters?: { status?: string; industry?: string }) => {
    return apiClient.get('/admin/companies', { params: filters });
  },

  getCompany: async (id: number) => {
    return apiClient.get(`/admin/companies/${id}`);
  },

  getPendingCompanies: async () => {
    return apiClient.get('/admin/companies/pending');
  },

  verifyCompany: async (id: number, data?: any) => {
    return apiClient.post(`/admin/companies/${id}/verify`, data);
  },

  rejectCompany: async (id: number, reason?: string) => {
    return apiClient.post(`/admin/companies/${id}/reject`, { reason });
  },

  getCompanyCampaigns: async (id: number) => {
    return apiClient.get(`/admin/companies/${id}/campaigns`);
  },

  getCompanyCandidates: async (id: number) => {
    return apiClient.get(`/admin/companies/${id}/candidates`);
  },

  // Booking Management
  getBookings: async (filters?: { status?: string; date?: string }) => {
    return apiClient.get('/admin/bookings', { params: filters });
  },

  getBooking: async (id: number) => {
    return apiClient.get(`/admin/bookings/${id}`);
  },

  getBookingsByStatus: async (status: string) => {
    return apiClient.get(`/admin/bookings/status/${status}`);
  },

  updateBooking: async (id: number, data: any) => {
    return apiClient.put(`/admin/bookings/${id}`, data);
  },

  deleteBooking: async (id: number) => {
    return apiClient.delete(`/admin/bookings/${id}`);
  },

  // Payment Management
  getPayments: async (filters?: { status?: string; gateway?: string }) => {
    return apiClient.get('/admin/payments', { params: filters });
  },

  getPayment: async (id: number) => {
    return apiClient.get(`/admin/payments/${id}`);
  },

  getPaymentsByStatus: async (status: string) => {
    return apiClient.get(`/admin/payments/status/${status}`);
  },

  refundPayment: async (id: number, data: any) => {
    return apiClient.post(`/admin/payments/${id}/refund`, data);
  },

  // Payout Management
  getPayouts: async (filters?: { status?: string }) => {
    return apiClient.get('/admin/payouts', { params: filters });
  },

  processPayout: async (id: number, data: any) => {
    return apiClient.post(`/admin/payouts/${id}/process`, data);
  },

  // Invoice Management
  getInvoices: async () => {
    return apiClient.get('/admin/invoices');
  },

  getInvoice: async (id: number) => {
    return apiClient.get(`/admin/invoices/${id}`);
  },

  // Notification Management
  sendNotification: async (data: any) => {
    return apiClient.post('/admin/notifications/send', data);
  },

  broadcastNotification: async (data: any) => {
    return apiClient.post('/admin/notifications/broadcast', data);
  },

  sendEmailCampaign: async (data: any) => {
    return apiClient.post('/admin/notifications/email', data);
  },

  getNotificationHistory: async (filters?: { type?: string; status?: string }) => {
    return apiClient.get('/admin/notifications/history', { params: filters });
  },

  // Reports & Analytics
  getUserGrowthReport: async (period?: string) => {
    return apiClient.get('/admin/reports/users', { params: { period } });
  },

  getRevenueReport: async (period?: string) => {
    return apiClient.get('/admin/reports/revenue', { params: { period } });
  },

  getBookingReport: async (period?: string) => {
    return apiClient.get('/admin/reports/bookings', { params: { period } });
  },

  getTrainerPerformanceReport: async () => {
    return apiClient.get('/admin/reports/trainers');
  },

  exportReport: async (data: any) => {
    return apiClient.post('/admin/reports/export', data);
  },

  // Settings Management
  getSettings: async () => {
    return apiClient.get('/admin/settings');
  },

  updateSettings: async (data: any) => {
    return apiClient.put('/admin/settings', data);
  },

  updatePaymentSettings: async (data: any) => {
    return apiClient.put('/admin/settings/payment', data);
  },

  updateVideoSettings: async (data: any) => {
    return apiClient.put('/admin/settings/video', data);
  },

  updateCommunicationSettings: async (data: any) => {
    return apiClient.put('/admin/settings/communication', data);
  },
};
