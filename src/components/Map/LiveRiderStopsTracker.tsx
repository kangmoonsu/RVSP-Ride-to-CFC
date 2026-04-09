'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface LiveRiderStopsTrackerProps {
  runId: string;
  myStopId?: string;
  initialCompletedStops: string[];
  stops: any[];
}

export default function LiveRiderStopsTracker({
  runId,
  myStopId,
  initialCompletedStops,
  stops = []
}: LiveRiderStopsTrackerProps) {
  const [completedStops, setCompletedStops] = useState<string[]>(initialCompletedStops);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to Postgres Realtime for completed_stop_ids updates
    const dbSubscription = supabase.channel(`db_run_stops_${runId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'route_runs', filter: `id=eq.${runId}` }, (payload) => {
        const newRecord = payload.new as any;
        if (newRecord.completed_stop_ids) {
          setCompletedStops(newRecord.completed_stop_ids);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(dbSubscription);
    };
  }, [runId, supabase]);

  if (!myStopId) {
    return (
      <div className="bg-surface-container text-on-surface-variant p-3 rounded-xl text-center text-sm font-semibold">
        Book a seat to track your pickup.
      </div>
    );
  }

  // Sort stops by order just in case
  const sortedStops = [...stops].sort((a, b) => a.sequence - b.sequence);
  const myStopIndex = sortedStops.findIndex(s => s.id === myStopId);

  if (myStopIndex === -1) {
    return null;
  }

  const isPassed = completedStops.includes(myStopId);
  const uncompletedBeforeMe = sortedStops.slice(0, myStopIndex).filter((s) => !completedStops.includes(s.id));
  const stopsAway = uncompletedBeforeMe.length;

  const renderBanner = () => {
    if (isPassed) {
      return (
        <div className="bg-surface-container-high text-on-surface-variant p-4 rounded-xl text-center flex flex-col items-center justify-center border border-outline-variant/20 shadow-sm animate-in fade-in">
          <span className="material-symbols-outlined text-4xl mb-2 text-outline">history</span>
          <span className="font-bold">Driver has passed your stop.</span>
        </div>
      );
    }

    if (stopsAway === 0) {
      return (
        <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex items-center justify-between shadow-sm animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined">directions_car</span>
            </div>
            <div>
              <p className="text-secondary font-extrabold text-sm uppercase tracking-wider mb-0.5">Arriving Soon!</p>
              <p className="text-primary font-bold text-lg leading-tight">Heading to your stop</p>
            </div>
          </div>
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-surface-container-lowest border border-outline-variant/10 p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center font-bold text-lg border border-outline-variant/20 shadow-inner">
            {stopsAway}
          </div>
          <div>
            <p className="text-on-surface-variant font-bold text-xs uppercase tracking-wider mb-0.5">estimated arrival</p>
            <p className="text-on-surface font-bold text-lg leading-tight">
              {stopsAway} stop{stopsAway > 1 ? 's' : ''} away
            </p>
          </div>
        </div>
        <div className="bg-secondary/10 text-secondary w-8 h-8 shrink-0 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px] animate-bounce">location_on</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Dynamic Banner */}
      {renderBanner()}

      {/* 2. Full Route Timeline */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 text-center">Route Progress</h4>
        
        <div className="relative ml-4">
          {/* Vertical tracking line */}
          <div className="absolute top-2 bottom-6 left-[10px] w-0.5 bg-outline-variant/30"></div>

          {sortedStops.map((stop) => {
            const isCompleted = completedStops.includes(stop.id);
            const isMyStop = stop.id === myStopId;

            let iconHtml;
            let iconClasses = "bg-surface-container-lowest border-outline-variant/30";
            
            if (isCompleted) {
              iconClasses = "bg-primary text-on-primary border-primary";
              iconHtml = <span className="material-symbols-outlined text-[14px]">check</span>;
            } else if (isMyStop) {
              iconClasses = "bg-secondary text-on-secondary border-secondary ring-4 ring-secondary/20";
              iconHtml = <span className="material-symbols-outlined text-[14px]">person_raised_hand</span>;
            } else {
              iconClasses = "bg-surface-container border-outline-variant/50";
              iconHtml = <div className="w-2 h-2 rounded-full bg-outline-variant/40"></div>;
            }

            return (
              <div key={stop.id} className="relative flex items-center mb-6 last:mb-0">
                {/* Node */}
                <div className={`absolute -left-[14px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${iconClasses}`}>
                  {iconHtml}
                </div>
                
                {/* Content */}
                <div className={`pl-8 ${isCompleted ? 'text-on-surface-variant opacity-60 line-through' : 'text-on-surface'} ${isMyStop ? 'font-bold' : 'font-medium'}`}>
                  {stop.name}
                  {isMyStop && <span className="ml-2 text-[10px] uppercase font-bold tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">My Stop</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
