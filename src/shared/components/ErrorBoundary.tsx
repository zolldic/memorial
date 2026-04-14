import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private resetBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  private getFriendlyMessage(error: Error | null): string {
    if (!error) {
      return 'We encountered an unexpected error. Please refresh the page to continue.';
    }

    const message = error.message.toLowerCase();
    if (message.includes('loading chunk') || message.includes('failed to fetch dynamically imported module')) {
      return 'A new version is available or a module failed to load. Refresh to continue.';
    }

    if (message.includes('network') || message.includes('failed to fetch')) {
      return 'A network error interrupted the page. Check your connection and try again.';
    }

    return 'We encountered an unexpected error. Please refresh the page to continue.';
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center">
            <div className="border-4 border-border p-12 bg-background">
              <h1 className="font-serif text-4xl font-bold mb-6">
                Something went wrong
              </h1>
              <p className="font-body text-lg text-muted-foreground mb-8">
                {this.getFriendlyMessage(this.state.error)}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={this.resetBoundary}
                  className="border border-border px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-muted transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors"
                >
                  Refresh Page
                </button>
              </div>
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="font-mono text-xs uppercase tracking-widest cursor-pointer mb-4">
                    Error Details (Development Only)
                  </summary>
                  <pre className="p-4 bg-muted border border-border text-xs overflow-auto">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
