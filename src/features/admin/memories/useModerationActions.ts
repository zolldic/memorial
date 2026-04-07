import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPendingMemories, 
  approveMemory, 
  rejectMemory, 
  updateMemoryTranslation 
} from './moderationService';
import { toast } from 'sonner';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-memories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Memory approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve memory');
    },
  });
}

export function useRejectMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectMemory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-memories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Memory rejected');
    },
    onError: () => {
      toast.error('Failed to reject memory');
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-memories'] });
      toast.success('Translation updated');
    },
    onError: () => {
      toast.error('Failed to update translation');
    },
  });
}
