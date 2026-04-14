import { X, Upload } from 'lucide-react';

interface MediaStepProps {
  imagePreview: string;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

export function MediaStep({ imagePreview, handleImageSelect, handleRemoveImage }: MediaStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-4">Portrait / Media</label>
        {imagePreview ? (
          <div className="relative inline-block border-2 border-neutral-300 p-2 bg-white">
            <img src={imagePreview} alt="Preview" className="w-64 h-64 object-cover grayscale block" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-3 -right-3 p-2 bg-red-600 text-white hover:bg-black transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-400 hover:border-neutral-900 bg-white/50 hover:bg-neutral-50 transition-colors cursor-pointer group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload size={32} className="mb-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-900">Click to upload portrait</p>
              <p className="text-xs text-neutral-500 font-mono">PNG, JPG or WebP (MAX. 5MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
          </label>
        )}
      </div>
    </div>
  );
}
