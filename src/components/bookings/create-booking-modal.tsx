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

// Función para obtener la fecha en formato local sin hora
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Función para convertir un string de fecha en un objeto Date preservando la zona horaria local
function parseDateString(dateString: string): Date {
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
}

// Definir schema con manejo específico para fechas
const formSchema = z.object({
  numeroHabitacion: z.coerce.number().min(1, "Debe seleccionar una habitación"),
  fechaInicio: z.string().min(1, "La fecha de inicio es requerida"),
  fechaFin: z.string().min(1, "La fecha de fin es requerida"),
  costo: z.coerce.number().min(0, "El costo debe ser mayor o igual a 0"),
}).refine((data) => {
  const inicio = parseDateString(data.fechaInicio);
  const fin = parseDateString(data.fechaFin);
  return fin > inicio;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["fechaFin"],
});

// Función para calcular días entre fechas usando strings de fecha
function calcularDiasEntreFechas(fechaInicioStr: string, fechaFinStr: string): number {
  const inicio = parseDateString(fechaInicioStr);
  const fin = parseDateString(fechaFinStr);
  
  inicio.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);
  
  const diffTime = fin.getTime() - inicio.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

interface CreateBookingModalProps {
  onBookingCreated?: () => void
}

export function CreateBookingModal({ onBookingCreated }: CreateBookingModalProps) {
  const [open, setOpen] = useState(false)
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [costoSugerido, setCostoSugerido] = useState<number>(0)
  const [diasEstancia, setDiasEstancia] = useState<number>(0)

  const hoy = getLocalDateString(new Date());
  const manana = getLocalDateString(new Date(new Date().setDate(new Date().getDate() + 1)));

  // Usar el formulario con tipos de string para las fechas
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroHabitacion: 0,
      fechaInicio: hoy,
      fechaFin: manana,
      costo: 0,
    },
  })

  const watchFechaInicio = form.watch("fechaInicio")
  const watchFechaFin = form.watch("fechaFin")
  const watchNumeroHabitacion = form.watch("numeroHabitacion")

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const data = await getHabitacionesDisponibles(parseDateString(watchFechaInicio), parseDateString(watchFechaFin))
        setHabitaciones(data)
      } catch {
        toast.error("Error", {
          description: "No se pudieron cargar las habitaciones.",
        })
      }
    }
    fetchHabitaciones()
  }, [watchFechaFin, watchFechaInicio])
  // Calcular días de estancia y costo sugerido cuando cambien las fechas o la habitación
  useEffect(() => {
    if (watchFechaInicio && watchFechaFin && watchNumeroHabitacion) {
      const dias = calcularDiasEntreFechas(watchFechaInicio, watchFechaFin);
      setDiasEstancia(dias > 0 ? dias : 0);

      const habitacionSeleccionada = habitaciones.find(h => h.numero_habitacion === watchNumeroHabitacion)
      if (habitacionSeleccionada && dias > 0) {
        const costoTotal = habitacionSeleccionada.precio_por_noche * dias
        setCostoSugerido(costoTotal)
        form.setValue("costo", costoTotal)
      }
    }
  }, [watchFechaInicio, watchFechaFin, watchNumeroHabitacion, habitaciones, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Convertir strings de fecha a objetos Date
      const fechaInicio = parseDateString(values.fechaInicio);
      const fechaFin = parseDateString(values.fechaFin);
      
      
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
            <p>El link del formulario ha sido generado exitosamente.</p>
            <p className="mt-2 text-sm text-muted-foreground break-all">{url}</p>
            <p className="mt-2 text-sm text-emerald-600">¡Link copiado al portapapeles!</p>
          </div>
        ),
        duration: 5000,
      })
      
      setOpen(false)
      form.reset({
        numeroHabitacion: habitaciones[0].numero_habitacion,
        fechaInicio: getLocalDateString(new Date()),
        fechaFin: getLocalDateString(new Date(new Date().setDate(new Date().getDate() + 1))),
        costo: 0,
      })
      onBookingCreated?.()
    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "Hubo un error al generar el link del formulario.",
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
      <DialogContent className="sm:max-w-[425px]">
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
                      <Input type="date" {...field} />
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
                      <Input type="date" {...field} />
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