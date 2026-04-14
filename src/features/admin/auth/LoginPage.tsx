import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      toast.success(t('login.success'));
      navigate(from, { replace: true });
    } else {
      const normalizedError = result.error?.toLowerCase() || '';
      const message =
        normalizedError.includes('invalid login credentials') || normalizedError.includes('invalid credentials')
          ? t('login.invalidCredentials')
          : t('login.genericError');
      setErrorMessage(message);
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground texture-lines">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl px-6 py-10 md:grid-cols-[1.2fr_1fr] md:gap-16 md:px-10">
        <section className="flex flex-col justify-center border-b border-border-light pb-10 md:border-b-0 md:border-r md:pr-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t('login.kicker')}</p>
          <h1 className="mt-6 font-serif text-5xl leading-[0.95] text-foreground md:text-6xl">{t('login.title')}</h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground md:text-lg">{t('login.subtitle')}</p>
        </section>

        <section className="flex items-center md:pl-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-7 border border-border bg-card p-7" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {t('login.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
                aria-invalid={Boolean(errorMessage)}
                className="w-full border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t('login.emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {t('login.passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                aria-invalid={Boolean(errorMessage)}
                className="w-full border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t('login.passwordPlaceholder')}
              />
            </div>

            {errorMessage && (
              <div className="border border-border px-4 py-3" role="alert" aria-live="assertive">
                <p className="font-medium text-foreground">{t('login.inlineErrorTitle')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t('login.recoveryHint')}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center border border-primary bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {t('login.submitting')}
                </>
              ) : (
                t('login.submit')
              )}
            </button>

            <p className="text-sm text-muted-foreground">
              {t('login.helpLabel')}{' '}
              <Link to="/work" className="font-medium text-foreground underline underline-offset-4">
                {t('login.helpLink')}
              </Link>
            </p>
          </form>
        </section>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {loading ? t('login.submitting') : ''}
      </div>
    </div>
  );
}
