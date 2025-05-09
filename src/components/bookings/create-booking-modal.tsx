"use client"

import { useState, useEffect } from "react"
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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { generateLinkFormulario } from "@/lib/formulario/link-formulario-service"
import { toast } from "sonner"
import { getHabitacionesDisponibles } from "@/lib/rooms/habitacion-service"
import { Habitacion } from "@/Types/habitacion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DateTimePicker } from "../ui/dateTimePicker"

// Definir schema con manejo específico para fechas
const formSchema = z.object({
  numeroHabitacion: z.coerce.number().min(1, "Debe seleccionar una habitación"),
  fechaInicio: z.string().min(1, "Debe seleccionar una fecha de inicio"),
  fechaFin: z.string().min(1, "Debe seleccionar una fecha de fin"),
  costo: z.coerce.number().min(0, "El costo debe ser mayor o igual a 0"),
}).refine((data) => {
  const inicio = new Date(data.fechaInicio);
  const fin = new Date(data.fechaFin);
  return fin > inicio;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["fechaFin"]
});

interface CreateBookingModalProps {
  onBookingCreated?: () => void
}

export function CreateBookingModal({ onBookingCreated }: CreateBookingModalProps) {
  const [open, setOpen] = useState(false)
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [costoSugerido, setCostoSugerido] = useState<number>(0)
  const [diasEstancia, setDiasEstancia] = useState<number>(0)

  const hoy = new Date(new Date().toISOString())
  const manana = new Date(new Date().setDate(new Date().getDate() + 1))

  // Usar el formulario con tipos de string para las fechas
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroHabitacion: 0,
      fechaInicio: hoy.toISOString(),
      fechaFin: manana.toISOString(),
      costo: 0,
    },
  })

  const watchFechaInicio = form.watch("fechaInicio")
  const watchFechaFin = form.watch("fechaFin")
  const watchNumeroHabitacion = form.watch("numeroHabitacion")

  const fetchHabitaciones = async () => {
    try {
      const data = await getHabitacionesDisponibles(
        new Date(watchFechaInicio), 
        new Date(watchFechaFin)
      )
      setHabitaciones(data)
    } catch (error) {
      toast.error("Error", {
        description: (
          <div className="mt-2">
            <p className="text-sm text-black">No se pudieron cargar las habitaciones.</p>
            {error instanceof Error && (
              <p className="mt-2 text-sm text-red-600">{error.message}</p>
            )}
            <p className="mt-2 text-sm text-red-600">¡Intenta nuevamente!</p>
          </div>
        ),
      })
    }
  }

  // Calcular días de estancia y costo sugerido
  useEffect(() => {
    if (watchFechaInicio && watchFechaFin) {
      const inicio = new Date(watchFechaInicio)
      const fin = new Date(watchFechaFin)
      const diffTime = Math.abs(fin.getTime() - inicio.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDiasEstancia(diffDays)

      if (watchNumeroHabitacion > 0) {
        const habitacionSeleccionada = habitaciones.find(h => h.numero_habitacion === watchNumeroHabitacion)
        if (habitacionSeleccionada) {
          const costo = habitacionSeleccionada.precio_por_noche * diffDays
          setCostoSugerido(costo)
          form.setValue("costo", costo)
        }
      }
    }
  }, [watchFechaInicio, watchFechaFin, watchNumeroHabitacion, habitaciones])

  // Cargar habitaciones disponibles cuando cambien las fechas
  useEffect(() => {
    fetchHabitaciones()
  }, [watchFechaInicio, watchFechaFin])

  // Hacer fetch siempre que la modal se abra
  useEffect(() => {
    fetchHabitaciones()
  }, [open])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Convertir strings de fecha a objetos Date
      const fechaInicio = new Date(values.fechaInicio);
      const fechaFin = new Date(values.fechaFin);
      
      const datosAEnviar = {
        numeroHabitacion: values.numeroHabitacion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        costo: values.costo
      };
      
      const url = await generateLinkFormulario(datosAEnviar)
      await navigator.clipboard.writeText(url)
      
      toast.success("Link generado", {
        description: (
          <div className="mt-2">
            <p className="text-sm text-black">El link del formulario ha sido generado exitosamente.</p>
            <p className="mt-2 text-sm text-emerald-600">¡Link copiado al portapapeles!</p>
          </div>
        ),
        duration: 5000,
      })
      
      setOpen(false)
      form.reset({
        numeroHabitacion: habitaciones[0]?.numero_habitacion || 0,
        fechaInicio: new Date().toISOString(),
        fechaFin: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        costo: 0,
      })
      onBookingCreated?.()
    } catch (error) {
      toast.error("Error", {
        description: (
          <div className="mt-2">
            <p className="text-sm text-black">Hubo un error al generar el link del formulario.</p>
            {error instanceof Error && (
              <p className="mt-2 text-sm text-red-600">{error.message}</p>
            )}
            <p className="mt-2 text-sm text-red-600">¡Intenta nuevamente!</p>
          </div>
        ),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span className="mr-2">Crear reserva</span>
          <Calendar className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Crear nueva reserva</DialogTitle>
          <DialogDescription>
            Complete los datos para generar un link de formulario de reserva.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="numeroHabitacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habitación</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una habitación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-[200px]">
                        {habitaciones.map((habitacion) => (
                          <SelectItem 
                            key={habitacion.numero_habitacion} 
                            value={habitacion.numero_habitacion.toString()}
                            className="cursor-pointer"
                          >
                            {`Habitación ${habitacion.numero_habitacion} - $${habitacion.precio_por_noche}/noche`}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <FormControl>
                      <DateTimePicker 
                        onChange={(date) => field.onChange(date)} 
                        initialDate={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de fin</FormLabel>
                    <FormControl>
                      <DateTimePicker 
                        onChange={(date) => field.onChange(date)} 
                        initialDate={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="costo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo total</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  {diasEstancia > 0 && (
                    <FormDescription className="text-sm text-muted-foreground">
                      Costo sugerido para {diasEstancia} {diasEstancia === 1 ? 'día' : 'días'}: ${costoSugerido}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Generar link</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 