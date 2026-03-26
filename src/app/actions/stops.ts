'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRouteStops(routeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('route_stops')
    .select('*')
    .eq('route_id', routeId)
    .order('stop_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching stops:', error)
    return []
  }
  return data
}

export async function addRouteStop(formData: FormData) {
  const supabase = await createClient()
  
  const routeId = formData.get('route_id') as string
  const locationName = formData.get('location_name') as string
  const lat = parseFloat(formData.get('lat') as string)
  const lng = parseFloat(formData.get('lng') as string)
  const estimatedOffsetMinutes = parseInt(formData.get('estimated_offset_minutes') as string) || 0;
  
  // Calculate the next stop_order number
  const { data: existingStops } = await supabase
    .from('route_stops')
    .select('stop_order')
    .eq('route_id', routeId)
    .order('stop_order', { ascending: false })
    .limit(1)
    
  const nextOrder = existingStops && existingStops.length > 0 ? existingStops[0].stop_order + 1 : 1

  const { error } = await supabase.from('route_stops').insert({
    route_id: routeId,
    location_name: locationName,
    lat,
    lng,
    stop_order: nextOrder,
    estimated_offset_minutes: estimatedOffsetMinutes
  })

  if (error) {
    console.error('Error adding stop:', error)
    throw new Error(error.message)
  }

  revalidatePath(`/coordinator/routes/${routeId}`)
}

export async function deleteRouteStop(stopId: string, routeId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('route_stops')
    .delete()
    .eq('id', stopId)

  if (error) {
    console.error('Error deleting stop:', error)
    throw new Error(error.message)
  }

  revalidatePath(`/coordinator/routes/${routeId}`)
}
