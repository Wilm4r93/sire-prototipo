/**
 * Restablece la base de datos de SIRE al estado inicial de la semilla
 * (3 estudiantes de referencia para ejecutar los casos de prueba).
 *
 * Uso:  npm run db:reset
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
  await prisma.estudiante.deleteMany({})
  for (const e of ESTUDIANTES) {
    await prisma.estudiante.create({ data: e })
  }
  const total = await prisma.estudiante.count()
  console.log(`Base de datos restablecida. Estudiantes: ${total}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
