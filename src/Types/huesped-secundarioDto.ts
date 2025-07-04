import { Genero } from "./enums/generos";
import { TipoDocumentoHuespedSecundario } from "./enums/tipoDocumentoHuespedSecundario";

export interface CreateHuespedSecundario {
  tipo_documento: TipoDocumentoHuespedSecundario
  numero_documento: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nombres: string;
  pais_residencia: string;
  ciudad_residencia: string;
  pais_procedencia: string;
  ciudad_procedencia: string;
  pais_destino: string;
  ciudad_destino: string;
  fecha_nacimiento: Date
  nacionalidad: string;
  ocupacion: string;
  genero: Genero
  telefono?: string;
  correo?: string;
  huespedId: number;
}