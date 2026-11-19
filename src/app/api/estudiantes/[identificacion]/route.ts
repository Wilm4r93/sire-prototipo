import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validarDatosEstudiante, normalizarDatosEstudiante } from '@/lib/validaciones'
import { esVersionV1 } from '@/lib/version'

type Contexto = { params: Promise<{ identificacion: string }> }

/** GET /api/estudiantes/[identificacion] — consulta un estudiante por su identificación (RF05, RF07). */
export async function GET(request: NextRequest, { params }: Contexto) {
  const { identificacion } = await params
  const id = decodeURIComponent(identificacion).trim()
  try {
    const estudiante = await db.estudiante.findFirst({ where: { identificacion: id } })
    if (!estudiante) {
      // ----------------------------------------------------------------
      // v1.0 — DEF03: la consulta de una identificación inexistente
      // dejaba escapar un error técnico no controlado (Error 500) en
      // lugar de un mensaje informativo para el usuario.
      // ----------------------------------------------------------------
      if (esVersionV1(request)) {
        return NextResponse.json(
          {
            ok: false,
            mensaje: `Error interno del servidor\n\nTypeError: No se puede leer la propiedad 'nombres' de undefined\n    en consultarEstudiante (app/consultar/page.js:47:32)\n    en async Object.consultar (app/api/estudiantes/${id}/route.js:12:9)\n\nError 500 — Internal Server Error`,
          },
          { status: 500 },
        )
      }

      // v2.0 — corrección de DEF03: mensaje informativo (RF07).
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
    const existente = await db.estudiante.findFirst({ where: { identificacion: id } })

    // ------------------------------------------------------------------
    // v1.0 — DEF04: la actualización no validaba nada: aceptaba campos
    // vacíos, guardaba la información en blanco y perdía los datos
    // anteriores confirmando con un mensaje de éxito.
    // ------------------------------------------------------------------
    if (esVersionV1(request)) {
      if (!existente) {
        return NextResponse.json(
          {
            ok: false,
            mensaje: `Error interno del servidor\n\nTypeError: No se puede leer la propiedad 'nombres' de undefined\n    en actualizarEstudiante (app/actualizar/page.js:52:28)\n\nError 500 — Internal Server Error`,
          },
          { status: 500 },
        )
      }

      const estudianteV1 = await db.estudiante.update({
        where: { id: existente.id },
        data: {
          nombres: datos.nombres,
          apellidos: datos.apellidos,
          correo: datos.correo,
          programa: datos.programa,
        },
      })
      return NextResponse.json({
        ok: true,
        mensaje: `Información actualizada correctamente para el estudiante ${estudianteV1.nombres} ${estudianteV1.apellidos} (Identificación ${estudianteV1.identificacion}).`,
        estudiante: estudianteV1,
      })
    }

    // ------------------------------------------------------------------
    // v2.0 — versión corregida tras el registro de defectos.
    // ------------------------------------------------------------------

    // RF02 y RF04 sobre los datos que se van a actualizar (corrección de DEF04).
    const validacion = validarDatosEstudiante(datos, { ignorarIdentificacion: true })
    if (!validacion.ok) {
      return NextResponse.json(
        { ok: false, mensaje: `No se pudo actualizar la información: ${validacion.mensaje}` },
        { status: 400 },
      )
    }

    if (!existente) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: `No se pudo actualizar la información: no existe un estudiante con la identificación ${id}.`,
        },
        { status: 404 },
      )
    }

    const estudiante = await db.estudiante.update({
      where: { id: existente.id },
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
