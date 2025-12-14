// lib/supabaseClientPublic.ts
// Cliente de Supabase para el navegador (frontend) usando @supabase/ssr
// Importante: NO romper el build si faltan envs (p.ej. en PRs de Dependabot).
// Si falta configuración, fallar recién cuando la UI intente usar el cliente.

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

function missingEnvProxy(): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get() {
      throw new Error(
        'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Configura .env.local o Secrets en GitHub Actions.'
      )
    }
  })
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseBrowserClient: SupabaseClient =
  url && anonKey ? createBrowserClient(url, anonKey) : missingEnvProxy()
