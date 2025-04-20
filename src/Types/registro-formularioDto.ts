import { Genero } from './enums/generos';
import { TipoDoc } from './enums/tiposDocumento';
import { MotivosViajes } from './enums/motivosViajes';
import { CreateHuespedSecundarioWithoutIdDto } from './huesped-secundario-sin-id-Dto';

export interface CreateRegistroFormulario {
  // Datos de la reserva
  fecha_inicio: Date;
  fecha_fin: Date;
  motivo_viaje: MotivosViajes;
  costo: number;
  numero_habitacion: number;
  numero_acompaniantes: number;

  // Datos del huésped
  tipo_documento: TipoDoc;
  numero_documento: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nombres: string;
  pais_residencia: string;
  departamento_residencia: string;
  ciudad_residencia: string;
  ciudad_procedencia: string;
  fecha_nacimiento: Date;
  nacionalidad: string;
  ocupacion: string;
  genero: Genero;
  telefono?: string;
  correo?: string;

  // Huespedes secundarios
  huespedes_secundarios?: CreateHuespedSecundarioWithoutIdDto[];
}
