// app/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '../lib/supabaseClientPublic'

export default function HomePage() {
  const router = useRouter()
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabaseBrowserClient.auth.getSession()
      if (data.session) {
        router.replace('/buzon')
      } else {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router])

  if (checkingSession) {
    return <p>Cargando...</p>
  }

  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>MVP QA · AG RBB – Buzón de Sugerencias</h1>
      <p>
        Bienvenido. Este es el MVP del buzón de sugerencias para la AG RBB. Para continuar, inicia
        sesión o regístrate.
      </p>

      <ul style={{ marginTop: '1rem' }}>
        <li>
          <Link href="/login">Ir a login</Link>
        </li>
        <li>
          <Link href="/register">Registrarse</Link>
        </li>
      </ul>
    </main>
  )
}
