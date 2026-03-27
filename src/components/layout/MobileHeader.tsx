import Link from 'next/link';
import { signOut } from '@/app/actions/auth';

interface MobileHeaderProps {
  title: string;
  backHref?: string;
  showSignOut?: boolean;
  /** Extra action button rendered to the right of the title */
  action?: React.ReactNode;
}

export default function MobileHeader({ title, backHref, showSignOut = false, action }: MobileHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Left: back button */}
      <div className="w-10 shrink-0">
        {backHref && (
          <Link
            href={backHref}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">
              arrow_back
            </span>
          </Link>
        )}
      </div>

      {/* Center: title */}
      <h1 className="flex-1 text-center text-base font-bold text-on-surface tracking-tight truncate px-2">
        {title}
      </h1>

      {/* Right: action or sign out */}
      <div className="w-10 shrink-0 flex justify-end">
        {action}
        {showSignOut && !action && (
          <form action={signOut}>
            <button
              type="submit"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 transition-colors"
              aria-label="Sign out"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">
                logout
              </span>
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
