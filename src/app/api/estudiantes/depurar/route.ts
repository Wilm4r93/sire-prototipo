import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { esVersionV1 } from '@/lib/version'

/**
 * POST /api/estudiantes/depurar — depura los registros duplicados de la base
 * de datos, corrección del defecto DEF01 en la v2.0.
 *
 * La v1.0 permitía registrar varias filas con la misma identificación (DEF01),
 * lo que además bloqueaba el caso de prueba CP12. Al activarse la v2.0 la base
 * se depura igual que en la regresión del taller: de cada grupo de duplicados
 * se conserva el registro original (el primero creado) y se eliminan las
 * copias posteriores, de modo que el listado y las actualizaciones vuelven a
 * ser inequívocos.
 */
export async function POST(request: NextRequest) {
  // La depuración solo existe en la v2.0: la v1.0 conserva sus defectos.
  if (esVersionV1(request)) {
    return NextResponse.json(
      {
        ok: false,
        mensaje: 'La depuración de duplicados está disponible únicamente en la v2.0.',
      },
      { status: 400 },
    )
  }

  try {
    const todos = await db.estudiante.findMany({
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: { id: true, identificacion: true },
    })

    const vistos = new Set<string>()
    const idsDuplicados: string[] = []
    for (const registro of todos) {
      if (vistos.has(registro.identificacion)) {
        idsDuplicados.push(registro.id)
      } else {
        vistos.add(registro.identificacion)
      }
    }

    if (idsDuplicados.length > 0) {
      await db.estudiante.deleteMany({ where: { id: { in: idsDuplicados } } })
    }

    return NextResponse.json({
      ok: true,
      eliminados: idsDuplicados.length,
      total: todos.length - idsDuplicados.length,
      mensaje:
        idsDuplicados.length > 0
          ? `Se eliminaron ${idsDuplicados.length} ${
              idsDuplicados.length === 1 ? 'registro duplicado' : 'registros duplicados'
            }: se conserva el registro original de cada identificación.`
          : 'La base de datos no tenía registros duplicados.',
    })
  } catch (error) {
    console.error('Error al depurar duplicados:', error)
    return NextResponse.json(
      { ok: false, mensaje: 'Error interno del servidor al depurar la base de datos.' },
      { status: 500 },
    )
  }
}
