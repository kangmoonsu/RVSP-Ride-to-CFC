'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface RiderDashboardRefresherProps {
  /** All run IDs the rider has a confirmed/pending booking on */
  watchRunIds: string[];
}

/**
 * Invisible client component that subscribes to Supabase Realtime for
 * any of the rider's runs. When a run's status or completed_stop_ids changes
 * (e.g. driver starts the run or checks off a stop), it calls router.refresh()
 * so the Server Component tree re-fetches and re-renders with fresh data.
 *
 * This ensures the "Your Ride is On the Way!" banner appears automatically
 * when a driver starts a run, without the rider needing to manually refresh.
 */
export default function RiderDashboardRefresher({ watchRunIds }: RiderDashboardRefresherProps) {
  const router = useRouter();
  const supabase = createClient();
  // Track the last refresh time to debounce rapid consecutive updates
  const lastRefreshRef = useRef<number>(0);

  useEffect(() => {
    if (watchRunIds.length === 0) return;

    const debounceRefresh = () => {
      const now = Date.now();
      // Debounce: only refresh if it's been more than 1.5s since last refresh
      if (now - lastRefreshRef.current > 1500) {
        lastRefreshRef.current = now;
        router.refresh();
      }
    };

    // Subscribe to all relevant run IDs in a single channel
    const channel = supabase
      .channel('rider_dashboard_run_watcher')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'route_runs',
          // Supabase filter supports `in` for comma-separated values
          filter: `id=in.(${watchRunIds.join(',')})`,
        },
        (payload) => {
          const newRecord = payload.new as Record<string, unknown>;
          const oldRecord = payload.old as Record<string, unknown>;

          // Only refresh when status or completed_stop_ids actually changes
          const statusChanged = newRecord.status !== oldRecord.status;
          const stopsChanged =
            JSON.stringify(newRecord.completed_stop_ids) !==
            JSON.stringify(oldRecord.completed_stop_ids);

          if (statusChanged || stopsChanged) {
            debounceRefresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [watchRunIds, router, supabase]);

  // Renders nothing — purely reactive
  return null;
}
