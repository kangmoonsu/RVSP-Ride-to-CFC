'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./RouteMap'), { ssr: false });

export default function LiveRiderTracker({ 
  runId, 
  stops, 
  initialLocation = null,
  initialCompletedStops = []
}: { 
  runId: string; 
  stops: any[]; 
  initialLocation?: { lat: number, lng: number } | null;
  initialCompletedStops?: string[];
}) {
  const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(initialLocation);
  const [completedStops, setCompletedStops] = useState<string[]>(initialCompletedStops);
  const supabase = createClient();

  useEffect(() => {
    // 1. High-frequency updates via Broadcast channel
    const channel = supabase.channel(`live_run_${runId}`);
    
    channel.on('broadcast', { event: 'location_update' }, (payload) => {
      if (payload?.payload?.lat && payload?.payload?.lng) {
        setDriverLocation({
          lat: payload.payload.lat,
          lng: payload.payload.lng
        });
      }
    }).subscribe();

    // 2. Reliable state updates via Postgres Realtime (for completed stops)
    const dbSubscription = supabase.channel(`db_run_${runId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'route_runs', filter: `id=eq.${runId}` }, (payload) => {
        const newRecord = payload.new as any;
        if (newRecord.completed_stop_ids) {
          setCompletedStops(newRecord.completed_stop_ids);
        }
        if (newRecord.current_lat && newRecord.current_lng) {
          setDriverLocation({ lat: newRecord.current_lat, lng: newRecord.current_lng });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(dbSubscription);
    };
  }, [runId, supabase]);

  // Visual cues for completed stops
  const visibleStops = stops.map(stop => ({
    ...stop,
    isCompleted: completedStops.includes(stop.id)
  }));

  // We want to pass stops and the driverLocation to the Map!
  // Our RouteMap component only accepts `stops`. We'll need to modify it slightly or add a special prop.
  return (
    <div className="w-full h-[300px] mt-4 relative">
      <DynamicMap 
        stops={visibleStops} 
        height="300px" 
        driverLocation={driverLocation} 
        routePath={visibleStops.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng]) as [number, number][]} 
      />
      {/* Note: We will need to update RouteMap to accept driverLocation overlay */}
      {driverLocation && (
        <div className="absolute top-2 right-2 bg-on-surface text-surface py-1 px-3 rounded-full text-xs font-bold z-1000 shadow-md flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          Live GPS 
        </div>
      )}
    </div>
  );
}
