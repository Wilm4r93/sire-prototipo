'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  GraduationCap,
  UserPlus,
  Search,
  PencilLine,
  Users,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react'

interface Estudiante {
  id: string
  identificacion: string
  nombres: string
  apellidos: string
  correo: string
  programa: string
  createdAt: string
  updatedAt: string
}

interface RespuestaAPI {
  ok: boolean
  mensaje: string
  estudiante?: Estudiante
  estudiantes?: Estudiante[]
  total?: number
<<<<<<< HEAD
  eliminados?: number
=======
>>>>>>> 1c38192c68245ab3f1787a4daf7a37b418f27ae0
}

const PROGRAMAS = [
  'Ingeniería de Sistemas',
  'Ingeniería de Software',
  'Ingeniería Industrial',
  'Administración de Empresas',
  'Contaduría Pública',
  'Negocios Internacionales',
  'Derecho',
  'Psicología',
]

type TipoMensaje = 'exito' | 'error' | undefined

function Mensaje({ tipo, texto }: { tipo: TipoMensaje; texto: string }) {
  if (!tipo || !texto) return null
  const esExito = tipo === 'exito'
  // La v1.0 deja escapar errores técnicos al usuario (DEF03):
  // se muestran con formato de consola, como en la ronda original.
  const esTecnico = texto.includes('TypeError')
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-lg border p-4 text-sm font-medium ${
        esExito
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
          : 'border-red-300 bg-red-50 text-red-800'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {esExito ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span
          className={
            esTecnico
              ? 'whitespace-pre-wrap break-words font-mono text-xs font-normal leading-relaxed'
              : undefined
          }
        >
          {texto}
        </span>
      </div>
    </div>
  )
}

function CampoTexto({
  id,
  etiqueta,
  valor,
  onChange,
  placeholder,
  deshabilitado,
}: {
  id: string
  etiqueta: string
  valor: string
  onChange: (v: string) => void
  placeholder?: string
  deshabilitado?: boolean
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{etiqueta}</Label>
      <Input
        id={id}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={deshabilitado}
        autoComplete="off"
      />
    </div>
  )
}

export default function PaginaSIRE() {
  const [pestana, setPestana] = useState('registro')

  // ----- Versión activa: v1.0 (original con defectos) / v2.0 (corregida) -----
  const [version, setVersion] = useState<'1.0' | '2.0'>('1.0')
  const esV1 = version === '1.0'

  // ----- Registro -----
  const [registro, setRegistro] = useState({
    identificacion: '',
    nombres: '',
    apellidos: '',
    correo: '',
    programa: '',
  })
  const [mensajeRegistro, setMensajeRegistro] = useState<{ tipo: TipoMensaje; texto: string }>({
    tipo: undefined,
    texto: '',
  })
  const [registrando, setRegistrando] = useState(false)

  // ----- Consulta -----
  const [idConsulta, setIdConsulta] = useState('')
  const [estudianteConsultado, setEstudianteConsultado] = useState<Estudiante | null>(null)
  const [mensajeConsulta, setMensajeConsulta] = useState<{ tipo: TipoMensaje; texto: string }>({
    tipo: undefined,
    texto: '',
  })
  const [consultando, setConsultando] = useState(false)

  // ----- Actualización -----
  const [idActualizar, setIdActualizar] = useState('')
  const [actualizacion, setActualizacion] = useState<Estudiante | null>(null)
  const [mensajeActualizacion, setMensajeActualizacion] = useState<{
    tipo: TipoMensaje
    texto: string
  }>({ tipo: undefined, texto: '' })
  const [cargandoActualizar, setCargandoActualizar] = useState(false)
  const [guardando, setGuardando] = useState(false)

  // ----- Listado -----
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [cargandoLista, setCargandoLista] = useState(false)

<<<<<<< HEAD
  // ----- Depuración de duplicados al activar la v2.0 -----
  const [avisoDepuracion, setAvisoDepuracion] = useState('')

=======
>>>>>>> 1c38192c68245ab3f1787a4daf7a37b418f27ae0
  /** Cabeceras comunes: cada petición informa a la API la versión activa. */
  const cabeceras = useCallback(
    (extra: Record<string, string> = {}) => ({
      'x-sire-version': version,
      ...extra,
    }),
    [version],
  )

  /** Cambia de versión y limpia los mensajes de la versión anterior. */
<<<<<<< HEAD
  async function cambiarVersion(v: '1.0' | '2.0') {
=======
  function cambiarVersion(v: '1.0' | '2.0') {
>>>>>>> 1c38192c68245ab3f1787a4daf7a37b418f27ae0
    if (v === version) return
    setVersion(v)
    setMensajeRegistro({ tipo: undefined, texto: '' })
    setMensajeConsulta({ tipo: undefined, texto: '' })
    setMensajeActualizacion({ tipo: undefined, texto: '' })
    setEstudianteConsultado(null)
<<<<<<< HEAD
    setAvisoDepuracion('')

    // Al activarse, la v2.0 depura la base de datos de los duplicados que
    // dejó registrar la v1.0 (corrección de DEF01): se conserva el registro
    // original y se eliminan las copias, igual que en la regresión del taller.
    if (v === '2.0') {
      try {
        const res = await fetch('/api/estudiantes/depurar', {
          method: 'POST',
          headers: { 'x-sire-version': '2.0' },
        })
        const data: RespuestaAPI = await res.json()
        if (data.ok && (data.eliminados ?? 0) > 0) {
          setAvisoDepuracion(data.mensaje)
          setPestana('listado')
        }
      } catch {
        // Silencioso: el listado se recarga de todos modos.
      }
    }

    // La lista se recarga después de la depuración para no mostrar datos viejos.
=======
>>>>>>> 1c38192c68245ab3f1787a4daf7a37b418f27ae0
    void cargarLista()
  }

  const cargarLista = useCallback(async () => {
    setCargandoLista(true)
    try {
      const res = await fetch('/api/estudiantes', { headers: cabeceras() })
      const data: RespuestaAPI = await res.json()
      if (data.ok && data.estudiantes) setEstudiantes(data.estudiantes)
    } catch {
      // Silencioso: el listado se reintenta con el botón Actualizar.
    } finally {
      setCargandoLista(false)
    }
  }, [cabeceras])

  useEffect(() => {
    void cargarLista()
  }, [cargarLista])

  // ----- Acciones -----

  async function registrarEstudiante(e: React.FormEvent) {
    e.preventDefault()
    setRegistrando(true)
    setMensajeRegistro({ tipo: undefined, texto: '' })
    try {
      const res = await fetch('/api/estudiantes', {
        method: 'POST',
        headers: cabeceras({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(registro),
      })
      const data: RespuestaAPI = await res.json()
      if (data.ok) {
        setMensajeRegistro({ tipo: 'exito', texto: data.mensaje })
        setRegistro({ identificacion: '', nombres: '', apellidos: '', correo: '', programa: '' })
        void cargarLista()
      } else {
        setMensajeRegistro({ tipo: 'error', texto: data.mensaje })
      }
    } catch {
      setMensajeRegistro({
        tipo: 'error',
        texto: 'No fue posible comunicarse con el servidor. Intente nuevamente.',
      })
    } finally {
      setRegistrando(false)
    }
  }

  async function consultarEstudiante(e: React.FormEvent) {
    e.preventDefault()
    setConsultando(true)
    setEstudianteConsultado(null)
    setMensajeConsulta({ tipo: undefined, texto: '' })
    try {
      const res = await fetch(`/api/estudiantes/${encodeURIComponent(idConsulta.trim())}`, {
        headers: cabeceras(),
      })
      const data: RespuestaAPI = await res.json()
      if (data.ok && data.estudiante) {
        setEstudianteConsultado(data.estudiante)
        setMensajeConsulta({ tipo: 'exito', texto: data.mensaje })
      } else {
        setMensajeConsulta({ tipo: 'error', texto: data.mensaje })
      }
    } catch {
      setMensajeConsulta({
        tipo: 'error',
        texto: 'No fue posible comunicarse con el servidor. Intente nuevamente.',
      })
    } finally {
      setConsultando(false)
    }
  }

  async function cargarDatosActualizar(e: React.FormEvent) {
    e.preventDefault()
    setCargandoActualizar(true)
    setActualizacion(null)
    setMensajeActualizacion({ tipo: undefined, texto: '' })
    try {
      const res = await fetch(`/api/estudiantes/${encodeURIComponent(idActualizar.trim())}`, {
        headers: cabeceras(),
      })
      const data: RespuestaAPI = await res.json()
      if (data.ok && data.estudiante) {
        setActualizacion(data.estudiante)
        setMensajeActualizacion({ tipo: 'exito', texto: data.mensaje })
      } else {
        setMensajeActualizacion({ tipo: 'error', texto: data.mensaje })
      }
    } catch {
      setMensajeActualizacion({
        tipo: 'error',
        texto: 'No fue posible comunicarse con el servidor. Intente nuevamente.',
      })
    } finally {
      setCargandoActualizar(false)
    }
  }

  async function guardarCambios(e: React.FormEvent) {
    e.preventDefault()
    if (!actualizacion) return
    setGuardando(true)
    setMensajeActualizacion({ tipo: undefined, texto: '' })
    try {
      const res = await fetch(`/api/estudiantes/${encodeURIComponent(actualizacion.identificacion)}`, {
        method: 'PUT',
        headers: cabeceras({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          nombres: actualizacion.nombres,
          apellidos: actualizacion.apellidos,
          correo: actualizacion.correo,
          programa: actualizacion.programa,
        }),
      })
      const data: RespuestaAPI = await res.json()
      if (data.ok && data.estudiante) {
        setActualizacion(data.estudiante)
        setMensajeActualizacion({ tipo: 'exito', texto: data.mensaje })
        void cargarLista()
      } else {
        setMensajeActualizacion({ tipo: 'error', texto: data.mensaje })
      }
    } catch {
      setMensajeActualizacion({
        tipo: 'error',
        texto: 'No fue posible comunicarse con el servidor. Intente nuevamente.',
      })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight sm:text-xl">
                SIRE — Sistema de Registro de Estudiantes
              </h1>
              <p className="text-sm text-muted-foreground">
                Registro, consulta y actualización de estudiantes
              </p>
            </div>
          </div>
          <div
            role="group"
            aria-label="Seleccionar versión de la aplicación"
            className="flex items-center gap-0.5 self-center rounded-lg border bg-muted p-0.5"
          >
            <button
              type="button"
              onClick={() => cambiarVersion('1.0')}
              aria-pressed={esV1}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                esV1
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              v1.0 · Original
            </button>
            <button
              type="button"
              onClick={() => cambiarVersion('2.0')}
              aria-pressed={!esV1}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                !esV1
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              v2.0 · Corregida
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {esV1 ? (
          <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Versión 1.0 — original con defectos (ronda 1 del plan de pruebas)
            </p>
            <p className="mt-1.5 leading-relaxed">
              Esta versión reproduce el comportamiento original evaluado en la primera ronda:
              acepta identificaciones duplicadas (DEF01), admite correos con formato inválido
              (DEF02), muestra un error interno al consultar una identificación inexistente
              (DEF03) y permite guardar actualizaciones con campos vacíos (DEF04). Cambie a la
              v2.0 para comparar el comportamiento corregido.
            </p>
          </div>
        ) : (
          <div className="mb-5 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Versión 2.0 — corregida tras el registro de defectos
            </p>
            <p className="mt-1.5 leading-relaxed">
              Los defectos DEF01-DEF04 fueron corregidos: identificación única (RF03),
              validación del formato del correo (RF04), mensaje informativo al consultar una
              identificación inexistente (RF05/RF07) y validación de campos obligatorios en la
<<<<<<< HEAD
              actualización (RF06). Al activarse, esta versión también depura automáticamente
              los duplicados que dejó la v1.0 en la base de datos. Ejecute los mismos casos de
              prueba que en la v1.0 para comparar los resultados.
            </p>
          </div>
        )}
        {!esV1 && avisoDepuracion && (
          <div
            role="status"
            aria-live="polite"
            className="mb-5 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            <p className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Base de datos depurada (corrección de DEF01)
            </p>
            <p className="mt-1.5 leading-relaxed">
              {avisoDepuracion} El listado queda sin identificaciones repetidas y las
              actualizaciones vuelven a ser inequívocas: así se desbloqueó el caso CP12 en la
              regresión de la v2.0.
=======
              actualización (RF06). Ejecute los mismos casos de prueba que en la v1.0 para
              comparar los resultados.
>>>>>>> 1c38192c68245ab3f1787a4daf7a37b418f27ae0
            </p>
          </div>
        )}
        <Tabs value={pestana} onValueChange={setPestana} className="gap-5">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="registro" className="gap-2">
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Registrar
            </TabsTrigger>
            <TabsTrigger value="consulta" className="gap-2">
              <Search className="h-4 w-4" aria-hidden="true" />
              Consultar
            </TabsTrigger>
            <TabsTrigger value="actualizacion" className="gap-2">
              <PencilLine className="h-4 w-4" aria-hidden="true" />
              Actualizar
            </TabsTrigger>
            <TabsTrigger value="listado" className="gap-2">
              <Users className="h-4 w-4" aria-hidden="true" />
              Listado
            </TabsTrigger>
          </TabsList>

          {/* ------------------------- Registro ------------------------- */}
          <TabsContent value="registro">
            <Card>
              <CardHeader>
                <CardTitle>Registro de estudiantes</CardTitle>
                <CardDescription>
                  {esV1
                    ? 'Ingrese la información del estudiante. La versión 1.0 solo exige los campos obligatorios: no valida identificaciones duplicadas (DEF01) ni el formato del correo electrónico (DEF02).'
                    : 'Ingrese la información del estudiante. El sistema valida los campos obligatorios, la identificación única y el formato del correo electrónico.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registrarEstudiante} className="grid gap-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CampoTexto
                      id="identificacion"
                      etiqueta="Identificación"
                      valor={registro.identificacion}
                      onChange={(v) => setRegistro({ ...registro, identificacion: v })}
                      placeholder="Ej.: 102030"
                    />
                    <div className="grid gap-2">
                      <Label htmlFor="programa">Programa académico</Label>
                      <Select
                        value={registro.programa}
                        onValueChange={(v) => setRegistro({ ...registro, programa: v })}
                      >
                        <SelectTrigger id="programa">
                          <SelectValue placeholder="Seleccione el programa" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROGRAMAS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <CampoTexto
                      id="nombres"
                      etiqueta="Nombres"
                      valor={registro.nombres}
                      onChange={(v) => setRegistro({ ...registro, nombres: v })}
                      placeholder="Ej.: Laura"
                    />
                    <CampoTexto
                      id="apellidos"
                      etiqueta="Apellidos"
                      valor={registro.apellidos}
                      onChange={(v) => setRegistro({ ...registro, apellidos: v })}
                      placeholder="Ej.: Gómez"
                    />
                  </div>
                  <CampoTexto
                    id="correo"
                    etiqueta="Correo electrónico"
                    valor={registro.correo}
                    onChange={(v) => setRegistro({ ...registro, correo: v })}
                    placeholder="Ej.: laura.gomez@example.com"
                  />
                  <Button type="submit" className="w-full sm:w-auto sm:self-start" disabled={registrando}>
                    {registrando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" aria-hidden="true" />
                        Registrar estudiante
                      </>
                    )}
                  </Button>
                  <Mensaje tipo={mensajeRegistro.tipo} texto={mensajeRegistro.texto} />
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------------- Consulta ------------------------- */}
          <TabsContent value="consulta">
            <Card>
              <CardHeader>
                <CardTitle>Consulta de estudiantes</CardTitle>
                <CardDescription>
                  Consulte la información de un estudiante mediante su número de identificación.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <form onSubmit={consultarEstudiante} className="flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="idConsulta">Número de identificación</Label>
                    <Input
                      id="idConsulta"
                      value={idConsulta}
                      onChange={(e) => setIdConsulta(e.target.value)}
                      placeholder="Ej.: 102030"
                      autoComplete="off"
                    />
                  </div>
                  <Button type="submit" disabled={consultando}>
                    {consultando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Consultando...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" aria-hidden="true" />
                        Consultar
                      </>
                    )}
                  </Button>
                </form>

                <Mensaje tipo={mensajeConsulta.tipo} texto={mensajeConsulta.texto} />

                {estudianteConsultado && (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="font-semibold">
                        {estudianteConsultado.nombres} {estudianteConsultado.apellidos}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          setIdActualizar(estudianteConsultado.identificacion)
                          setActualizacion(estudianteConsultado)
                          setMensajeActualizacion({
                            tipo: 'exito',
                            texto: `Datos cargados de ${estudianteConsultado.nombres} ${estudianteConsultado.apellidos}. Modifique la información y guarde los cambios.`,
                          })
                          setPestana('actualizacion')
                        }}
                      >
                        <PencilLine className="h-4 w-4" aria-hidden="true" />
                        Editar información
                      </Button>
                    </div>
                    <Separator className="mb-3" />
                    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      <div className="flex justify-between gap-4 sm:block">
                        <dt className="text-muted-foreground">Identificación</dt>
                        <dd className="font-medium">{estudianteConsultado.identificacion}</dd>
                      </div>
                      <div className="flex justify-between gap-4 sm:block">
                        <dt className="text-muted-foreground">Correo electrónico</dt>
                        <dd className="font-medium">{estudianteConsultado.correo}</dd>
                      </div>
                      <div className="flex justify-between gap-4 sm:block">
                        <dt className="text-muted-foreground">Programa académico</dt>
                        <dd className="font-medium">{estudianteConsultado.programa}</dd>
                      </div>
                      <div className="flex justify-between gap-4 sm:block">
                        <dt className="text-muted-foreground">Registro</dt>
                        <dd className="font-medium">
                          {new Date(estudianteConsultado.createdAt).toLocaleString('es-CO')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ----------------------- Actualización ----------------------- */}
          <TabsContent value="actualizacion">
            <Card>
              <CardHeader>
                <CardTitle>Actualización de información</CardTitle>
                <CardDescription>
                  Cargue los datos de un estudiante registrado mediante su identificación y
                  modifique su información.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <form onSubmit={cargarDatosActualizar} className="flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="idActualizar">Número de identificación</Label>
                    <Input
                      id="idActualizar"
                      value={idActualizar}
                      onChange={(e) => setIdActualizar(e.target.value)}
                      placeholder="Ej.: 102030"
                      autoComplete="off"
                    />
                  </div>
                  <Button type="submit" variant="outline" disabled={cargandoActualizar}>
                    {cargandoActualizar ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Cargando...
                      </>
                    ) : (
                      'Cargar datos'
                    )}
                  </Button>
                </form>

                {actualizacion && (
                  <form onSubmit={guardarCambios} className="grid gap-4" noValidate>
                    <Separator />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <CampoTexto
                        id="actIdentificacion"
                        etiqueta="Identificación"
                        valor={actualizacion.identificacion}
                        onChange={() => {}}
                        deshabilitado
                      />
                      <div className="grid gap-2">
                        <Label htmlFor="actPrograma">Programa académico</Label>
                        <Select
                          value={actualizacion.programa}
                          onValueChange={(v) => setActualizacion({ ...actualizacion, programa: v })}
                        >
                          <SelectTrigger id="actPrograma">
                            <SelectValue placeholder="Seleccione el programa" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROGRAMAS.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <CampoTexto
                        id="actNombres"
                        etiqueta="Nombres"
                        valor={actualizacion.nombres}
                        onChange={(v) => setActualizacion({ ...actualizacion, nombres: v })}
                      />
                      <CampoTexto
                        id="actApellidos"
                        etiqueta="Apellidos"
                        valor={actualizacion.apellidos}
                        onChange={(v) => setActualizacion({ ...actualizacion, apellidos: v })}
                      />
                    </div>
                    <CampoTexto
                      id="actCorreo"
                      etiqueta="Correo electrónico"
                      valor={actualizacion.correo}
                      onChange={(v) => setActualizacion({ ...actualizacion, correo: v })}
                      placeholder="Ej.: laura.gomez@example.com"
                    />
                    <Button type="submit" className="w-full sm:w-auto sm:self-start" disabled={guardando}>
                      {guardando ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <PencilLine className="h-4 w-4" aria-hidden="true" />
                          Guardar cambios
                        </>
                      )}
                    </Button>
                  </form>
                )}

                <Mensaje tipo={mensajeActualizacion.tipo} texto={mensajeActualizacion.texto} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------------- Listado ------------------------- */}
          <TabsContent value="listado">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="grid gap-1.5">
                    <CardTitle>Estudiantes registrados</CardTitle>
                    <CardDescription>
                      Estado actual de la base de datos del sistema ({estudiantes.length}{' '}
                      {estudiantes.length === 1 ? 'estudiante' : 'estudiantes'}).
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => void cargarLista()}
                    disabled={cargandoLista}
                  >
                    <RefreshCw className={`h-4 w-4 ${cargandoLista ? 'animate-spin' : ''}`} aria-hidden="true" />
                    Actualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cargandoLista && estudiantes.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Cargando listado...</p>
                ) : estudiantes.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No hay estudiantes registrados todavía.
                  </p>
                ) : (
                  <div className="max-h-96 overflow-y-auto rounded-lg border">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur">
                        <TableRow>
                          <TableHead>Identificación</TableHead>
                          <TableHead>Nombres</TableHead>
                          <TableHead>Apellidos</TableHead>
                          <TableHead>Correo electrónico</TableHead>
                          <TableHead className="hidden md:table-cell">Programa académico</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {estudiantes.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.identificacion}</TableCell>
                            <TableCell>{e.nombres}</TableCell>
                            <TableCell>{e.apellidos}</TableCell>
                            <TableCell>{e.correo}</TableCell>
                            <TableCell className="hidden md:table-cell">{e.programa}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-auto border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-muted-foreground">
          SIRE {esV1 ? 'v1.0 (original con defectos)' : 'v2.0 (corregida)'} — Prototipo académico ·
          Taller: Implementación del Plan de Pruebas de Software · Ingeniería de Software II
        </div>
      </footer>
    </div>
  )
}
