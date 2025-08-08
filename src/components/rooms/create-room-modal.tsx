"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { useCreateHabitacion } from "@/lib/rooms/habitacion-service"
import { EstadoHabitacion } from "@/Types/enums/estadosHabitacion"
import { TipoHabitacion } from "@/Types/enums/tiposHabitacion"
import { toast } from "sonner"
import { BedDouble } from "lucide-react"

const formSchema = z.object({
  numero_habitacion: z.coerce.number().min(1, "El número de habitación debe ser mayor a 0"),
  tipo: z.nativeEnum(TipoHabitacion),
  estado: z.nativeEnum(EstadoHabitacion),
  precio_por_noche: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
})

interface CreateRoomModalProps {
  onRoomCreated?: () => void
}

export function CreateRoomModal({ onRoomCreated }: CreateRoomModalProps) {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateHabitacion()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_habitacion: 0,
      tipo: TipoHabitacion.SENCILLA,
      estado: EstadoHabitacion.LIBRE,
      precio_por_noche: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createMutation.mutateAsync(values)
      
      toast.success("Habitación creada", {
        description: (
          <div className="mt-2">
            <p className="text-sm text-black">La habitación ha sido creada exitosamente.</p>
          </div>
        ),
      })
      
      setOpen(false)
      form.reset()
      onRoomCreated?.()
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: (
            <div className="mt-2">
              <p className="text-sm text-black">Hubo un error al crear la habitación.</p>
              <p className="mt-2 text-sm text-red-600">{error.message}</p>
              <p className="mt-2 text-sm text-red-600">¡Intenta nuevamente!</p>
            </div>
          ),
        })
      } else {
        toast.error("Error", {
          description: (
            <div className="mt-2">
              <p className="text-sm text-black">Hubo un error al crear la habitación.</p>
              <p className="mt-2 text-sm text-red-600">¡Intenta nuevamente!</p>
            </div>
          ),
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <span className="mr-2">Añadir habitación</span>
          <BedDouble className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nueva habitación</DialogTitle>
          <DialogDescription>
            Complete los datos de la nueva habitación. Haga clic en guardar cuando termine.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TipoHabitacion).map((tipo) => (
                        <SelectItem key={tipo} value={tipo} className="cursor-pointer">
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <Button 
                type="submit" 
                className="cursor-pointer"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 