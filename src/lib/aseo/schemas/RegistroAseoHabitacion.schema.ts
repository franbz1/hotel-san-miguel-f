import { CreateRegistroAseoHabitacionDto, UpdateRegistroAseoHabitacionDto, FiltrosRegistroAseoHabitacionDto } from "@/Types/aseo/RegistroAseoHabitacion";
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum";
import { z } from "zod";

export const createRegistroAseoHabitacionDtoSchema: z.ZodType<CreateRegistroAseoHabitacionDto> = z.object({
  usuarioId: z.number().int().positive("El ID del usuario debe ser un número positivo"),
  habitacionId: z.number().int().positive("El ID de la habitación debe ser un número positivo"),
  fecha_registro: z.string().datetime("Debe ser una fecha válida en formato ISO"),
  areas_intervenidas: z.array(
    z.string().min(2, "Cada área debe tener al menos 2 caracteres").max(100, "Cada área no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un área intervenida"),
  areas_intervenidas_banio: z.array(
    z.string().min(2, "Cada área del baño debe tener al menos 2 caracteres").max(100, "Cada área del baño no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un área del baño intervenida"),
  procedimiento_rotacion_colchones: z.string().min(10, "El procedimiento debe tener al menos 10 caracteres").max(500, "El procedimiento no puede exceder 500 caracteres").optional(),
  tipos_realizados: z.array(z.nativeEnum(TiposAseo)).min(1, "Debe seleccionar al menos un tipo de aseo"),
  objetos_perdidos: z.boolean().default(false),
  rastros_de_animales: z.boolean().default(false),
  observaciones: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true; // Permitir vacío
    return val.length >= 5; // Si no está vacío, debe tener al menos 5 caracteres
  }, "Las observaciones deben tener al menos 5 caracteres si se especifican").refine((val) => {
    if (!val) return true;
    return val.length <= 1000;
  }, "Las observaciones no pueden exceder 1000 caracteres"),
});

export const updateRegistroAseoHabitacionDtoSchema: z.ZodType<UpdateRegistroAseoHabitacionDto> = z.object({
  usuarioId: z.number().int().positive("El ID del usuario debe ser un número positivo").optional(),
  habitacionId: z.number().int().positive("El ID de la habitación debe ser un número positivo").optional(),
  fecha_registro: z.string().datetime("Debe ser una fecha válida en formato ISO").optional(),
  areas_intervenidas: z.array(
    z.string().min(2, "Cada área debe tener al menos 2 caracteres").max(100, "Cada área no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un área intervenida").optional(),
  areas_intervenidas_banio: z.array(
    z.string().min(2, "Cada área del baño debe tener al menos 2 caracteres").max(100, "Cada área del baño no puede exceder 100 caracteres")
  ).min(1, "Debe especificar al menos un área del baño intervenida").optional(),
  procedimiento_rotacion_colchones: z.string().min(10, "El procedimiento debe tener al menos 10 caracteres").max(500, "El procedimiento no puede exceder 500 caracteres").optional(),
  tipos_realizados: z.array(z.nativeEnum(TiposAseo)).min(1, "Debe seleccionar al menos un tipo de aseo").optional(),
  objetos_perdidos: z.boolean().optional(),
  rastros_de_animales: z.boolean().optional(),
  observaciones: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true; // Permitir vacío
    return val.length >= 5; // Si no está vacío, debe tener al menos 5 caracteres
  }, "Las observaciones deben tener al menos 5 caracteres si se especifican").refine((val) => {
    if (!val) return true;
    return val.length <= 1000;
  }, "Las observaciones no pueden exceder 1000 caracteres"),
});

export const filtrosRegistroAseoHabitacionDtoSchema: z.ZodType<FiltrosRegistroAseoHabitacionDto> = z.object({
  usuarioId: z.number().int().positive("El ID del usuario debe ser un número positivo").optional(),
  habitacionId: z.number().int().positive("El ID de la habitación debe ser un número positivo").optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD").optional(),
  tipo_aseo: z.nativeEnum(TiposAseo).optional(),
  objetos_perdidos: z.boolean().optional(),
  rastros_de_animales: z.boolean().optional(),
});