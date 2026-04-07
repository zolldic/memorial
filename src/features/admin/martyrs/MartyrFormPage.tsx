import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMartyrForEdit, useCreateMartyr, useUpdateMartyr, useUploadMartyrImage } from './useMartyrsAdmin';
import { MartyrFormData } from './martyrsService';
import { ArrowLeft, Upload, X } from 'lucide-react';

export function MartyrFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: existingData, isLoading: loadingData } = useMartyrForEdit(id);
  const createMutation = useCreateMartyr();
  const updateMutation = useUpdateMartyr();
  const uploadMutation = useUploadMartyrImage();

  const [formData, setFormData] = useState<MartyrFormData>({
    nameEn: '',
    nameAr: '',
    age: undefined,
    locationEn: '',
    locationAr: '',
    professionEn: '',
    professionAr: '',
    storyEn: '',
    storyAr: '',
    dateOfMartyrdom: '',
    imageUrl: undefined,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
      if (existingData.imageUrl) {
        setImagePreview(existingData.imageUrl);
      }
    }
  }, [existingData]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, imageUrl: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = formData.imageUrl;

    // Upload new image if selected
    if (imageFile) {
      const result = await uploadMutation.mutateAsync(imageFile);
      if (result.success && result.url) {
        imageUrl = result.url;
      } else {
        return; // Stop if upload failed
      }
    }

    const dataToSubmit = { ...formData, imageUrl };

    if (isEditing && id) {
      const result = await updateMutation.mutateAsync({ id, data: dataToSubmit });
      if (result.data?.success !== false) {
        navigate('/admin/martyrs');
      }
    } else {
      const result = await createMutation.mutateAsync(dataToSubmit);
      if (result.data?.success !== false) {
        navigate('/admin/martyrs');
      }
    }
  };

  if (isEditing && loadingData) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-neutral-200 rounded" />
          <div className="h-96 bg-neutral-200 rounded" />
        </div>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/martyrs')}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Martyrs
        </button>
        <h1 className="text-3xl font-bold text-neutral-900">
          {isEditing ? 'Edit Martyr' : 'Add New Martyr'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Profile Image</h2>
          
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border border-neutral-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-48 h-48 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="text-center">
                <Upload className="mx-auto mb-2 text-neutral-400" size={32} />
                <p className="text-sm text-neutral-600">Click to upload</p>
                <p className="text-xs text-neutral-400 mt-1">Max 5MB</p>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Full name in English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name (Arabic) *
              </label>
              <input
                type="text"
                required
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="الاسم الكامل بالعربية"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Age
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date of Martyrdom *
              </label>
              <input
                type="date"
                required
                value={formData.dateOfMartyrdom}
                onChange={(e) => setFormData({ ...formData, dateOfMartyrdom: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location (English) *
              </label>
              <input
                type="text"
                required
                value={formData.locationEn}
                onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location (Arabic) *
              </label>
              <input
                type="text"
                required
                value={formData.locationAr}
                onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="المدينة، البلد"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Profession */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Profession</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Profession (English) *
              </label>
              <input
                type="text"
                required
                value={formData.professionEn}
                onChange={(e) => setFormData({ ...formData, professionEn: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Occupation or role"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Profession (Arabic) *
              </label>
              <input
                type="text"
                required
                value={formData.professionAr}
                onChange={(e) => setFormData({ ...formData, professionAr: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="المهنة أو الدور"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Their Story</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Story (English) *
              </label>
              <textarea
                required
                value={formData.storyEn}
                onChange={(e) => setFormData({ ...formData, storyEn: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Tell their story..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Story (Arabic) *
              </label>
              <textarea
                required
                value={formData.storyAr}
                onChange={(e) => setFormData({ ...formData, storyAr: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="احكِ قصتهم..."
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/martyrs')}
            disabled={isSubmitting}
            className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Martyr' : 'Create Martyr'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
