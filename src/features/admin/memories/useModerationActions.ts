import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPendingMemories, 
  approveMemory, 
  rejectMemory, 
  updateMemoryTranslation 
} from './moderationService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/supabaseError';

export function usePendingMemories() {
  return useQuery({
    queryKey: ['admin-pending-memories'],
    queryFn: getPendingMemories,
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useApproveMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveMemory,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || 'Failed to approve memory');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['admin-pending-memories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['martyr-detail'] });
      toast.success('Memory approved successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to approve memory'));
    },
  });
}

export function useRejectMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectMemory,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || 'Failed to reject memory');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['admin-pending-memories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['martyr-detail'] });
      toast.success('Memory rejected');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to reject memory'));
    },
  });
}

export function useUpdateTranslation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      memoryId, 
      language, 
      content 
    }: { 
      memoryId: string; 
      language: 'en' | 'ar'; 
      content: string;
    }) => updateMemoryTranslation(memoryId, language, content),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || 'Failed to update translation');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['admin-pending-memories'] });
      toast.success('Translation updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update translation'));
    },
  });
}
