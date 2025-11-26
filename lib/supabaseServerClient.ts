// lib/supabaseServerClient.ts
// Cliente de Supabase para usar en el backend (route handlers, server components)

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY para configurar Supabase (server).'
  )
}

export async function supabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (err) {
          console.error('Error setting cookie:', err)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        } catch (err) {
          console.error('Error removing cookie:', err)
        }
      }
    }
  })
}
