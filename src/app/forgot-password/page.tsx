import React from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/app/actions/auth'

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-primary/8 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

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
        <span className="ml-3 text-sm font-semibold text-on-surface-variant">Back to Sign in</span>
      </div>

      <main className="flex-1 flex flex-col justify-center px-6 pb-12 max-w-md w-full mx-auto">
        {/* Icon + heading */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-surface-container mb-5">
            <span className="material-symbols-outlined text-primary text-[40px]" aria-hidden="true">lock_reset</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline mb-3">Reset Password</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto">
            Enter the email associated with your account and we&apos;ll send reset instructions.
          </p>
        </div>

        {/* Alerts */}
        {(error || message) && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${error ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
            {error || message}
          </div>
        )}

        {/* Form */}
        <form action={forgotPassword} className="space-y-5" id="forgot-password-form">
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
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="w-full h-14 pl-12 pr-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-outline text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            id="send-reset-btn"
            className="btn-active w-full h-14 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">send</span>
            Send Reset Link
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-2"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_back</span>
          Back to Sign in
        </Link>
      </main>
    </div>
  )
}
