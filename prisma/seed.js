/**
 * Semilla de datos SIRE — estudiantes iniciales para poder ejecutar
 * los casos de prueba del taller (p. ej. CP03 usa la identificación 102030).
 *
 * Uso:  npm run db:seed
 */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const ESTUDIANTES = [
  {
    identificacion: '102030',
    nombres: 'Laura',
    apellidos: 'Gómez',
    correo: 'laura.gomez@example.com',
    programa: 'Ingeniería de Sistemas',
  },
  {
    identificacion: '102031',
    nombres: 'Carlos',
    apellidos: 'Ruiz',
    correo: 'carlos.ruiz@example.com',
    programa: 'Administración de Empresas',
  },
  {
    identificacion: '102032',
    nombres: 'María Fernanda',
    apellidos: 'Pérez',
    correo: 'maria.perez@example.com',
    programa: 'Contaduría Pública',
  },
]

async function main() {
  for (const e of ESTUDIANTES) {
    // La identificación no es única en la base de datos (la unicidad se
    // garantiza en la capa de aplicación, corrección de DEF01 en v2.0),
    // por eso se busca con findFirst antes de insertar.
    const existente = await prisma.estudiante.findFirst({
      where: { identificacion: e.identificacion },
    })
    if (!existente) {
      await prisma.estudiante.create({ data: e })
    }
  }
  const total = await prisma.estudiante.count()
  console.log(`Semilla completada. Estudiantes en la base de datos: ${total}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
