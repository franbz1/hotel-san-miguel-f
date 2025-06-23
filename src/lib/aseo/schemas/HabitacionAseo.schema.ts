import { FiltrosAseoHabitacionDto } from "@/Types/aseo/HabitacionAseo";
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum";
import { z } from "zod";

export const filtrosAseoHabitacionDtoSchema: z.ZodType<FiltrosAseoHabitacionDto> = z.object({
  requerido_aseo_hoy: z.boolean().optional(),
  requerido_desinfeccion_hoy: z.boolean().optional(),
  requerido_rotacion_colchones: z.boolean().optional(),
  ultimo_aseo_tipo: z.nativeEnum(TiposAseo).optional(),
}); 