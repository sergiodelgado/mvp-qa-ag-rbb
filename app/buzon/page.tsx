'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowserClient } from '@/lib/supabaseClientPublic'
import { useSugerencias } from '@/hooks/useSugerencias'
import { useAuth } from '@/hooks/useAuth'
import type { Sugerencia } from '@/lib/types/sugerencia'

export default function BuzonPage() {
  const router = useRouter()
  const { user, loading: loadingAuth } = useAuth({ requireAuth: true })
  const { sugerencias, setSugerencias, isLoading: loadingSugerencias, error: sugerenciasError, refresh: fetchSugerencias } = useSugerencias()
  
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [perfilNombre, setPerfilNombre] = useState<string | null>(null)
  const [perfilEmail, setPerfilEmail] = useState<string | null>(null)
  const [perfilError, setPerfilError] = useState<string | null>(null)

  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const hasLoadedProfileFor = useRef<string | null>(null)

  // Cargar perfil desde tabla socios cuando user está disponible
  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      if (!user) return

      // Solo cargar si no hemos cargado para este usuario
      if (hasLoadedProfileFor.current === user.id) {
        return
      }

      setLoadingProfile(true)
      setPerfilError(null)

      const { data: perfil, error: perfilErr } = await supabaseBrowserClient
        .from('socios')
        .select('nombre, email')
        .eq('id', user.id)
        .single()

      // Solo actualizar estado si el componente sigue montado
      if (!isMounted) return

      if (perfilErr) {
        // Fallback: usar email de Auth si algo falla con socios
        setPerfilNombre(user.email ?? 'Socio')
        setPerfilEmail(user.email ?? '')
        setPerfilError('No se pudo cargar el perfil completo, usando datos básicos.')
      } else {
        setPerfilNombre(perfil?.nombre ?? user.email ?? 'Socio')
        setPerfilEmail(perfil?.email ?? user.email ?? '')
      }

      setLoadingProfile(false)
      hasLoadedProfileFor.current = user.id
    }

    loadProfile()

    // Cleanup: prevenir updates si componente se desmonta antes de completar fetch
    return () => {
      isMounted = false
    }
  }, [user])



  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    const tituloTrim = titulo.trim()
    const contenidoTrim = contenido.trim()

    if (!tituloTrim || !contenidoTrim) {
      setFormError('Título y contenido son obligatorios.')
      return
    }

    try {
      setSubmitting(true)

      const res = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: tituloTrim,
          contenido: contenidoTrim
        })
      })

      if (res.status === 401) {
        router.replace('/login')
        return
      }

      if (res.status === 400) {
        const body = await res.json().catch(() => null)
        setFormError(body?.message ?? 'Datos inválidos al crear la sugerencia.')
        return
      }

      if (!res.ok) {
        setFormError('Error al crear la sugerencia.')
        return
      }

      // Sugerencia creada OK
      const creada: Sugerencia = await res.json()
      // Agregar optimistically a la lista
      setSugerencias((prev) => [creada, ...prev])

      setTitulo('')
      setContenido('')
    } catch (err) {
      console.error('Error al crear sugerencia:', err)
      setFormError('Error inesperado al crear la sugerencia.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleLogoutClick() {
    router.push('/logout')
  }

  if (loadingAuth || loadingProfile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando buzón...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-8 space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Buzón de sugerencias</h1>
          <p className="text-sm text-gray-500">
            Sesión de{' '}
            <span className="font-medium">{perfilNombre ?? perfilEmail ?? 'Socio'}</span>
            {perfilError && (
              <span className="block text-xs text-amber-600 mt-1">{perfilError}</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogoutClick}
          className="px-3 py-1.5 text-sm rounded bg-gray-800 text-white hover:bg-gray-700"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Formulario de nueva sugerencia */}
      <section className="border rounded-lg p-4 space-y-4 bg-gray-50">
        <h2 className="text-lg font-semibold">Crear nueva sugerencia</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="titulo">
              Título
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Ej: Mejorar comunicación de eventos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="contenido">
              Contenido
            </label>
            <textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm min-h-[100px]"
              placeholder="Describe tu sugerencia con el detalle que consideres necesario..."
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
          >
            {submitting ? 'Enviando...' : 'Enviar sugerencia'}
          </button>
        </form>
      </section>

      {/* Listado de sugerencias */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tus sugerencias</h2>
          <button
            type="button"
            onClick={fetchSugerencias}
            disabled={loadingSugerencias}
            className="px-3 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-60"
          >
            {loadingSugerencias ? 'Actualizando...' : 'Actualizar lista'}
          </button>
        </div>

        {sugerenciasError && <p className="text-sm text-red-600">{sugerenciasError}</p>}

        {loadingSugerencias && !sugerencias.length && (
          <p className="text-sm text-gray-500">Cargando sugerencias...</p>
        )}

        {!loadingSugerencias && !sugerenciasError && sugerencias.length === 0 && (
          <p className="text-sm text-gray-500">
            Aún no has registrado sugerencias. Parte creando la primera arriba.
          </p>
        )}

        <ul className="space-y-3">
          {sugerencias.map((s) => (
            <li key={s.id} className="border rounded-lg p-3 bg-white shadow-sm text-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">{s.titulo}</h3>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {s.estado}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{s.contenido}</p>
              <p className="text-[11px] text-gray-400 mt-2">
                Creada el {new Date(s.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
