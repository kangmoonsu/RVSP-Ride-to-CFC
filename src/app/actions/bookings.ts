'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBooking(formData: FormData) {
  const supabase = await createClient()
  
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    throw new Error('Not authenticated')
  }

  const runId = formData.get('run_id') as string
  const pickupStopId = formData.get('pickup_stop_id') as string
  const needsReturnRide = formData.get('needs_return_ride') === 'true'

  // We find the user_id in the `users` table corresponding to the auth.user()
  const { data: dbUser } = await supabase.from('users').select('id').eq('id', userData.user.id).single()
  
  if (!dbUser) {
    throw new Error('User profile not found')
  }

  const { error } = await supabase.from('ride_bookings').insert({
    run_id: runId,
    rider_id: dbUser.id,
    pickup_stop_id: pickupStopId,
    needs_return_ride: needsReturnRide,
    status: 'pending'
  })

  if (error) {
    console.error('Error creating booking:', error)
    throw new Error(error.message)
  }

  revalidatePath('/rider/dashboard')
}

export async function getRiderBookings(riderId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.from('ride_bookings').select(`
    *,
    run:route_runs(
      scheduled_date, 
      status, 
      route:routes(name)
    ),
    pickup_stop:route_stops(location_name)
  `).eq('rider_id', riderId).order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rider bookings:', error)
    return []
  }

  return data
}
