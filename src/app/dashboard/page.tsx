import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  
  if (profile?.role === 'coordinator') {
    return redirect('/coordinator/dashboard')
  }
  
  if (profile?.role === 'driver') {
    return redirect('/driver/dashboard')
  }
  
  return redirect('/rider/dashboard')
}
