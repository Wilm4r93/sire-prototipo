# 🚀 Guía de instalación y ejecución de SIRE en Visual Studio Code

**SIRE — Sistema de Registro de Estudiantes · Prototipo funcional v2.0 (sin defectos)**
Taller: *Implementación del Plan de Pruebas de Software* — Ingeniería de Software II

---

## 📋 Requisitos previos

| Requisito | Versión mínima | Dónde conseguirlo |
|---|---|---|
| **Node.js** | 20.9 o superior (recomendado: **22 LTS**) | <https://nodejs.org> (instalar la versión **LTS**) |
| **Visual Studio Code** | Cualquiera reciente | <https://code.visualstudio.com> |
| Navegador moderno | Chrome, Edge o Firefox | — |

> ⚠️ **Importante:** Next.js 16 exige Node.js 20.9+. Si tienes una versión anterior, la app no arrancará.

### Verificar la instalación de Node.js

Abre una terminal (en Windows: `CMD` o PowerShell) y escribe:

```bash
node -v    # debe mostrar v20.9.x, v22.x o superior
npm -v     # debe mostrar 10.x o superior
```

Si ambos comandos responden con un número de versión, estás listo. 👍

---

## 🧰 Paso 1 · Descomprimir y abrir el proyecto en VS Code

1. Descomprime el archivo `SIRE_Prototipo_VSCode.zip` en una carpeta de tu preferencia, por ejemplo `Documentos\SIRE`.
2. Abre **Visual Studio Code**.
3. Menú **Archivo (File) → Abrir carpeta (Open Folder…)** y selecciona la carpeta **`sire-prototipo`** (la que contiene `package.json`).
4. Si VS Code pregunta *"¿Confías en los autores de los archivos de esta carpeta?"*, responde **Sí, confío en los autores**.

### Extensiones recomendadas (opcional pero sugerido)

Abre la pestaña de extensiones (`Ctrl+Shift+X`) e instala:

- **ESLint** (Microsoft) — resalta errores de TypeScript/JavaScript
- **Tailwind CSS IntelliSense** (Tailwind Labs) — autocompletado de clases CSS
- **Prettier - Code formatter** (Prettier) — formato de código
- **Prisma** (Prisma) — resaltado del esquema de base de datos

---

## 📦 Paso 2 · Instalar las dependencias

1. Abre la **terminal integrada** de VS Code con:
   - Menú **Terminal → Nueva terminal**, o
   - Atajo **`Ctrl + `** (backtick) / en teclado español **`Ctrl + ñ`**
2. En la terminal escribe y ejecuta (espera a que termine, tarda unos minutos la primera vez):

```bash
npm install
```

✅ Cuando termine verás algo como `added 320 packages in 2m` (el número puede variar).

---

## 🗄️ Paso 3 · Generar el cliente de Prisma

La app usa **Prisma + SQLite** para la base de datos. Genera el cliente con:

```bash
npx prisma generate
```

✅ Debe mostrar: `✔ Generated Prisma Client to ./node_modules/@prisma/client`

> 💡 La base de datos **ya viene creada y con datos** (`db/custom.db`, con los estudiantes 102030-102034) para que puedas ejecutar los casos de prueba de inmediato. Este paso solo compila el código de acceso a datos.

### Comandos útiles de la base de datos (opcionales)

| Comando | Qué hace |
|---|---|
| `npm run db:setup` | Recrea el esquema y carga la semilla (3 estudiantes base) |
| `npm run db:seed` | Solo carga la semilla (agrega los estudiantes base si faltan) |
| `npm run db:reset` | **Borra todo** y deja solo los 3 estudiantes de referencia |

---

## ▶️ Paso 4 · Ejecutar la aplicación

```bash
npm run dev
```

1. Espera a que la terminal muestre:
   ```
   ✓ Ready in ...ms
   - Local: http://localhost:3000
   ```
2. Abre el navegador en **<http://localhost:3000>** (o mantén `Ctrl` y haz clic en el enlace de la terminal).
3. Verás la interfaz de SIRE con 4 pestañas: **Registrar**, **Consultar**, **Actualizar** y **Listado**.

> Para detener el servidor: haz clic en la terminal y presiona **`Ctrl + C`**.
> Para volver a arrancarlo más tarde: `npm run dev` de nuevo.

---

## 🧪 Paso 5 · Ejecutar los casos de prueba (demo del taller)

Estos son los 12 casos de la matriz (`02_Matriz_Casos_de_Prueba.xlsx`), con los datos exactos para reproducirlos en la app v2.0:

