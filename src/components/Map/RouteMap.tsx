'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix for default Leaflet icons in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface StopData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sequence: number;
}

export interface RouteMapProps {
  stops: StopData[];
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  routePath?: [number, number][]; // Arr of [lat, lng] for polyline
  driverLocation?: { lat: number, lng: number } | null;
}

export default function RouteMap({ stops, onMapClick, height = '400px', routePath = [], driverLocation = null }: RouteMapProps) {
  // Default center (can be somewhere central, or first stop)
  const defaultCenter: [number, number] = stops.length > 0 ? [stops[0].lat, stops[0].lng] : [34.0522, -118.2437]; // Default to LA for now

  return (
    <div style={{ height, width: '100%' }} className="rounded-[1.5rem] overflow-hidden shadow-sm border border-outline-variant/20 relative z-0">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {stops.map((stop) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]}>
            <Popup>
              <strong>{stop.sequence}. {stop.name}</strong>
            </Popup>
          </Marker>
        ))}

        {routePath.length > 0 && (
          <Polyline positions={routePath} color="hsl(168, 100%, 10%)" weight={4} opacity={0.7} />
        )}
        
        {driverLocation && (
          <Marker position={[driverLocation.lat, driverLocation.lng]}>
             <Popup>
               <strong>Driver's Live Location</strong>
             </Popup>
          </Marker>
        )}

        {/* Simple click handler wrapper for the map */}
        <MapEventsHandler onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}

// Separate component to handle map events because useMapEvents needs to be inside MapContainer
import { useMapEvents } from 'react-leaflet';

function MapEventsHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}
