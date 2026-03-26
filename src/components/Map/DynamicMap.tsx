'use client';

import dynamic from 'next/dynamic';
import { RouteMapProps } from './RouteMap';

// Dynamically import RouteMap so it doesn't cause SSR issues with window object required by Leaflet
const DynamicMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-surface-container-lowest rounded-[1.5rem] animate-pulse border border-outline-variant/10">
      <div className="flex flex-col items-center text-on-surface-variant gap-2 opacity-60">
        <span className="material-symbols-outlined text-4xl animate-bounce">map</span>
        <span className="font-medium">Loading Map...</span>
      </div>
    </div>
  )
});

export default function MapWrapper(props: RouteMapProps) {
  return <DynamicMap {...props} />;
}
