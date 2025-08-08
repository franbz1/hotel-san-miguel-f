"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  User,
  Building,
  ClipboardList,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { 
  useRegistroAseoZonaComun, 
  useUpdateRegistroAseoZonaComun, 
  useDeleteRegistroAseoZonaComun 
} from "@/hooks/aseo/useRegistrosAseoZonaComun"
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum"
import { UpdateRegistroAseoZonaComunDto } from "@/Types/aseo/RegistroAseoZonaComun"
import { updateRegistroAseoZonaComunDtoSchema } from "@/lib/aseo/schemas/RegistroAseoZonaComun.schema"
import { toast } from "sonner"

export default function DetalleRegistroAseoZonaComunPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const registroId = parseInt(params.id as string)
  
  const { 
    registro, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useRegistroAseoZonaComun(registroId)
  
  const { 
    updateRegistro, 
    isUpdating, 
    isError: updateError, 
    error: updateErrorMessage,
    isSuccess: updateSuccess,
    reset: resetUpdate
  } = useUpdateRegistroAseoZonaComun()
  
  const { 
    deleteRegistro, 
    isDeleting, 
    isError: deleteError, 
    error: deleteErrorMessage,
    isSuccess: deleteSuccess,
    reset: resetDelete
  } = useDeleteRegistroAseoZonaComun()

  const form = useForm<UpdateRegistroAseoZonaComunDto>({
    resolver: zodResolver(updateRegistroAseoZonaComunDtoSchema),
    defaultValues: {
      tipos_realizados: [],
      objetos_perdidos: false,
      rastros_de_animales: false,
      observaciones: ""
    }
  })

  // Cargar datos del registro en el formulario cuando se obtienen
  useEffect(() => {
    if (registro) {
      form.reset({
        fecha_registro: new Date(registro.fecha_registro).toISOString().slice(0, 16),
        tipos_realizados: registro.tipos_realizados || [],
        objetos_perdidos: registro.objetos_perdidos || false,
        rastros_de_animales: registro.rastros_de_animales || false,
        observaciones: registro.observaciones || ""
      })
    }
  }, [registro, form.reset])

  // Formatear fecha UTC a local
  const formatearFechaLocal = (fechaUTC: Date) => {
    try {
      const fecha = new Date(fechaUTC)
      return fecha.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  // Obtener badge color por tipo de aseo
  const getTipoAseoBadgeColor = (tipo: TiposAseo) => {
    switch (tipo) {
      case TiposAseo.LIMPIEZA:
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case TiposAseo.DESINFECCION:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Manejar actualización
  const handleUpdate = (data: UpdateRegistroAseoZonaComunDto) => {
    updateRegistro(registroId, data)
  }

  // Manejar eliminación
  const handleDelete = () => {
    deleteRegistro(registroId)
  }

  // Efectos de éxito
  useEffect(() => {
    if (updateSuccess) {
      toast.success("Registro actualizado exitosamente")
      setIsEditing(false)
      resetUpdate()
      refetch()
    }
  }, [updateSuccess, resetUpdate, refetch])

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Registro eliminado exitosamente")
      resetDelete()
      router.push("/aseo/zonas-comunes/registros")
    }
  }, [deleteSuccess, resetDelete, router])

  // Efectos de error
  useEffect(() => {
    if (updateError) {
      toast.error(`Error al actualizar: ${updateErrorMessage}`)
    }
  }, [updateError, updateErrorMessage])

  useEffect(() => {
    if (deleteError) {
      toast.error(`Error al eliminar: ${deleteErrorMessage}`)
    }
  }, [deleteError, deleteErrorMessage])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner />
          <span className="ml-2">Cargando registro...</span>
        </div>
      </div>
    )
  }

  if (isError || !registro) {
    return (
      <div className="container mx-auto py-6">
        <Alert className="max-w-2xl mx-auto" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar el registro: {error || "Registro no encontrado"}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Registro de Aseo #{registro.id}</h1>
            <p className="text-muted-foreground">
              Detalles completos del registro de aseo - Zona Común
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                    <DialogDescription>
                      Esta acción no se puede deshacer. El registro será eliminado permanentemente.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(false)}
              variant="outline"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información General */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Zona Común:</span>
                <Badge variant="outline">
                  {registro.zonaComun?.nombre || `Zona ${registro.zonaComunId}`}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Usuario:</span>
                <span>{registro.usuario?.nombre || `Usuario ${registro.usuarioId}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Fecha:</span>
                <span>{formatearFechaLocal(registro.fecha_registro)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Tipos de Aseo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {registro.tipos_realizados.map((tipo, index) => (
                  <Badge key={index} className={getTipoAseoBadgeColor(tipo)}>
                    {tipo}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Hallazgos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Objetos perdidos:</span>
                <Badge variant={registro.objetos_perdidos ? "destructive" : "secondary"}>
                  {registro.objetos_perdidos ? "Sí" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rastros de animales:</span>
                <Badge variant={registro.rastros_de_animales ? "destructive" : "secondary"}>
                  {registro.rastros_de_animales ? "Sí" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulario de Edición / Vista Detallada */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? "Editar Registro" : "Detalles del Registro"}
              </CardTitle>
              <CardDescription>
                {isEditing ? "Modifica los campos necesarios" : "Información detallada del registro"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6">

                    <FormField
                      control={form.control}
                      name="fecha_registro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Registro</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <Label>Tipos de Aseo Realizados</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[TiposAseo.LIMPIEZA, TiposAseo.DESINFECCION].map((tipo) => (
                          <FormField
                            key={tipo}
                            control={form.control}
                            name="tipos_realizados"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tipo)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || []
                                      if (checked) {
                                        field.onChange([...currentValues, tipo])
                                      } else {
                                        field.onChange(currentValues.filter(v => v !== tipo))
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {tipo}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="objetos_perdidos"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Objetos perdidos encontrados</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rastros_de_animales"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Rastros de animales encontrados</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="observaciones"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observaciones</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Observaciones adicionales..."
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Información adicional sobre el registro de aseo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <LoadingSpinner className="mr-2 h-4 w-4" />
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  {registro.observaciones && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Observaciones</h3>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {registro.observaciones}
                      </p>
                    </div>
                  )}
                  
                  {!registro.observaciones && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Observaciones</h3>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        Sin observaciones adicionales
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 