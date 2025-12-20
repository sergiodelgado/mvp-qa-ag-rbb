import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Sugerencia } from '@/lib/types/sugerencia';

export function useSugerencias() {
  const router = useRouter();
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSugerencias = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/sugerencias', {
        method: 'GET'
      });

      if (res.status === 401) {
        // Sesión caducada o inexistente
        router.replace('/login');
        return;
      }

      if (!res.ok) {
        setError('No se pudieron cargar las sugerencias.');
        return;
      }

      const data: Sugerencia[] = await res.json();
      setSugerencias(data);
    } catch (err) {
      console.error('Error al traer sugerencias:', err);
      setError('Error inesperado al cargar las sugerencias.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSugerencias();
  }, [fetchSugerencias]);

  return { 
    sugerencias,
    setSugerencias,
    isLoading, 
    error, 
    refresh: fetchSugerencias 
  };
}
