import { getRouteById, getRoutes } from '@/app/actions/routes';
import { getRouteStops, addRouteStop, deleteRouteStop } from '@/app/actions/stops';
import { createRouteRun } from '@/app/actions/runs';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DynamicMap from '@/components/Map/DynamicMap';

export default async function RouteDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const route = await getRouteById(params.id);
  
  if (!route) {
    notFound();
  }

  const stops = await getRouteStops(params.id);
  // Also get drivers for the select list (using the existing routes logic or just a simplified db call)
  // For simplicity since getRoutes is already fetching drivers, we'll just fetch all roles='driver' directly.
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: drivers } = await supabase.from('users').select('id, full_name').eq('role', 'driver');

  // Map backend stop structure to frontend component structure
  const formattedStops = stops.map(stop => ({
    id: stop.id,
    name: stop.location_name,
    lat: stop.lat,
    lng: stop.lng,
    sequence: stop.stop_order
  }));

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/coordinator/dashboard" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
                Dashboard
              </Link>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant text-sm font-semibold">Route Details</span>
            </div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight font-headline">{route.name}</h1>
            {route.description && (
              <p className="text-on-surface-variant text-lg mt-2 max-w-2xl">{route.description}</p>
            )}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <div className="mt-4 inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person</span>
              Driver: {route.default_driver ? (route.default_driver as any).full_name : 'Unassigned'}
            </div>
          </div>
          <button className="bg-primary text-on-primary font-bold py-3 px-6 rounded-full shadow-md shadow-primary/10 hover:bg-primary-container transition-all flex items-center justify-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">play_arrow</span>
            Start Route Run
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stops List & Editor */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" aria-hidden="true">location_on</span>
                Route Stops
              </h2>
              
              {stops.length === 0 ? (
                <div className="text-center py-8 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                  <span className="material-symbols-outlined text-outline text-4xl mb-2" aria-hidden="true">map</span>
                  <p className="text-on-surface-variant text-sm font-medium">No stops added yet.</p>
                  <p className="text-outline text-xs mt-1">Use the form below to add a stop.</p>
                </div>
              ) : (
                <ul className="space-y-3 mb-6">
                  {stops.map((stop, index) => (
                    <li key={stop.id} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow relative group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
                          {stop.stop_order}
                        </div>
                        {index < stops.length - 1 && (
                          <div className="w-0.5 h-6 bg-outline-variant/30 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="font-semibold text-on-surface truncate">{stop.location_name}</p>
                        <p className="text-xs text-on-surface-variant truncate font-mono mt-1 opacity-70">
                          {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
                        </p>
                      </div>
                      {/* Delete button wrapper */}
                      <form action={deleteRouteStop.bind(null, stop.id, route.id)}>
                        <button type="submit" className="opacity-0 group-hover:opacity-100 transition-opacity text-error/80 hover:text-error">
                          <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add Stop Form */}
              <div className="mt-8 pt-6 border-t border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface mb-4">Add New Stop</h3>
                <form action={addRouteStop} className="space-y-4">
                  <input type="hidden" name="route_id" value={route.id} />
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">Stop Name</label>
                    <input name="location_name" type="text" placeholder="e.g. Main St Pick-up" required className="w-full bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary px-4 py-3 rounded-xl text-sm" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">Latitude</label>
                      <input name="lat" type="number" step="any" placeholder="34.0522" required className="w-full bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary px-4 py-3 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">Longitude</label>
                      <input name="lng" type="number" step="any" placeholder="-118.2437" required className="w-full bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary px-4 py-3 rounded-xl text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">Est. Offset Minutes (Optional)</label>
                    <input name="estimated_offset_minutes" type="number" placeholder="5" className="w-full bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary px-4 py-3 rounded-xl text-sm" />
                  </div>

                  <button type="submit" className="w-full mt-2 bg-secondary text-on-secondary font-bold py-3 rounded-xl shadow-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add_location</span>
                    Save Stop
                  </button>
                </form>
              </div>

            </div>
          </div>

          {/* Map View */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-primary mb-4 sr-only">Interactive Map</h2>
            <div className="bg-surface-container-lowest p-2 rounded-[2rem] border border-outline-variant/10 shadow-sm">
              <DynamicMap 
                stops={formattedStops} 
                height="600px" 
                // We'll pass in polyline coordinates later when we hook up OSRM
                routePath={[]} 
              />
            </div>
            <p className="text-sm text-on-surface-variant mt-3 text-center">
              Coordinates can be copy-pasted or found via Google Maps until map-click coordination is finalized.
            </p>
          </div>
          
        </div>

        {/* Schedule/Start Run Form */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm mt-8">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" aria-hidden="true">add_task</span>
            Schedule New Run
          </h2>
          <form action={createRouteRun} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <input type="hidden" name="route_id" value={route.id} />
            
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Scheduled Date & Time</label>
              <input 
                name="scheduled_date" 
                type="datetime-local" 
                required 
                className="w-full bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary px-4 py-3 rounded-xl text-sm" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Assign Driver (Optional)</label>
              <select 
                name="driver_id" 
                className="w-full bg-surface-container-low border-none outline-none focus:ring-2 focus:ring-primary px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
                defaultValue={route.default_driver ? (route.default_driver as any).id : ""}
              >
                <option value="">-- No Driver yet --</option>
                {drivers?.map(dr => (
                  <option key={dr.id} value={dr.id}>{dr.full_name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-primary text-on-primary font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">calendar_add_on</span>
              Schedule Run
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
