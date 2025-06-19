import { CreateReporteAseoDiarioDto, UpdateReporteAseoDiarioDto, FiltrosReportesAseoDto } from "@/Types/aseo/ReporteAseoDiario";
import { z } from "zod";

// Esquemas para objetos anidados
const resumenReporteSchema = z.object({
  total_habitaciones_aseadas: z.number().int().min(0, "Debe ser un número no negativo"),
  total_zonas_comunes_aseadas: z.number().int().min(0, "Debe ser un número no negativo"),
  objetos_perdidos_encontrados: z.number().int().min(0, "Debe ser un número no negativo"),
  rastros_animales_encontrados: z.number().int().min(0, "Debe ser un número no negativo"),
});

const datosReporteSchema = z.object({
  habitaciones: z.array(z.any()), // Usando z.any() ya que RegistroAseoHabitacion es un objeto complejo
  zonas_comunes: z.array(z.any()), // Usando z.any() ya que RegistroAseoZonaComun es un objeto complejo
  resumen: resumenReporteSchema,
});

export const createReporteAseoDiarioDtoSchema: z.ZodType<CreateReporteAseoDiarioDto> = z.object({
  fecha: z.string().datetime("Debe ser una fecha válida en formato ISO"),
  elementos_aseo: z.array(
    z.string().min(2, "Cada elemento debe tener al menos 2 caracteres").max(100, "Cada elemento no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un elemento de aseo"),
  elementos_proteccion: z.array(
    z.string().min(2, "Cada elemento debe tener al menos 2 caracteres").max(100, "Cada elemento no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un elemento de protección"),
  productos_quimicos: z.array(
    z.string().min(2, "Cada producto debe tener al menos 2 caracteres").max(100, "Cada producto no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un producto químico"),
  procedimiento_aseo_habitacion: z.string().min(10, "Debe tener al menos 10 caracteres").max(1000, "No puede exceder 1000 caracteres"),
  procedimiento_desinfeccion_habitacion: z.string().min(10, "Debe tener al menos 10 caracteres").max(1000, "No puede exceder 1000 caracteres"),
  procedimiento_limpieza_zona_comun: z.string().min(10, "Debe tener al menos 10 caracteres").max(1000, "No puede exceder 1000 caracteres"),
  procedimiento_desinfeccion_zona_comun: z.string().min(10, "Debe tener al menos 10 caracteres").max(1000, "No puede exceder 1000 caracteres"),
  datos: datosReporteSchema,
});

export const updateReporteAseoDiarioDtoSchema: z.ZodType<UpdateReporteAseoDiarioDto> = z.object({
  fecha: z.string().datetime("Debe ser una fecha válida en formato ISO").optional(),
  elementos_aseo: z.array(
    z.string().min(2, "Cada elemento debe tener al menos 2 caracteres").max(100, "Cada elemento no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un elemento de aseo").optional(),
  elementos_proteccion: z.array(
    z.string().min(2, "Cada elemento debe tener al menos 2 caracteres").max(100, "Cada elemento no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un elemento de protección").optional(),
  productos_quimicos: z.array(
    z.string().min(2, "Cada producto debe tener al menos 2 caracteres").max(100, "Cada producto no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un producto químico").optional(),
  procedimiento_aseo_habitacion: z.string().min(10, "Debe tener al menos 10 caracteres").max(1000, "No puede exceder 1000 caracteres").optional(),
  procedimiento_desinfeccion_habitacion: z.string().min(10, "Debe tener al menos 10 caracteres").max(1000, "No puede exceder 1000 caracteres").optional(),
  procedimiento_limpieza_zona_comun: z.string().min(10, "Debe tener al menos 10 caracteres").max(1000, "No puede exceder 1000 caracteres").optional(),
  procedimiento_desinfeccion_zona_comun: z.string().min(10, "Debe tener al menos 10 caracteres").max(1000, "No puede exceder 1000 caracteres").optional(),
  datos: datosReporteSchema.optional(),
});

export const filtrosReportesAseoDtoSchema: z.ZodType<FiltrosReportesAseoDto> = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD").optional(),
  fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de inicio debe estar en formato YYYY-MM-DD").optional(),
  fecha_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de fin debe estar en formato YYYY-MM-DD").optional(),
  elemento_aseo: z.string().min(2, "Debe tener al menos 2 caracteres").max(100, "No puede exceder 100 caracteres").optional(),
  producto_quimico: z.string().min(2, "Debe tener al menos 2 caracteres").max(100, "No puede exceder 100 caracteres").optional(),
  elemento_proteccion: z.string().min(2, "Debe tener al menos 2 caracteres").max(100, "No puede exceder 100 caracteres").optional(),
}).refine(
  (data) => {
    // Validar que si se especifica rango de fechas, ambas estén presentes
    const tieneInicio = !!data.fecha_inicio;
    const tieneFin = !!data.fecha_fin;
    if (tieneInicio && !tieneFin) return false;
    if (!tieneInicio && tieneFin) return false;
    
    // Validar que la fecha de inicio sea menor o igual a la fecha de fin
    if (tieneInicio && tieneFin) {
      return new Date(data.fecha_inicio!) <= new Date(data.fecha_fin!);
    }
    
    return true;
  },
  {
    message: "Si especifica un rango de fechas, debe proporcionar tanto fecha_inicio como fecha_fin, y fecha_inicio debe ser menor o igual a fecha_fin",
  }
); 