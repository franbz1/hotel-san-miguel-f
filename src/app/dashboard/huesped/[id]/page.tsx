"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  UserCheck,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  MapIcon
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { getHuespedById, updateHuesped } from "@/lib/huespedes/huesped-service"
import { Huesped, UpdateHuespedDto } from "@/Types/huesped"
import { TipoDoc } from "@/Types/enums/tiposDocumento"
import { EstadosReserva } from "@/Types/enums/estadosReserva"
import { MotivosViajes } from "@/Types/enums/motivosViajes"
import { toast } from "sonner"
import { ReservasList } from "@/components/reservas"

export default function HuespedDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const huespedId = parseInt(params.id as string)

  const [huesped, setHuesped] = useState<Huesped | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<UpdateHuespedDto>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHuesped()
  }, [huespedId])

  const fetchHuesped = async () => {
    try {
      setLoading(true)
      setError(null)
      const huespedData = await getHuespedById(huespedId)
      setHuesped(huespedData)
      setEditData({
        tipo_documento: huespedData.tipo_documento,
        numero_documento: huespedData.numero_documento,
        primer_apellido: huespedData.primer_apellido,
        segundo_apellido: huespedData.segundo_apellido,
        nombres: huespedData.nombres,
        pais_residencia: huespedData.pais_residencia,
        ciudad_residencia: huespedData.ciudad_residencia,
        nacionalidad: huespedData.nacionalidad,
        ocupacion: huespedData.ocupacion,
        genero: huespedData.genero,
        telefono: huespedData.telefono || '',
        correo: huespedData.correo || ''
      })
    } catch (error) {
      console.error('Error al cargar huésped:', error)
      setError('Error al cargar la información del huésped')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!huesped) return

    try {
      setSaving(true)
      const updatedHuesped = await updateHuesped(huesped.id, editData)
      setHuesped(updatedHuesped)
      setIsEditing(false)
      toast.success('Información del huésped actualizada correctamente')
    } catch (error) {
      console.error('Error al actualizar huésped:', error)
      toast.error('Error al actualizar la información del huésped')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (huesped) {
      setEditData({
        tipo_documento: huesped.tipo_documento,
        numero_documento: huesped.numero_documento,
        primer_apellido: huesped.primer_apellido,
        segundo_apellido: huesped.segundo_apellido,
        nombres: huesped.nombres,
        pais_residencia: huesped.pais_residencia,
        ciudad_residencia: huesped.ciudad_residencia,
        nacionalidad: huesped.nacionalidad,
        ocupacion: huesped.ocupacion,
        genero: huesped.genero,
        telefono: huesped.telefono || '',
        correo: huesped.correo || ''
      })
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Funciones para calcular analíticas
  const getAnalytics = () => {
    if (!huesped) return null

    const reservas = huesped.reservas || []
    const facturas = huesped.facturas || []

    // Estadísticas de reservas
    const totalReservas = reservas.length
    const reservasPorEstado = reservas.reduce((acc, reserva) => {
      acc[reserva.estado] = (acc[reserva.estado] || 0) + 1
      return acc
    }, {} as Record<EstadosReserva, number>)

    // Calcular noches totales
    const nochesTotales = reservas.reduce((total, reserva) => {
      const inicio = new Date(reserva.fecha_inicio)
      const fin = new Date(reserva.fecha_fin)
      const noches = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
      return total + noches
    }, 0)

    // Fechas primera y última reserva
    const fechasReservas = reservas.map(r => new Date(r.createdAt)).sort((a, b) => a.getTime() - b.getTime())
    const primeraReserva = fechasReservas[0]
    const ultimaReserva = fechasReservas[fechasReservas.length - 1]

    // Motivos de viaje más frecuentes
    const motivosFreq = reservas.reduce((acc, reserva) => {
      acc[reserva.motivo_viaje] = (acc[reserva.motivo_viaje] || 0) + 1
      return acc
    }, {} as Record<MotivosViajes, number>)

    const motivoMasFrecuente = Object.entries(motivosFreq).sort(([,a], [,b]) => b - a)[0]

    // Ciudades de procedencia
    const ciudadesFreq = reservas.reduce((acc, reserva) => {
      const ciudad = `${reserva.ciudad_procedencia}, ${reserva.pais_procedencia}`
      acc[ciudad] = (acc[ciudad] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const ciudadMasFrecuente = Object.entries(ciudadesFreq).sort(([,a], [,b]) => b - a)[0]

    // Estadísticas de facturas
    const totalFacturado = facturas.reduce((total, factura) => total + factura.total, 0)
    const promedioFactura = facturas.length > 0 ? totalFacturado / facturas.length : 0
    const facturaMasAlta = facturas.length > 0 ? Math.max(...facturas.map(f => f.total)) : 0
    const facturaMasBaja = facturas.length > 0 ? Math.min(...facturas.map(f => f.total)) : 0

    // Tiempo como cliente
    const tiempoCliente = primeraReserva ? 
      Math.ceil((Date.now() - primeraReserva.getTime()) / (1000 * 60 * 60 * 24)) : 0

    // Total acompañantes
    const totalAcompanantes = huesped.huespedes_secundarios?.length || 0

    return {
      totalReservas,
      reservasPorEstado,
      nochesTotales,
      primeraReserva,
      ultimaReserva,
      motivoMasFrecuente,
      ciudadMasFrecuente,
      totalFacturado,
      promedioFactura,
      facturaMasAlta,
      facturaMasBaja,
      tiempoCliente,
      totalAcompanantes,
      totalFacturas: facturas.length
    }
  }

  const analytics = getAnalytics()

  const formatMotivoViaje = (motivo: MotivosViajes) => {
    switch(motivo) {
      case MotivosViajes.NEGOCIOS_Y_MOTIVOS_PROFESIONALES:
        return "Negocios"
      case MotivosViajes.VACACIONES_RECREO_Y_OCIO:
        return "Recreación"
      case MotivosViajes.SALUD_Y_ATENCION_MEDICA:
        return "Salud"
      case MotivosViajes.EDUCACION_Y_FORMACION:
        return "Educación"
      case MotivosViajes.OTROS_MOTIVOS:
        return "Otros"
      default:
        return motivo
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Detalles del Huésped" />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Cargando información del huésped...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !huesped) {
    return (
      <div>
        <Header title="Error" />
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error || 'Huésped no encontrado'}</p>
              <Button onClick={() => router.push('/dashboard')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Hotel San Miguel" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header con acciones */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {huesped.nombres} {huesped.primer_apellido} {huesped.segundo_apellido}
              </h1>
              <p className="text-gray-600">{huesped.tipo_documento} {huesped.numero_documento}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="contacto" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contacto</span>
            </TabsTrigger>
            <TabsTrigger value="reservas" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="acompanantes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Acompañantes</span>
            </TabsTrigger>
            <TabsTrigger value="analitica" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analítica</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab de Información Personal */}
          <TabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombres">Nombres</Label>
                      {isEditing ? (
                        <Input
                          id="nombres"
                          value={editData.nombres || ''}
                          onChange={(e) => setEditData({...editData, nombres: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{huesped.nombres}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="primer_apellido">Primer Apellido</Label>
                      {isEditing ? (
                        <Input
                          id="primer_apellido"
                          value={editData.primer_apellido || ''}
                          onChange={(e) => setEditData({...editData, primer_apellido: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{huesped.primer_apellido}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="segundo_apellido">Segundo Apellido</Label>
                      {isEditing ? (
                        <Input
                          id="segundo_apellido"
                          value={editData.segundo_apellido || ''}
                          onChange={(e) => setEditData({...editData, segundo_apellido: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{huesped.segundo_apellido || 'No especificado'}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="genero">Género</Label>
                      {isEditing ? (
                        <Select
                          value={editData.genero || ''}
                          onValueChange={(value) => setEditData({...editData, genero: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar género" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Masculino</SelectItem>
                            <SelectItem value="F">Femenino</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">
                          {huesped.genero === 'M' ? 'Masculino' : huesped.genero === 'F' ? 'Femenino' : huesped.genero}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                      {isEditing ? (
                        <Select
                          value={editData.tipo_documento || ''}
                          onValueChange={(value) => setEditData({...editData, tipo_documento: value as TipoDoc})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de documento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TipoDoc.CC}>Cédula de Ciudadanía</SelectItem>
                            <SelectItem value={TipoDoc.CE}>Cédula de Extranjería</SelectItem>
                            <SelectItem value={TipoDoc.TI}>Tarjeta de Identidad</SelectItem>
                            <SelectItem value={TipoDoc.PASAPORTE}>Pasaporte</SelectItem>
                            <SelectItem value={TipoDoc.PPT}>PPT</SelectItem>
                            <SelectItem value={TipoDoc.PEP}>PEP</SelectItem>
                            <SelectItem value={TipoDoc.DNI}>DNI</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{huesped.tipo_documento}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="numero_documento">Número de Documento</Label>
                      {isEditing ? (
                        <Input
                          id="numero_documento"
                          value={editData.numero_documento || ''}
                          onChange={(e) => setEditData({...editData, numero_documento: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{huesped.numero_documento}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nacionalidad">Nacionalidad</Label>
                      {isEditing ? (
                        <Input
                          id="nacionalidad"
                          value={editData.nacionalidad || ''}
                          onChange={(e) => setEditData({...editData, nacionalidad: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{huesped.nacionalidad}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ocupacion">Ocupación</Label>
                      {isEditing ? (
                        <Input
                          id="ocupacion"
                          value={editData.ocupacion || ''}
                          onChange={(e) => setEditData({...editData, ocupacion: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{huesped.ocupacion}</p>
                      )}
                    </div>
                  </div>

                  {huesped.fechaNacimiento && (
                    <div>
                      <Label>Fecha de Nacimiento</Label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(huesped.fechaNacimiento)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Información de Residencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pais_residencia">País de Residencia</Label>
                    {isEditing ? (
                      <Input
                        id="pais_residencia"
                        value={editData.pais_residencia || ''}
                        onChange={(e) => setEditData({...editData, pais_residencia: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{huesped.pais_residencia}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ciudad_residencia">Ciudad de Residencia</Label>
                    {isEditing ? (
                      <Input
                        id="ciudad_residencia"
                        value={editData.ciudad_residencia || ''}
                        onChange={(e) => setEditData({...editData, ciudad_residencia: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{huesped.ciudad_residencia}</p>
                    )}
                  </div>
                  {huesped.departamento_residencia && (
                    <div>
                      <Label>Departamento de Residencia</Label>
                      <p className="text-sm text-gray-900 mt-1">{huesped.departamento_residencia}</p>
                    </div>
                  )}
                  {huesped.lugarNacimiento && (
                    <div>
                      <Label>Lugar de Nacimiento</Label>
                      <p className="text-sm text-gray-900 mt-1">{huesped.lugarNacimiento}</p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <Label>Fecha de Registro</Label>
                      <p className="mt-1">{formatDate(huesped.createdAt)}</p>
                    </div>
                    <div>
                      <Label>Última Actualización</Label>
                      <p className="mt-1">{formatDate(huesped.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab de Contacto */}
          <TabsContent value="contacto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    {isEditing ? (
                      <Input
                        id="telefono"
                        value={editData.telefono || ''}
                        onChange={(e) => setEditData({...editData, telefono: e.target.value})}
                        placeholder="Número de teléfono"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{huesped.telefono || 'No especificado'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="correo">Correo Electrónico</Label>
                    {isEditing ? (
                      <Input
                        id="correo"
                        type="email"
                        value={editData.correo || ''}
                        onChange={(e) => setEditData({...editData, correo: e.target.value})}
                        placeholder="correo@ejemplo.com"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{huesped.correo || 'No especificado'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Reservas */}
          <TabsContent value="reservas">
            <ReservasList 
              reservas={huesped.reservas || []}
              title="Reservas del Huésped"
              emptyMessage="Este huésped no tiene reservas registradas"
              className="border-0 shadow-none p-0"
              huesped={huesped}
              huespedesSecundarios={huesped.huespedes_secundarios}
              facturas={huesped.facturas}
            />
          </TabsContent>

          {/* Tab de Acompañantes */}
          <TabsContent value="acompanantes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Huéspedes Acompañantes
                  <Badge variant="secondary">
                    {huesped.huespedes_secundarios?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!huesped.huespedes_secundarios || huesped.huespedes_secundarios.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No hay acompañantes registrados</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {huesped.huespedes_secundarios.map((acompanante) => (
                        <div key={acompanante.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                {acompanante.nombres} {acompanante.primer_apellido} {acompanante.segundo_apellido}
                                <Badge variant="outline" className="text-xs">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Acompañante
                                </Badge>
                              </h4>
                              <p className="text-sm text-gray-600">
                                {acompanante.tipo_documento} {acompanante.numero_documento}
                              </p>
                              <p className="text-sm text-gray-600">
                                Nacionalidad: {acompanante.nacionalidad}
                              </p>
                              <p className="text-sm text-gray-600">
                                Género: {acompanante.genero === 'M' ? 'Masculino' : acompanante.genero === 'F' ? 'Femenino' : acompanante.genero}
                              </p>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                              <p>Registrado:</p>
                              <p>{formatDate(acompanante.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Analítica */}
          <TabsContent value="analitica">
            <div className="space-y-6">
              {/* Resumen general */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Reservas</p>
                        <p className="text-2xl font-bold">{analytics?.totalReservas || 0}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Noches Totales</p>
                        <p className="text-2xl font-bold">{analytics?.nochesTotales || 0}</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Facturado</p>
                        <p className="text-2xl font-bold">${(analytics?.totalFacturado || 0).toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Días como Cliente</p>
                        <p className="text-2xl font-bold">{analytics?.tiempoCliente || 0}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estadísticas detalladas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Estadísticas de Reservas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Estadísticas de Reservas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Primera Reserva</Label>
                        <p className="text-sm font-medium">
                          {analytics?.primeraReserva ? formatDate(analytics.primeraReserva) : 'No disponible'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Última Reserva</Label>
                        <p className="text-sm font-medium">
                          {analytics?.ultimaReserva ? formatDate(analytics.ultimaReserva) : 'No disponible'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Reservas por Estado</Label>
                      {analytics?.reservasPorEstado && Object.entries(analytics.reservasPorEstado).map(([estado, cantidad]) => (
                        <div key={estado} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              estado === EstadosReserva.RESERVADO ? 'default' : 
                              estado === EstadosReserva.FINALIZADO ? 'secondary' :
                              estado === EstadosReserva.CANCELADO ? 'destructive' : 'outline'
                            }>
                              {estado}
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">{cantidad}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Motivo de Viaje Más Frecuente</Label>
                      <p className="text-sm font-medium">
                        {analytics?.motivoMasFrecuente ? 
                          `${formatMotivoViaje(analytics.motivoMasFrecuente[0] as MotivosViajes)} (${analytics.motivoMasFrecuente[1]} veces)` : 
                          'No disponible'
                        }
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Ciudad de Procedencia Más Frecuente</Label>
                      <div className="flex items-center gap-2">
                        <MapIcon className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {analytics?.ciudadMasFrecuente ? 
                            `${analytics.ciudadMasFrecuente[0]} (${analytics.ciudadMasFrecuente[1]} veces)` : 
                            'No disponible'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estadísticas de Facturas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Estadísticas de Facturas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Total de Facturas</Label>
                          <p className="text-lg font-bold text-emerald-700">{analytics?.totalFacturas || 0}</p>
                        </div>
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Promedio por Factura</Label>
                          <p className="text-lg font-bold text-blue-700">
                            ${(analytics?.promedioFactura || 0).toLocaleString()}
                          </p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-green-50 rounded-lg border">
                          <Label className="text-xs text-muted-foreground">Factura Más Alta</Label>
                          <p className="text-sm font-bold text-green-700">
                            ${(analytics?.facturaMasAlta || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg border">
                          <Label className="text-xs text-muted-foreground">Factura Más Baja</Label>
                          <p className="text-sm font-bold text-orange-700">
                            ${(analytics?.facturaMasBaja || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Información Adicional</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Acompañantes</span>
                          <span className="text-sm font-medium">{analytics?.totalAcompanantes || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Promedio Acompañantes por Reserva</span>
                          <span className="text-sm font-medium">
                            {analytics?.totalReservas ? 
                              ((analytics?.totalAcompanantes || 0) / analytics.totalReservas).toFixed(1) : 
                              '0'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 