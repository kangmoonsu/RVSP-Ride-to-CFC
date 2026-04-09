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

  // --- Duplicate booking prevention ---
  // Get the route_id for this run, and only look at runs that are still active
  const { data: runData } = await supabase.from('route_runs').select('route_id').eq('id', runId).single()
  if (runData?.route_id) {
    // Find only ACTIVE (scheduled/in-progress) runs for this route — NOT completed ones
    const { data: activeRouteRuns } = await supabase
      .from('route_runs')
      .select('id')
      .eq('route_id', runData.route_id)
      .in('status', ['scheduled', 'in-progress'])
    if (activeRouteRuns && activeRouteRuns.length > 0) {
      const activeRunIds = activeRouteRuns.map(r => r.id)
      // Check if rider already has a confirmed/pending booking on any ACTIVE run of this route
      const { data: existingBooking } = await supabase
        .from('ride_bookings')
        .select('id, status')
        .eq('rider_id', dbUser.id)
        .in('run_id', activeRunIds)
        .in('status', ['pending', 'confirmed'])
        .maybeSingle()

      if (existingBooking) {
        throw new Error('You already have an active booking for this route.')
      }
    }
  }
  // --- End duplicate check ---

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
      id,
      scheduled_date, 
      status,
      route_id,
      route:routes(id, name)
    ),
    pickup_stop:route_stops(location_name)
  `).eq('rider_id', riderId).order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rider bookings:', error)
    return []
  }

  return data
}

export async function approveBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Update status
  const { data, error } = await supabase
    .from('ride_bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId)
    .select('*, rider:users!ride_bookings_rider_id_fkey(email, full_name), run:route_runs(scheduled_date, route:routes(name))')

  if (error) {
    throw new Error(error.message || 'Update failed')
  }
  
  if (!data || data.length === 0) {
    throw new Error('Booking not found or you do not have permission to update it.')
  }

  const updatedBooking = data[0];

  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    const { Resend } = await import('resend')
    const resend = new Resend(resendApiKey)
    const riderEmail = updatedBooking.rider?.email
    const riderName = updatedBooking.rider?.full_name
    const routeName = updatedBooking.run?.route?.name || 'Your Route'
    
    await resend.emails.send({
      from: 'CFC Rides <contact.michaeldev@gmail.com>', // Change to verified domain when ready
      to: [riderEmail],
      subject: `Your Ride for ${routeName} is Confirmed!`,
      html: `<p>Hello ${riderName},</p><p>Your driver has just formally approved your seat for <strong>${routeName}</strong> on ${new Date(updatedBooking.run?.scheduled_date).toLocaleString()}.</p><p>Get ready!</p>`
    })
  } else {
    console.log(`[SIMULATED EMAIL] To: ${updatedBooking.rider?.email} - Your ride is confirmed!`)
  }

  revalidatePath('/driver/dashboard')
  revalidatePath('/rider/dashboard')
}
