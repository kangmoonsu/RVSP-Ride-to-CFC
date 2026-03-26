import React from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/app/actions/auth'

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { error, message } = await searchParams;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex items-center px-6 h-16 bg-[#f9f9f8] dark:bg-[#1a1c1c] no-border tonal-shift-bg ease-in-out transition-all duration-300">
        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:bg-[#f4f4f3] dark:hover:bg-[#2a2c2c] transition-colors duration-300 p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[#00342b] dark:text-[#afcbd8]" aria-hidden="true">arrow_back</span>
          </Link>
        </div>
        <div className="ml-4">
          <span className="font-headline text-sm font-medium tracking-tight text-[#3f4945] dark:text-[#bfc9c4]">Back to Sign in</span>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-16 pb-12">
        <div className="w-full max-w-md space-y-12">
          {/* Hero Content */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-container-low rounded-xl mb-6">
              <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">lock_reset</span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
              Reset Password
            </h1>
            <p className="text-on-surface-variant text-base mt-2">Enter the email associated with your account, and we&apos;ll send you instructions to reset your password.</p>
          </div>
          
          {/* Form Alerts */}
          {(error || message) && (
            <div className={`p-4 rounded-xl text-sm font-medium ${error ? 'bg-error-container text-error' : 'bg-primary-container text-primary'}`}>
              {error || message}
            </div>
          )}

          {/* Form Section */}
          <form action={forgotPassword} className="space-y-10">
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2" htmlFor="email">
                  Email Address
                </label>
                <input className="w-full bg-transparent border-none border-b-2 border-surface-container-highest focus:border-primary outline-none focus:ring-0 px-0 py-3 font-body text-base placeholder:text-outline-variant transition-colors duration-300" id="email" name="email" placeholder="name@example.com" type="email" required />
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <button className="w-full bg-primary text-on-primary font-semibold py-4 px-8 rounded-full shadow-lg shadow-primary/10 hover:bg-primary-container transition-all duration-300 active:scale-95" type="submit">
                Send Reset Link
              </button>
              <Link href="/login" className="group flex items-center justify-center gap-2 py-2">
                <span className="text-sm font-semibold text-primary group-hover:underline">Back to Sign in</span>
              </Link>
            </div>
          </form>
          
          {/* Editorial Accent Section */}
          <div className="pt-12 grid grid-cols-12 gap-4">
            <div className="col-span-8 h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary-container w-1/3"></div>
            </div>
            <div className="col-span-4 h-1 bg-surface-container-low rounded-full"></div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl h-48 w-full group">
            <div className="absolute inset-0 bg-primary/20 z-10 group-hover:bg-primary/10 transition-colors duration-500"></div>
            <img className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-transform duration-700" alt="church sanctuary window" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHOIm7tMjcnXF0XSvb3YfmVevabQkCFeNqrqFoYwznL5tVAZWutTGoiH9N5Gwd5LL5LbaX3BLPtbZvqJUMy6F1VRUnoxzdaoGaiGn7SrSxR_tTj_cZsXexatRFv0I_k8K6OL_3QRMAtihb2iS8uy9B6zqw5nVx7hgF8KF8NqhGP3VJA58i2jiZFcY3k8jqVq3UIv3htOdwkOgjactmJi3BWlhHlz5qmpFov6mSC5H03fBxkM6PwRSSPOrFCeNiF5xu4zPgt0rqTJ0"/>
            <div className="absolute bottom-4 left-6 z-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Sanctuary Modern</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
