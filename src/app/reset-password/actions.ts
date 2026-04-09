'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirm = formData.get('confirm_password') as string

  if (password !== confirm) {
    return redirect('/reset-password?error=' + encodeURIComponent('Passwords do not match.'))
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return redirect('/reset-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/dashboard?message=Password updated successfully.')
}
