import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMartyrsForAdmin, 
  getMartyrForEdit,
  createMartyr, 
  updateMartyr, 
  deleteMartyr,
  uploadMartyrImage,
  MartyrFormData 
} from './martyrsService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/supabaseError';

export function useMartyrsAdmin() {
  return useQuery({
    queryKey: ['admin-martyrs'],
    queryFn: getMartyrsForAdmin,
  });
}

export function useMartyrForEdit(id?: string) {
  return useQuery({
    queryKey: ['admin-martyr', id],
    queryFn: () => id ? getMartyrForEdit(id) : null,
    enabled: !!id,
  });
}

export function useCreateMartyr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMartyr,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || 'Failed to create martyr');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['admin-martyrs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['martyrs'] }); // Public cache
      toast.success('Martyr created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create martyr'));
    },
  });
}

export function useUpdateMartyr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MartyrFormData }) => updateMartyr(id, data),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || 'Failed to update martyr');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['admin-martyrs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-martyr'] });
      queryClient.invalidateQueries({ queryKey: ['martyrs'] }); // Public cache
      queryClient.invalidateQueries({ queryKey: ['martyr-detail'] });
      toast.success('Martyr updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update martyr'));
    },
  });
}

export function useDeleteMartyr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMartyr,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || 'Failed to delete martyr');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['admin-martyrs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['martyrs'] }); // Public cache
      queryClient.invalidateQueries({ queryKey: ['martyr-detail'] });
      toast.success('Martyr deleted');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete martyr'));
    },
  });
}

export function useUploadMartyrImage() {
  return useMutation({
    mutationFn: uploadMartyrImage,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to upload image'));
    },
  });
}
