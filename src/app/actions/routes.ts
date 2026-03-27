'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getRoutes() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('routes').select(`
    *,
    default_driver:users!routes_default_driver_id_fkey(full_name)
  `).order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching routes:', error)
    return []
  }

  return data
}

export async function getRouteById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('routes').select(`
    *,
    default_driver:users!routes_default_driver_id_fkey(full_name)
  `).eq('id', id).single()

  if (error) {
    console.error('Error fetching route:', error)
    return null
  }
  return data
}

export async function createRoute(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const defaultDriverId = formData.get('default_driver_id') as string

  // Insert into DB
  const { error } = await supabase.from('routes').insert({
    name,
    description,
    default_driver_id: defaultDriverId || null
  })

  if (error) {
    console.error('Error creating route:', error)
    return redirect(`/coordinator/routes/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/coordinator/dashboard')
  redirect('/coordinator/dashboard')
}

export async function createDriverRoute(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  // Insert into DB with current user as default diver
  const { error } = await supabase.from('routes').insert({
    name,
    description,
    default_driver_id: user.id
  })

  if (error) {
    console.error('Error creating route:', error)
    return redirect(`/driver/routes/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/driver/dashboard')
  redirect('/driver/dashboard')
}

function getNextOccurence(dayOfWeek: string, timeStr: string): Date {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDay = days.indexOf(dayOfWeek);
  
  const now = new Date();
  const currentDay = now.getDay();
  
  let daysUntil = targetDay - currentDay;
  if (daysUntil < 0) {
    daysUntil += 7;
  }
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntil);
  nextDate.setHours(hours, minutes, 0, 0);
  
  // If the day is today, but the time has already passed, schedule for next week
  if (daysUntil === 0 && nextDate < now) {
    nextDate.setDate(nextDate.getDate() + 7);
  }
  
  return nextDate;
}

export async function createDriverRouteWithRun(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const name = formData.get('name') as string
  const capacity = parseInt(formData.get('capacity') as string || '4', 10)
  const scheduleDay = formData.get('schedule_day') as string
  const scheduleTime = formData.get('schedule_time') as string
  const rsvpDay = formData.get('rsvp_day') as string
  const rsvpTime = formData.get('rsvp_time') as string
  const stopsCount = parseInt(formData.get('stops_count') as string || '0', 10)

  // 1. Create Route Blueprint
  const { data: route, error: routeError } = await supabase.from('routes').insert({
    name,
    description: `RSVP Deadline: Every ${rsvpDay} at ${rsvpTime}`,
    default_driver_id: user.id,
    capacity,
    schedule_day: scheduleDay,
    schedule_time: scheduleTime,
    rsvp_day: rsvpDay,
    rsvp_time: rsvpTime
  }).select().single()

  if (routeError || !route) {
    console.error('Error creating route:', routeError)
    return redirect(`/driver/routes/new?error=${encodeURIComponent(routeError?.message || 'Failed to create route')}`)
  }

  // 2. Create Stops
  const stopsToInsert = [];
  for (let i = 0; i < stopsCount; i++) {
    const locName = formData.get(`stop_${i}_name`) as string;
    const lat = parseFloat(formData.get(`stop_${i}_lat`) as string || '0');
    const lng = parseFloat(formData.get(`stop_${i}_lng`) as string || '0');
    if (locName) {
      stopsToInsert.push({
        route_id: route.id,
        location_name: locName,
        stop_order: i + 1,
        lat: lat,
        lng: lng,
        estimated_offset_minutes: i * 15 // Example logic
      });
    }
  }

  if (stopsToInsert.length > 0) {
    await supabase.from('route_stops').insert(stopsToInsert);
  }

  // 3. Create First Route Run for the Next Occurring Day
  const nextRunDate = getNextOccurence(scheduleDay, scheduleTime);
  
  const { error: runError } = await supabase.from('route_runs').insert({
    route_id: route.id,
    driver_id: user.id,
    scheduled_date: nextRunDate.toISOString(),
    status: 'scheduled'
  })

  // We could theoretically schedule out a few weeks of runs here, or have a cron job do it

  if (runError) {
    console.error('Error creating run:', runError)
  }

  revalidatePath('/rider/dashboard')
  revalidatePath('/driver/dashboard')
  redirect('/driver/dashboard')
}

export async function deleteRoute(routeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: runs } = await supabase.from('route_runs').select('id').eq('route_id', routeId)
  if (runs && runs.length > 0) {
    const runIds = runs.map(r => r.id)
    await supabase.from('ride_bookings').delete().in('run_id', runIds)
    await supabase.from('route_runs').delete().in('id', runIds)
  }

  await supabase.from('route_stops').delete().eq('route_id', routeId)
  
  const { error } = await supabase.from('routes').delete().eq('id', routeId).eq('default_driver_id', user.id)
  
  if (error) {
    console.error('Error deleting route:', error)
    throw new Error(error.message)
  }

  revalidatePath('/driver/dashboard')
  revalidatePath('/rider/dashboard')
}

export async function updateRouteBlueprint(routeId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const capacity = parseInt(formData.get('capacity') as string || '4', 10)
  const scheduleDay = formData.get('schedule_day') as string
  const scheduleTime = formData.get('schedule_time') as string
  const rsvpDay = formData.get('rsvp_day') as string
  const rsvpTime = formData.get('rsvp_time') as string

  const { error } = await supabase.from('routes').update({
    capacity,
    schedule_day: scheduleDay,
    schedule_time: scheduleTime,
    rsvp_day: rsvpDay,
    rsvp_time: rsvpTime,
    description: `RSVP Deadline: Every ${rsvpDay} at ${rsvpTime}`
  }).eq('id', routeId).eq('default_driver_id', user.id)

  if (error) {
    console.error('Error updating route:', error)
    throw new Error(error.message)
  }

  revalidatePath('/driver/dashboard')
  revalidatePath('/rider/dashboard')
  redirect('/driver/dashboard')
}
