import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMartyrsAdmin, useDeleteMartyr } from './useMartyrsAdmin';
import { Search, Plus } from 'lucide-react';
import { ConfirmModal } from '../../core/components/ConfirmModal';
import { AdminMartyrCard } from './AdminMartyrCard';

export function MartyrsManagementPage() {
  const navigate = useNavigate();
  const { data: martyrs, isLoading } = useMartyrsAdmin();
  const deleteMutation = useDeleteMartyr();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    martyrId: string | null;
    martyrName: string | null;
  }>({ isOpen: false, martyrId: null, martyrName: null });

  const filteredMartyrs = martyrs?.filter(m => 
    m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.nameAr.includes(searchQuery) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: string, name: string) => {
    setConfirmState({ isOpen: true, martyrId: id, martyrName: name });
  };

  const handleConfirmDelete = () => {
    if (confirmState.martyrId) {
      deleteMutation.mutate(confirmState.martyrId);
    }
    setConfirmState({ isOpen: false, martyrId: null, martyrName: null });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-background texture-lines">
        <div className="animate-pulse space-y-6 max-w-7xl mx-auto">
          <div className="h-10 w-64 bg-neutral-300 border border-neutral-400" />
          <div className="h-14 bg-neutral-300 border border-neutral-400" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-300 border border-neutral-400" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-background texture-lines">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-neutral-900 mb-2">Martyrs Management</h1>
              <p className="text-neutral-600 tracking-wide uppercase text-sm font-medium">
                Manage profiles
                <span className="ml-3 bg-neutral-900 text-white px-3 py-1 text-xs font-bold font-mono">
                  {martyrs?.length || 0} TOTAL
                </span>
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/martyrs/new')}
              className="flex items-center justify-center gap-3 bg-neutral-900 text-white px-6 py-3 hover:bg-black transition-colors font-bold uppercase tracking-widest text-sm border-2 border-transparent hover:border-black"
            >
              <Plus size={18} />
              Add Martyr
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH BY NAME OR LOCATION..."
              className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors uppercase tracking-wide text-sm font-medium placeholder-neutral-500"
            />
          </div>
        </div>

        {/* Grid */}
        {filteredMartyrs && filteredMartyrs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMartyrs.map((martyr) => (
              <AdminMartyrCard 
                key={martyr.id} 
                martyr={martyr} 
                onEdit={(id) => navigate(`/admin/martyrs/${id}/edit`)}
                onDelete={handleDeleteClick}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-neutral-300 border-dashed p-16 text-center bg-white/30">
            <p className="text-neutral-500 uppercase tracking-widest font-bold">
              {searchQuery ? 'NO MARTYRS MATCH YOUR SEARCH.' : 'NO MARTYRS CATALOGED YET.'}
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title="DELETE MARTYR RECORD"
        description={`Are you sure you want to permanently delete the record for ${confirmState.martyrName || 'this individual'}? This will also eradicate all associated memories and metadata. This action is irreversible.`}
        confirmLabel="DELETE FOREVER"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, martyrId: null, martyrName: null })}
      />
    </div>
  );
}
