// app/buzon/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '../../lib/supabaseClientPublic'

type SocioPerfil = {
  nombre: string | null
  email: string | null
}

export default function BuzonPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [perfil, setPerfil] = useState<SocioPerfil | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const { data: sessionData } = await supabaseBrowserClient.auth.getSession()

      if (!sessionData.session) {
        // No autenticado → /login
        router.replace('/login')
        return
      }

      const user = sessionData.session.user

      // Cargar perfil desde la tabla socios
      const { data: socio, error } = await supabaseBrowserClient
        .from('socios')
        .select('nombre, email')
        .eq('id', user.id)
        .single()

      if (error) {
        // Si falla el perfil, no rompemos el flujo
        setPerfil({
          nombre: user.email ?? 'Socio',
          email: user.email ?? null,
        })
      } else {
        setPerfil({
          nombre: socio?.nombre ?? user.email ?? 'Socio',
          email: socio?.email ?? user.email ?? null,
        })
      }

      setCheckingAuth(false)
    }

    loadData()
  }, [router])

  if (checkingAuth) {
    return <p>Cargando...</p>
  }

  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>Buzón de sugerencias</h1>
      <p>
        Bienvenido, <strong>{perfil?.nombre ?? 'Socio'}</strong>
      </p>

      <p style={{ marginTop: '0.75rem' }}>
        Aquí más adelante podrás crear, ver y gestionar tus sugerencias para la AG RBB.
      </p>

      <button
        style={{ marginTop: '1rem' }}
        onClick={() => router.push('/logout')}
      >
        Cerrar sesión
      </button>
    </main>
  )
}
