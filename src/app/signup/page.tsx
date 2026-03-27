import React from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-secondary/8 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 -left-20 w-64 h-64 bg-primary/8 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <div
        className="flex items-center px-4 h-14"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <Link
          href="/login"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          aria-label="Back to login"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">arrow_back</span>
        </Link>
        <span className="ml-2 text-base font-bold text-primary font-headline">CFC</span>
      </div>

      <main className="flex-1 flex flex-col justify-center px-6 pb-8 max-w-md w-full mx-auto">
        {/* Welcome */}
        <div className="mb-8 mt-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-secondary-container mb-4">
            <span className="material-symbols-outlined text-on-secondary-container text-[32px]" aria-hidden="true">church</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline mb-2">Join CFC</h1>
          <p className="text-on-surface-variant text-sm">A supportive community and peaceful ride await you.</p>
        </div>

        {/* Alerts */}
        {(error || message) && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${error ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
            {error || message}
          </div>
        )}

        {/* Form */}
        <form action={signup} className="space-y-5" id="signup-form">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="full_name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]" aria-hidden="true">person</span>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Sarah Jenkins"
                required
                autoComplete="name"
                className="w-full h-14 pl-12 pr-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-outline text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]" aria-hidden="true">mail</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="sarah@example.com"
                required
                autoComplete="email"
                className="w-full h-14 pl-12 pr-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-outline text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]" aria-hidden="true">lock</span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full h-14 pl-12 pr-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-outline text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            id="create-account-btn"
            className="btn-active w-full h-14 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base mt-2"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">how_to_reg</span>
            Create Account
          </button>
        </form>

        {/* Privacy note */}
        <div className="mt-6 bg-surface-container-low rounded-2xl p-4 flex gap-3 items-start">
          <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0" aria-hidden="true">shield</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            By joining, you agree to our{' '}
            <span className="text-primary font-semibold">Terms of Service</span> and{' '}
            <span className="text-primary font-semibold">Community Guidelines</span>. We value your privacy.
          </p>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-on-surface-variant mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  )
}
