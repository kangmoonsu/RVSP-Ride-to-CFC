'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRouteRun(formData: FormData) {
  const supabase = await createClient()

  const routeId = formData.get('route_id') as string
  const scheduledDate = formData.get('scheduled_date') as string
  let driverId = formData.get('driver_id') as string | null
  
  if (driverId === '') driverId = null;

  const { error } = await supabase.from('route_runs').insert({
    route_id: routeId,
    scheduled_date: scheduledDate,
    driver_id: driverId,
    status: 'scheduled'
  })

  if (error) {
    console.error('Error creating route run:', error)
    throw new Error(error.message)
  }

  revalidatePath(`/coordinator/routes/${routeId}`)
  revalidatePath('/coordinator/dashboard')
  revalidatePath('/rider/dashboard')
}

export async function updateRunStatus(runId: string, status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled') {
  const supabase = await createClient()

  const { error } = await supabase.from('route_runs').update({
    status
  }).eq('id', runId)

  if (error) {
    console.error('Error updating run status:', error)
    throw new Error(error.message)
  }

  revalidatePath('/coordinator/dashboard')
  revalidatePath('/driver/dashboard')
}

export async function completeAndRecreateRun(runId: string, recreateNextWeek: boolean) {
  const supabase = await createClient()

  // First mark the current run as completed
  const { error: updateError } = await supabase.from('route_runs').update({
    status: 'completed'
  }).eq('id', runId)

  if (updateError) {
    console.error('Error completing run:', updateError)
    throw new Error(updateError.message)
  }

  // If driver requested to recreate the run for next week
  if (recreateNextWeek) {
    const { data: run, error: fetchError } = await supabase.from('route_runs').select('*').eq('id', runId).single()
    
    if (fetchError || !run) {
      console.error('Error fetching run to recreate:', fetchError)
      throw new Error(fetchError?.message || 'Run not found')
    }

    const nextDate = new Date(run.scheduled_date)
    nextDate.setDate(nextDate.getDate() + 7)

    const { error: createError } = await supabase.from('route_runs').insert({
      route_id: run.route_id,
      scheduled_date: nextDate.toISOString(),
      driver_id: run.driver_id,
      status: 'scheduled'
    })

    if (createError) {
      console.error('Error recreating run:', createError)
      throw new Error(createError.message)
    }
  }

  revalidatePath('/coordinator/dashboard')
  revalidatePath('/driver/dashboard')
}

export async function getActiveRuns() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('route_runs').select(`
    *,
    route:routes(id, name, description, route_stops(id, location_name, stop_order)),
    driver:users!route_runs_driver_id_fkey(full_name)
  `).in('status', ['scheduled', 'in-progress']).order('scheduled_date', { ascending: true })

  if (error) {
    console.error('Error fetching active runs:', error)
    return []
  }

  return data
}

export async function checkOffStop(runId: string, stopId: string) {
  const supabase = await createClient()

  const { data: run, error: fetchError } = await supabase.from('route_runs').select('completed_stop_ids').eq('id', runId).single()
  
  if (fetchError) {
    console.error('Error fetching run:', fetchError)
    throw new Error(fetchError.message)
  }

  const currentStops = run.completed_stop_ids || []
  if (!currentStops.includes(stopId)) {
    const { error } = await supabase.from('route_runs').update({
      completed_stop_ids: [...currentStops, stopId]
    }).eq('id', runId)
    
    if (error) {
      console.error('Error updating stops:', error)
      throw new Error(error.message)
    }
  }

  revalidatePath('/driver/dashboard')
  revalidatePath('/rider/dashboard')
}

export async function updateRunLocation(runId: string, lat: number, lng: number) {
  const supabase = await createClient()
  await supabase.from('route_runs').update({
    current_lat: lat,
    current_lng: lng,
    location_updated_at: new Date().toISOString()
  }).eq('id', runId)
}
