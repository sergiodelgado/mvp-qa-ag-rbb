// app/api/sugerencias/route.ts
// Fase 2: API para crear y listar sugerencias del socio autenticado

import { NextRequest, NextResponse } from 'next/server'
import { supabaseFromRequest } from '@/lib/supabaseServerClient'

// GET /api/sugerencias
// Lista las sugerencias del usuario autenticado, ordenadas por created_at desc
export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseFromRequest(req)

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: 'No hay sesión activa.' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('sugerencias')
      .select('id, titulo, contenido, estado, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al listar sugerencias:', error)
      return NextResponse.json(
        { message: 'Error al obtener las sugerencias.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data ?? [], { status: 200 })
  } catch (err) {
    console.error('Error inesperado en GET /api/sugerencias:', err)
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 })
  }
}

// POST /api/sugerencias
// Crea una nueva sugerencia para el usuario autenticado
export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseFromRequest(req)

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: 'No hay sesión activa.' }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as {
      titulo?: string
      contenido?: string
    } | null

    if (!body || typeof body.titulo !== 'string' || typeof body.contenido !== 'string') {
      return NextResponse.json(
        { message: 'Payload inválido. Se requiere titulo y contenido.' },
        { status: 400 }
      )
    }

    const titulo = body.titulo.trim()
    const contenido = body.contenido.trim()

    if (!titulo || !contenido) {
      return NextResponse.json(
        { message: 'Titulo y contenido son obligatorios.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('sugerencias')
      .insert([
        {
          socio_id: user.id,
          titulo,
          contenido
        }
      ])
      .select('id, titulo, contenido, estado, created_at')
      .single()

    if (error) {
      console.error('Error al crear sugerencia:', error)
      return NextResponse.json(
        { message: 'Error al crear la sugerencia.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Error inesperado en POST /api/sugerencias:', err)
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 })
  }
}
