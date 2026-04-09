import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import EditRouteForm from './EditRouteForm';

export default async function DriverEditRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: routeData } = await supabase
    .from('routes')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('default_driver_id', user.id)
    .single();

  const route = routeData as any;

  if (!route) {
    redirect('/driver/dashboard');
  }

  const { data: stopsData } = await supabase
    .from('route_stops')
    .select('*')
    .eq('route_id', route.id)
    .order('stop_order', { ascending: true });

  return <EditRouteForm route={route} initialStops={stopsData || []} />;
}
