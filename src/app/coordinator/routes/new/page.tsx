import React from 'react';
import Link from 'next/link';
import { createRoute } from '@/app/actions/routes';
import { createClient } from '@/utils/supabase/server';

export default async function NewRoutePage({ searchParams }: { searchParams: { error?: string } }) {
  const supabase = await createClient();
  const { data: drivers } = await supabase.from('users').select('id, full_name').eq('role', 'driver');

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <header className="sticky top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-xl shadow-[0_12px_40px_hsla(168,100%,10%,0.06)] flex items-center gap-4 px-6 py-4">
        <Link href="/coordinator/dashboard" className="p-2 hover:bg-stone-200/50 rounded-full transition-colors flex items-center">
          <span className="material-symbols-outlined text-teal-900">arrow_back</span>
        </Link>
        <h1 className="text-xl font-bold text-teal-900 font-manrope">Create New Route</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <section className="mb-12">
          <h2 className="text-4xl font-extrabold text-primary mb-2">Service Route Details</h2>
          <p className="text-on-surface-variant font-medium text-lg">Define a new route path for sanctuary transport.</p>
        </section>

        {searchParams.error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-2xl mb-8 border border-error/20">
            {searchParams.error}
          </div>
        )}

        <form action={createRoute} className="space-y-8 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Route Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder="e.g. Northside Morning Service"
              className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Description (Optional)</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              placeholder="Details about stops or schedule..."
              className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="default_driver_id" className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Default Driver (Optional)</label>
            <select 
              id="default_driver_id" 
              name="default_driver_id" 
              className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all appearance-none"
            >
              <option value="">-- Unassigned --</option>
              {drivers?.map((driver) => (
                <option key={driver.id} value={driver.id}>{driver.full_name}</option>
              ))}
            </select>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full bg-primary text-on-primary font-bold py-4 rounded-full shadow-lg hover:bg-primary-container transition-colors">
              Save Route
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
