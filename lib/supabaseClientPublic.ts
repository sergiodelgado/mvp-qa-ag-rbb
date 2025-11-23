// lib/supabaseClientPublic.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno'
  )
}

// Cliente para usar exclusivamente en el navegador (componentes con "use client")
export const supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey)
