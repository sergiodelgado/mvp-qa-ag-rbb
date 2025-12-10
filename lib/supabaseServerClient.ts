// lib/supabaseServerClient.ts
// Cliente de Supabase para rutas app/api/* con Next.js App Router.
// Usa cookies() de forma asíncrona (Next 16) y es tolerante a tipos de TS.

import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

type SupabaseResponse = {
  supabase: SupabaseClient
}

export async function supabaseFromRequest(_req: NextRequest): Promise<SupabaseResponse> {
  // En Next 16 cookies() es dinámica y devuelve un Promise en rutas app
  const cookieStore = await cookies()

  const supabaseUrl =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ''

  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_ANON_KEY o NEXT_PUBLIC_* no están configuradas'
    )
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        // cast a any para evitar el error de TS con Promise<ReadonlyRequestCookies>
        return (cookieStore as any).get(name)?.value
      },
      set(name: string, value: string, options: any) {
        ;(cookieStore as any).set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        ;(cookieStore as any).set({ name, value: '', ...options, maxAge: 0 })
      }
    }
  })

  return { supabase }
}
