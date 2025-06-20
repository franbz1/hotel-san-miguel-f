import { CreateZonaComunDto, UpdateZonaComunDto, FiltrosZonaComunDto } from "@/Types/zonasComunes";
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum";
import { z } from "zod";

export const createZonaComunDtoSchema: z.ZodType<CreateZonaComunDto> = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  
  piso: z.number()
    .int("El piso debe ser un número entero")
    .min(0, "El piso debe ser 0 o mayor")
    .max(50, "El piso no puede ser mayor a 50"),
  
  requerido_aseo_hoy: z.boolean()
    .default(false)
    .optional(),
  
  ultimo_aseo_fecha: z.string()
    .datetime("Debe ser una fecha válida en formato ISO")
    .optional(),
  
  ultimo_aseo_tipo: z.nativeEnum(TiposAseo)
    .optional(),
});

export const updateZonaComunDtoSchema: z.ZodType<UpdateZonaComunDto> = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios")
    .optional(),
  
  piso: z.number()
    .int("El piso debe ser un número entero")
    .min(0, "El piso debe ser 0 o mayor")
    .max(50, "El piso no puede ser mayor a 50")
    .optional(),
  
  requerido_aseo_hoy: z.boolean()
    .optional(),
  
  ultimo_aseo_fecha: z.string()
    .datetime("Debe ser una fecha válida en formato ISO")
    .optional(),
  
  ultimo_aseo_tipo: z.nativeEnum(TiposAseo)
    .optional(),
});

export const filtrosZonaComunDtoSchema: z.ZodType<FiltrosZonaComunDto> = z.object({
  piso: z.number()
    .int("El piso debe ser un número entero")
    .min(0, "El piso debe ser 0 o mayor")
    .max(50, "El piso no puede ser mayor a 50")
    .optional(),
  
  requerido_aseo_hoy: z.boolean()
    .optional(),
  
  ultimo_aseo_tipo: z.nativeEnum(TiposAseo)
    .optional(),
});

// Schema combinado para validación completa de zona común
export const zonaComunSchema = z.object({
  id: z.number().int().positive("El ID debe ser un número positivo"),
  nombre: z.string().min(2).max(100),
  piso: z.number().int().min(0).max(50),
  requerido_aseo_hoy: z.boolean(),
  ultimo_aseo_fecha: z.date(),
  ultimo_aseo_tipo: z.nativeEnum(TiposAseo),
  requerido_desinfeccion_hoy: z.boolean(),
  proxima_desinfeccion_zona_comun: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Tipos derivados de los schemas para consistencia de tipos
export type CreateZonaComunValidation = z.infer<typeof createZonaComunDtoSchema>;
export type UpdateZonaComunValidation = z.infer<typeof updateZonaComunDtoSchema>;
export type FiltrosZonaComunValidation = z.infer<typeof filtrosZonaComunDtoSchema>;
export type ZonaComunValidation = z.infer<typeof zonaComunSchema>; 