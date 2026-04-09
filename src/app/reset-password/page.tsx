import React from 'react'
import Link from 'next/link'
import { updatePassword } from './actions'

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { error, message } = await searchParams

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-primary/8 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <div className="flex items-center px-4 h-14" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <Link
          href="/login"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          aria-label="Back to login"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">arrow_back</span>
        </Link>
        <span className="ml-3 text-sm font-semibold text-on-surface-variant">Back to Sign in</span>
      </div>

      <main className="flex-1 flex flex-col justify-center px-6 pb-12 max-w-md w-full mx-auto">
        {/* Icon + heading */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-surface-container mb-5">
            <span className="material-symbols-outlined text-primary text-[40px]" aria-hidden="true">lock</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline mb-3">Set New Password</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto">
            Choose a strong new password for your account.
          </p>
        </div>

        {/* Alerts */}
        {(error || message) && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${error ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
            {error || message}
          </div>
        )}

        {/* Form */}
        <form action={updatePassword} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]" aria-hidden="true">lock</span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full h-14 pl-12 pr-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-outline text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="confirm_password">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]" aria-hidden="true">lock_open</span>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Re-enter password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full h-14 pl-12 pr-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-outline text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-active w-full h-14 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">check_circle</span>
            Update Password
          </button>
        </form>
      </main>
    </div>
  )
}
