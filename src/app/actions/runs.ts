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
