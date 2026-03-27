import React from 'react'
import Link from 'next/link'
import { login, signInWithGoogle, signInWithApple } from '@/app/actions/auth'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-primary/8 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 -left-20 w-64 h-64 bg-secondary/8 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

      {/* Logo / top branding — stays at top but doesn't use a fixed header */}
      <div className="flex items-center justify-center pt-16 pb-2" style={{ paddingTop: 'max(4rem, env(safe-area-inset-top, 4rem))' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary text-[28px]" aria-hidden="true">directions_bus</span>
          </div>
          <span className="text-2xl font-extrabold text-primary tracking-tight font-headline">Church Rides</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col justify-center px-6 pb-8 max-w-md w-full mx-auto">
        {/* Welcome */}
        <div className="mb-8 mt-4 text-center">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline mb-2">Welcome back 🙏</h1>
          <p className="text-on-surface-variant text-sm">Sign in to your account to continue.</p>
        </div>

        {/* Alerts */}
        {(error || message) && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${error ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
            {error || message}
          </div>
        )}

        {/* Login form */}
        <form action={login} className="space-y-5" id="login-form">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="email">
              Email address
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

          {/* Password */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline underline-offset-2">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]" aria-hidden="true">lock</span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full h-14 pl-12 pr-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-outline text-sm outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            className="btn-active w-full h-14 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base mt-2"
          >
            Sign In
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_forward</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-outline-variant/30" />
          <span className="text-xs text-on-surface-variant font-medium">or continue with</span>
          <div className="h-px flex-1 bg-outline-variant/30" />
        </div>

        {/* Social login */}
        <div className="grid grid-cols-2 gap-3">
          <form action={signInWithGoogle} className="w-full">
            <button
              type="submit"
              id="google-signin-btn"
              className="btn-active w-full h-12 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </form>
          <form action={signInWithApple} className="w-full">
            <button
              type="submit"
              id="apple-signin-btn"
              className="btn-active w-full h-12 rounded-2xl bg-[#1a1c1c] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.78-.04 1.94-.78 3.31-.72 1.6.06 2.87.69 3.65 1.83-3.1 1.76-2.5 5.92.54 7.23-.74 1.82-1.74 3.52-2.58 4.85zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.41-2.04 4.35-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-on-surface-variant mt-8">
          New to Church Rides?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-2">
            Create an account
          </Link>
        </p>
      </main>
    </div>
  )
}
