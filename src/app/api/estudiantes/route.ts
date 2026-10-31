import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validarDatosEstudiante, normalizarDatosEstudiante } from '@/lib/validaciones'

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

    // RF02 y RF04: campos obligatorios y formato del correo.
    const validacion = validarDatosEstudiante(datos)
    if (!validacion.ok) {
      return NextResponse.json(
        { ok: false, mensaje: `No se pudo registrar el estudiante: ${validacion.mensaje}` },
        { status: 400 },
      )
    }

    // RF03: identificación única.
    const existente = await db.estudiante.findUnique({
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
