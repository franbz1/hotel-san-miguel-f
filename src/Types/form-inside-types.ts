import { Genero } from "./enums/generos";
import { MotivosViajes } from "./enums/motivosViajes";
import { TipoDoc } from "./enums/tiposDocumento";
import { TipoDocumentoHuespedSecundario } from "./enums/tipoDocumentoHuespedSecundario";

// Tipo base para formularios que incluyen campos de ubicación
export interface LocationFormFields {
  // Campos de país
  pais_residencia: string;
  pais_residencia_code?: string; // Opcional para compatibilidad
  ciudad_residencia: string;
  ciudad_residencia_code?: string; // Opcional para compatibilidad
  
  // Campos de nacionalidad
  nacionalidad: string;
  nacionalidad_code?: string; // Opcional para compatibilidad
  
  // Campos de procedencia
  pais_procedencia: string;
  pais_procedencia_code?: string; // Opcional para compatibilidad
  ciudad_procedencia: string;
  ciudad_procedencia_code?: string; // Opcional para compatibilidad
}

// Tipo para campos personales
export interface PersonalInfoFormFields extends LocationFormFields {
  tipo_documento: TipoDoc;
  numero_documento: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nombres: string;
  fecha_nacimiento: Date;
  ocupacion: string;
  genero: Genero;
  telefono?: string;
  country_code?: string;
  correo?: string;
  motivo_viaje: MotivosViajes;
}

// Tipo para campos de huéspedes secundarios
export interface CompanionFormFields extends LocationFormFields {
  tipo_documento: TipoDocumentoHuespedSecundario;
  numero_documento: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nombres: string;
  fecha_nacimiento: Date;
  ocupacion: string;
  genero: Genero;
  telefono?: string;
  correo?: string;
} 