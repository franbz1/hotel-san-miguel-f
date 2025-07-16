import { CreateRegistroFormulario } from "@/Types/registro-formularioDto";
import { z } from "zod";
import { MotivosViajes } from "@/Types/enums/motivosViajes";
import { TipoDoc } from "@/Types/enums/tiposDocumento";
import { Genero } from "@/Types/enums/generos";
import { TipoDocumentoHuespedSecundario } from "@/Types/enums/tipoDocumentoHuespedSecundario";

// Schema para huésped secundario (sin huespedId)
export const huespedSecundarioSchema = z.object({
  tipo_documento: z.nativeEnum(TipoDocumentoHuespedSecundario, {
    required_error: "El tipo de documento es obligatorio",
    invalid_type_error: "Debe ser uno de los tipos de documento válidos"
  }),
  numero_documento: z.string()
    .min(6, "El numero de documento es obligatorio y debe tener al menos 6 caracteres")
    .max(20, "El numero de documento no puede tener más de 20 caracteres"),
  primer_apellido: z.string()
    .min(2, "El primer apellido es obligatorio y debe tener al menos 2 caracteres")
    .max(50, "El primer apellido no puede tener más de 50 caracteres"),
  segundo_apellido: z.string()
    .min(2, "El segundo apellido es opcional y debe tener al menos 2 caracteres")
    .max(50, "El segundo apellido no puede tener más de 50 caracteres")
    .optional(),
  nombres: z.string()
    .min(2, "Los nombres son obligatorios y deben tener al menos 2 caracteres")
    .max(100, "Los nombres no pueden tener más de 100 caracteres"),
  pais_residencia: z.string()
    .min(2, "El pais de residencia es obligatorio y debe tener al menos 2 caracteres")
    .max(50, "El pais de residencia no puede tener más de 50 caracteres"),
  ciudad_residencia: z.string()
    .min(2, "La ciudad de residencia es obligatorio y debe tener al menos 2 caracteres")
    .max(50, "La ciudad de residencia no puede tener más de 50 caracteres"),
  pais_procedencia: z.string()
    .min(2, "El pais de procedencia es obligatorio y debe tener al menos 2 caracteres")
    .max(50, "El pais de procedencia no puede tener más de 50 caracteres"),
  ciudad_procedencia: z.string()
    .min(2, "La ciudad de procedencia es obligatorio y debe tener al menos 2 caracteres")
    .max(50, "La ciudad de procedencia no puede tener más de 50 caracteres"),
  pais_destino: z.string()
    .min(2, "El país de destino es obligatorio y debe tener al menos 2 caracteres")
    .max(50, "El país de destino no puede tener más de 50 caracteres"),
  ciudad_destino: z.string()
    .min(2, "La ciudad de destino es obligatoria y debe tener al menos 2 caracteres")
    .max(50, "La ciudad de destino no puede tener más de 50 caracteres"),
  fecha_nacimiento: z.date({
    required_error: "La fecha de nacimiento es obligatoria y debe ser una fecha",
    invalid_type_error: "La fecha de nacimiento debe ser una fecha válida"
  }),
  nacionalidad: z.string()
    .min(2, "La nacionalidad es obligatoria y debe tener al menos 2 caracteres")
    .max(50, "La nacionalidad no puede tener más de 50 caracteres"),
  ocupacion: z.string()
    .min(2, "La ocupacion es obligatoria y debe tener al menos 2 caracteres")
    .max(50, "La ocupacion no puede tener más de 50 caracteres"),
  genero: z.nativeEnum(Genero, {
    required_error: "El genero es obligatorio y debe ser uno de los siguientes: MASCULINO, FEMENINO, OTRO",
    invalid_type_error: "El genero debe ser uno de los siguientes: MASCULINO, FEMENINO, OTRO"
  }),
  telefono: z.string()
    .optional(),
  correo: z.string()
    .email("El correo es opcional y debe ser un correo válido")
    .optional()
    .or(z.literal(""))
});

// ==========================================
// SCHEMA COMPLETO PARA VALIDACIÓN FINAL
// ==========================================

