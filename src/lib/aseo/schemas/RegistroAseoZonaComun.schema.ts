import { CreateRegistroAseoZonaComunDto, UpdateRegistroAseoZonaComunDto, FiltrosRegistroAseoZonaComunDto } from "@/Types/aseo/RegistroAseoZonaComun";
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum";
import { z } from "zod";

export const createRegistroAseoZonaComunDtoSchema: z.ZodType<CreateRegistroAseoZonaComunDto> = z.object({
  usuarioId: z.number().int().positive("El ID del usuario debe ser un número positivo"),
  zonaComunId: z.number().int().positive("El ID de la zona común debe ser un número positivo"),
  fecha_registro: z.string().datetime("Debe ser una fecha válida en formato ISO"),
  tipos_realizados: z.array(z.nativeEnum(TiposAseo)).min(1, "Debe seleccionar al menos un tipo de aseo"),
  objetos_perdidos: z.boolean().default(false),
  rastros_de_animales: z.boolean().default(false),
  observaciones: z.string().min(5, "Las observaciones deben tener al menos 5 caracteres").max(1000, "Las observaciones no pueden exceder 1000 caracteres").optional(),
});

export const updateRegistroAseoZonaComunDtoSchema: z.ZodType<UpdateRegistroAseoZonaComunDto> = z.object({
  usuarioId: z.number().int().positive("El ID del usuario debe ser un número positivo").optional(),
  zonaComunId: z.number().int().positive("El ID de la zona común debe ser un número positivo").optional(),
  fecha_registro: z.string().datetime("Debe ser una fecha válida en formato ISO").optional(),
  tipos_realizados: z.array(z.nativeEnum(TiposAseo)).min(1, "Debe seleccionar al menos un tipo de aseo").optional(),
  objetos_perdidos: z.boolean().optional(),
  rastros_de_animales: z.boolean().optional(),
  observaciones: z.string().min(5, "Las observaciones deben tener al menos 5 caracteres").max(1000, "Las observaciones no pueden exceder 1000 caracteres").optional(),
});

export const filtrosRegistroAseoZonaComunDtoSchema: z.ZodType<FiltrosRegistroAseoZonaComunDto> = z.object({
  usuarioId: z.number().int().positive("El ID del usuario debe ser un número positivo").optional(),
  zonaComunId: z.number().int().positive("El ID de la zona común debe ser un número positivo").optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD").optional(),
  tipo_aseo: z.nativeEnum(TiposAseo).optional(),
  objetos_perdidos: z.boolean().optional(),
  rastros_de_animales: z.boolean().optional(),
}); 