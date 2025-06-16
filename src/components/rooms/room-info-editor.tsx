import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { BedDouble, Check, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { EstadoHabitacion } from "@/Types/enums/estadosHabitacion"
import { TipoHabitacion } from "@/Types/enums/tiposHabitacion"
import { Habitacion, UpdateHabitacionDto } from "@/Types/habitacion"
import { updateHabitacion, deleteHabitacion } from "@/lib/rooms/habitacion-service"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Reserva } from "@/Types/Reserva"
import { 
  getRoomBorderClass, 
  getRoomBadgeClass, 
  getRoomStatusText,
  getRoomTextClass 
} from "@/lib/common/constants/room-constants"
import { AdminOnly } from "../auth/permission-guard"

interface RoomInfoEditorProps {
  habitacion?: Habitacion | null
  reservas?: Reserva[] | null
  loading: boolean
  onRoomUpdated?: () => void
}

const updateFormSchema = z.object({
  numero_habitacion: z.coerce.number().min(1, "El número de habitación debe ser mayor a 0"),
  tipo: z.nativeEnum(TipoHabitacion),
  estado: z.nativeEnum(EstadoHabitacion),
  precio_por_noche: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
})

export function RoomInfoEditor({ habitacion, loading, onRoomUpdated }: RoomInfoEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      numero_habitacion: habitacion?.numero_habitacion || 0,
      tipo: habitacion?.tipo || TipoHabitacion.SENCILLA,
      estado: habitacion?.estado || EstadoHabitacion.LIBRE,
      precio_por_noche: habitacion?.precio_por_noche || 0,
    },
  })

  // Actualizar los valores del formulario cuando cambia la habitación
  useEffect(() => {
    if (habitacion) {
      form.reset({
        numero_habitacion: habitacion.numero_habitacion,
        tipo: habitacion.tipo,
        estado: habitacion.estado,
        precio_por_noche: habitacion.precio_por_noche,
      })
    }
  }, [habitacion, form])

  async function onSubmit(values: z.infer<typeof updateFormSchema>) {
    if (!habitacion?.id) {
      toast.error("No se puede actualizar la habitación sin un ID")
      return
    }

    // Crear un objeto con solo los campos que han cambiado
    const changedFields: UpdateHabitacionDto = {}
    
    if (values.numero_habitacion !== habitacion.numero_habitacion) {
      changedFields.numero_habitacion = values.numero_habitacion
    }
    
    if (values.tipo !== habitacion.tipo) {
      changedFields.tipo = values.tipo
    }
    
    if (values.estado !== habitacion.estado) {
      changedFields.estado = values.estado
    }
    
    if (values.precio_por_noche !== habitacion.precio_por_noche) {
      changedFields.precio_por_noche = values.precio_por_noche
    }

    // Si no hay cambios, no hacer nada
    if (Object.keys(changedFields).length === 0) {
      toast.info("No hay cambios para actualizar")
      setDialogOpen(false)
      return
    }

    // ID del toast de carga
    const loadingToastId = "updating-room"
    
    try {
      toast.loading("Actualizando habitación...", { id: loadingToastId })
      await updateHabitacion(habitacion.id, changedFields)
      
      toast.success("Habitación actualizada", {
        description: "Los datos han sido actualizados correctamente",
      })
      
      setDialogOpen(false)
      onRoomUpdated?.()
    } catch (error) {
      toast.error("Error al actualizar", {
        description: error instanceof Error ? error.message : "No se pudo actualizar la habitación",
      })
    } finally {
      toast.dismiss(loadingToastId)
    }
  }

  async function handleDelete() {
    if (!habitacion?.id) {
      toast.error("No se puede eliminar la habitación sin un ID")
      return
    }

    setIsDeleting(true)

    try {
      await deleteHabitacion(habitacion.id)
      toast.success("Habitación eliminada", {
        description: "Los datos han sido eliminados correctamente",
      })
      router.push("/dashboard")
    } catch (error) {
      toast.error("Error al eliminar", {
        description: error instanceof Error ? error.message : "No se pudo eliminar la habitación",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Información de la habitación</CardTitle>
        <div className="flex gap-2">
          <AdminOnly>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="cursor-pointer h-8 gap-1"
                disabled={loading}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Editar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar habitación</DialogTitle>
                <DialogDescription>
                  Actualice los datos de la habitación. Haga clic en guardar cuando termine.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                  <FormField
                    control={form.control}
                    name="numero_habitacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de habitación</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de habitación</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(TipoHabitacion).map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(EstadoHabitacion).map((estado) => (
                                <SelectItem key={estado} value={estado}>
                                  {estado}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="precio_por_noche"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio por noche</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" className="mt-4">
                      <Check className="mr-2 h-4 w-4" /> Guardar cambios
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive"
                size="sm" 
                className="cursor-pointer h-8 gap-1"
                disabled={loading || isDeleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Eliminar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Está seguro de eliminar esta habitación?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente la habitación #{habitacion?.numero_habitacion} y todos sus datos asociados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
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
          </AdminOnly>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            {/* Ilustración (más pequeña) */}
            <div className="w-full md:w-1/4 flex items-center justify-center">
              <div className={`border ${getRoomBorderClass(habitacion?.estado)} rounded-md p-3 flex flex-col justify-center overflow-hidden h-[120px] w-[120px]`}>
                <BedDouble className={`w-full max-w-[80px] mx-auto ${getRoomTextClass(habitacion?.estado)}`} />
                <div className="mt-2 text-center">
                  <Badge className={getRoomBadgeClass(habitacion?.estado)}>
                    {getRoomStatusText(habitacion?.estado)}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Información */}
            <div className="w-full md:w-3/4 space-y-3">
              <div className="flex justify-between">
                <p className="font-medium">Habitación</p>
                <p>{habitacion?.numero_habitacion}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Tipo</p>
                <p>{habitacion?.tipo}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Estado</p>
                <p>{habitacion?.estado}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Precio por noche</p>
                <p>
                  {habitacion?.precio_por_noche
                    ? habitacion.precio_por_noche.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 