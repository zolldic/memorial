import { useState } from 'react';
import { usePendingMemories, useApproveMemory, useRejectMemory, useUpdateTranslation } from './useModerationActions';
import { CheckCircle } from 'lucide-react';
import { ConfirmModal } from '../../core/components/ConfirmModal';
import { MemoryCard } from './MemoryCard';
import { getErrorMessage } from '@/shared/utils/supabaseError';

export function PendingMemoriesPage() {
  const { data: memories, isLoading, isError, error, refetch, isFetching } = usePendingMemories();
  const approveMutation = useApproveMemory();
  const rejectMutation = useRejectMemory();
  const updateTranslationMutation = useUpdateTranslation();
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
    memoryId: string | null;
  }>({ isOpen: false, type: null, memoryId: null });

  const handleSave = async (memoryId: string, editedEn: string, editedAr: string) => {
    const memory = memories?.find(m => m.id === memoryId);
    if (!memory) return;

    if (editedEn !== memory.contentEn) {
      await updateTranslationMutation.mutateAsync({ memoryId, language: 'en', content: editedEn });
    }

    if (editedAr !== memory.contentAr) {
      await updateTranslationMutation.mutateAsync({ memoryId, language: 'ar', content: editedAr });
    }
  };

  const handleApprove = (memoryId: string) => {
    setConfirmState({ isOpen: true, type: 'approve', memoryId });
  };

  const handleReject = (memoryId: string) => {
    setConfirmState({ isOpen: true, type: 'reject', memoryId });
  };
  
  const handleConfirmAction = () => {
    if (confirmState.type === 'approve' && confirmState.memoryId) {
      approveMutation.mutate(confirmState.memoryId);
    } else if (confirmState.type === 'reject' && confirmState.memoryId) {
      rejectMutation.mutate(confirmState.memoryId);
    }
    setConfirmState({ isOpen: false, type: null, memoryId: null });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-neutral-200 rounded" />
          <div className="h-32 bg-neutral-200 rounded" />
          <div className="h-32 bg-neutral-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 md:p-8">
        <div className="border-2 border-red-300 bg-red-50 p-6 md:p-8">
          <h1 className="text-xl font-bold text-red-700 mb-2">Failed to load pending memories</h1>
          <p className="text-sm text-red-700 mb-4">
            {getErrorMessage(error, 'An unexpected error occurred while loading pending memories.')}
          </p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-5 py-2 border-2 border-red-700 text-red-700 font-bold uppercase tracking-wide text-xs hover:bg-red-700 hover:text-white transition-colors disabled:opacity-60"
          >
            {isFetching ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = memories?.length || 0;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Pending Memories
        </h1>
        <p className="text-neutral-600">
          Review and moderate user-submitted memories
          <span className="ml-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
            {pendingCount} pending
          </span>
        </p>
      </div>

      {pendingCount === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">All caught up!</h2>
          <p className="text-neutral-600">No pending memories to review at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {memories?.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onApprove={handleApprove}
              onReject={handleReject}
              onSave={handleSave}
              isApproving={approveMutation.isPending}
              isRejecting={rejectMutation.isPending}
              isUpdating={updateTranslationMutation.isPending}
            />
          ))}
        </div>
      )}
      
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.type === 'approve' ? 'Approve Memory' : 'Reject Memory'}
        description={
          confirmState.type === 'approve' 
            ? 'Are you sure you want to approve this memory? It will become visible to the public immediately.' 
            : 'Are you sure you want to reject this memory? This action cannot be undone and the content will be deleted.'
        }
        confirmLabel={confirmState.type === 'approve' ? 'Approve' : 'Reject'}
        isDestructive={confirmState.type === 'reject'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmState({ isOpen: false, type: null, memoryId: null })}
      />
    </div>
  );
}
