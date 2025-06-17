// Servicios del módulo de aseo

// Configuración de aseo
export * from './configuracion-aseo-service';

// Zonas comunes
export * from './zona-comun-service';

// Registro de aseo de habitaciones
export {
  REGISTRO_ASEO_HABITACION_KEYS,
  useRegistrosAseoHabitacion,
  useRegistroAseoHabitacionById,
  useCreateRegistroAseoHabitacion,
  useUpdateRegistroAseoHabitacion,
  useDeleteRegistroAseoHabitacion,
  useRegistrosPorHabitacion,
  useRegistrosPorUsuario as useRegistrosHabitacionPorUsuario,
  useRegistrosPorFecha as useRegistrosHabitacionPorFecha,
} from './registro-aseo-habitacion-service';

// Registro de aseo de zonas comunes
export {
  REGISTRO_ASEO_ZONA_COMUN_KEYS,
  useRegistrosAseoZonaComun,
  useRegistroAseoZonaComunById,
  useCreateRegistroAseoZonaComun,
  useUpdateRegistroAseoZonaComun,
  useDeleteRegistroAseoZonaComun,
  useRegistrosPorZonaComun,
  useRegistrosPorUsuario as useRegistrosZonaComunPorUsuario,
  useRegistrosPorFecha as useRegistrosZonaComunPorFecha,
} from './registro-aseo-zona-comun-service';

// Reportes de aseo
export * from './reporte-aseo-service'; 