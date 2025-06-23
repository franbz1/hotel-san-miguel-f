import { UpdateConfiguracionAseoDto } from "@/Types/aseo/ConfiguracionAseo";
import { z } from "zod";

// Expresión regular para validar formato de hora HH:MM
const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const updateConfiguracionAseoDtoSchema: z.ZodType<UpdateConfiguracionAseoDto> = z.object({
  hora_limite_aseo: z.string().regex(horaRegex, "Debe estar en formato HH:MM (24 horas)").optional(),
  hora_proceso_nocturno_utc: z.string().regex(horaRegex, "Debe estar en formato HH:MM (24 horas)").optional(),
  frecuencia_rotacion_colchones: z.number().int().min(1, "Debe ser al menos 1 día").max(365, "No puede exceder 365 días").optional(),
  dias_aviso_rotacion_colchones: z.number().int().min(1, "Debe ser al menos 1 día").max(30, "No puede exceder 30 días").optional(),
  habilitar_notificaciones: z.boolean().optional(),
  email_notificaciones: z.string().email("Debe ser un email válido").optional(),
  elementos_aseo_default: z.array(
    z.string().min(1, "Cada elemento debe tener al menos 1 caracter").max(100, "Cada elemento no puede exceder 100 caracteres")
  ).max(50, "No puede tener más de 50 elementos").optional(),
  elementos_proteccion_default: z.array(
    z.string().min(1, "Cada elemento debe tener al menos 1 caracter").max(100, "Cada elemento no puede exceder 100 caracteres")
  ).max(50, "No puede tener más de 50 elementos").optional(),
  productos_quimicos_default: z.array(
    z.string().min(1, "Cada producto debe tener al menos 1 caracter").max(100, "Cada producto no puede exceder 100 caracteres")
  ).max(50, "No puede tener más de 50 productos").optional(),
  areas_intervenir_habitacion_default: z.array(
    z.string().min(1, "Cada área debe tener al menos 1 caracter").max(100, "Cada área no puede exceder 100 caracteres")
  ).max(50, "No puede tener más de 50 áreas").optional(),
  areas_intervenir_banio_default: z.array(
    z.string().min(1, "Cada área debe tener al menos 1 caracter").max(100, "Cada área no puede exceder 100 caracteres")
  ).max(50, "No puede tener más de 50 áreas").optional(),
  procedimiento_aseo_habitacion_default: z.string().max(1000, "No puede exceder 1000 caracteres").optional(),
  procedimiento_desinfeccion_habitacion_default: z.string().max(1000, "No puede exceder 1000 caracteres").optional(),
  procedimiento_rotacion_colchones_default: z.string().max(1000, "No puede exceder 1000 caracteres").optional(),
  procedimiento_limieza_zona_comun_default: z.string().max(1000, "No puede exceder 1000 caracteres").optional(),
  procedimiento_desinfeccion_zona_comun_default: z.string().max(1000, "No puede exceder 1000 caracteres").optional(),
}); 