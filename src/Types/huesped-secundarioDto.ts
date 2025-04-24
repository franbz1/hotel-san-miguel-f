import { Genero } from "./enums/generos";
import { TipoDoc } from "./enums/tiposDocumento";

export interface CreateHuespedSecundario {
  tipo_documento: TipoDoc
  numero_documento: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nombres: string;
  pais_residencia: string;
  ciudad_residencia: string;
  ciudad_procedencia: string;
  fecha_nacimiento: Date
  nacionalidad: string;
  ocupacion: string;
  genero: Genero
  telefono?: string;
  correo?: string;
  huespedId: number;
}