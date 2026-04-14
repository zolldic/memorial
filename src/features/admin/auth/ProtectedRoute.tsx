import { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { t } = useTranslation('auth');
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md border border-border bg-card p-8 text-center" role="status" aria-live="polite">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">{t('route.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background px-6 py-12 text-foreground texture-lines">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 border border-border bg-card p-8 md:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t('route.kicker')}</p>
          <h2 className="font-serif text-4xl leading-tight">{t('route.accessDeniedTitle')}</h2>
          <p className="text-base leading-8 text-muted-foreground">{t('route.accessDeniedMessage')}</p>
          <p className="text-sm text-muted-foreground">{t('route.accessDeniedHint')}</p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center border border-primary bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground"
            >
              {t('route.returnHome')}
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center justify-center border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-foreground"
            >
              {t('route.requestAccess')}
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center justify-center border border-border px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-foreground"
              type="button"
            >
              {t('route.signOut')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