| CP | Pestaña | Datos de entrada | Resultado esperado (v2.0) |
|---|---|---|---|
| **CP01** ✅ | Registrar | Id: `102034`, Ana Sofía Díaz, `ana.diaz@example.com`, Ing. Industrial | Mensaje verde "registrado correctamente" y aparece en Listado |
| **CP02** ❌ | Registrar | Todos los campos vacíos → Registrar | Mensaje de error: faltan campos obligatorios |
| **CP03** ❌ | Registrar | Id: `102030` (ya existe, Laura Gómez) con otros datos | Error: "ya existe un estudiante con la identificación 102030" |
| **CP04** ❌ | Registrar | Id: `102035`, correo `ana.diazexample.com` (sin @) | Error: "el correo no tiene un formato válido" |
| **CP05** ✅ | Registrar | Id: `102036`, correo `ana+tag@correo.co.uk` | Registro exitoso |
| **CP06** ✅ | Consultar | Id: `102030` | Se muestran los datos de Laura Gómez |
| **CP07** ❌ | Consultar | Id: `999999` (no existe) | Mensaje informativo "No se encontró…" (**no** un error 500) |
| **CP08** ✅ | Actualizar | Id: `102031` → cargar → cambiar programa a "Ingeniería Industrial" | Actualización exitosa, el Listado refleja el cambio |
| **CP09** ❌ | Actualizar | Id: `102032` → cargar → borrar el nombre → Actualizar | Error: los campos obligatorios no pueden quedar vacíos |
| **CP10** ❌ | Registrar | Id y nombre con solo espacios: `"   "` | Error: los campos no pueden contener solo espacios |
| **CP11** ✅ | Todas | Ejecutar operaciones válidas e inválidas | Mensajes claros de confirmación y de error |
| **CP12** ❌ | Actualizar | Id: `102030` con el estado duplicado de la v1.0 (ver mockups) | En v2.0 ya no puede existir el duplicado (DEF01 corregido) |

> 💡 Si ejecutaste CP01 con el id 102034 y quieres repetir la ronda completa desde cero, usa antes `npm run db:reset`.

### 🐞 Mockups de la versión 1.0 (con los 4 defectos)

Para **mostrar cómo se veía la v1.0 defectuosa** en la demo, el paquete incluye 4 simulaciones HTML (no requieren servidor, funcionan con doble clic o desde la app):

Con la app corriendo, visita:

- <http://localhost:3000/mockups-v1/def01_identificacion_duplicada.html> — DEF01 (Alta)
- <http://localhost:3000/mockups-v1/def02_correo_invalido_aceptado.html> — DEF02 (Media)
- <http://localhost:3000/mockups-v1/def03_error_consulta_inexistente.html> — DEF03 (Crítica)
- <http://localhost:3000/mockups-v1/def04_actualizacion_campos_vacios.html> — DEF04 (Alta)

También puedes abrirlos directamente con doble clic desde la carpeta `public/mockups-v1/`.

---

## 🔧 Solución de problemas

| Problema | Solución |
|---|---|
| `next: command not found` o error raro al arrancar | Ejecuta de nuevo `npm install` y luego `npx prisma generate` |
| `Error: @prisma/client did not initialize yet` | Ejecuta `npx prisma generate` y reinicia con `npm run dev` |
| **Puerto 3000 ocupado** (`EADDRINUSE`) | Cierra la otra app, o arranca en otro puerto: `npx next dev -p 3001` |
| `You are using Node.js XX.x` (versión vieja) | Actualiza Node.js a la 22 LTS desde <https://nodejs.org> |
| La página abre pero sin estilos | Detén (`Ctrl+C`), borra la carpeta `.next` y vuelve a ejecutar `npm run dev` |
| Quiero partir de cero la base de datos | `npm run db:reset` |
| Cambios en la DB no se reflejan | Detén el servidor, ejecuta `npm run db:reset` y arranca de nuevo |

---

## 📁 Estructura del proyecto

```
sire-prototipo/
├── db/
│   └── custom.db              ← Base de datos SQLite (ya viene con datos)
├── prisma/
│   ├── schema.prisma          ← Modelo de datos (tabla Estudiante)
│   ├── seed.js                ← Datos semilla (3 estudiantes base)
│   └── reset.js               ← Restablece la DB al estado inicial
├── public/
│   └── mockups-v1/            ← Simulaciones HTML de la v1.0 con defectos
├── src/
│   ├── app/
│   │   ├── page.tsx           ← Interfaz SIRE (4 pestañas)
│   │   ├── layout.tsx         ← Diseño global
│   │   ├── globals.css        ← Estilos (Tailwind CSS 4)
│   │   └── api/estudiantes/   ← API REST (GET/POST lista, GET/PUT por id)
│   ├── components/ui/         ← Componentes de interfaz (shadcn/ui)
│   └── lib/
│       ├── db.ts              ← Cliente Prisma
│       └── validaciones.ts    ← Reglas RF02, RF03, RF04, RF07
├── .env                       ← Ruta de la base de datos
├── package.json               ← Dependencias y comandos
└── tsconfig.json              ← Configuración TypeScript
```

---

## 📜 Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en <http://localhost:3000> |
| `npm run build` | Compila para producción |
| `npm run start` | Ejecuta la versión compilada (requiere `build` antes) |
| `npm run lint` | Revisa la calidad del código |
| `npm run db:setup` | Crea el esquema + datos semilla |
| `npm run db:reset` | Restablece la DB a los 3 estudiantes base |

---

## 🧭 Nota sobre la narrativa del taller

- La **v1.0** (con los defectos DEF01-DEF04) se representa con los **mockups HTML** de `public/mockups-v1/` y las capturas de la carpeta `evidencias/` del entregable.
- Esta aplicación es la **v2.0 corregida**: los 12 casos de prueba de la regresión se ejecutan directamente sobre ella, tal como quedó registrado en la hoja *Ejecución* de la matriz.

¡Con esto tienes el proyecto corriendo al 100 % en VS Code! 🎉
