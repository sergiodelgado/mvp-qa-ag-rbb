'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '@/lib/supabaseClientPublic'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const mail = email.trim()
    const pass = password.trim()

    if (!mail || !pass) {
      setError('Email y contraseña son obligatorios.')
      return
    }

    setLoading(true)

    const { data, error: signInError } =
      await supabaseBrowserClient.auth.signInWithPassword({
        email: mail,
        password: pass
      })

    if (signInError) {
      console.error('Error en login:', signInError)
      setError(
        signInError.message ?? 'Credenciales inválidas o problema al iniciar sesión.'
      )
      setLoading(false)
      return
    }

    console.log('Login OK, user:', data.user)

    router.replace('/buzon')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-lg p-6 bg-black text-white">
        <h1 className="text-3xl font-bold mb-2">Login</h1>
        <p className="text-sm text-gray-300 mb-4">
          Ingresa con tu email y contraseña de socio.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 rounded text-black text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 rounded text-black text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 rounded bg-gray-200 text-black font-semibold text-sm disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )
}
