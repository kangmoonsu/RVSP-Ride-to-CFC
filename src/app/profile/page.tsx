import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/actions/auth';
import { updateDisplayName, updatePasswordFromProfile } from '@/app/actions/profile';
import BottomNav from '@/components/layout/BottomNav';
import Link from 'next/link';
import { Suspense } from 'react';
import ProfileAlerts from './ProfileAlerts';

export const metadata = {
  title: 'My Profile | CFC Rides',
  description: 'Manage your name and password for your CFC Rides account.',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: dbUser } = await supabase
    .from('users')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single();

  if (!dbUser) {
    redirect('/login');
  }

  // Derive which dashboard to go back to
  const dashboardHref =
    dbUser.role === 'driver'
      ? '/driver/dashboard'
      : dbUser.role === 'coordinator'
      ? '/coordinator/dashboard'
      : '/rider/dashboard';

  const role = (dbUser.role as 'rider' | 'driver' | 'coordinator') || 'rider';

  // Detect if OAuth user (no password-based login)
  const isOAuthUser = user.app_metadata?.provider !== 'email';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Sticky header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <Link
          href={dashboardHref}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          aria-label="Back to dashboard"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">
            arrow_back
          </span>
        </Link>

        <div className="flex-1 text-center">
          <span className="text-base font-bold text-on-surface">My Profile</span>
        </div>

        {/* Sign out */}
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
      </header>

      {/* Page content */}
      <div
        className="flex-1 pt-14 px-4 max-w-lg mx-auto w-full space-y-6"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Toast alerts (reads search params — needs Suspense) */}
        <Suspense fallback={null}>
          <ProfileAlerts />
        </Suspense>

        {/* ── Avatar + Identity Card ── */}
        <section className="mt-6">
          <div className="bg-primary rounded-3xl p-6 flex items-center gap-4 shadow-md">
            {/* Avatar circle */}
            <div className="w-16 h-16 rounded-full bg-on-primary/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-4xl" aria-hidden="true">
                account_circle
              </span>
            </div>
            <div>
              <p className="text-on-primary/70 text-xs font-bold uppercase tracking-widest mb-0.5">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
              <h1 className="text-on-primary text-xl font-extrabold leading-tight">{dbUser.full_name}</h1>
              <p className="text-on-primary/70 text-sm mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">mail</span>
                {dbUser.email}
              </p>
            </div>
          </div>
        </section>

        {/* ── Change Name ── */}
        <section id="change-name">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">badge</span>
            Display Name
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-5">
            <form action={updateDisplayName} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  defaultValue={dbUser.full_name}
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Your full name"
                  className="w-full h-12 bg-surface-container border border-outline-variant/20 rounded-xl text-sm px-4 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-on-surface"
                />
              </div>
              <button
                type="submit"
                id="save-name-btn"
                className="btn-active w-full h-12 bg-primary text-on-primary font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">save</span>
                Save Name
              </button>
            </form>
          </div>
        </section>

        {/* ── Change Password ── */}
        {!isOAuthUser ? (
          <section id="change-password">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">lock</span>
              Password
            </h2>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-5">
              <form action={updatePasswordFromProfile} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full h-12 bg-surface-container border border-outline-variant/20 rounded-xl text-sm px-4 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-on-surface"
                  />
                </div>
                <div>
                  <label htmlFor="confirm_password" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    required
                    minLength={6}
                    placeholder="Re-enter new password"
                    className="w-full h-12 bg-surface-container border border-outline-variant/20 rounded-xl text-sm px-4 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-on-surface"
                  />
                </div>
                <button
                  type="submit"
                  id="save-password-btn"
                  className="btn-active w-full h-12 bg-secondary text-on-secondary font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">lock_reset</span>
                  Update Password
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section id="change-password">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">lock</span>
              Password
            </h2>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-outline text-[20px]" aria-hidden="true">info</span>
              <p className="text-on-surface-variant text-sm">
                You signed in with a social account. Password management is handled by your provider.
              </p>
            </div>
          </section>
        )}

        {/* ── Danger Zone: Sign Out ── */}
        <section className="pb-2">
          <div className="bg-surface-container-lowest rounded-2xl border border-error/10 shadow-sm p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-error/70 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-error/50 text-[16px]" aria-hidden="true">power_settings_new</span>
              Account
            </h2>
            <form action={signOut}>
              <button
                type="submit"
                id="signout-profile-btn"
                className="btn-active w-full h-12 bg-error/10 text-error font-bold rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-error hover:text-on-error transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">logout</span>
                Sign Out
              </button>
            </form>
          </div>
        </section>
      </div>

      <BottomNav role={role} />
    </div>
  );
}
