import apiClient from './client';

export const gamificationApi = {
  // Leaderboard
  getGlobalLeaderboard: async (page?: number, per_page?: number) => {
    return apiClient.get('/leaderboard/global', { params: { page, per_page } });
  },

  getCountryLeaderboard: async (countryCode: string, page?: number, per_page?: number) => {
    return apiClient.get(`/leaderboard/country/${countryCode}`, { params: { page, per_page } });
  },

  getMyRank: async () => {
    return apiClient.get('/leaderboard/me/rank');
  },

  // Badges
  getAllBadges: async () => {
    return apiClient.get('/badges');
  },

  getMyBadges: async () => {
    return apiClient.get('/badges/me');
  },

  // XP Levels reference
  getXPLevels: async () => {
    return apiClient.get('/xp/levels');
  },
};
