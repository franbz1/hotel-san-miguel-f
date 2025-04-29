import { z } from "zod"
import { TipoDoc } from "@/Types/enums/tiposDocumento"
import { Genero } from "@/Types/enums/generos"
import { MotivosViajes } from "@/Types/enums/motivosViajes"

// Schema de validación para los datos personales
export const personalInfoSchema = z.object({
  tipo_documento: z.nativeEnum(TipoDoc, {
    required_error: "Seleccione el tipo de documento",
  }),
  numero_documento: z.string().min(5, {
    message: "El número de documento debe tener al menos 5 caracteres",
  }),
  primer_apellido: z.string().min(2, {
    message: "El primer apellido es requerido",
  }),
  segundo_apellido: z.string().optional(),
  nombres: z.string().min(2, {
    message: "El nombre es requerido",
  }),
  pais_residencia: z.string().min(2, {
    message: "El país de residencia es requerido",
  }),
  pais_residencia_code: z.string().optional(),
  ciudad_residencia: z.string().min(2, {
    message: "La ciudad de residencia es requerida",
  }),
  ciudad_residencia_code: z.string().optional(),
  pais_procedencia: z.string().min(2, {
    message: "El país de procedencia es requerido",
  }),
  pais_procedencia_code: z.string().optional(),
  ciudad_procedencia: z.string().min(2, {
    message: "La ciudad de procedencia es requerida",
  }),
  ciudad_procedencia_code: z.string().optional(),
  fecha_nacimiento: z.date({
    required_error: "La fecha de nacimiento es requerida",
  })
  .max(new Date(), { message: "La fecha de nacimiento no puede ser futura" }),
  nacionalidad: z.string().min(2, {
    message: "La nacionalidad es requerida",
  }),
  nacionalidad_code: z.string().optional(),
  ocupacion: z.string().min(2, {
    message: "La ocupación es requerida",
  }),
  genero: z.nativeEnum(Genero, {
    required_error: "Seleccione el género",
  }),
  telefono: z.string().optional(),
  country_code: z.string().optional(),
  correo: z.union([
    z.literal(""),
    z.string().email({
      message: "El correo electrónico es inválido",
    }),
  ]),
  motivo_viaje: z.nativeEnum(MotivosViajes, {
    required_error: "Seleccione el motivo del viaje",
  }),
})

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema> 