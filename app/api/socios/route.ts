// app/api/socios/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServerClient'

// GET /api/socios
// Devuelve el registro del socio autenticado
export async function GET() {
  const supabase = getSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from('socios')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Error al obtener socio', detail: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ socio: data }, { status: 200 })
}

// PUT /api/socios
// Actualiza algunos campos permitidos del socio autenticado
export async function PUT(req: NextRequest) {
  const supabase = getSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  const body = await req.json()

  // Solo permitimos actualizar campos controlados
  const payload: {
    nombre?: string
    rol?: string
    estado?: string
  } = {}

  if (typeof body.nombre === 'string') payload.nombre = body.nombre
  if (typeof body.rol === 'string') payload.rol = body.rol
  if (typeof body.estado === 'string') payload.estado = body.estado

  const { data, error } = await supabase
    .from('socios')
    .update(payload)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Error al actualizar socio', detail: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ socio: data }, { status: 200 })
}
