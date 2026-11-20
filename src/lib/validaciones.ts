/**
 * SIRE - Sistema de Registro de Estudiantes
 * Validaciones de negocio (RF02, RF04) compartidas por las rutas de API.
 */

export interface DatosEstudiante {
  identificacion: string
  nombres: string
  apellidos: string
  correo: string
  programa: string
}

/** Formato de correo electrónico válido: texto@dominio.extensión */
const EXPRESION_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ResultadoValidacion {
  ok: boolean
  mensaje?: string
}

/**
 * RF02 - Validación de campos obligatorios:
 * el sistema no debe permitir registrar estudiantes cuando falten datos obligatorios.
 * RF04 - Validación del correo electrónico: debe tener un formato válido.
 */
export function validarDatosEstudiante(
  datos: DatosEstudiante,
  opciones: { ignorarIdentificacion?: boolean } = {},
): ResultadoValidacion {
  const faltantes: string[] = []

  if (!opciones.ignorarIdentificacion && !datos.identificacion) {
    faltantes.push('Identificación')
  }
  if (!datos.nombres) faltantes.push('Nombres')
  if (!datos.apellidos) faltantes.push('Apellidos')
  if (!datos.correo) faltantes.push('Correo electrónico')
  if (!datos.programa) faltantes.push('Programa académico')

  if (faltantes.length > 0) {
    return {
      ok: false,
      mensaje: `los siguientes campos son obligatorios: ${faltantes.join(', ')}.`,
    }
  }

  if (!EXPRESION_CORREO.test(datos.correo)) {
    return {
      ok: false,
      mensaje: `el correo electrónico "${datos.correo}" no tiene un formato válido.`,
    }
  }

  return { ok: true }
}

/** Normaliza los datos recibidos: recorta espacios al inicio y al final. */
export function normalizarDatosEstudiante(body: Record<string, unknown>): DatosEstudiante {
  return {
    identificacion: String(body.identificacion ?? '').trim(),
    nombres: String(body.nombres ?? '').trim(),
    apellidos: String(body.apellidos ?? '').trim(),
    correo: String(body.correo ?? '').trim(),
    programa: String(body.programa ?? '').trim(),
  }
}
