// lib/supabaseServerClient.ts
// Clientes de Supabase para backend:
// - supabaseServerClient(): usa cookies() (UI / SSR Next)
// - supabaseFromRequest(req): usa Authorization header (API / Postman)

import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY para configurar Supabase (server).'
  )
}

/**
 * Cliente para SSR / UI (usa cookies() de Next)
 * Lo pueden usar page.tsx, layout.tsx, etc.
 */
export async function supabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value ?? ''
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
 * Cliente para route handlers que reciben Authorization: Bearer <token>
 * (caso Postman / Newman en F3b)
 */
export function supabaseFromRequest(req: NextRequest) {
  const authHeader =
    req.headers.get('authorization') || req.headers.get('Authorization') || ''

  // Si no viene header, igual creamos cliente; auth.getUser() fallará y devolverá 401 en tu route.ts
  const headers: Record<string, string> = {}
  if (authHeader) {
    headers['Authorization'] = authHeader
  }

  return createClient(url, anonKey, {
    global: {
      headers
    }
  })
}
