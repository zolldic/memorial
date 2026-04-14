import { MartyrFormData } from '../martyrsService';

interface ReviewStepProps {
  formData: MartyrFormData;
  imagePreview: string;
}

export function ReviewStep({ formData, imagePreview }: ReviewStepProps) {
  return (
    <div className="space-y-8">
      <div className="bg-neutral-100/50 border border-neutral-200 p-6 flex flex-col md:flex-row gap-8">
          {imagePreview && (
            <div className="shrink-0">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover border-2 border-neutral-300 grayscale" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 mb-1">{formData.nameEn || 'Untitled'}</h3>
            {formData.nameAr && <p className="text-lg font-bold text-neutral-700 mb-4" dir="rtl">{formData.nameAr}</p>}
            
            <div className="grid grid-cols-2 gap-4 text-sm font-mono tracking-wide uppercase mt-4">
              <div>
                <span className="text-neutral-500 block mb-1">Age</span>
                <strong>{formData.age || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block mb-1">Date of Martyrdom</span>
                <strong>{formData.dateOfMartyrdom || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block mb-1">Location</span>
                <strong>{formData.locationEn || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block mb-1">Profession</span>
                <strong>{formData.professionEn || 'N/A'}</strong>
              </div>
            </div>
          </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 text-orange-900">
        <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Final Review</h4>
        <p className="text-sm tracking-wide">Please verify all names, dates, and spelling before committing this record to the immutable archive. Empty story sections can be appended later.</p>
      </div>
    </div>
  );
}
