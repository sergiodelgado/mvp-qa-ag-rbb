// lib/supabaseServerClient.ts
// Clientes Supabase para UI, SSR y API Routes (cookies + Authorization: Bearer)

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Lee y valida env vars SOLO cuando se necesita crear el cliente.
 * Evita fallos en build-time (Next puede importar módulos durante `next build`).
 */
function getSupabaseEnv() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_URL y SUPABASE_ANON_KEY son obligatorias')
  }

  return { supabaseUrl, supabaseAnonKey }
}

// ==============
// CLIENTE BROWSER
// ==============

export function supabaseClientPublic(): SupabaseClient {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ==============
// CLIENTE SSR / SERVER COMPONENTS
// ==============

export async function supabaseServerClient(): Promise<SupabaseClient> {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return (cookieStore as any).get(name)?.value
      },
      set(name: string, value: string, options: any) {
        ;(cookieStore as any).set(name, value, options)
      },
      remove(name: string, options: any) {
        ;(cookieStore as any).delete(name, options)
      }
    }
  })
}

// ==============
// CLIENTE PARA ROUTE HANDLERS (API Routes)
// - Usa cookies (UI)
// - Acepta Authorization: Bearer <token> (Postman/Newman)
// ==============

export async function supabaseFromRequest(
  req: NextRequest
): Promise<{ supabase: SupabaseClient }> {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  const cookieStore = await cookies()

  const authHeader = req.headers.get('authorization') ?? undefined

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return (cookieStore as any).get(name)?.value
      },
      set(name: string, value: string, options: any) {
        ;(cookieStore as any).set(name, value, options)
      },
      remove(name: string, options: any) {
        ;(cookieStore as any).delete(name, options)
      }
    },
    global: authHeader
      ? {
          headers: { Authorization: authHeader }
        }
      : undefined
  })

  return { supabase }
}

// ==============
// CLIENTE ADMIN (SERVICE ROLE) - SOLO SERVER
// ==============

export function supabaseAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son obligatorias para operaciones admin')
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() { return [] },
      setAll() {}
    }
  })
}
