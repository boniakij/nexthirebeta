import apiClient from './client';
import { TrainerPackage, CreatePackageResponse, PackageListResponse, PackageFormState } from '@/types/trainerPackage';

export const trainerPackagesApi = {
  // Get all packages for trainer
  listPackages: async (filters?: { status?: string; search?: string; sort?: string; page?: number }) => {
    return apiClient.get<PackageListResponse>('/trainers/me/packages', { params: filters });
  },

  // Get single package
  getPackage: async (id: number) => {
    return apiClient.get<{ success: boolean; data: TrainerPackage }>(`/trainers/me/packages/${id}`);
  },

  // Create package
  createPackage: async (data: Partial<PackageFormState>) => {
    return apiClient.post<CreatePackageResponse>('/trainers/me/packages', data);
  },

  // Update package
  updatePackage: async (id: number, data: Partial<PackageFormState>) => {
    return apiClient.put<{ success: boolean; data: TrainerPackage }>(`/trainers/me/packages/${id}`, data);
  },

  // Delete/deactivate package
  deletePackage: async (id: number) => {
    return apiClient.delete<{ success: boolean; message: string }>(`/trainers/me/packages/${id}`);
  },

  // Publish/submit for review
  publishPackage: async (id: number, status: 'pending_review' | 'active') => {
    return apiClient.patch<{ success: boolean; message: string; data: { package_id: number; status: string } }>(
      `/trainers/me/packages/${id}/publish`,
      { status }
    );
  },

  // Hide package
  hidePackage: async (id: number) => {
    return apiClient.patch<{ success: boolean; message: string }>(`/trainers/me/packages/${id}/hide`, {});
  },

  // Duplicate package
  duplicatePackage: async (id: number) => {
    return apiClient.patch<{ success: boolean; message: string; data: { new_package_id: number; status: string } }>(
      `/trainers/me/packages/${id}/duplicate`,
      {}
    );
  },

  // Deactivate package
  deactivatePackage: async (id: number) => {
    return apiClient.patch<{ success: boolean; message: string }>(`/trainers/me/packages/${id}/deactivate`, {});
  },
};
