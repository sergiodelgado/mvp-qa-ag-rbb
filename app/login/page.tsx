// app/login/page.tsx
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '../../lib/supabaseClientPublic'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabaseBrowserClient.auth.getSession()
      if (data.session) {
        // Usuario ya autenticado → redirigir a /buzon
        router.replace('/buzon')
      }
    }

    checkSession()
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    const { error } = await supabaseBrowserClient.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMessage('Credenciales inválidas. Revisa tu email y contraseña.')
      return
    }

    // Login exitoso → /buzon
    router.replace('/buzon')
  }

  return (
    <main style={{ padding: '1.5rem', maxWidth: 400 }}>
      <h1>Login</h1>
      <p>Ingresa con tu email y contraseña de socio.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginTop: '1rem',
        }}
      >
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />
        </label>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}
