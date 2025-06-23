import { RegistroAseoHabitacion } from "./RegistroAseoHabitacion";
import { RegistroAseoZonaComun } from "./RegistroAseoZonaComun";

export interface ReporteAseoDiario {
  id: number;
  fecha: Date;

  elementos_aseo: string[];
  elementos_proteccion: string[];
  productos_quimicos: string[];
  procedimiento_aseo_habitacion: string;
  procedimiento_desinfeccion_habitacion: string;
  procedimiento_limpieza_zona_comun: string;
  procedimiento_desinfeccion_zona_comun: string;

  datos: {
    habitaciones: RegistroAseoHabitacion[];
    zonas_comunes: RegistroAseoZonaComun[];
    resumen: {
      total_habitaciones_aseadas: number;
      total_zonas_comunes_aseadas: number;
      objetos_perdidos_encontrados: number;
      rastros_animales_encontrados: number;
    };
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReporteAseoDiarioDto {
  fecha: string; // ISO date string, obligatorio
  elementos_aseo: string[]; // Mín 1 elemento, 2-100 chars c/u
  elementos_proteccion: string[]; // Mín 1 elemento, 2-100 chars c/u
  productos_quimicos: string[]; // Mín 1 elemento, 2-100 chars c/u
  procedimiento_aseo_habitacion: string; // 10-1000 chars, obligatorio
  procedimiento_desinfeccion_habitacion: string; // 10-1000 chars, obligatorio
  procedimiento_limpieza_zona_comun: string; // 10-1000 chars, obligatorio
  procedimiento_desinfeccion_zona_comun: string; // 10-1000 chars, obligatorio
  datos: {
    habitaciones: RegistroAseoHabitacion[];
    zonas_comunes: RegistroAseoZonaComun[];
    resumen: {
      total_habitaciones_aseadas: number;
      total_zonas_comunes_aseadas: number;
      objetos_perdidos_encontrados: number;
      rastros_animales_encontrados: number;
    };
  };
}

export interface UpdateReporteAseoDiarioDto {
  fecha?: string; // ISO date string, opcional
  elementos_aseo?: string[]; // Mín 1 elemento, 2-100 chars c/u, opcional
  elementos_proteccion?: string[]; // Mín 1 elemento, 2-100 chars c/u, opcional
  productos_quimicos?: string[]; // Mín 1 elemento, 2-100 chars c/u, opcional
  procedimiento_aseo_habitacion?: string; // 10-1000 chars, opcional
  procedimiento_desinfeccion_habitacion?: string; // 10-1000 chars, opcional
  procedimiento_limpieza_zona_comun?: string; // 10-1000 chars, opcional
  procedimiento_desinfeccion_zona_comun?: string; // 10-1000 chars, opcional
  datos?: {
    habitaciones: RegistroAseoHabitacion[];
    zonas_comunes: RegistroAseoZonaComun[];
    resumen: {
      total_habitaciones_aseadas: number;
      total_zonas_comunes_aseadas: number;
      objetos_perdidos_encontrados: number;
      rastros_animales_encontrados: number;
    };
  };
}

export interface FiltrosReportesAseoDto {
  fecha?: string; // "YYYY-MM-DD" - fecha específica
  fecha_inicio?: string; // "YYYY-MM-DD" - rango inicial
  fecha_fin?: string; // "YYYY-MM-DD" - rango final
  elemento_aseo?: string; // 2-100 chars
  producto_quimico?: string; // 2-100 chars
  elemento_proteccion?: string; // 2-100 chars
}