import { TipoHabitacion } from './enums/tiposHabitacion'
import { MotivosViajes } from './enums/motivosViajes'
import { EstadosReserva } from './enums/estadosReserva'

// DTOs de Filtros
export interface FiltrosAnalyticsDto {
  fechaInicio?: string; // Formato: YYYY-MM-DD
  fechaFin?: string; // Formato: YYYY-MM-DD
  tipoHabitacion?: TipoHabitacion;
  nacionalidades?: string[];
  paisesProcedencia?: string[];
  motivoViaje?: MotivosViajes;
  estadoReserva?: EstadosReserva;
}

export interface FiltrosOcupacionDto extends FiltrosAnalyticsDto {
  agruparPor?: 'día' | 'semana' | 'mes' | 'año';
}

export interface FiltrosDashboardDto extends FiltrosAnalyticsDto {
  incluirComparacion?: boolean;
  topMercados?: number;
}

export interface FiltrosForecastDto {
  periodosAdelante?: number;
  tipoPeriodo?: 'día' | 'semana' | 'mes' | 'año';
}

// DTOs de Respuesta

export interface OcupacionPorPeriodoDto {
  periodo: string;
  ocupacion: number;
  revpar: number;
  adr: number;
  habitacionesOcupadas: number;
  habitacionesDisponibles: number;
}

export interface AnalisisOcupacionResponseDto {
  ocupacionPorPeriodo: OcupacionPorPeriodoDto[];
  ocupacionPromedio: number;
  revparPromedio: number;
  adrPromedio: number;
}

export interface DemografiaHuespedesDto {
  nacionalidad: string;
  cantidad: number;
  porcentaje: number;
  ingresos: number;
}

export interface ProcedenciaHuespedesDto {
  paisProcedencia: string;
  cantidadReservas: number;
  porcentajeTotal: number;
  duracionPromedioEstancia: number;
}

export interface RendimientoHabitacionDto {
  tipo: string;
  totalHabitaciones: number;
  tasaOcupacionPromedio: number;
  revpar: number;
  precioPromedioNoche: number;
  ingresosTotales: number;
}

export interface MotivosViajeDto {
  motivo: string;
  cantidad: number;
  porcentaje: number;
  duracionPromedioEstancia: number;
}

export interface ForecastOcupacionDto {
  periodo: string;
  ocupacionPredicta: number;
  confianza: number;
  factoresInfluyentes: string[];
}

export interface ComparacionPeriodoAnterior {
  ocupacion: {
    actual: number;
    anterior: number;
    cambio: number;
    porcentajeCambio: number;
  };
  revpar: {
    actual: number;
    anterior: number;
    cambio: number;
    porcentajeCambio: number;
  };
  adr: {
    actual: number;
    anterior: number;
    cambio: number;
    porcentajeCambio: number;
  };
  ingresos: {
    actual: number;
    anterior: number;
    cambio: number;
    porcentajeCambio: number;
  };
}

export interface DashboardEjecutivoDto {
  ocupacionActual: number;
  revparActual: number;
  adrActual: number;
  ingresosPeriodo: number;
  topMercadosEmisores: DemografiaHuespedesDto[];
  distribucionMotivosViaje: MotivosViajeDto[];
  rendimientoHabitaciones: RendimientoHabitacionDto[];
  tasaHuespedesRecurrentes: number;
  comparacionPeriodoAnterior?: ComparacionPeriodoAnterior;
}

// Respuestas de los endpoints
export interface AnalyticsOcupacionResponse {
  data: AnalisisOcupacionResponseDto;
  success: boolean;
  message?: string;
}

export interface AnalyticsDemografiaResponse {
  data: DemografiaHuespedesDto[];
  success: boolean;
  message?: string;
}

export interface AnalyticsProcedenciaResponse {
  data: ProcedenciaHuespedesDto[];
  success: boolean;
  message?: string;
}

export interface AnalyticsRendimientoResponse {
  data: RendimientoHabitacionDto[];
  success: boolean;
  message?: string;
}

export interface AnalyticsMotivosViajeResponse {
  data: MotivosViajeDto[];
  success: boolean;
  message?: string;
}

export interface AnalyticsForecastResponse {
  data: ForecastOcupacionDto[];
  success: boolean;
  message?: string;
}

export interface AnalyticsDashboardResponse {
  data: DashboardEjecutivoDto;
  success: boolean;
  message?: string;
} 