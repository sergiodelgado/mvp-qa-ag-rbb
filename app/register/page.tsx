// app/register/page.tsx
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '../../lib/supabaseClientPublic'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabaseBrowserClient.auth.getSession()
      if (data.session) {
        // Si ya está autenticado, no tiene sentido registrar otro usuario → a /buzon
        router.replace('/buzon')
      }
    }

    checkSession()
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setLoading(true)

    // 1) Crear usuario en Supabase Auth
    const { data, error } = await supabaseBrowserClient.auth.signUp({
      email,
      password,
    })

    if (error || !data.user) {
      setLoading(false)
      setErrorMessage('No se pudo completar el registro. Revisa los datos ingresados.')
      return
    }

    // 2) Crear registro en tabla socios
    const userId = data.user.id

    const { error: insertError } = await supabaseBrowserClient.from('socios').insert([
      {
        id: userId,
        email,
        nombre,
        // rol y estado pueden quedar con valores por defecto definidos en la BD
      },
    ])

    setLoading(false)

    if (insertError) {
      setErrorMessage(
        'El usuario se creó en autenticación, pero falló la creación del perfil. Contacta soporte.'
      )
      return
    }

    // 3) Mostrar mensaje y redirigir SIEMPRE a /login
    setSuccessMessage('Registro exitoso. Ahora puedes iniciar sesión.')
    router.replace('/login')
  }

  return (
    <main style={{ padding: '1.5rem', maxWidth: 400 }}>
      <h1>Registro</h1>
      <p>Crea tu cuenta de socio para usar el buzón de sugerencias.</p>

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

        <label>
          Nombre o alias
          <input
            type="text"
            value={nombre}
            onChange={event => setNombre(event.target.value)}
            required
          />
        </label>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </main>
  )
}
