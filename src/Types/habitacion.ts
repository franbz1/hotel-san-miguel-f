import { EstadoHabitacion } from "./enums/estadosHabitacion";
import { TipoHabitacion } from "./enums/tiposHabitacion";
import { Reserva } from "./Reserva";

export interface Habitacion {
  id: number;

  numero_habitacion: number;

  tipo: TipoHabitacion;

  estado: EstadoHabitacion;

  precio_por_noche: number;

  created_at: string;

  updated_at: string;

  reservas?: Reserva[];
}

export interface CreateHabitacionDto {
  numero_habitacion: number;
  tipo: TipoHabitacion;
  estado: EstadoHabitacion;
  precio_por_noche: number;
}

export interface UpdateHabitacionDto {
  numero_habitacion?: number;
  tipo?: TipoHabitacion;
  estado?: EstadoHabitacion;
  precio_por_noche?: number;
}

