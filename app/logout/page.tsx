// app/logout/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '../../lib/supabaseClientPublic'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const doLogout = async () => {
      await supabaseBrowserClient.auth.signOut()
      router.replace('/login')
    }

    doLogout()
  }, [router])

  return (
    <main style={{ padding: '1.5rem' }}>
      <p>Cerrando sesión...</p>
    </main>
  )
}
