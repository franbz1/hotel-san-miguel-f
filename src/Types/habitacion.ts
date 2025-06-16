import { EstadoHabitacion } from "./enums/estadosHabitacion";
import { TipoHabitacion } from "./enums/tiposHabitacion";
import { Reserva } from "./Reserva";
import { TiposAseo } from "./aseo/tiposAseoEnum";
import { RegistroAseoHabitacion } from "./aseo/RegistroAseoHabitacion";

export interface Habitacion {
  id: number;

  numero_habitacion: number;

  tipo: TipoHabitacion;

  estado: EstadoHabitacion;

  precio_por_noche: number;

  created_at: string;

  updated_at: string;

  reservas?: Reserva[];

  ultimo_aseo_fecha?: Date;

  ultimo_aseo_tipo?: TiposAseo;

  ultima_rotacion_colchones?: Date;
  proxima_rotacion_colchones?: Date;
  requerido_rotacion_colchones?: boolean;

  registros_aseo_habitacion?: RegistroAseoHabitacion[];
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

