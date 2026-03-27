import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getActiveRuns } from '@/app/actions/runs';
import { getRiderBookings, createBooking } from '@/app/actions/bookings';
import { signOut } from '@/app/actions/auth';
import Link from 'next/link';
import LiveRiderTracker from '@/components/Map/LiveRiderTracker';

export default async function RiderDashboard() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  let { data: dbUser } = await supabase.from('users').select('*').eq('id', user.id).single();

  if (!dbUser) {
    const newUser = {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      role: 'rider' as const,
    };
    const { data: createdUser } = await supabase.from('users').insert(newUser).select().single();
    dbUser = createdUser || newUser;
  }

  const [activeRuns, myBookings] = await Promise.all([
    getActiveRuns(),
    getRiderBookings(dbUser.id)
  ]);

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/20">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight font-headline">Rider Dashboard</h1>
            <p className="text-on-surface-variant text-lg mt-2 font-medium">Welcome back, {dbUser.full_name}</p>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-bold px-4 py-2 rounded-xl hover:bg-primary/10">
               <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
               Back
             </Link>
             <Link href="/driver/dashboard" className="bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container transition-colors flex items-center gap-2 font-bold px-4 py-2 rounded-xl shadow-sm">
               <span className="material-symbols-outlined" aria-hidden="true">directions_car</span>
               Switch to Driver
             </Link>
             <form action={signOut}>
                <button type="submit" className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-2 font-bold px-4 py-2 rounded-xl hover:bg-error/10">
                  <span className="material-symbols-outlined" aria-hidden="true">logout</span>
                  Sign Out
                </button>
             </form>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Available Runs */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" aria-hidden="true">directions_bus</span>
                Available Rides
              </h2>
            </div>
            
            {!activeRuns || activeRuns.length === 0 ? (
              <div className="bg-surface-container-lowest p-12 rounded-[2rem] border border-outline-variant/10 text-center shadow-sm">
                <span className="material-symbols-outlined text-outline text-6xl mb-4 block" aria-hidden="true">event_busy</span>
                <h3 className="text-xl font-bold text-on-surface mb-2">No Scheduled Rides</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto">There are no upcoming routes scheduled at the moment. Please check back later.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {activeRuns.map((run: any) => (
                  <div key={run.id} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-on-surface">{run.route.name}</h3>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {run.status}
                      </div>
                    </div>
                    {run.route.description && (
                      <p className="text-sm font-semibold text-error mb-4">{run.route.description}</p>
                    )}
                    
                    <div className="space-y-2 mb-6 flex-1">
                      <p className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] opacity-70" aria-hidden="true">calendar_clock</span>
                        {new Date(run.scheduled_date).toLocaleString()}
                      </p>
                      <p className="text-on-surface-variant text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] opacity-70" aria-hidden="true">person</span>
                        Driver: {run.driver ? run.driver.full_name : 'Pending'}
                      </p>
                    </div>

                    <div className="mt-auto border-t border-outline-variant/20 pt-4">
                      {run.status === 'scheduled' && run.driver_id === dbUser.id ? (
                        <div className="bg-primary/10 text-primary p-4 rounded-xl text-center font-bold text-sm">
                          You are driving this route.
                        </div>
                      ) : run.status === 'scheduled' && (
                        <form action={createBooking} className="space-y-4">
                          <input type="hidden" name="run_id" value={run.id} />
                          
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">Select Pickup Stop</label>
                            <select name="pickup_stop_id" required className="w-full bg-surface-container border-none outline-none focus:ring-2 focus:ring-primary px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer">
                              <option value="">-- Choose Stop --</option>
                              {run.route.route_stops
                                ?.sort((a: any, b: any) => a.stop_order - b.stop_order)
                                .map((stop: any) => (
                                  <option key={stop.id} value={stop.id}>{stop.stop_order}. {stop.location_name}</option>
                                ))}
                            </select>
                          </div>
                          
                          <label className="flex items-center gap-3 cursor-pointer p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
                            <input type="checkbox" name="needs_return_ride" value="true" className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant/30" />
                            <span className="text-sm font-semibold text-on-surface-variant select-none">I need a return ride after service</span>
                          </label>

                          <button 
                            type="submit" 
                            disabled={run.status !== 'scheduled'}
                            className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">confirmation_number</span>
                            Book Seat
                          </button>
                        </form>
                      )}

                      {run.status === 'in-progress' && (
                        <div>
                          <p className="text-sm font-bold text-secondary mb-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">info</span>
                            Driver is en route! Tracking live:
                          </p>
                          <LiveRiderTracker 
                             runId={run.id} 
                             stops={run.route.route_stops?.map((s: any) => ({
                               id: s.id,
                               name: s.location_name,
                               lat: s.lat,
                               lng: s.lng,
                               sequence: s.stop_order
                             })) || []} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sidebar - My Bookings */}
          <aside className="space-y-6">
            <div className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" aria-hidden="true">local_activity</span>
                My Bookings
              </h2>
              {myBookings && myBookings.length > 0 ? (
                <div className="space-y-4">
                  {myBookings.map((booking: any) => (
                    <div key={booking.id} className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-on-surface">{booking.run?.route?.name}</p>
                        <span className="text-xs font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full">
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">calendar_today</span>
                        {new Date(booking.run?.scheduled_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">location_on</span>
                        Pick-up: {booking.pickup_stop?.location_name}
                      </p>
                      {booking.needs_return_ride && (
                        <p className="text-xs font-semibold text-secondary mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">sync_alt</span>
                          Return Ride Requested
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-outline text-4xl mb-2" aria-hidden="true">receipt_long</span>
                  <p className="text-on-surface-variant text-sm font-medium">No bookings yet.</p>
                  <p className="text-outline text-xs mt-1">Your reserved rides will appear here.</p>
                </div>
              )}
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
