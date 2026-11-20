import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  camposObligatoriosFaltantes,
  validarDatosEstudiante,
  normalizarDatosEstudiante,
} from '@/lib/validaciones'
import { esVersionV1 } from '@/lib/version'

/** GET /api/estudiantes — lista todos los estudiantes registrados. */
export async function GET() {
  try {
    const estudiantes = await db.estudiante.findMany({
      orderBy: { identificacion: 'asc' },
    })
    return NextResponse.json({ ok: true, total: estudiantes.length, estudiantes })
  } catch (error) {
    console.error('Error al listar estudiantes:', error)
    return NextResponse.json(
      { ok: false, mensaje: 'Error interno del servidor al consultar la lista de estudiantes.' },
      { status: 500 },
    )
  }
}

/** POST /api/estudiantes — registra un estudiante nuevo (RF01, RF02, RF03, RF04, RF07). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const datos = normalizarDatosEstudiante(body)

    // ------------------------------------------------------------------
    // v1.0 — comportamiento original evaluado en la primera ronda:
    // DEF01: no verificaba la unicidad de la identificación (RF03).
    // DEF02: no validaba el formato del correo electrónico (RF04).
    // Solo exigía los campos obligatorios (RF02), por eso CP02 y CP10 pasaron.
    // ------------------------------------------------------------------
    if (esVersionV1(request)) {
      const faltantes = camposObligatoriosFaltantes(datos)
      if (faltantes.length > 0) {
        return NextResponse.json(
          {
            ok: false,
            mensaje: `No se pudo registrar el estudiante: los siguientes campos son obligatorios: ${faltantes.join(', ')}.`,
          },
          { status: 400 },
        )
      }

      const estudiante = await db.estudiante.create({ data: datos })
      return NextResponse.json(
        {
          ok: true,
          mensaje: `Estudiante registrado correctamente: ${estudiante.nombres} ${estudiante.apellidos} (Identificación ${estudiante.identificacion}).`,
          estudiante,
        },
        { status: 201 },
      )
    }

    // ------------------------------------------------------------------
    // v2.0 — versión corregida tras el registro de defectos.
    // ------------------------------------------------------------------

    // RF02 y RF04: campos obligatorios y formato del correo.
    const validacion = validarDatosEstudiante(datos)
    if (!validacion.ok) {
      return NextResponse.json(
        { ok: false, mensaje: `No se pudo registrar el estudiante: ${validacion.mensaje}` },
        { status: 400 },
      )
    }

    // RF03: identificación única (corrección del defecto DEF01).
    const existente = await db.estudiante.findFirst({
      where: { identificacion: datos.identificacion },
    })
    if (existente) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: `No se pudo registrar el estudiante: ya existe un estudiante registrado con la identificación ${datos.identificacion}.`,
        },
        { status: 409 },
      )
    }

    const estudiante = await db.estudiante.create({ data: datos })
    return NextResponse.json(
      {
        ok: true,
        mensaje: `Estudiante registrado correctamente: ${estudiante.nombres} ${estudiante.apellidos} (Identificación ${estudiante.identificacion}).`,
        estudiante,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error al registrar estudiante:', error)
    return NextResponse.json(
      { ok: false, mensaje: 'Error interno del servidor al registrar el estudiante.' },
      { status: 500 },
    )
  }
}
