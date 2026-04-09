'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const fullName = (formData.get('full_name') as string)?.trim()
  if (!fullName || fullName.length < 2) {
    redirect('/profile?error=' + encodeURIComponent('Name must be at least 2 characters.'))
  }

  // Update auth metadata
  const { error: metaError } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  })

  if (metaError) {
    redirect('/profile?error=' + encodeURIComponent(metaError.message))
  }

  // Update public users table
  const { error: dbError } = await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (dbError) {
    redirect('/profile?error=' + encodeURIComponent(dbError.message))
  }

  revalidatePath('/profile')
  revalidatePath('/rider/dashboard')
  revalidatePath('/driver/dashboard')
  redirect('/profile?message=' + encodeURIComponent('Name updated successfully!'))
}

export async function updatePasswordFromProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const password = formData.get('password') as string
  const confirm = formData.get('confirm_password') as string

  if (!password || password.length < 6) {
    redirect('/profile?error=' + encodeURIComponent('Password must be at least 6 characters.'))
  }

  if (password !== confirm) {
    redirect('/profile?error=' + encodeURIComponent('Passwords do not match.'))
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/profile?error=' + encodeURIComponent(error.message))
  }

  redirect('/profile?message=' + encodeURIComponent('Password updated successfully!'))
}
