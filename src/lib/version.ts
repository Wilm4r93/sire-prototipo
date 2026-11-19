import type { NextRequest } from 'next/server'

/**
 * SIRE maneja dos versiones conmutables para la demostración del taller:
 *
 * - v1.0: versión original evaluada en la primera ronda del plan de pruebas,
 *   que contiene los defectos DEF01-DEF04 registrados en el informe.
 * - v2.0: versión corregida tras el análisis del registro de defectos.
 *
 * El cliente indica la versión activa en cada petición mediante la cabecera
 * "x-sire-version"; las rutas de API deciden qué comportamiento aplicar.
 */
export function esVersionV1(request: NextRequest): boolean {
  return request.headers.get('x-sire-version') === '1.0'
}
