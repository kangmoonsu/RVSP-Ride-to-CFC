import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { updateRouteBlueprint } from '@/app/actions/routes';

export default async function DriverEditRoutePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: routeData } = await supabase
    .from('routes')
    .select('*')
    .eq('id', params.id)
    .eq('default_driver_id', user.id)
    .single();

  const route = routeData as any; // Type override for newly migrated columns

  if (!route) {
    redirect('/driver/dashboard');
  }

  const updateRouteWithId = updateRouteBlueprint.bind(null, route.id);

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-[#f9f9f8]/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center px-4 py-4 h-[72px]">
        <Link href="/driver/dashboard" className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors flex items-center justify-center">
           <span className="material-symbols-outlined text-[24px]">close</span>
        </Link>
        <span className="ml-2 font-headline text-xl font-bold text-primary tracking-tight">Edit Blueprint</span>
      </header>

      <main className="pt-24 px-4 max-w-xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">Modify Schedule</h1>
          <p className="text-on-surface-variant text-sm">Update the recurring schedule and capacity for your route blueprint: <strong>{route.name}</strong></p>
        </div>

        <form action={updateRouteWithId} className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-6">
            <div className="space-y-2">
              <label htmlFor="capacity" className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total Seat Capacity</label>
              <input 
                type="number" 
                id="capacity" 
                name="capacity" 
                min="1"
                max="50"
                defaultValue={route.capacity || 4}
                required 
                className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Recurring Departure Schedule</label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  name="schedule_day" 
                  required 
                  defaultValue={route.schedule_day || ''}
                  className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                >
                  <option value="" disabled>Select Day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
                <input 
                  type="time" 
                  name="schedule_time" 
                  defaultValue={route.schedule_time || ''}
                  required 
                  className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">RSVP Deadline</label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  name="rsvp_day" 
                  required 
                  defaultValue={route.rsvp_day || ''}
                  className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                >
                  <option value="" disabled>Select Day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
                <input 
                  type="time" 
                  name="rsvp_time" 
                  defaultValue={route.rsvp_time || ''}
                  required 
                  className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/20">
              <button type="submit" className="w-full bg-primary text-on-primary font-bold py-4 rounded-full shadow-lg hover:bg-primary-container transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
