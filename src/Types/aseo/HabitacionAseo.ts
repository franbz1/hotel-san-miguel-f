import { EstadoHabitacion } from "../enums/estadosHabitacion";
import { TipoHabitacion } from "../enums/tiposHabitacion";
import { TiposAseo } from "./tiposAseoEnum";

// Tipo para la respuesta del endpoint de habitaciones para aseo
export interface HabitacionAseo {
  id: number;
  numero_habitacion: number;
  tipo: TipoHabitacion;
  estado: EstadoHabitacion;
  ultimo_aseo_fecha: Date | null;
  ultimo_aseo_tipo: TiposAseo | null;
  ultima_rotacion_colchones: Date | null;
  proxima_rotacion_colchones: Date | null;
  requerido_aseo_hoy: boolean;
  requerido_desinfeccion_hoy: boolean;
  requerido_rotacion_colchones: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Filtros para el endpoint de habitaciones para aseo
export interface FiltrosAseoHabitacionDto {
  // Filtros específicos de aseo
  requerido_aseo_hoy?: boolean;           // true/false - habitaciones que requieren aseo hoy
  requerido_desinfeccion_hoy?: boolean;   // true/false - habitaciones que requieren desinfección hoy
  requerido_rotacion_colchones?: boolean; // true/false - habitaciones que requieren rotación de colchones
  ultimo_aseo_tipo?: TiposAseo;           // Enum TiposAseo - filtrar por último tipo de aseo
} 