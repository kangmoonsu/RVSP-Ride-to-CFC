import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateRunStatus, checkOffStop } from '@/app/actions/runs';
import { deleteRoute } from '@/app/actions/routes';
import { approveBooking } from '@/app/actions/bookings';
import { signOut } from '@/app/actions/auth';
import Link from 'next/link';
// import LiveDriverBroadcaster from '@/components/Map/LiveDriverBroadcaster';
import BottomNav from '@/components/layout/BottomNav';
import DriverRunActions from '@/components/DriverRunActions';

export default async function DriverDashboard() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: dbUser } = await supabase.from('users').select('*').eq('id', user.id).single();

  if (!dbUser) {
    redirect('/dashboard');
  }

  const { data: assignedRuns } = await supabase
    .from('route_runs')
    .select(`
      *,
      route:routes(name, description, route_stops(id, location_name, stop_order, lat, lng)),
      ride_bookings(id, pickup_stop_id, needs_return_ride, status, rider:users!ride_bookings_rider_id_fkey(full_name))
    `)
    .eq('driver_id', dbUser.id)
    .order('scheduled_date', { ascending: true });

  const { data: myRoutes } = await supabase
    .from('routes')
    .select('id, name, capacity, description, schedule_day, schedule_time, rsvp_day, rsvp_time')
    .eq('default_driver_id', dbUser.id)
    .order('created_at', { ascending: false });

  const activeRunsData = assignedRuns?.filter((r: any) => r.status === 'scheduled' || r.status === 'in-progress') || [];


  return (
    <div className="min-h-screen bg-surface flex flex-col">
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
          <span className="text-base font-bold text-on-surface">Driver Dashboard</span>
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
      <div
        className="flex-1 pt-14 px-4 max-w-2xl mx-auto w-full"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
      >

        {/* Greeting */}
        <div className="mt-5 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Safe travels</p>
          <h2 className="text-2xl font-extrabold text-primary font-headline">{dbUser.full_name} 🚐</h2>
        </div>

        {/* Switch to rider pill */}
        <div className="flex mb-6">
          <Link
            href="/rider/dashboard"
            className="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant font-semibold text-xs px-4 py-2 rounded-full border border-outline-variant/20 hover:border-primary/30 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">person_raised_hand</span>
            Switch to Rider View
          </Link>
        </div>

        {/* ── Assigned Runs ── */}
        <section className="mb-8" id="assigned-runs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]" aria-hidden="true">local_taxi</span>
              My Assigned Runs
            </h2>
            <Link
              href="/driver/routes/new"
              id="create-route-btn"
              className="btn-active inline-flex items-center gap-1 bg-primary text-on-primary font-bold text-xs px-3 py-2 rounded-full shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
              New Route
            </Link>
          </div>

          {!activeRunsData || activeRunsData.length === 0 ? (
            <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/10 text-center shadow-sm">
              <span className="material-symbols-outlined text-outline text-5xl mb-3 block" aria-hidden="true">assignment_turned_in</span>
              <h3 className="text-base font-bold text-on-surface mb-1">No Assigned Runs</h3>
              <p className="text-on-surface-variant text-sm max-w-xs mx-auto">The coordinator will assign runs to you.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRunsData.map((run: any) => {
                const stops = run.route?.route_stops?.sort((a: any, b: any) => a.stop_order - b.stop_order) || [];
                const passengers = run.ride_bookings || [];
                const isActionable = run.status === 'scheduled' || run.status === 'in-progress';

                return (
                  <div key={run.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                    {/* Run meta */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 mr-3">
                          <h3 className="text-base font-bold text-on-surface">{run.route?.name}</h3>
                          <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">calendar_clock</span>
                            {new Date(run.scheduled_date).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${run.status === 'in-progress' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary/10 text-primary'}`}>
                          {run.status}
                        </span>
                      </div>

                      {/* Start / Complete button */}
                      {isActionable && (
                        <DriverRunActions runId={run.id} runStatus={run.status} />
                      )}
                    </div>

                    {/* Live broadcaster (Temporarily disabled for Beta)
                    {run.status === 'in-progress' && (
                      <div className="px-4 pb-3">
                        <LiveDriverBroadcaster runId={run.id} />
                      </div>
                    )} */}

                    {/* Stops & Passengers */}
                    <div className="bg-surface-container-low rounded-b-3xl p-4 border-t border-outline-variant/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Stops & Passengers</h4>
                      <div className="space-y-4">
                        {stops.map((stop: any, index: number) => {
                          const pickups = passengers.filter((p: any) => p.pickup_stop_id === stop.id);
                          return (
                            <div key={stop.id} className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${run.completed_stop_ids?.includes(stop.id) ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary text-on-primary'}`}>
                                  {stop.stop_order}
                                </div>
                                {index < stops.length - 1 && (
                                  <div className={`w-0.5 flex-1 min-h-6 my-1 ${run.completed_stop_ids?.includes(stop.id) ? 'bg-surface-container-high' : 'bg-outline-variant/30'}`} />
                                )}
                              </div>
                              <div className="flex-1 pb-2">
                                <div className="flex justify-between items-start">
                                  <h5 className={`font-bold text-sm ${run.completed_stop_ids?.includes(stop.id) ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{stop.location_name}</h5>
                                  
                                  {run.status === 'in-progress' && !run.completed_stop_ids?.includes(stop.id) && (
                                    <form action={checkOffStop.bind(null, run.id, stop.id)}>
                                      <button type="submit" className="text-[10px] font-bold bg-secondary/10 text-secondary hover:bg-secondary hover:text-on-secondary transition-colors px-2 py-1 rounded-md border border-secondary/20">
                                        Check Off
                                      </button>
                                    </form>
                                  )}
                                  {run.completed_stop_ids?.includes(stop.id) && (
                                    <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 bg-surface-container px-2 py-1 rounded-md">
                                      <span className="material-symbols-outlined text-[10px]">check</span> Passed
                                    </span>
                                  )}
                                </div>
                                {pickups.length > 0 ? (
                                  <ul className="mt-2 space-y-2">
                                    {pickups.map((p: any) => (
                                      <li key={p.id} className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20">
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-secondary text-[18px]" aria-hidden="true">person_raised_hand</span>
                                            <span className="font-semibold text-sm">{p.rider?.full_name}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {p.needs_return_ride && (
                                              <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">Return</span>
                                            )}
                                            {p.status === 'confirmed' ? (
                                              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Approved</span>
                                            ) : (
                                              <form action={approveBooking.bind(null, p.id)}>
                                                <button
                                                  type="submit"
                                                  className="btn-active bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                                                >
                                                  Approve
                                                </button>
                                              </form>
                                            )}
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-on-surface-variant/60 italic mt-1">No pickups at this stop.</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── My Managed Routes ── */}
        <section id="routes">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]" aria-hidden="true">settings_input_component</span>
              My Routes
            </h2>
          </div>

          {!myRoutes || myRoutes.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 text-center shadow-sm">
              <p className="text-on-surface-variant text-sm">No routes yet. Tap "New Route" to create one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRoutes.map((route: any) => (
                <div key={route.id} className="bg-surface-container-lowest p-4 rounded-3xl border border-outline-variant/10 shadow-sm">
                  <h3 className="text-base font-bold text-on-surface mb-1">{route.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-4">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">airline_seat_recline_normal</span>
                      {route.capacity || 4} seats
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/driver/routes/${route.id}/edit`}
                      className="btn-active flex-1 h-11 bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-bold rounded-2xl text-center text-sm flex items-center justify-center border border-outline-variant/20"
                    >
                      Edit Route
                    </Link>
                    <form action={deleteRoute.bind(null, route.id)} className="flex-1">
                      <button
                        type="submit"
                        className="btn-active w-full h-11 bg-error/10 text-error hover:bg-error hover:text-on-error transition-colors font-bold rounded-2xl text-sm"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom navigation */}
      <BottomNav role="driver" />
    </div>
  );
}
