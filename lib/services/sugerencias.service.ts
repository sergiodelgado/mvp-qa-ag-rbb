// lib/services/sugerencias.service.ts

import { supabaseAdminClient } from '../supabaseServerClient';
// ... (interface)

export async function crearSugerencia(
  socioId: string | null,
  payload: any 
) {
  // === VALIDACIÓN Y SANITIZACIÓN (HARDENING) ===
  
  // 1. Whitelist explícita: Extraer solo lo que nos importa
  const tituloRaw = payload?.titulo;
  const contenidoRaw = payload?.contenido;
  const privacyModeRaw = payload?.privacy_mode;
  
  // 2. Sanitización básica
  const titulo = String(tituloRaw ?? '').trim();
  const contenido = String(contenidoRaw ?? '').trim();
  
  // 3. Validación de Privacy Mode
  let privacyMode: 'anonymous' | 'followup' = 'anonymous';
  if (privacyModeRaw === 'followup') {
    privacyMode = 'followup';
  } else if (privacyModeRaw && privacyModeRaw !== 'anonymous') {
    // Si viene algo raro que no es null/undefined ni 'anonymous' ni 'followup', lo rechazamos o forzamos anonymous.
    // Para hardening estricto, mejor rechazar si el cliente manda basura explícita.
    // Pero por robustez, forzamos 'anonymous' si no es 'followup'.
    privacyMode = 'anonymous'; 
  }

  // 4. Reglas de Negocio
  if (!titulo) {
    throw new Error('El título es requerido.');
  }
  if (titulo.length > 100) {
    throw new Error('El título no debe exceder 100 caracteres.');
  }

  if (!contenido) {
    throw new Error('El contenido de la sugerencia no puede estar vacío.');
  }
  if (contenido.length > 2000) {
    throw new Error('El contenido es demasiado largo (máx. 2000 caracteres).');
  }
  
  if (privacyMode === 'followup' && !socioId) {
    throw new Error('Se requiere sesión para seguimiento (socioId nulo).');
  }
  // =============================================================

  // === Lógica de Persistencia ===
  // Usar CLIENTE ADMIN para saltar RLS en inserts anónimos
  const supabase = supabaseAdminClient();

  const { data, error } = await supabase
    .from('sugerencias')
    .insert([{ 
      socio_id: privacyMode === 'followup' ? socioId : null, 
      titulo, 
      contenido,
      // Si existiera columna privacy_mode: privacy_mode: privacyMode 
    }])
    .select();

  if (error) {
    console.error('Error al insertar sugerencia:', error);
    throw new Error('Fallo interno al guardar la sugerencia.');
  }

  return data[0]; // Devuelve la sugerencia creada
}

// Aquí irían otras funciones de negocio puras, como listarSugerencias()