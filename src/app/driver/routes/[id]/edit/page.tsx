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

  const [stopsResult, upcomingRunResult] = await Promise.all([
    supabase
      .from('route_stops')
      .select('*')
      .eq('route_id', route.id)
      .order('stop_order', { ascending: true }),
    // Fetch the next scheduled/in-progress run so the driver can edit its date
    supabase
      .from('route_runs')
      .select('id, scheduled_date')
      .eq('route_id', route.id)
      .in('status', ['scheduled', 'in-progress'])
      .order('scheduled_date', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <EditRouteForm
      route={route}
      initialStops={stopsResult.data || []}
      upcomingRun={upcomingRunResult.data ?? null}
    />
  );
}
