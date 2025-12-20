import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from './useSession'
import type { User } from '@supabase/supabase-js'

interface UseAuthOptions {
  requireAuth?: boolean      // Redirige a /login si no hay sesión
  redirectIfAuth?: boolean   // Redirige a /buzon si hay sesión
}

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter()
  const { user, loading } = useSession()

  useEffect(() => {
    if (loading) return

    if (!user && options.requireAuth) {
      router.replace('/login')
    } else if (user && options.redirectIfAuth) {
      router.replace('/buzon')
    }
  }, [user, loading, router, options.requireAuth, options.redirectIfAuth])

  return { 
    user, 
    loading, 
    isAuthenticated: !!user 
  }
}

