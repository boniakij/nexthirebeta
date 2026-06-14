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

  // Get student settings
  getSettings: async () => {
    return apiClient.get('/students/me/settings');
  },

  // Update student settings
  updateSettings: async (data: any) => {
    return apiClient.put('/students/me/settings', data);
  },
};

// Trainer API
export const trainerApi = {
  // Get trainer profile
  getProfile: async () => {
    return apiClient.get('/trainers/me');
  },

  // Update trainer profile
  updateProfile: async (data: any) => {
    return apiClient.put('/trainers/me', data);
  },

  // Upload/update resume
  uploadResume: async (formData: FormData) => {
    return apiClient.post('/trainers/me/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get trainer dashboard
  getDashboard: async () => {
    return apiClient.get('/trainers/me/dashboard');
  },

  // Get trainer sessions
  getSessions: async (filters?: { status?: string; per_page?: number }) => {
    return apiClient.get('/trainers/me/sessions', { params: filters });
  },

  // Get trainer earnings
  getEarnings: async (period?: string) => {
    return apiClient.get('/trainers/me/earnings', { params: { period } });
  },

  // Get trainer reviews
  getReviews: async (filters?: { per_page?: number; cursor?: string }) => {
    return apiClient.get('/trainers/me/reviews', { params: filters });
  },

  // Get trainer statistics
  getStats: async () => {
    return apiClient.get('/trainers/me/stats');
  },

  // Get public trainer profile
  getPublicProfile: async (trainerId: number) => {
    return apiClient.get(`/trainers/${trainerId}/public`);
  },
};

// Interview Package API
export const interviewApi = {
  // Trainer: Create interview package
  createInterviewPackage: async (data: any) => {
    return apiClient.post('/trainers/interview-packages', data);
  },

  // Trainer: Get my packages
  getMyPackages: async (filters?: { per_page?: number }) => {
    return apiClient.get('/trainers/interview-packages', { params: filters });
  },

  // Trainer: Get package details
  getPackageDetails: async (id: number) => {
    return apiClient.get(`/trainers/interview-packages/${id}`);
  },

  // Trainer: Update package
  updatePackage: async (id: number, data: any) => {
    return apiClient.put(`/trainers/interview-packages/${id}`, data);
  },

  // Trainer: Delete package
  deletePackage: async (id: number) => {
    return apiClient.delete(`/trainers/interview-packages/${id}`);
  },

  // Student: Get all packages with filters
  getAvailablePackages: async (filters?: {
    category?: string;
    difficulty_level?: string;
    search?: string;
    per_page?: number;
  }) => {
    return apiClient.get('/interview-packages', { params: filters });
  },

  // Student: Get package details
  getPackage: async (id: number) => {
    return apiClient.get(`/interview-packages/${id}`);
  },

  // Student: Get trainer info with package
  getPackageTrainer: async (id: number) => {
    return apiClient.get(`/interview-packages/${id}/trainer`);
  },

  // Student: Book interview package
  bookPackage: async (id: number, notes?: string) => {
    return apiClient.post(`/interview-packages/${id}/book`, { student_notes: notes });
  },

  // Student: Get my bookings
  getMyBookings: async (filters?: { per_page?: number; status?: string }) => {
    return apiClient.get('/students/interview-bookings', { params: filters });
  },

  // Student: Cancel booking
  cancelBooking: async (id: number, reason?: string) => {
    return apiClient.post(`/interview-bookings/${id}/cancel`, { reason });
  },
};
