import React from 'react'
import Link from 'next/link'
import { login, signInWithGoogle, signInWithApple } from '@/app/actions/auth'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { error, message } = await searchParams;

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#f9f9f8]/80 backdrop-blur-xl flex justify-between items-center px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">church</span>
          <span className="text-xl font-bold text-primary tracking-tight font-headline">The Sanctuary</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md space-y-12">
          {/* Welcome Header */}
          <section className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container mb-2">
              <span className="material-symbols-outlined text-on-secondary-container text-3xl" aria-hidden="true">auto_awesome</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary font-headline">Welcome home.</h1>
            <p className="text-on-surface-variant font-medium max-w-[280px] mx-auto leading-relaxed">
              Join your community in shared journeys and prayerful connections.
            </p>
          </section>

          {/* Form Alerts */}
          {(error || message) && (
            <div className={`p-4 rounded-xl text-sm font-medium ${error ? 'bg-error-container text-error' : 'bg-primary-container text-primary'}`}>
              {error || message}
            </div>
          )}

          {/* Login Form */}
          <form action={login} className="space-y-8">
            <div className="space-y-6">
              {/* Email Field */}
              <div className="relative group">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1" htmlFor="email">Email address</label>
                <div className="relative">
                  <input className="w-full bg-transparent border-none outline-none border-b-2 border-surface-container-highest focus:ring-0 focus:border-primary px-1 py-3 text-on-surface placeholder:text-outline transition-all duration-300" id="email" name="email" placeholder="name@example.com" type="email" required />
                </div>
              </div>
              {/* Password Field */}
              <div className="relative group">
                <div className="flex justify-between items-end mb-2 ml-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                </div>
                <div className="relative">
                  <input className="w-full bg-transparent border-none outline-none border-b-2 border-surface-container-highest focus:ring-0 focus:border-primary px-1 py-3 text-on-surface placeholder:text-outline transition-all duration-300" id="password" name="password" placeholder="••••••••" type="password" required />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">visibility_off</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              <button className="w-full bg-primary text-on-primary font-bold py-5 rounded-full shadow-lg shadow-[#00342b]/10 hover:bg-primary-container transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2" type="submit">
                Sign In
                <span className="material-symbols-outlined text-xl" aria-hidden="true">arrow_forward</span>
              </button>
              
              <div className="flex items-center gap-4 py-2">
                <div className="h-px w-full bg-outline-variant/30"></div>
                <span className="text-sm text-on-surface-variant shrink-0">Or continue with</span>
                <div className="h-px w-full bg-outline-variant/30"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form action={signInWithGoogle} className="w-full">
                  <button type="submit" className="w-full py-4 rounded-full border border-outline-variant/50 text-on-surface font-semibold hover:bg-surface-container-low transition-colors flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                </form>
                <form action={signInWithApple} className="w-full">
                  <button type="submit" className="w-full py-4 rounded-full bg-[#1a1c1c] text-white font-semibold hover:bg-black transition-colors flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.78-.04 1.94-.78 3.31-.72 1.6.06 2.87.69 3.65 1.83-3.1 1.76-2.5 5.92.54 7.23-.74 1.82-1.74 3.52-2.58 4.85zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.41-2.04 4.35-3.74 4.25z"/></svg>
                    Apple
                  </button>
                </form>
              </div>
            </div>
          </form>

          {/* Footer Links */}
          <footer className="space-y-6 text-center">
            <div className="flex flex-col gap-4">
              <Link className="text-primary font-semibold text-sm hover:underline decoration-2 underline-offset-4 transition-all" href="/forgot-password">
                Forgot your password?
              </Link>
              <div className="h-px w-12 bg-outline-variant/30 mx-auto"></div>
              <p className="text-on-surface-variant text-sm">
                New to The Sanctuary? 
                <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1" href="/signup">
                  Create an account
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[40%] bg-secondary-fixed opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute top-[60%] -left-[10%] w-[50%] h-[50%] bg-primary-fixed opacity-10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-[265px] opacity-10">
          <img className="w-full h-full object-cover object-bottom" alt="church windows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1VExBGXu1C_7WYdEPBRsluKPKaH132QpY1JHDVQQnZg12COXFWfcnMPFNjAmLI3Cnqa-hqaEQt6qFqpCcm9eRvKROPiuVKPjPhkmp-E1Ezj7sMfM7MbQHXlWdeppBiJ6txILR8eyhnIK6YHf5wO6coes8yS_jlY5YcOxeVG39LfaHoTV_g7EfSxHj-5EpbQ4cTAxw4t5JaaMHuw2maTMbb8kcz_CSlt8WJywzBotZwPGU6lJpz1SF8anGws7sCOEiWiLK857yTDs" style={{maskImage: 'linear-gradient(to top, black, transparent)'}} />
        </div>
      </div>
    </>
  )
}
