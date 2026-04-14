import { MartyrFormData } from '../martyrsService';

interface StoryStepProps {
  formData: MartyrFormData;
  setFormData: (data: MartyrFormData) => void;
}

export function StoryStep({ formData, setFormData }: StoryStepProps) {
  const handleChange = (field: keyof MartyrFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">Life Story (English)</label>
        <textarea 
          value={formData.storyEn || ''} 
          onChange={e => handleChange('storyEn', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors resize-none"
        />
      </div>
      <div dir="rtl">
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2 text-right">Life Story (Arabic)</label>
        <textarea 
          value={formData.storyAr || ''} 
          onChange={e => handleChange('storyAr', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors resize-none"
        />
      </div>
    </div>
  );
}
