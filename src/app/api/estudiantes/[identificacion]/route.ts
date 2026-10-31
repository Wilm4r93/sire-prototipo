import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validarDatosEstudiante, normalizarDatosEstudiante } from '@/lib/validaciones'

type Contexto = { params: Promise<{ identificacion: string }> }

/** GET /api/estudiantes/[identificacion] — consulta un estudiante por su identificación (RF05, RF07). */
export async function GET(_request: NextRequest, { params }: Contexto) {
  const { identificacion } = await params
  const id = decodeURIComponent(identificacion).trim()
  try {
    const estudiante = await db.estudiante.findUnique({ where: { identificacion: id } })
    if (!estudiante) {
      return NextResponse.json(
        { ok: false, mensaje: `No se encontró ningún estudiante con la identificación ${id}.` },
        { status: 404 },
      )
    }
    return NextResponse.json({
      ok: true,
      mensaje: `Estudiante encontrado: ${estudiante.nombres} ${estudiante.apellidos}.`,
      estudiante,
    })
  } catch (error) {
    console.error('Error al consultar estudiante:', error)
    return NextResponse.json(
      { ok: false, mensaje: 'Error interno del servidor al consultar el estudiante.' },
      { status: 500 },
    )
  }
}

/** PUT /api/estudiantes/[identificacion] — actualiza los datos de un estudiante (RF06, RF02, RF04, RF07). */
export async function PUT(request: NextRequest, { params }: Contexto) {
  const { identificacion } = await params
  const id = decodeURIComponent(identificacion).trim()
  try {
    const body = await request.json()
    const datos = normalizarDatosEstudiante({ ...body, identificacion: id })

    // RF02 y RF04 sobre los datos que se van a actualizar.
    const validacion = validarDatosEstudiante(datos, { ignorarIdentificacion: true })
    if (!validacion.ok) {
      return NextResponse.json(
        { ok: false, mensaje: `No se pudo actualizar la información: ${validacion.mensaje}` },
        { status: 400 },
      )
    }

    const existente = await db.estudiante.findUnique({ where: { identificacion: id } })
    if (!existente) {
      return NextResponse.json(
        { ok: false, mensaje: `No se pudo actualizar la información: no existe un estudiante con la identificación ${id}.` },
        { status: 404 },
      )
    }

    const estudiante = await db.estudiante.update({
      where: { identificacion: id },
      data: {
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        correo: datos.correo,
        programa: datos.programa,
      },
    })
    return NextResponse.json({
      ok: true,
      mensaje: `Información actualizada correctamente para el estudiante ${estudiante.nombres} ${estudiante.apellidos} (Identificación ${estudiante.identificacion}).`,
      estudiante,
    })
  } catch (error) {
    console.error('Error al actualizar estudiante:', error)
    return NextResponse.json(
      { ok: false, mensaje: 'Error interno del servidor al actualizar el estudiante.' },
      { status: 500 },
    )
  }
}
