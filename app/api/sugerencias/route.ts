// app/api/sugerencias/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseFromRequest } from '@/lib/supabaseServerClient';
import { crearSugerencia } from '@/lib/services/sugerencias.service';

// GET /api/sugerencias
// Sin sesión: 401 + JSON
export async function GET(req: NextRequest) {
  const { supabase } = await supabaseFromRequest(req);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: 'No hay sesión activa.' }, { status: 401 });
  }

  // Implementación mínima: leer sugerencias del usuario autenticado.
  // Ajusta nombre de tabla/columnas si difieren (p.ej. "sugerencias", "socio_id", "created_at").
  const { data, error } = await supabase
    .from('sugerencias')
    .select('*')
    .eq('socio_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
}

// POST /api/sugerencias
export async function POST(req: NextRequest) {
  const { supabase } = await supabaseFromRequest(req);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: 'No hay sesión activa.' }, { status: 401 });
  }

  const socioId = session.user.id;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: 'Payload JSON inválido.' }, { status: 400 });
  }

  try {
    const nuevaSugerencia = await crearSugerencia(socioId, payload);
    return NextResponse.json(nuevaSugerencia, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al procesar.';

    if (errorMessage.includes('requerido') || errorMessage.includes('vacío')) {
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
