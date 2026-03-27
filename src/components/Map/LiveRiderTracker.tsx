'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./RouteMap'), { ssr: false });

export default function LiveRiderTracker({ runId, stops }: { runId: string, stops: any[] }) {
  const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel(`live_run_${runId}`);
    
    channel.on('broadcast', { event: 'location_update' }, (payload) => {
      if (payload?.payload?.lat && payload?.payload?.lng) {
        setDriverLocation({
          lat: payload.payload.lat,
          lng: payload.payload.lng
        });
      }
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [runId, supabase]);

  // We want to pass stops and the driverLocation to the Map!
  // Our RouteMap component only accepts `stops`. We'll need to modify it slightly or add a special prop.
  return (
    <div className="w-full h-[300px] mt-4 relative">
      <DynamicMap 
        stops={stops} 
        height="300px" 
        driverLocation={driverLocation} 
        routePath={stops.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng]) as [number, number][]} 
      />
      {/* Note: We will need to update RouteMap to accept driverLocation overlay */}
      {driverLocation && (
        <div className="absolute top-2 right-2 bg-on-surface text-surface py-1 px-3 rounded-full text-xs font-bold z-[1000] shadow-md flex items-center gap-2">
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
