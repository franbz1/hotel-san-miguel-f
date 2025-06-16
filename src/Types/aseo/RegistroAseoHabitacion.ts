import { Habitacion } from "../habitacion";
import { Usuario } from "../usuario";
import { TiposAseo } from "./tiposAseoEnum";

export interface RegistroAseoHabitacion {
  id: number;
  usuarioId: number;
  habitacionId: number;
  fecha_registro: Date;

  areas_intervenidas: string[];
  areas_intervenidas_banio: string[];
  procedimiento_rotacion_colchones?: string;

  usuario: Usuario;
  habitacion: Habitacion;

  tipos_realizados: TiposAseo[];

  objetos_perdidos: boolean;
  rastros_de_animales: boolean;
  observaciones?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRegistroAseoHabitacionDto {
  usuarioId: number; // Obligatorio, > 0
  habitacionId: number; // Obligatorio, > 0
  fecha_registro: string; // ISO date string, obligatorio
  areas_intervenidas: string[]; // Mín 1 elemento, 2-100 chars c/u
  areas_intervenidas_banio: string[]; // Mín 1 elemento, 2-100 chars c/u
  procedimiento_rotacion_colchones?: string; // 10-500 chars, opcional
  tipos_realizados: TiposAseo[]; // Mín 1 elemento, obligatorio
  objetos_perdidos?: boolean; // Opcional, default: false
  rastros_de_animales?: boolean; // Opcional, default: false
  observaciones?: string; // 5-1000 chars, opcional
}

export interface UpdateRegistroAseoHabitacionDto {
  usuarioId?: number; // > 0, opcional
  habitacionId?: number; // > 0, opcional
  fecha_registro?: string; // ISO date string, opcional
  areas_intervenidas?: string[]; // Mín 1 elemento, 2-100 chars c/u, opcional
  areas_intervenidas_banio?: string[]; // Mín 1 elemento, 2-100 chars c/u, opcional
  procedimiento_rotacion_colchones?: string; // 10-500 chars, opcional
  tipos_realizados?: TiposAseo[]; // Mín 1 elemento, opcional
  objetos_perdidos?: boolean; // Opcional
  rastros_de_animales?: boolean; // Opcional
  observaciones?: string; // 5-1000 chars, opcional
}

export interface FiltrosRegistroAseoHabitacionDto {
  usuarioId?: number; // ID del usuario
  habitacionId?: number; // ID de la habitación
  fecha?: string; // "YYYY-MM-DD"
  tipo_aseo?: TiposAseo; // Enum TiposAseo
  objetos_perdidos?: boolean; // true/false
  rastros_de_animales?: boolean; // true/false
}