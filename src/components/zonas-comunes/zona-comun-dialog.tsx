"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Form,
  FormControl,
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
import { Plus, Edit } from "lucide-react"
import { CreateZonaComunDto, UpdateZonaComunDto, ZonaComun } from "@/Types/zonasComunes"
import { createZonaComunDtoSchema, updateZonaComunDtoSchema } from "@/lib/aseo/schemas/ZonaComun.schema"
import { toast } from "sonner"

interface ZonaComunDialogProps {
  // Props para creación
  onCreateZona?: (data: CreateZonaComunDto) => void
  isCreating?: boolean
  resetCreate?: () => void

  // Props para edición
  zona?: ZonaComun | null
  onUpdateZona?: (id: number, data: UpdateZonaComunDto) => void
  isUpdating?: boolean
  resetUpdate?: () => void

  // Props para controlar el modal externamente (para edición)
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ZonaComunDialog({
  onCreateZona,
  isCreating = false,
  resetCreate,
  zona,
  onUpdateZona,
  isUpdating = false,
  resetUpdate,
  open,
  onOpenChange
}: ZonaComunDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isEditMode = !!zona
  const isControlledOpen = open !== undefined
  const isOpen = isControlledOpen ? open : internalOpen
  const setOpen = isControlledOpen ? onOpenChange! : setInternalOpen

  // Determinar el schema basado en el modo
  const schema = isEditMode ? updateZonaComunDtoSchema : createZonaComunDtoSchema

  // Formulario unificado
  const form = useForm<CreateZonaComunDto | UpdateZonaComunDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      piso: 0,
    }
  })

  // Efecto para llenar el formulario cuando se edita
  useEffect(() => {
    if (isEditMode && zona) {
      form.reset({
        nombre: zona.nombre,
        piso: zona.piso,
      })
    } else if (!isEditMode) {
      form.reset({
        nombre: "",
        piso: 0,
      })
    }
  }, [zona, isEditMode, form])

  // Manejar envío del formulario
  const handleSubmit = (data: CreateZonaComunDto | UpdateZonaComunDto) => {
    if (isEditMode && zona && onUpdateZona) {
      onUpdateZona(zona.id, data as UpdateZonaComunDto)
      toast.success("Zona común actualizada exitosamente")
    } else if (!isEditMode && onCreateZona) {
      onCreateZona(data as CreateZonaComunDto)
      toast.success("Zona común creada exitosamente")
    }

    handleClose()
  }

  // Manejar cierre del dialog
  const handleClose = () => {
    setOpen(false)
    form.reset()

    if (isEditMode && resetUpdate) {
      resetUpdate()
    } else if (!isEditMode && resetCreate) {
      resetCreate()
    }
  }

  const isLoading = isEditMode ? isUpdating : isCreating

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Zona
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? (
              <>
                <Edit className="h-5 w-5 inline mr-2" />
                Editar Zona Común
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 inline mr-2" />
                Crear Nueva Zona Común
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifica los datos de la zona común"
              : "Agrega una nueva zona común al sistema"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Zona</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Lobby Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="piso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piso</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    {isEditMode ? "Actualizando..." : "Creando..."}
                  </>
                ) : (
                  isEditMode ? "Actualizar" : "Crear Zona"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 