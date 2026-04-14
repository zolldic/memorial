type ErrorKind = 'auth' | 'network' | 'database' | 'unknown';

export interface AppErrorInfo {
  kind: ErrorKind;
  message: string;
  retryable: boolean;
  code?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function toAppError(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred.'
): AppErrorInfo {
  if (!error) {
    return {
      kind: 'unknown',
      message: fallbackMessage,
      retryable: false,
    };
  }

  if (error instanceof Error) {
    const lowered = error.message.toLowerCase();

    if (
      lowered.includes('failed to fetch') ||
      lowered.includes('network') ||
      lowered.includes('timeout') ||
      lowered.includes('offline')
    ) {
      return {
        kind: 'network',
        message: 'Network error. Check your connection and try again.',
        retryable: true,
      };
    }

    if (
      lowered.includes('jwt') ||
      lowered.includes('session') ||
      lowered.includes('token') ||
      lowered.includes('invalid login') ||
      lowered.includes('auth')
    ) {
      return {
        kind: 'auth',
        message: 'Authentication session issue. Please sign in again.',
        retryable: false,
      };
    }

    return {
      kind: 'unknown',
      message: error.message || fallbackMessage,
      retryable: false,
    };
  }

  if (isRecord(error)) {
    const code = typeof error.code === 'string' ? error.code : undefined;
    const message = typeof error.message === 'string' ? error.message : fallbackMessage;

    if (code?.startsWith('PGRST') || code?.startsWith('22') || code?.startsWith('23') || code?.startsWith('42')) {
      return {
        kind: 'database',
        message,
        retryable: false,
        code,
      };
    }

    if (code === '401' || code === '403') {
      return {
        kind: 'auth',
        message: 'You are not authorized to perform this action.',
        retryable: false,
        code,
      };
    }

    if (code === '23505') {
      return {
        kind: 'database',
        message: 'This action was already completed.',
        retryable: false,
        code,
      };
    }

    return {
      kind: 'unknown',
      message,
      retryable: false,
      code,
    };
  }

  return {
    kind: 'unknown',
    message: fallbackMessage,
    retryable: false,
  };
}

export function getErrorMessage(error: unknown, fallbackMessage?: string): string {
  return toAppError(error, fallbackMessage).message;
}
