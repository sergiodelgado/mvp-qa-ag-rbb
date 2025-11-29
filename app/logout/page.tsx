'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '@/lib/supabaseClientPublic'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const doLogout = async () => {
      try {
        await supabaseBrowserClient.auth.signOut()
      } finally {
        router.replace('/login')
      }
    }

    doLogout()
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <p className="text-lg">Cerrando sesión...</p>
    </main>
  )
}
