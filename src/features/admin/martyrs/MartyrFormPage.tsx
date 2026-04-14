import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useMartyrForEdit, useCreateMartyr, useUpdateMartyr, useUploadMartyrImage } from './useMartyrsAdmin';
import { MartyrFormData } from './martyrsService';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { toast } from 'sonner';
import { IdentityStep } from './steps/IdentityStep';
import { StoryStep } from './steps/StoryStep';
import { MediaStep } from './steps/MediaStep';
import { ReviewStep } from './steps/ReviewStep';

const STEPS = ['Identity & Demographics', 'Their Story', 'Media', 'Review'];

export function MartyrFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: existingData, isLoading: loadingData } = useMartyrForEdit(id);
  const createMutation = useCreateMartyr();
  const updateMutation = useUpdateMartyr();
  const uploadMutation = useUploadMartyrImage();

  const [currentStep, setCurrentStep] = useState(0);

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
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
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
  };

  const validateStep = (step: number) => {
    if (step === 0) {
      if (!formData.nameEn && !formData.nameAr) return 'At least one name is required';
      if (!formData.dateOfMartyrdom) return 'Date of martyrdom is required';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      toast.error(error);
      return;
    }
    setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const error = validateStep(currentStep);
    if (error) {
      toast.error(error);
      return;
    }

    let imageUrl = formData.imageUrl;

    if (imageFile) {
      const result = await uploadMutation.mutateAsync(imageFile);
      if (result.success && result.url) {
        imageUrl = result.url;
      } else {
        toast.error('Failed to upload image');
        return;
      }
    }

    const dataToSubmit = { ...formData, imageUrl };

    if (isEditing && id) {
      const result = await updateMutation.mutateAsync({ id, data: dataToSubmit });
      if (result.success) {
        navigate('/admin/martyrs');
      }
    } else {
      const result = await createMutation.mutateAsync(dataToSubmit);
      if (result.success) {
        navigate('/admin/martyrs');
      }
    }
  };

  if (isEditing && loadingData) {
    return (
      <div className="p-6 md:p-10 min-h-screen bg-background texture-lines">
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          <div className="h-10 w-64 bg-neutral-300 border border-neutral-400" />
          <div className="h-[600px] bg-neutral-300 border border-neutral-400" />
        </div>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-background texture-lines">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link
              to="/admin/martyrs"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 font-bold uppercase tracking-widest text-xs transition-colors"
            >
              <ArrowLeft size={16} /> BACK TO MARTYRS
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-neutral-900">
              {isEditing ? 'EDIT RECORD' : 'NEW RECORD'}
            </h1>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className={`flex-1 min-w-[120px] pb-4 border-b-4 transition-colors ${
                idx === currentStep
                  ? 'border-neutral-900 text-neutral-900'
                  : idx < currentStep
                  ? 'border-neutral-500 text-neutral-500'
                  : 'border-neutral-200 text-neutral-400'
              }`}
            >
              <p className="text-xs font-bold font-mono tracking-widest uppercase mb-1">
                STEP 0{idx + 1}
              </p>
              <p className="font-bold text-sm tracking-wide uppercase line-clamp-1">{step}</p>
            </div>
          ))}
        </div>

        <div className="bg-background border-2 border-neutral-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] p-0">
          <div className="p-8">
            {currentStep === 0 && (
              <IdentityStep formData={formData} setFormData={setFormData} />
            )}

            {currentStep === 1 && (
              <StoryStep formData={formData} setFormData={setFormData} />
            )}

            {currentStep === 2 && (
              <MediaStep 
                imagePreview={imagePreview} 
                handleImageSelect={handleImageSelect} 
                handleRemoveImage={handleRemoveImage} 
              />
            )}

            {currentStep === 3 && (
              <ReviewStep formData={formData} imagePreview={imagePreview} />
            )}
          </div>

          <div className="bg-neutral-100 border-t-2 border-neutral-300 p-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0 || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-green-700 text-white font-bold uppercase tracking-widest text-sm hover:bg-green-800 transition-colors border-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={16} /> {isEditing ? 'COMMIT EDITS' : 'PUBLISH RECORD'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
