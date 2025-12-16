// lib/services/sugerencias.service.ts

import { supabaseServerClient } from '../supabaseServerClient'; // o similar

// 1. Definir el tipo de datos (es una buena práctica)
interface SugerenciaPayload {
  titulo: string;
  contenido: string;
}

/**
 * Función Pura de Negocio: Inserta una sugerencia si es válida.
 * Esta función no sabe nada de solicitudes HTTP o JSON.
 * Solo maneja la lógica de validación e inserción.
 */
export async function crearSugerencia(
  socioId: string,
  payload: SugerenciaPayload
) {
  // === Lógica de Validación (MOVIDA DESDE EL ROUTE HANDLER) ===
  const { titulo, contenido } = payload;

  if (!titulo || titulo.length > 100) {
    // En un servicio, lanzamos errores claros que el manejador HTTP atrapará.
    throw new Error('El título es requerido y no debe exceder 100 caracteres.');
  }

  if (!contenido || contenido.length === 0) {
    throw new Error('El contenido de la sugerencia no puede estar vacío.');
  }
  // =============================================================

  // === Lógica de Persistencia (MOVIDA DESDE EL ROUTE HANDLER) ===
  const supabase = await supabaseServerClient(); // Asumimos que obtienes el cliente aquí

  const { data, error } = await supabase
    .from('sugerencias')
    .insert([{ socio_id: socioId, titulo, contenido }])
    .select();

  if (error) {
    // Siempre lanzar el error para que el ROUTE HANDLER lo maneje
    console.error('Error al insertar sugerencia:', error);
    throw new Error('Fallo interno al guardar la sugerencia.');
  }

  return data[0]; // Devuelve la sugerencia creada
}

// Aquí irían otras funciones de negocio puras, como listarSugerencias()