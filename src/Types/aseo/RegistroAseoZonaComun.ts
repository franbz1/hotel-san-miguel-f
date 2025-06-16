import { Usuario } from "../usuario";
import { ZonaComun } from "../zonasComunes";
import { TiposAseo } from "./tiposAseoEnum"

export interface RegistroAseoZonaComun {
  id: number;
  zonaComunId: number;
  usuarioId: number;
  fecha_registro: Date;

  zonaComun: ZonaComun;
  usuario: Usuario;

  tipos_realizados: TiposAseo[];

  objetos_perdidos: boolean;
  rastros_de_animales: boolean;
  observaciones?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRegistroAseoZonaComunDto {
  usuarioId: number; // Obligatorio, > 0
  zonaComunId: number; // Obligatorio, > 0
  fecha_registro: string; // ISO date string, obligatorio
  tipos_realizados: TiposAseo[]; // Mín 1 elemento, obligatorio
  objetos_perdidos?: boolean; // Opcional, default: false
  rastros_de_animales?: boolean; // Opcional, default: false
  observaciones?: string; // 5-1000 chars, opcional
}

export interface UpdateRegistroAseoZonaComunDto {
  usuarioId?: number; // > 0, opcional
  zonaComunId?: number; // > 0, opcional
  fecha_registro?: string; // ISO date string, opcional
  tipos_realizados?: TiposAseo[]; // Mín 1 elemento, opcional
  objetos_perdidos?: boolean; // Opcional
  rastros_de_animales?: boolean; // Opcional
  observaciones?: string; // 5-1000 chars, opcional
}

export interface FiltrosRegistroAseoZonaComunDto {
  usuarioId?: number; // ID del usuario
  zonaComunId?: number; // ID de la zona común
  fecha?: string; // "YYYY-MM-DD"
  tipo_aseo?: TiposAseo; // Enum TiposAseo
  objetos_perdidos?: boolean; // true/false
  rastros_de_animales?: boolean; // true/false
}