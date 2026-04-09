'use client';

import { useSearchParams } from 'next/navigation';

/**
 * Reads ?message= and ?error= from the URL and renders
 * a dismissible banner. Must be wrapped in <Suspense>.
 */
export default function ProfileAlerts() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  if (!message && !error) return null;

  return (
    <div className="mt-4 space-y-2">
      {message && (
        <div
          role="status"
          className="flex items-center gap-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl px-4 py-3 text-sm font-semibold animate-in fade-in"
        >
          <span className="material-symbols-outlined text-[18px] shrink-0" aria-hidden="true">
            check_circle
          </span>
          {message}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 bg-error/10 text-error border border-error/20 rounded-2xl px-4 py-3 text-sm font-semibold animate-in fade-in"
        >
          <span className="material-symbols-outlined text-[18px] shrink-0" aria-hidden="true">
            error
          </span>
          {error}
        </div>
      )}
    </div>
  );
}
