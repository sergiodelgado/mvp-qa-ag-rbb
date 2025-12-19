// app/register/page.tsx
'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '@/lib/supabaseClientPublic'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const router = useRouter()
  // Si ya hay sesión, redirige a /buzon automáticamente
  useAuth({ redirectIfAuth: true })
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return

    setErrorMessage(null)
    setSuccessMessage(null)

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedNombre = nombre.trim()

    if (!trimmedEmail || !trimmedPassword || !trimmedNombre) {
      setErrorMessage('Todos los campos son obligatorios')
      return
    }

    setLoading(true)

    try {
      // 1) Crear usuario en Supabase Auth
      const { data, error } = await supabaseBrowserClient.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword
      })

      console.log('SIGNUP RESULT:', { data, error })

      if (error || !data?.user) {
        setErrorMessage(
          `No se pudo completar el registro en Auth: ${
            error?.message ?? 'Error desconocido'
          }`
        )
        setLoading(false)
        return
      }

      const userId = data.user.id

      // 2) Crear registro en tabla socios
      const { data: insertData, error: insertError } = await supabaseBrowserClient
        .from('socios')
        .insert([
          {
            id: userId,
            email: trimmedEmail,
            nombre: trimmedNombre
          }
        ])
        .select()

      console.log('SOCIOS INSERT RESULT:', { insertData, insertError })

      if (insertError) {
        setErrorMessage(
          `El usuario se creó en autenticación, pero falló la creación del perfil: ${insertError.message}`
        )
        setLoading(false)
        return
      }

      // 3) Mostrar mensaje y redirigir SIEMPRE a /login
      setSuccessMessage('Registro exitoso. Ahora puedes iniciar sesión.')
      setLoading(false)
      router.replace('/login')
    } catch (e: any) {
      console.error('ERROR REGISTRO GENERAL:', e)
      setErrorMessage(`Error inesperado durante el registro: ${e.message ?? String(e)}`)
      setLoading(false)
    }
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
          marginTop: '1rem'
        }}
      >
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <label>
          Nombre o alias
          <input
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
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
