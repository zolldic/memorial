import { format } from 'date-fns';
import { User, Edit2, Trash2 } from 'lucide-react';
import type { MartyrListItem } from './useMartyrsAdmin';

interface AdminMartyrCardProps {
  martyr: MartyrListItem;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}

export function AdminMartyrCard({ martyr, onEdit, onDelete, isDeleting }: AdminMartyrCardProps) {
  return (
    <div className="bg-background border-2 border-neutral-300 hover:border-neutral-900 transition-colors flex flex-col">
      {/* Image */}
      <div className="relative h-56 bg-neutral-200 border-b-2 border-neutral-300 grayscale hover:grayscale-0 transition-all duration-500">
        {martyr.imageUrl ? (
          <img
            src={martyr.imageUrl}
            alt={martyr.nameEn}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={48} className="text-neutral-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-bold uppercase tracking-tight text-neutral-900 mb-1 line-clamp-1">
            {martyr.nameEn || martyr.nameAr}
          </h3>
          {martyr.nameAr && (
            <p className="text-lg font-bold text-neutral-700 mb-4" dir="rtl">
              {martyr.nameAr}
            </p>
          )}

          <div className="space-y-3 text-sm text-neutral-700 font-mono tracking-wide uppercase mb-6 bg-neutral-100/50 p-4 border border-neutral-200">
            {martyr.age && (
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">AGE</span>
                <span className="font-bold">{martyr.age}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500">DATE</span>
              <span className="font-bold">{format(new Date(martyr.dateOfMartyrdom), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">CANDLES</span>
              <span className="font-bold">{martyr.candlesCount}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t-2 border-neutral-200 mt-auto">
          <button
            onClick={() => onEdit(martyr.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 text-neutral-900 border-2 border-neutral-300 hover:border-neutral-900 hover:bg-neutral-200 transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(martyr.id, martyr.nameEn)}
            disabled={isDeleting}
            className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors font-bold disabled:opacity-50"
            aria-label={`Delete ${martyr.nameEn}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
