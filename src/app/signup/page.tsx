import React from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { error, message } = await searchParams;

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#f9f9f8]/80 dark:bg-[#1a1c1c]/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,52,43,0.06)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[#3f4945] dark:text-[#afcbd8] hover:bg-[#eeeeed] dark:hover:bg-[#3f4945] p-2 rounded-full transition-colors duration-300">
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          </Link>
          <span className="font-headline text-xl font-bold text-[#00342b] dark:text-[#ffffff]">The Sanctuary</span>
        </div>
      </header>

      <main className="min-h-screen pt-24 pb-32 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Asymmetric Visual Side */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              <img className="w-full h-full object-cover" alt="Peaceful interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG77DVkGm_eL-9TzgT5dT25YL2_wfcvN1u8yPRjBiqCh9Btik397GZTM2kM6VUsvxxDYVFTG2PaAft-mAG40jz-R-RBrlmFyOjGIx587RwSJ2PRPM2S3y87CN2UZQ7WCJ4iLos86RfeqLWjESrquv02mppLJmizpQ_e-oD1CFB7xWpqJxobUeGjyPAfgIBgGasRafkT_t-BEmlkRKrZtf-KPj3tXVUOsEwEwsrsB57mxzSgtaEI4jjD4-ktRWoQNT9LI3QopM7C5c"/>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary-container p-8 rounded-xl shadow-lg max-w-[240px]">
              <p className="text-on-secondary-container font-medium leading-relaxed italic">
                &quot;Where two or three gather in my name, there am I with them.&quot;
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start space-y-12">
            <header className="text-center lg:text-left space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight font-headline">
                Join the Sanctuary
              </h1>
              <p className="text-on-surface-variant text-lg max-w-md">
                Enter your details to start your journey. A supportive community and peaceful ride await you.
              </p>
            </header>

            {/* Form Alerts */}
            {(error || message) && (
              <div className={`p-4 w-full max-w-md rounded-xl text-sm font-medium ${error ? 'bg-error-container text-error' : 'bg-primary-container text-primary'}`}>
                {error || message}
              </div>
            )}

            <form action={signup} className="w-full max-w-md space-y-8">
              <div className="space-y-6">
                <div className="group relative">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Full Name</label>
                  <input className="w-full bg-transparent border-0 border-b-2 border-surface-container-highest py-3 px-0 focus:ring-0 focus:border-primary transition-colors duration-300 placeholder:text-outline-variant/60 outline-none" name="full_name" placeholder="Sarah Jenkins" type="text" required />
                </div>
                <div className="group relative">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Email Address</label>
                  <input className="w-full bg-transparent border-0 border-b-2 border-surface-container-highest py-3 px-0 focus:ring-0 focus:border-primary transition-colors duration-300 placeholder:text-outline-variant/60 outline-none" name="email" placeholder="sarah@example.com" type="email" required />
                </div>
                <div className="group relative">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Password</label>
                  <input className="w-full bg-transparent border-0 border-b-2 border-surface-container-highest py-3 px-0 focus:ring-0 focus:border-primary transition-colors duration-300 placeholder:text-outline-variant/60 outline-none" name="password" placeholder="••••••••" type="password" required />
                </div>
              </div>

              <div className="pt-4 flex flex-col items-center lg:items-start gap-6">
                <button className="w-full py-4 px-8 bg-primary text-on-primary rounded-full font-semibold text-lg hover:bg-primary-container transition-all duration-300 shadow-lg shadow-primary/10" type="submit">
                  Create Account
                </button>
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px w-8 bg-outline-variant/30"></div>
                  <span className="text-sm text-on-surface-variant">Already have an account?</span>
                  <div className="h-px w-8 bg-outline-variant/30"></div>
                </div>
                <Link href="/login" className="text-primary font-bold text-sm hover:underline transition-all">
                  Sign in to your account
                </Link>
              </div>
            </form>

            <div className="bg-surface-container-low p-6 rounded-xl w-full max-w-md">
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-secondary" aria-hidden="true">shield</span>
                <p className="text-xs leading-relaxed text-on-surface-variant">
                  By joining, you agree to our <span className="text-primary font-semibold">Terms of Service</span> and <span className="text-primary font-semibold">Community Guidelines</span>. We value your privacy and data security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
