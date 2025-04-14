
export enum TipoHabitacion {
  APARTAMENTO = 'APARTAMENTO',
  HAMACA = 'HAMACA',
  CAMPING = 'CAMPING',
  MÚLTIPLE = 'MÚLTIPLE',
  CASA = 'CASA',
  FINCA = 'FINCA',
  CAMA = 'CAMA',
  PLAZA = 'PLAZA',
  SENCILLA = 'SENCILLA',
  SUITE = 'SUITE',
  DOBLE = 'DOBLE',
  OTRO = 'OTRO',
}

export enum EstadoHabitacion {
  LIBRE = 'LIBRE',
  OCUPADO = 'OCUPADO',
  RESERVADO = 'RESERVADO',
  EN_DESINFECCION = 'EN_DESINFECCION',
  EN_MANTENIMIENTO = 'EN_MANTENIMIENTO',
  EN_LIMPIEZA = 'EN_LIMPIEZA',
}

export interface Habitacion {
  id: number;

  numero_habitacion: number;

  tipo: TipoHabitacion;

  estado: EstadoHabitacion;

  precio_por_noche: number;
}
