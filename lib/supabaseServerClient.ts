// lib/supabaseServerClient.ts
// Clientes de Supabase para backend:
// - supabaseServerClient(): usa cookies() (UI / SSR Next)
// - supabaseFromRequest(req): usa Authorization header (API / Postman)

import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

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
 * Cliente para route handlers que reciben Authorization: Bearer <token>
 * o cookies de sesión de Supabase (caso Postman / Newman / UI)
 */
export function supabaseFromRequest(req: NextRequest) {
  const authHeader =
    req.headers.get('authorization') || req.headers.get('Authorization') || ''

  const response = NextResponse.next({
    request: {
      headers: req.headers
    }
  })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          response.cookies.set({ name, value, ...options })
        } catch (err) {
          console.error('Error setting cookie from request:', err)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          response.cookies.set({ name, value: '', ...options, maxAge: 0 })
        } catch (err) {
          console.error('Error removing cookie from request:', err)
        }
      }
    },
    global: authHeader
      ? {
          headers: {
            Authorization: authHeader
          }
        }
      : undefined
  })

  return { supabase, response }
}