export const createRegistroFormularioDtoSchema: z.ZodType<CreateRegistroFormulario> = z.object({
  // Datos de la reserva (del link + motivo del usuario)
  fecha_inicio: z.date({
    required_error: "La fecha de inicio es obligatoria",
    invalid_type_error: "Debe ser una fecha válida"
  }),
  fecha_fin: z.date({
    required_error: "La fecha de fin es obligatoria", 
    invalid_type_error: "Debe ser una fecha válida"
  }),
  pais_destino: z.string()
    .min(2, "El país de destino es obligatorio y debe ser un texto")
    .max(50, "El país de destino no puede tener más de 50 caracteres"),
  ciudad_destino: z.string()
    .min(2, "La ciudad de destino es obligatoria y debe ser un texto")
    .max(50, "La ciudad de destino no puede tener más de 50 caracteres"),
  motivo_viaje: z.nativeEnum(MotivosViajes, {
    required_error: "El motivo de viaje es obligatorio",
    invalid_type_error: "Debe ser uno de los motivos de viaje válidos"
  }),
  costo: z.number({
    required_error: "El costo es obligatorio",
    invalid_type_error: "El costo debe ser un número"
  })
    .positive("El costo debe ser un número positivo")
    .multipleOf(0.01, "El costo puede tener máximo 2 decimales"),
  numero_habitacion: z.number({
    required_error: "El número de habitación es obligatorio",
    invalid_type_error: "El número de habitación debe ser un número"
  })
    .positive("El número de habitación debe ser un número positivo"),
  numero_acompaniantes: z.number({
    required_error: "El número de acompañantes es obligatorio",
    invalid_type_error: "El número de acompañantes debe ser un número entero"
  })
    .int("El número de acompañantes debe ser un número entero")
    .min(0, "El número de acompañantes debe ser mínimo 0"),

  // Datos del huésped principal
  tipo_documento: z.nativeEnum(TipoDoc, {
    required_error: "El tipo de documento es obligatorio",
    invalid_type_error: "Debe ser uno de los tipos de documento válidos"
  }),
  numero_documento: z.string()
    .min(6, "El número de documento debe tener al menos 6 caracteres")
    .max(20, "El número de documento no puede tener más de 20 caracteres"),
  primer_apellido: z.string()
    .min(2, "El primer apellido debe tener al menos 2 caracteres")
    .max(50, "El primer apellido no puede tener más de 50 caracteres"),
  segundo_apellido: z.string()
    .min(2, "El segundo apellido debe tener al menos 2 caracteres")
    .max(50, "El segundo apellido no puede tener más de 50 caracteres")
    .optional(),
  nombres: z.string()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(50, "Los nombres no pueden tener más de 50 caracteres"),
  pais_residencia: z.string()
    .min(2, "El país de residencia debe tener al menos 2 caracteres")
    .max(50, "El país de residencia no puede tener más de 50 caracteres"),
  ciudad_residencia: z.string()
    .min(2, "La ciudad de residencia debe tener al menos 2 caracteres")
    .max(50, "La ciudad de residencia no puede tener más de 50 caracteres"),
  pais_procedencia: z.string()
    .min(2, "El país de procedencia es obligatorio y debe ser un texto")
    .max(50, "El país de procedencia no puede tener más de 50 caracteres"),
  ciudad_procedencia: z.string()
    .min(2, "La ciudad de destino es obligatoria y debe ser un texto")
    .max(50, "La ciudad de destino no puede tener más de 50 caracteres"),
  fecha_nacimiento: z.date({
    required_error: "La fecha de nacimiento es obligatoria",
    invalid_type_error: "Debe ser una fecha válida"
  }),
  nacionalidad: z.string()
    .min(2, "La nacionalidad debe tener al menos 2 caracteres")
    .max(50, "La nacionalidad no puede tener más de 50 caracteres"),
  ocupacion: z.string()
    .min(2, "La ocupación debe tener al menos 2 caracteres")
    .max(50, "La ocupación no puede tener más de 50 caracteres"),
  genero: z.nativeEnum(Genero, {
    required_error: "El género es obligatorio",
    invalid_type_error: "Debe ser uno de los géneros válidos: MASCULINO, FEMENINO, OTRO"
  }),
  telefono: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Debe ser un número de teléfono válido (formato internacional)")
    .optional()
    .or(z.literal("")),
  correo: z.string()
    .email("Debe ser un email válido")
    .optional()
    .or(z.literal("")),

  // Huéspedes secundarios (opcional)
  huespedes_secundarios: z.array(huespedSecundarioSchema).optional()
})
.refine((data) => {
  // Validación cruzada: número de acompañantes debe coincidir con la cantidad de huéspedes secundarios
  const numeroAcompaniantes = data.numero_acompaniantes || 0;
  const cantidadHuespedes = data.huespedes_secundarios?.length || 0;
  return numeroAcompaniantes === cantidadHuespedes;
}, {
  message: "El número de acompañantes debe coincidir con la cantidad de huéspedes secundarios registrados",
  path: ["numero_acompaniantes"]
});

// ==========================================
// TIPOS DERIVADOS DE LOS SCHEMAS
// ==========================================

export type RegistroFormularioDto = z.infer<typeof createRegistroFormularioDtoSchema>;
export type HuespedSecundarioDto = z.infer<typeof huespedSecundarioSchema>;