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

// Corregido según documentación - campos requeridos
export interface ForecastParamsDto {
  fechaInicio?: string;
  fechaFin?: string;
  periodosAdelante: number; // Requerido (1-12)
  tipoPeriodo: 'mes' | 'semana'; // Requerido
}

// DTOs de Respuesta

// Corregido según documentación
export interface OcupacionPorPeriodoDto {
  periodo: string;         // Fecha ISO del período
  tasaOcupacion: number;   // Porcentaje de ocupación
  revpar: number;          // Revenue Per Available Room
  adr: number;             // Average Daily Rate
  totalReservas: number;   // Número total de reservas
  ingresosTotales: number; // Ingresos totales del período
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

// Corregido según documentación
export interface ProcedenciaHuespedesDto {
  paisProcedencia: string;
  ciudadProcedencia: string;
  cantidad: number;
  porcentaje: number;
}

// Corregido según documentación - estructura por habitación individual
export interface RendimientoHabitacionDto {
  habitacionId: string;           // ID único de la habitación
  numeroHabitacion: string;       // Número de la habitación (ej: "101")
  tipo: string;                   // Tipo de habitación (ej: "SENCILLA")
  ingresosTotales: number;        // Ingresos totales en el período
  totalReservas: number;          // Total de reservas realizadas
  nochesVendidas: number;         // Total de noches vendidas
  ingresoPromedioReserva: number; // Ingreso promedio por reserva
  porcentajeOcupacion: number;    // Porcentaje de ocupación
}

export interface MotivosViajeDto {
  motivo: MotivosViajes;
  cantidad: number;
  porcentaje: number;
  duracionPromedioEstancia: number;
}

// Corregido según documentación - renombrado y campos corregidos
export interface PrediccionOcupacionDto {
  periodo: string;
  ocupacionPredicida: number;
  nivelConfianza: number;
  ingresosPredichos: number;
}

// Corregido según documentación - estructura simplificada
export interface ComparacionPeriodoAnterior {
  ocupacionAnterior: number;
  revparAnterior: number;
  adrAnterior: number;
  ingresosAnteriores: number;
  cambioOcupacion: number;
  cambioRevpar: number;
  cambioAdr: number;
  cambioIngresos: number;
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

// Corregido - usando PrediccionOcupacionDto
export interface AnalyticsForecastResponse {
  data: PrediccionOcupacionDto[];
  success: boolean;
  message?: string;
}

export interface AnalyticsDashboardResponse {
  data: DashboardEjecutivoDto;
  success: boolean;
  message?: string;
} 