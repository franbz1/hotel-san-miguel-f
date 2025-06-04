import { getCookie, COOKIE_NAMES } from "@/lib/common/cookies"
import { ANALYTICS_ENDPOINTS } from "@/lib/common/api"
import {
  FiltrosAnalyticsDto,
  FiltrosOcupacionDto,
  FiltrosDashboardDto,
  FiltrosForecastDto,
  AnalyticsOcupacionResponse,
  AnalyticsDemografiaResponse,
  AnalyticsProcedenciaResponse,
  AnalyticsRendimientoResponse,
  AnalyticsMotivosViajeResponse,
  AnalyticsForecastResponse,
  DashboardEjecutivoDto,
} from "@/Types/analytics"

// Función auxiliar para crear URLSearchParams
const createURLParams = (filters: object): URLSearchParams => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, String(item)))
      } else {
        params.append(key, String(value))
      }
    }
  })
  
  return params
}

// Función auxiliar para hacer fetch con autenticación
const fetchWithAuth = async (url: string): Promise<Response> => {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Error en la petición: ${response.status}`)
  }

  return response
}

// Servicio para analíticas de ocupación
export async function getAnalyticsOcupacion(
  filtros?: FiltrosOcupacionDto
): Promise<AnalyticsOcupacionResponse> {
  try {
    const params = filtros ? createURLParams(filtros) : undefined
    const response = await fetchWithAuth(ANALYTICS_ENDPOINTS.OCUPACION(params))
    return response.json()
  } catch (error) {
    console.error('Error al obtener analíticas de ocupación:', error)
    throw error
  }
}

// Servicio para demografía de huéspedes
export async function getAnalyticsDemografia(
  filtros?: FiltrosAnalyticsDto
): Promise<AnalyticsDemografiaResponse> {
  try {
    const params = filtros ? createURLParams(filtros) : undefined
    const response = await fetchWithAuth(ANALYTICS_ENDPOINTS.HUESPEDES_DEMOGRAFIA(params))
    return response.json()
  } catch (error) {
    console.error('Error al obtener demografía de huéspedes:', error)
    throw error
  }
}

// Servicio para procedencia de huéspedes
export async function getAnalyticsProcedencia(
  filtros?: FiltrosAnalyticsDto
): Promise<AnalyticsProcedenciaResponse> {
  try {
    const params = filtros ? createURLParams(filtros) : undefined
    const response = await fetchWithAuth(ANALYTICS_ENDPOINTS.HUESPEDES_PROCEDENCIA(params))
    return response.json()
  } catch (error) {
    console.error('Error al obtener procedencia de huéspedes:', error)
    throw error
  }
}

// Servicio para rendimiento de habitaciones
export async function getAnalyticsRendimiento(
  filtros?: FiltrosAnalyticsDto
): Promise<AnalyticsRendimientoResponse> {
  try {
    const params = filtros ? createURLParams(filtros) : undefined
    const response = await fetchWithAuth(ANALYTICS_ENDPOINTS.HABITACIONES_RENDIMIENTO(params))
    return response.json()
  } catch (error) {
    console.error('Error al obtener rendimiento de habitaciones:', error)
    throw error
  }
}

// Servicio para motivos de viaje
export async function getAnalyticsMotivosViaje(
  filtros?: FiltrosAnalyticsDto
): Promise<AnalyticsMotivosViajeResponse> {
  try {
    const params = filtros ? createURLParams(filtros) : undefined
    const response = await fetchWithAuth(ANALYTICS_ENDPOINTS.MOTIVOS_VIAJE(params))
    return response.json()
  } catch (error) {
    console.error('Error al obtener motivos de viaje:', error)
    throw error
  }
}

// Servicio para forecast de ocupación
export async function getAnalyticsForecast(
  filtros?: FiltrosForecastDto
): Promise<AnalyticsForecastResponse> {
  try {
    const params = filtros ? createURLParams(filtros) : undefined
    const response = await fetchWithAuth(ANALYTICS_ENDPOINTS.FORECAST_OCUPACION(params))
    return response.json()
  } catch (error) {
    console.error('Error al obtener forecast de ocupación:', error)
    throw error
  }
}

// Servicio para dashboard ejecutivo
export async function getAnalyticsDashboard(
  filtros?: FiltrosDashboardDto
): Promise<DashboardEjecutivoDto> {
  try {
    const params = filtros ? createURLParams(filtros) : undefined
    const response = await fetchWithAuth(ANALYTICS_ENDPOINTS.DASHBOARD(params))
    return response.json()
  } catch (error) {
    console.error('Error al obtener dashboard ejecutivo:', error)
    throw error
  }
}

// Función de utilidad para formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

// Función de utilidad para formatear porcentajes
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)
}

// Función de utilidad para obtener el color del cambio porcentual
export const getChangeColor = (changePercent: number): string => {
  if (changePercent > 0) return 'text-green-600'
  if (changePercent < 0) return 'text-red-600'
  return 'text-gray-600'
}

// Función de utilidad para obtener el icono del cambio
export const getChangeIcon = (changePercent: number): string => {
  if (changePercent > 0) return '↗'
  if (changePercent < 0) return '↘'
  return '→'
} 