export interface ConfiguracionAseo {
  id: number;
  hora_limite_aseo: string; // "17:00"
  hora_proceso_nocturno_utc: string; // "05:00"
  frecuencia_rotacion_colchones: number; // 180
  dias_aviso_rotacion_colchones: number; // 5
  habilitar_notificaciones: boolean; // false
  email_notificaciones?: string; // "admin@hotel.com"
  elementos_aseo_default: string[]; // ["Escoba", "Trapeador"]
  elementos_proteccion_default: string[]; // ["Guantes", "Mascarilla"]
  productos_quimicos_default: string[]; // ["Desinfectante"]
  areas_intervenir_habitacion_default: string[]; // ["Cama", "Baño"]
  areas_intervenir_banio_default: string[]; // ["Inodoro", "Lavamanos"]
  procedimiento_aseo_habitacion_default?: string;
  procedimiento_desinfeccion_habitacion_default?: string;
  procedimiento_rotacion_colchones_default?: string;
  procedimiento_limieza_zona_comun_default?: string;
  procedimiento_desinfeccion_zona_comun_default?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateConfiguracionAseoDto {
  hora_limite_aseo?: string; // Formato: "HH:MM"
  hora_proceso_nocturno_utc?: string; // Formato: "HH:MM"
  frecuencia_rotacion_colchones?: number; // 1-365 días
  dias_aviso_rotacion_colchones?: number; // 1-30 días
  habilitar_notificaciones?: boolean;
  email_notificaciones?: string; // Email válido
  elementos_aseo_default?: string[]; // Máx 50 elementos, 100 chars c/u
  elementos_proteccion_default?: string[]; // Máx 50 elementos, 100 chars c/u
  productos_quimicos_default?: string[]; // Máx 50 elementos, 100 chars c/u
  areas_intervenir_habitacion_default?: string[]; // Máx 50 elementos, 100 chars c/u
  areas_intervenir_banio_default?: string[]; // Máx 50 elementos, 100 chars c/u
  procedimiento_aseo_habitacion_default?: string; // Máx 1000 chars
  procedimiento_desinfeccion_habitacion_default?: string; // Máx 1000 chars
  procedimiento_rotacion_colchones_default?: string; // Máx 1000 chars
  procedimiento_limieza_zona_comun_default?: string; // Máx 1000 chars
  procedimiento_desinfeccion_zona_comun_default?: string; // Máx 1000 chars
} 