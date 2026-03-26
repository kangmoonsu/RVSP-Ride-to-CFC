'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function LiveDriverBroadcaster({ runId }: { runId: string }) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const channel = supabase.channel(`live_run_${runId}`);
    
    // Subscribe to channel before broadcasting
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsBroadcasting(true);
      }
    });

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading, speed } = position.coords;
        if (isBroadcasting) {
          channel.send({
            type: 'broadcast',
            event: 'location_update',
            payload: { lat: latitude, lng: longitude, heading, speed, timestamp: Date.now() },
          });
        }
      },
      (err) => {
        console.error('GPS error:', err);
        setError(`GPS Error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      supabase.removeChannel(channel);
      setIsBroadcasting(false);
    };
  }, [runId, isBroadcasting, supabase]);

  if (error) {
    return (
      <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-semibold flex items-center gap-2">
        <span className="material-symbols-outlined">error</span>
        {error}
      </div>
    );
  }

  return (
    <div className="bg-primary/10 text-primary p-3 rounded-lg text-sm font-bold flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined animate-pulse">satellite_alt</span>
        GPS Tracking Active
      </div>
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
      </div>
    </div>
  );
}
