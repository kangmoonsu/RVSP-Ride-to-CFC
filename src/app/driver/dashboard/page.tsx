import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateRunStatus } from '@/app/actions/runs';
import { deleteRoute } from '@/app/actions/routes';
import { approveBooking } from '@/app/actions/bookings';
import { signOut } from '@/app/actions/auth';
import Link from 'next/link';
import LiveDriverBroadcaster from '@/components/Map/LiveDriverBroadcaster';

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

  // Fetch runs assigned to this driver
  const { data: assignedRuns, error: runsError } = await supabase
    .from('route_runs')
    .select(`
      *,
      route:routes(name, description, route_stops(id, location_name, stop_order, lat, lng)),
      ride_bookings(id, pickup_stop_id, needs_return_ride, status, rider:users!ride_bookings_rider_id_fkey(full_name, phone_number))
    `)
    .eq('driver_id', dbUser.id)
    .order('scheduled_date', { ascending: true });

  const { data: myRoutes } = await supabase
    .from('routes')
    .select('id, name, capacity, description, schedule_day, schedule_time, rsvp_day, rsvp_time')
    .eq('default_driver_id', dbUser.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/20">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight font-headline">Driver Dashboard</h1>
            <p className="text-on-surface-variant text-lg mt-2 font-medium">Safe travels, {dbUser.full_name}!</p>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-bold px-4 py-2 rounded-xl hover:bg-primary/10">
               <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
               Back
             </Link>
             <Link href="/rider/dashboard" className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2 font-bold px-4 py-2 rounded-xl shadow-sm">
               <span className="material-symbols-outlined" aria-hidden="true">person_raised_hand</span>
               Switch to Rider
             </Link>
             <form action={signOut}>
                <button type="submit" className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-2 font-bold px-4 py-2 rounded-xl hover:bg-error/10">
                  <span className="material-symbols-outlined" aria-hidden="true">logout</span>
                  Sign Out
                </button>
             </form>
          </div>
        </header>

        {/* Assigned Runs */}
        <section>
          <div className="flex justify-between items-center mb-6 mt-8">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" aria-hidden="true">local_taxi</span>
              My Assigned Runs
            </h2>
            <Link href="/driver/routes/new" className="bg-primary-container text-on-primary-container font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-primary/20 transition-all flex items-center gap-2 text-sm">
               <span className="material-symbols-outlined text-[18px]">add</span>
               Create Route
            </Link>
          </div>

          {!assignedRuns || assignedRuns.length === 0 ? (
             <div className="bg-surface-container-lowest p-12 rounded-4xl border border-outline-variant/10 text-center shadow-sm">
               <span className="material-symbols-outlined text-outline text-6xl mb-4 block" aria-hidden="true">assignment_turned_in</span>
               <h3 className="text-xl font-bold text-on-surface mb-2">No Assigned Runs</h3>
               <p className="text-on-surface-variant max-w-sm mx-auto">You do not have any upcoming routes assigned to you. The coordinator will assign runs.</p>
             </div>
          ) : (
             <div className="space-y-6">
               {assignedRuns.map((run: any) => {
                 // Sort stops by order
                 const stops = run.route?.route_stops?.sort((a: any, b: any) => a.stop_order - b.stop_order) || [];
                 const passengers = run.ride_bookings || [];
                 const isActionable = run.status === 'scheduled' || run.status === 'in-progress';

                 return (
                   <div key={run.id} className="bg-surface-container-lowest p-6 rounded-4xl border border-outline-variant/10 shadow-sm flex flex-col gap-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-on-surface">{run.route?.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${run.status === 'in-progress' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary/10 text-primary'}`}>
                              {run.status}
                            </span>
                          </div>
                          <p className="text-on-surface-variant text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] opacity-70" aria-hidden="true">calendar_clock</span>
                            {new Date(run.scheduled_date).toLocaleString()}
                          </p>
                        </div>
                        {isActionable && (
                          <form action={updateRunStatus.bind(null, run.id, run.status === 'scheduled' ? 'in-progress' : 'completed')}>
                            <button className={`text-on-primary font-bold py-3 px-6 rounded-full shadow-md transition-all flex items-center gap-2 ${run.status === 'scheduled' ? 'bg-primary hover:bg-primary-container shadow-primary/10' : 'bg-secondary hover:bg-secondary-container shadow-secondary/10'}`}>
                              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                                {run.status === 'scheduled' ? 'play_arrow' : 'stop'}
                              </span>
                              {run.status === 'scheduled' ? 'Start Run' : 'Complete Run'}
                            </button>
                          </form>
                        )}
                      </div>

                      {run.status === 'in-progress' && (
                        <div className="mt-2">
                          <LiveDriverBroadcaster runId={run.id} />
                        </div>
                      )}

                      {/* Stops & Passengers */}
                      <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Route Stops & Passengers</h4>
                        <div className="space-y-4">
                          {stops.map((stop: any, index: number) => {
                             const pickups = passengers.filter((p: any) => p.pickup_stop_id === stop.id);
                             return (
                               <div key={stop.id} className="flex items-start gap-4">
                                 <div className="flex flex-col items-center">
                                   <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                                     {stop.stop_order}
                                   </div>
                                   {index < stops.length - 1 && (
                                     <div className="w-0.5 h-full min-h-8 bg-outline-variant/30 my-1"></div>
                                   )}
                                 </div>
                                 <div className="flex-1 pb-4">
                                    <h5 className="font-bold text-on-surface">{stop.location_name}</h5>
                                    {pickups.length > 0 ? (
                                      <ul className="mt-2 space-y-2">
                                        {pickups.map((p: any) => (
                                          <li key={p.id} className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 flex flex-col gap-2 text-sm">
                                            <div className="flex justify-between items-center w-full">
                                              <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-secondary opacity-70 text-[18px]" aria-hidden="true">person_raised_hand</span>
                                                <span className="font-semibold">{p.rider?.full_name}</span>
                                                {p.status === 'confirmed' ? (
                                                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">Approved</span>
                                                ) : (
                                                  <span className="text-[10px] font-bold bg-error/10 text-error px-2 py-0.5 rounded uppercase">Pending</span>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {p.needs_return_ride && (
                                                  <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-1 rounded">Return</span>
                                                )}
                                                {p.status === 'pending' && (
                                                  <form action={approveBooking.bind(null, p.id)}>
                                                    <button type="submit" className="bg-primary text-on-primary px-3 py-1 rounded-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors">
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
                                      <p className="text-xs text-on-surface-variant/70 italic mt-1">No pickups at this stop.</p>
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

        {/* My Managed Routes */}
        <section className="pt-8 border-t border-outline-variant/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" aria-hidden="true">settings_input_component</span>
              My Managed Routes
            </h2>
          </div>

          {!myRoutes || myRoutes.length === 0 ? (
             <div className="bg-surface-container-lowest p-8 rounded-4xl border border-outline-variant/10 text-center shadow-sm">
               <p className="text-on-surface-variant max-w-sm mx-auto">You haven't created any routes yet.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {myRoutes.map((route: any) => (
                 <div key={route.id} className="bg-surface-container-lowest p-6 rounded-4xl border border-outline-variant/10 shadow-sm flex flex-col gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface mb-1">{route.name}</h3>
                      <p className="text-on-surface-variant text-sm flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-[16px] opacity-70" aria-hidden="true">event_repeat</span>
                        Every {route.schedule_day} at {route.schedule_time}
                      </p>
                      <p className="text-on-surface-variant text-sm flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[16px] opacity-70" aria-hidden="true">airline_seat_recline_normal</span>
                        Capacity: {route.capacity || 4} seats
                      </p>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <Link href={`/driver/routes/${route.id}/edit`} className="flex-1 bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-bold px-4 py-2 rounded-xl text-center shadow-sm text-sm border border-outline-variant/20">
                        Edit Route
                      </Link>
                      <form action={deleteRoute.bind(null, route.id)} className="flex-1">
                        <button type="submit" className="w-full bg-error/10 text-error hover:bg-error hover:text-on-error transition-colors font-bold px-4 py-2 rounded-xl text-center shadow-sm text-sm">
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
    </div>
  );
}
