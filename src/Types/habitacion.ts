import { EstadoHabitacion } from "./enums/estadosHabitacion";
import { TipoHabitacion } from "./enums/tiposHabitacion";

export interface Habitacion {
  id: number;

  numero_habitacion: number;

  tipo: TipoHabitacion;

  estado: EstadoHabitacion;

  precio_por_noche: number;

  created_at: string;

  updated_at: string;

  deleted_at: boolean;
}
