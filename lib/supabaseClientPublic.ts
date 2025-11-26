// lib/supabaseClientPublic.ts
// Cliente de Supabase para el navegador (frontend) usando @supabase/ssr
// Esto guarda la sesión en cookies compatibles con createServerClient.

import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY para configurar Supabase (browser).'
  )
}

// Cliente único reutilizable en toda la app
export const supabaseBrowserClient = createBrowserClient(url, anonKey)
