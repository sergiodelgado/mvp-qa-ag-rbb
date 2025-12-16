// app/api/sugerencias/route.ts (La versión refactorizada)

import { NextResponse } from 'next/server';
import { supabaseFromRequest } from '@/lib/supabaseServerClient'; // o similar
import { crearSugerencia } from '@/lib/services/sugerencias.service'; // <--- ¡IMPORTANTE!

// Manejador de Solicitud POST
export async function POST(req: Request) {
  // 1. Obtener la sesión (Responsabilidad HTTP/Auth)
  const supabase = supabaseFromRequest(req);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Devuelve la respuesta HTTP de error
    return NextResponse.json({ message: 'No hay sesión activa.' }, { status: 401 });
  }

  const socioId = session.user.id;
  let payload: any;

  try {
    payload = await req.json();
  } catch (e) {
    return NextResponse.json({ message: 'Payload JSON inválido.' }, { status: 400 });
  }

  // 3. Llamar al Servicio (Responsabilidad de la Lógica de Negocio)
  try {
    // **ESTO ES LO MÁS LIMPIO:** Llama a la función de negocio pura.
    const nuevaSugerencia = await crearSugerencia(socioId, payload);

    // 4. Manejar Respuesta Exitosa
    return NextResponse.json(nuevaSugerencia, { status: 201 });

  } catch (error) {
    // 4. Manejar la Respuesta de Error (Errores de Validación/Servicio)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al procesar.';
    
    // Si es un error de validación (del servicio), devolver 400.
    if (errorMessage.includes('requerido') || errorMessage.includes('vacío')) {
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    // Cualquier otro error (ej. DB interna) devolver 500
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}