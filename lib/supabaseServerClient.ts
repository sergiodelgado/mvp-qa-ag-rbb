// lib/supabaseServerClient.ts
// Cliente de Supabase para backend (route handlers, server components)

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY para configurar Supabase (server).'
  )
}

/**
 * Cliente clásico basado en cookies (para la UI Next.js).
 */
export async function supabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = cookies()

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

/**
 * Cliente híbrido para API:
 * - Si viene Authorization: Bearer <token> → usa ese token (modo Postman/F3b).
 * - Si no viene header → cae al modo cookies (UI navegador).
 */
export async function supabaseFromRequest(req: Request): Promise<SupabaseClient> {
  const authHeader = req.headers.get('authorization')

  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    // Modo token (Postman / F3b)
    return createClient(url, anonKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    })
  }

  // Modo cookies (UI Next.js)
  return supabaseServerClient()
}
