import { useState, useEffect, useRef } from 'react'
import { supabaseBrowserClient } from '@/lib/supabaseClientPublic'
import type { User } from '@supabase/supabase-js'

export function useSession() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const hasChecked = useRef(false)

  useEffect(() => {
    if (hasChecked.current) return

    const getSession = async () => {
      try {
        setLoading(true)
        // Usamos getUser para mayor seguridad validando contra el servidor, 
        // o getSession si preferimos velocidad y no requerimos revalidación estricta inmediata.
        // El código original usaba getUser en useAuth y getSession en page.tsx.
        // Estandarizaremos a getUser para consistencia y seguridad.
        const { data: { user: currentUser }, error } = await supabaseBrowserClient.auth.getUser()
        
        if (error) {
           // Si hay error (ej. no sesión), user es null
           setUser(null)
        } else {
           setUser(currentUser)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setUser(null)
      } finally {
        setLoading(false)
        hasChecked.current = true
      }
    }

    getSession()
  }, [])

  return { user, loading }
}
