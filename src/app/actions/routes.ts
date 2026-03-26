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
