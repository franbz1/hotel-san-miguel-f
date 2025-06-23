import { RegistroAseoZonaComun } from "./aseo/RegistroAseoZonaComun";
import { TiposAseo } from "./aseo/tiposAseoEnum"

export interface ZonaComun {
  id: number;
  nombre: string;
  piso: number;
  requerido_aseo_hoy: boolean;
  ultimo_aseo_fecha: Date;
  ultimo_aseo_tipo: TiposAseo;

  requerido_desinfeccion_hoy: boolean;
  proxima_desinfeccion_zona_comun: Date;

  registros_aseo_zona_comun?: RegistroAseoZonaComun[];

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateZonaComunDto {
  nombre: string; // 2-100 chars, obligatorio
  piso: number; // 0-50, obligatorio
  requerido_aseo_hoy?: boolean; // Opcional, default: false
  ultimo_aseo_fecha?: string; // ISO date string, opcional
  ultimo_aseo_tipo?: TiposAseo; // Opcional
}

export interface UpdateZonaComunDto {
  nombre?: string; // 2-100 chars, opcional
  piso?: number; // 0-50, opcional
  requerido_aseo_hoy?: boolean; // Opcional
  ultimo_aseo_fecha?: string; // ISO date string, opcional
  ultimo_aseo_tipo?: TiposAseo; // Opcional
}

export interface FiltrosZonaComunDto {
  piso?: number; // 0-50
  requerido_aseo_hoy?: boolean; // true/false
  ultimo_aseo_tipo?: TiposAseo; // Enum TiposAseo
}