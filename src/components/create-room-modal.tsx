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
  DialogClose,
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
import { createHabitacion, CreateHabitacionDto, EstadoHabitacion, TipoHabitacion } from "@/lib/habitacion-service"
import { toast } from "sonner"
import { X } from "lucide-react"

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
      await createHabitacion(values)
      toast.success("Habitación creada", {
        description: "La habitación ha sido creada exitosamente.",
      })
      setOpen(false)
      form.reset()
      onRoomCreated?.()
    } catch (error) {
      toast.error("Error", {
        description: "Hubo un error al crear la habitación.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <span className="mr-2">Añadir habitación</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
            <path d="M2 11h20" />
            <path d="M12 7v14" />
            <path d="M2 14h20" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer">
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </DialogClose>
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
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(EstadoHabitacion).map((estado) => (
                        <SelectItem key={estado} value={estado} className="cursor-pointer">
                          {estado}
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
              <Button type="submit" className="cursor-pointer">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 