import { MartyrFormData } from '../martyrsService';

interface IdentityStepProps {
  formData: MartyrFormData;
  setFormData: (data: MartyrFormData) => void;
}

export function IdentityStep({ formData, setFormData }: IdentityStepProps) {
  const handleChange = (field: keyof MartyrFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">Name (English) *</label>
          <input 
            type="text" 
            value={formData.nameEn} 
            onChange={e => handleChange('nameEn', e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors uppercase"
          />
        </div>
        <div dir="rtl">
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2 text-right">Name (Arabic) *</label>
          <input 
            type="text" 
            value={formData.nameAr} 
            onChange={e => handleChange('nameAr', e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">Age</label>
          <input 
            type="number" 
            value={formData.age || ''} 
            onChange={e => handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">Date of Martyrdom *</label>
          <input 
            type="date" 
            value={formData.dateOfMartyrdom} 
            onChange={e => handleChange('dateOfMartyrdom', e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors uppercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">Profession (English)</label>
          <input 
            type="text" 
            value={formData.professionEn || ''} 
            onChange={e => handleChange('professionEn', e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors uppercase"
          />
        </div>
        <div dir="rtl">
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2 text-right">Profession (Arabic)</label>
          <input 
            type="text" 
            value={formData.professionAr || ''} 
            onChange={e => handleChange('professionAr', e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">Location (English)</label>
          <input 
            type="text" 
            value={formData.locationEn || ''} 
            onChange={e => handleChange('locationEn', e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors uppercase"
          />
        </div>
        <div dir="rtl">
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2 text-right">Location (Arabic)</label>
          <input 
            type="text" 
            value={formData.locationAr || ''} 
            onChange={e => handleChange('locationAr', e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border-2 border-neutral-300 focus:border-neutral-900 focus:ring-0 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
