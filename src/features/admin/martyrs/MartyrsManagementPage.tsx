import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMartyrsAdmin, useDeleteMartyr } from './useMartyrsAdmin';
import { Search, Plus, Edit2, Trash2, Calendar, User, Flame } from 'lucide-react';
import { format } from 'date-fns';

export function MartyrsManagementPage() {
  const navigate = useNavigate();
  const { data: martyrs, isLoading } = useMartyrsAdmin();
  const deleteMutation = useDeleteMartyr();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMartyrs = martyrs?.filter(m => 
    m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.nameAr.includes(searchQuery) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete ${name}? This will also delete all associated memories and cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-neutral-200 rounded" />
          <div className="h-12 bg-neutral-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Martyrs Management</h1>
            <p className="text-neutral-600">
              Manage martyr profiles and information
              <span className="ml-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                {martyrs?.length || 0} total
              </span>
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/martyrs/new')}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            <Plus size={20} />
            Add Martyr
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredMartyrs && filteredMartyrs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMartyrs.map((martyr) => (
            <div
              key={martyr.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-neutral-100">
                {martyr.imageUrl ? (
                  <img
                    src={martyr.imageUrl}
                    alt={martyr.nameEn}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={64} className="text-neutral-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-1">
                  {martyr.nameEn || martyr.nameAr}
                </h3>
                {martyr.nameAr && (
                  <p className="text-sm text-neutral-600 mb-3" dir="rtl">
                    {martyr.nameAr}
                  </p>
                )}

                <div className="space-y-2 text-sm text-neutral-600 mb-4">
                  {martyr.age && (
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>Age {martyr.age}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{format(new Date(martyr.dateOfMartyrdom), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame size={14} />
                    <span>{martyr.candlesCount} candles lit</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/martyrs/${martyr.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(martyr.id, martyr.nameEn)}
                    disabled={deleteMutation.isPending}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
          <p className="text-neutral-600">
            {searchQuery ? 'No martyrs found matching your search.' : 'No martyrs yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
