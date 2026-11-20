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
    await prisma.estudiante.upsert({
      where: { identificacion: e.identificacion },
      update: {},
      create: e,
    })
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
