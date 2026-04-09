import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getActiveRuns } from '@/app/actions/runs';
import { getRiderBookings, createBooking } from '@/app/actions/bookings';
import { signOut } from '@/app/actions/auth';
import Link from 'next/link';
// import LiveRiderTracker from '@/components/Map/LiveRiderTracker';
import LiveRiderStopsTracker from '@/components/Map/LiveRiderStopsTracker';
import BottomNav from '@/components/layout/BottomNav';
import RiderDashboardRefresher from '@/components/RiderDashboardRefresher';

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

  // Runs that are currently in-progress AND the rider has a confirmed booking for
  const inProgressMyRuns = activeRuns?.filter((run: any) =>
    run.status === 'in-progress' &&
    myBookings?.some((b: any) => b.run_id === run.id && b.status === 'confirmed')
  ) || [];

  // Set of route_ids the rider already has an active booking on
  const bookedRouteIds = new Set(
    myBookings
      ?.filter((b: any) => ['pending', 'confirmed'].includes(b.status))
      .map((b: any) => b.run?.route_id)
      .filter(Boolean) ?? []
  );

  // Run IDs to watch for realtime updates (all active/confirmed bookings)
  const watchRunIds: string[] = myBookings
    ?.filter((b: any) => ['pending', 'confirmed'].includes(b.status) && b.run_id)
    .map((b: any) => b.run_id) ?? [];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Realtime watcher: refreshes the page when a driver checks off a stop or starts the run */}
      <RiderDashboardRefresher watchRunIds={watchRunIds} />
      {/* Mobile sticky header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* Left */}
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          aria-label="Back to home"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">home</span>
        </Link>

        {/* Center */}
        <div className="flex-1 text-center">
          <span className="text-base font-bold text-on-surface">Rider Dashboard</span>
        </div>

        {/* Right: sign out */}
        <form action={signOut}>
          <button
            type="submit"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 transition-colors"
            aria-label="Sign out"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">logout</span>
          </button>
        </form>
      </header>

      {/* Page content */}
      <div className="flex-1 pt-14 pb-20 px-4 max-w-2xl mx-auto w-full" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>

        {/* Welcome greeting */}
        <div className="mt-5 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Welcome back</p>
          <h2 className="text-2xl font-extrabold text-primary font-headline">{dbUser.full_name} 👋</h2>
        </div>

        {/* Switch to driver pill */}
        <div className="flex mb-6">
          <Link
            href="/driver/dashboard"
            className="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant font-semibold text-xs px-4 py-2 rounded-full border border-outline-variant/20 hover:border-primary/30 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">directions_car</span>
            Switch to Driver View
          </Link>
        </div>

        {/* ── In-Progress Ride Alert Banner ── */}
        {inProgressMyRuns.length > 0 && (
          <section className="mb-6">
            {inProgressMyRuns.map((run: any) => {
              const myBooking = myBookings?.find((b: any) => b.run_id === run.id);
              return (
                <div key={run.id} className="bg-primary text-on-primary rounded-3xl p-4 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-on-primary"></span>
                    </div>
                    <p className="font-extrabold text-sm uppercase tracking-wider">Your Ride is On the Way!</p>
                  </div>
                  <p className="font-bold text-base mb-1">{run.route?.name}</p>
                  <p className="text-on-primary/70 text-xs mb-4">Driver: {run.driver?.full_name}</p>
                  <LiveRiderStopsTracker
                    runId={run.id}
                    myStopId={myBooking?.pickup_stop_id}
                    initialCompletedStops={run.completed_stop_ids || []}
                    stops={run.route?.route_stops?.map((s: any) => ({ id: s.id, name: s.location_name, sequence: s.stop_order })) || []}
                  />
                </div>
              );
            })}
          </section>
        )}

        {/* My Bookings — shown first on mobile (top priority info) */}
        {myBookings && myBookings.length > 0 && (
          <section id="bookings" className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]" aria-hidden="true">local_activity</span>
              My Bookings
            </h2>
            <div className="space-y-3">
              {myBookings.map((booking: any) => (
                <div key={booking.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-on-surface text-sm">{booking.run?.route?.name}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full">
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">calendar_today</span>
                      {new Date(booking.run?.scheduled_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">location_on</span>
                      {booking.pickup_stop?.location_name}
                    </span>
                    {booking.needs_return_ride && (
                      <span className="flex items-center gap-1 text-secondary font-semibold">
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">sync_alt</span>
                        Return ride
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Available Rides */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px]" aria-hidden="true">directions_bus</span>
            Available Rides
          </h2>

          {!activeRuns || activeRuns.length === 0 ? (
            <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/10 text-center shadow-sm">
              <span className="material-symbols-outlined text-outline text-5xl mb-3 block" aria-hidden="true">event_busy</span>
              <h3 className="text-base font-bold text-on-surface mb-1">No Scheduled Rides</h3>
              <p className="text-on-surface-variant text-sm max-w-xs mx-auto">No upcoming routes at the moment. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRuns.map((run: any) => {
                const alreadyBooked = bookedRouteIds.has(run.route?.id);
                const myRunBooking = myBookings?.find((b: any) => b.run_id === run.id);
                return (
                <div key={run.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                  {/* Run header */}
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex-1 mr-3">
                      <h3 className="text-base font-bold text-on-surface">{run.route.name}</h3>
                      {run.route.description && (
                        <p className="text-xs font-semibold text-error mt-0.5">{run.route.description}</p>
                      )}
                      <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-1.5">
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">calendar_clock</span>
                        {new Date(run.scheduled_date).toLocaleString()}
                      </p>
                      <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">person</span>
                        Driver: {run.driver ? run.driver.full_name : 'Pending'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      run.status === 'in-progress' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                    }`}>
                      {run.status === 'in-progress' ? '🟢 Live' : run.status}
                    </span>
                  </div>

                  {/* Action area */}
                  <div className="px-4 pb-4">
                    {run.status === 'scheduled' && run.driver_id === dbUser.id ? (
                      <div className="bg-primary/10 text-primary p-3 rounded-xl text-center font-bold text-sm">
                        You are driving this route.
                      </div>
                    ) : run.status === 'scheduled' && alreadyBooked ? (
                      <div className="bg-surface-container text-on-surface-variant p-3 rounded-xl text-center font-semibold text-sm flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Already Booked
                      </div>
                    ) : run.status === 'scheduled' && (
                      <form action={createBooking} className="space-y-3">
                        <input type="hidden" name="run_id" value={run.id} />
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                            Select Pickup Stop
                          </label>
                          <select
                            name="pickup_stop_id"
                            required
                            className="w-full h-12 bg-surface-container border border-outline-variant/20 rounded-xl text-sm px-4 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                          >
                            <option value="">— Choose Stop —</option>
                            {run.route.route_stops
                              ?.sort((a: any, b: any) => a.stop_order - b.stop_order)
                              .map((stop: any) => (
                                <option key={stop.id} value={stop.id}>{stop.stop_order}. {stop.location_name}</option>
                              ))}
                          </select>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
                          <input
                            type="checkbox"
                            name="needs_return_ride"
                            value="true"
                            className="w-5 h-5 rounded border border-outline-variant/60 flex shrink-0 items-center justify-center accent-primary appearance-auto"
                          />
                          <span className="text-sm font-semibold text-on-surface-variant select-none">I need a return ride</span>
                        </label>

                        <button
                          type="submit"
                          className="btn-active w-full h-12 bg-primary text-on-primary font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm"
                        >
                          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">confirmation_number</span>
                          Book Seat
                        </button>
                      </form>
                    )}

                    {run.status === 'in-progress' && !myRunBooking && (
                      <div className="bg-surface-container text-on-surface-variant p-3 rounded-xl text-center text-sm font-semibold">
                        This ride is in progress. Book a future run to join.
                      </div>
                    )}
                  </div>
                </div>
              )})}
            </div>
          )}
        </section>
      </div>

      {/* Bottom navigation */}
      <BottomNav role="rider" />
    </div>
  );
}
