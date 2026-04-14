import { useState } from 'react';
import { PendingMemory } from './moderationService';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Edit2, Save, X, Calendar, User, Heart, Image as ImageIcon, Mic } from 'lucide-react';

interface MemoryCardProps {
  memory: PendingMemory;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSave: (id: string, contentEn: string, contentAr: string) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
  isUpdating: boolean;
}

export function MemoryCard({ 
  memory, 
  onApprove, 
  onReject, 
  onSave, 
  isApproving, 
  isRejecting, 
  isUpdating 
}: MemoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEn, setEditedEn] = useState(memory.contentEn);
  const [editedAr, setEditedAr] = useState(memory.contentAr);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedEn(memory.contentEn);
    setEditedAr(memory.contentAr);
  };

  const handleSaveClick = async () => {
    await onSave(memory.id, editedEn, editedAr);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedEn(memory.contentEn);
    setEditedAr(memory.contentAr);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              {memory.martyrName.en || memory.martyrName.ar}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
              <span className="flex items-center gap-1">
                <User size={14} />
                {memory.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {memory.relationship}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {format(new Date(memory.submittedAt), 'MMM d, yyyy')}
              </span>
            </div>
            {((memory.photoUrls && memory.photoUrls.length > 0) || memory.audioUrl) && (
              <div className="flex items-center gap-2 mt-2">
                {memory.photoUrls && memory.photoUrls.length > 0 && (
                  <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    <ImageIcon size={12} />
                    {memory.photoUrls.length > 1 ? `${memory.photoUrls.length} Photos` : 'Photo'}
                  </span>
                )}
                {memory.audioUrl && (
                  <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    <Mic size={12} />
                    Audio
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={handleEditClick}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit translations"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onApprove(memory.id)}
                  disabled={isApproving}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Approve"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={() => onReject(memory.id)}
                  disabled={isRejecting}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Reject"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSaveClick}
                  disabled={isUpdating}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Save"
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={handleCancelClick}
                  className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* English */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              English Content
            </label>
            {isEditing ? (
              <textarea
                value={editedEn}
                onChange={(e) => setEditedEn(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="English translation..."
              />
            ) : (
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 min-h-[8rem]">
                {memory.contentEn || (
                  <span className="text-neutral-400 italic">No English translation</span>
                )}
              </div>
            )}
          </div>

          {/* Arabic */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Arabic Content (العربية)
            </label>
            {isEditing ? (
              <textarea
                value={editedAr}
                onChange={(e) => setEditedAr(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="الترجمة العربية..."
                dir="rtl"
              />
            ) : (
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 min-h-[8rem]" dir="rtl">
                {memory.contentAr || (
                  <span className="text-neutral-400 italic">لا توجد ترجمة عربية</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Media Preview */}
        {((memory.photoUrls && memory.photoUrls.length > 0) || memory.audioUrl) && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h4 className="text-sm font-semibold text-neutral-700 mb-3">Attached Media</h4>
            <div className="flex gap-4">
              {memory.photoUrls && memory.photoUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {memory.photoUrls.map((photoUrl, idx) => (
                    <img
                      key={`${memory.id}-admin-photo-${idx}`}
                      src={photoUrl}
                      alt={`Memory photo ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-neutral-200"
                    />
                  ))}
                </div>
              )}
              {memory.audioUrl && (
                <div className="flex-1">
                  <audio controls className="w-full max-w-md">
                    <source src={memory.audioUrl} type="audio/webm" />
                    <source src={memory.audioUrl} type="audio/mp4" />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
