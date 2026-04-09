'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createDriverRouteWithRun } from '@/app/actions/routes';
import dynamic from 'next/dynamic';
import { useJsApiLoader } from '@react-google-maps/api';

const RouteMap = dynamic(() => import('@/components/Map/RouteMap'), { ssr: false });

const libraries: "places"[] = ["places"];

function DriverNewRouteForm() {
  const [stops, setStops] = useState([{ id: '1', location_name: '', lat: 0, lng: 0, sequence: 1 }]);
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Autocomplete state
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchParams = useSearchParams();
  const errorMsg = searchParams.get('error');

  const addStop = () => {
    setStops([...stops, { id: Math.random().toString(), location_name: '', lat: 0, lng: 0, sequence: stops.length + 1 }]);
  };

  const removeStop = (index: number) => {
    if (stops.length > 1) {
      setStops(stops.filter((_, i) => i !== index).map((s, i) => ({ ...s, sequence: i + 1 })));
    }
  };

  const insertStopAfter = (index: number) => {
    const newStops = [...stops];
    newStops.splice(index + 1, 0, { id: Math.random().toString(), location_name: '', lat: 0, lng: 0, sequence: 0 });
    setStops(newStops.map((s, i) => ({ ...s, sequence: i + 1 })));
  };

  const fetchSuggestions = async (query: string, index: number) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    if (!window.google) return;

    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input: query, componentRestrictions: { country: 'us' } }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
      } else {
        setSuggestions([]);
      }
    });
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...stops];
    newStops[index].location_name = value;
    setStops(newStops);

    setActiveSearchIndex(index);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value, index);
    }, 400);
  };

  const selectSuggestion = (index: number, suggestion: any) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: suggestion.place_id }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        
        const newStops = [...stops];
        newStops[index].location_name = suggestion.description;
        newStops[index].lat = lat;
        newStops[index].lng = lng;
        setStops(newStops);
        setActiveSearchIndex(null);
        setSuggestions([]);
      }
    });
  };

  const handleMapClick = async (lat: number, lng: number) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      const placeName = status === 'OK' && results && results[0] ? results[0].formatted_address : `Pinned Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
      
      const newStops = [...stops];
      const lastStop = newStops[newStops.length - 1];
      
      if (!lastStop.location_name && lastStop.lat === 0) {
        lastStop.location_name = placeName;
        lastStop.lat = lat;
        lastStop.lng = lng;
      } else {
        newStops.push({
          id: Math.random().toString(),
          location_name: placeName,
          lat,
          lng,
          sequence: newStops.length + 1
        });
      }
      setStops(newStops);
    });
  };

  const handleMarkerDragEnd = async (stopId: string, lat: number, lng: number) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      const placeName = status === 'OK' && results && results[0] ? results[0].formatted_address : `Pinned Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
      
      setStops(prevStops => prevStops.map(s => {
        if (s.id === stopId) {
          return { ...s, lat, lng, location_name: placeName };
        }
        return s;
      }));
    });
  };

  if (loadError) return <div className="p-4 bg-error-container text-on-error-container rounded-2xl">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading Google Maps...</div>;

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <header className="sticky top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-xl shadow-[0_12px_40px_hsla(168,100%,10%,0.06)] flex items-center gap-4 px-6 py-4">
        <Link href="/driver/dashboard" className="p-2 hover:bg-stone-200/50 rounded-full transition-colors flex items-center">
          <span className="material-symbols-outlined text-teal-900">arrow_back</span>
        </Link>
        <h1 className="text-xl font-bold text-teal-900 font-manrope">Offer a Ride</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <section className="mb-8">
            <h2 className="text-4xl font-extrabold text-primary mb-2">Create Your Route</h2>
            <p className="text-on-surface-variant font-medium text-lg">Search stops and plot them on the map. You can drag the pins to the exact spot.</p>
          </section>

          {errorMsg && (
            <div className="bg-error-container text-on-error-container p-4 rounded-2xl mb-8 border border-error/20">
              {errorMsg}
            </div>
          )}

          <form action={createDriverRouteWithRun} className="space-y-8 bg-surface-container-lowest p-8 rounded-4xl shadow-sm border border-outline-variant/10">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Route Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                placeholder="e.g. Downtown to Church"
                className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Stops (Pickups)</label>
              <div className="space-y-4">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 relative">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {stop.sequence}
                      </div>

                      <div className="flex-1 relative">
                        <input 
                          type="text"
                          name={`stop_${index}_name`}
                          value={stop.location_name}
                          onChange={(e) => handleStopChange(index, e.target.value)}
                          onFocus={() => {
                            setActiveSearchIndex(index);
                            if (stop.location_name.length >= 3) fetchSuggestions(stop.location_name, index);
                          }}
                          onBlur={() => setTimeout(() => setActiveSearchIndex(null), 250)}
                          required
                          placeholder="Search address or street name..."
                          className="w-full bg-surface-container text-on-surface px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
                        />
                        <input type="hidden" name={`stop_${index}_lat`} value={stop.lat} />
                        <input type="hidden" name={`stop_${index}_lng`} value={stop.lng} />

                        {/* Autocomplete Dropdown */}
                        {activeSearchIndex === index && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-surface-container-high rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden text-sm">
                  {suggestions.map((s, i) => (
                    <div 
                      key={i} 
                      className="cursor-pointer px-4 py-3 hover:bg-surface-container-highest transition-colors border-b border-outline-variant/10 last:border-0 flex flex-col"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input onBlur from firing before click
                        selectSuggestion(index, s);
                      }}
                    >
                      <span className="font-bold text-on-surface">{s.structured_formatting?.main_text || s.description.split(',')[0]}</span>
                      <span className="text-on-surface-variant text-xs truncate max-w-full">{s.structured_formatting?.secondary_text || s.description}</span>
                    </div>
                  ))}
                </div>
              )}
                      </div>
                      
                      {stops.length > 1 && (
                        <button type="button" onClick={() => removeStop(index)} className="p-3 text-error hover:bg-error/10 rounded-xl transition-colors shrink-0">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      )}
                    </div>
                    {stop.lat !== 0 && stop.lng !== 0 && (
                       <span className="text-xs font-medium text-primary ml-10 flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px]">check_circle</span> Map pinned (Drag to adjust)
                       </span>
                    )}
                    
                    {/* Insert Stop Button Below */}
                    <div className="relative flex justify-center py-1">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-outline-variant/10"></div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => insertStopAfter(index)}
                        className="relative bg-surface-container-low border border-outline-variant/20 rounded-full w-6 h-6 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors z-10"
                        title="Insert stop below"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <input type="hidden" name="stops_count" value={stops.length} />
              <button type="button" onClick={addStop} className="mt-2 text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-[18px]">add</span> Add Another Stop
              </button>
            </div>

            <div className="space-y-2">
              <label htmlFor="capacity" className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total Seat Capacity</label>
              <input 
                type="number" 
                id="capacity" 
                name="capacity" 
                min="1"
                max="50"
                defaultValue="4"
                required 
                className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest">Departure Date & Time</label>
              <p className="text-xs text-on-surface-variant mb-2">When does this ride depart?</p>
              <input 
                type="datetime-local" 
                name="departure_datetime" 
                required 
                className="w-full bg-surface-container text-on-surface px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>


            <div className="pt-6">
              <button type="submit" className="w-full bg-primary text-on-primary font-bold py-4 rounded-full shadow-lg hover:bg-primary-container transition-colors">
                Publish Route & Schedule Next Run
              </button>
            </div>
          </form>
        </div>

        {/* Map Preview */}
        <div className="sticky top-24 h-[600px] bg-surface-container-low rounded-3xl p-4 shadow-sm border border-outline-variant/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Route Path Preview</h3>
          <RouteMap 
            stops={stops.filter(s => s.lat !== 0 && s.lng !== 0).map(s => ({ id: s.id, name: s.location_name, lat: s.lat, lng: s.lng, sequence: s.sequence }))} 
            routePath={stops.filter(s => s.lat !== 0 && s.lng !== 0).map(s => [s.lat, s.lng]) as [number, number][]}
            height="100%" 
            onMapClick={handleMapClick}
            onMarkerDragEnd={handleMarkerDragEnd}
          />
        </div>

      </main>
    </div>
  )
}

export default function DriverNewRoutePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DriverNewRouteForm />
    </React.Suspense>
  )
}
