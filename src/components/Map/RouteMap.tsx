'use client';

import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useRef } from 'react';

export interface StopData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sequence: number;
  isCompleted?: boolean;
}

export interface RouteMapProps {
  stops: StopData[];
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerDragEnd?: (stopId: string, lat: number, lng: number) => void;
  height?: string;
  routePath?: [number, number][]; // Arr of [lat, lng] for polyline
  driverLocation?: { lat: number, lng: number } | null;
}

const libraries: "places"[] = ["places"];

export default function RouteMap({ stops, onMapClick, onMarkerDragEnd, height = '400px', routePath = [], driverLocation = null }: RouteMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const defaultCenter = stops.length > 0 && stops[0].lat !== 0 ? { lat: stops[0].lat, lng: stops[0].lng } : { lat: 34.0522, lng: -118.2437 };

  // Fit bounds when stops change
  useEffect(() => {
    if (mapRef.current && stops.length > 0) {
      const validStops = stops.filter(s => s.lat !== 0 && s.lng !== 0 && !isNaN(s.lat) && !isNaN(s.lng));
      if (validStops.length > 0) {
        if (validStops.length === 1) {
          mapRef.current.panTo({ lat: validStops[0].lat, lng: validStops[0].lng });
          mapRef.current.setZoom(14);
        } else {
          const bounds = new window.google.maps.LatLngBounds();
          validStops.forEach(s => bounds.extend({ lat: s.lat, lng: s.lng }));
          mapRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        }
      }
    }
  }, [stops]);

  if (loadError) return <div className="p-4 bg-error-container text-on-error-container rounded-2xl">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="flex h-full w-full items-center justify-center p-4">Loading maps...</div>;

  return (
    <div style={{ height, width: '100%' }} className="rounded-[1.5rem] overflow-hidden shadow-sm border border-outline-variant/20 relative z-0">
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={defaultCenter}
        zoom={13}
        onLoad={(map) => { mapRef.current = map; }}
        onClick={(e) => {
          if (onMapClick && e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        }}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {stops.map((stop) => (
          stop.lat !== 0 ? (
            <Marker
              key={stop.id}
              position={{ lat: stop.lat, lng: stop.lng }}
              draggable={!!onMarkerDragEnd}
              label={{ text: stop.sequence.toString(), color: 'white', fontWeight: 'bold' }}
              title={stop.name}
              icon={stop.isCompleted ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : undefined}
              onDragEnd={(e) => {
                if (onMarkerDragEnd && e.latLng) {
                  onMarkerDragEnd(stop.id, e.latLng.lat(), e.latLng.lng());
                }
              }}
            />
          ) : null
        ))}

        {routePath.length > 0 && (
          <Polyline 
            path={routePath.map(p => ({ lat: p[0], lng: p[1] }))} 
            options={{ strokeColor: 'hsl(168, 100%, 15%)', strokeOpacity: 0.8, strokeWeight: 5 }} 
          />
        )}
        
        {driverLocation && (
           <Marker 
             position={{ lat: driverLocation.lat, lng: driverLocation.lng }} 
             icon={{
               path: window.google.maps.SymbolPath.CIRCLE,
               scale: 8,
               fillColor: '#4285F4',
               fillOpacity: 1,
               strokeColor: '#ffffff',
               strokeWeight: 2,
             }}
             title="Driver Live GPS"
           />
        )}
      </GoogleMap>
    </div>
  );
}
