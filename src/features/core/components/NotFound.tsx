import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function NotFound() {
  const { t } = useTranslation('common');
  const { lang } = useLanguage();
  const isRtl = lang === 'ar';

  return (
    <div className="py-16 md:py-24 lg:py-32 min-h-[60vh] flex items-center">
      <section className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="text-8xl md:text-9xl font-serif font-bold tracking-tight text-muted-foreground/30">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-tight mb-6">
          {t('notFound.title')}
        </h1>

        {/* Message */}
        <p className="text-xl font-body leading-relaxed text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t('notFound.message')}
        </p>

        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 border-2 border-border hover:bg-foreground hover:text-background transition-colors duration-500 ease-out font-mono text-sm uppercase tracking-wider"
        >
          <ArrowLeft 
            size={18} 
            strokeWidth={1.5} 
            className={isRtl ? 'rotate-180' : ''} 
          />
          {t('notFound.backHome')}
          <Home size={18} strokeWidth={1.5} />
        </Link>
      </section>
    </div>
  );
}
