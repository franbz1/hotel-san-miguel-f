import { getCookie, COOKIE_NAMES } from "@/lib/common/cookies"
import { ANALYTICS_ENDPOINTS } from "@/lib/common/api"
import {
  FiltrosAnalyticsDto,
  FiltrosOcupacionDto,
  FiltrosDashboardDto,
  ForecastParamsDto,
  DashboardEjecutivoDto,
  AnalisisOcupacionResponseDto,
  DemografiaHuespedesDto,
  ProcedenciaHuespedesDto,
  RendimientoHabitacionDto,
  MotivosViajeDto,
  PrediccionOcupacionDto,
} from "@/Types/analytics"

// Función auxiliar para convertir fecha local a UTC
const convertToUTC = (dateString: string): string => {
  // Crear fecha en zona horaria local (YYYY-MM-DD se interpreta como local)
  const localDate = new Date(dateString + 'T00:00:00')
  
  // Convertir a UTC y formatear como ISO string
  const utcDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000))
  
  // Retornar en formato ISO UTC
  return utcDate.toISOString()
}

/*
EJEMPLO DE CONVERSIÓN DE FECHAS:
================================
Usuario en Colombia (UTC-5) selecciona: "2024-01-15"

1. Input del usuario: "2024-01-15" (interpretado como local)
2. Conversión a UTC: "2024-01-15T05:00:00.000Z" 
3. Enviado al backend: "2024-01-15T05:00:00.000Z"
4. Backend procesa en UTC consistentemente
5. UI sigue mostrando: "2024-01-15" (fecha local original)

VENTAJAS:
- Backend siempre recibe UTC para consistencia global
- Usuario ve fechas en su zona horaria local
- No hay confusión de zona horaria en cálculos del servidor
*/

// Función auxiliar para crear URLSearchParams
const createURLParams = (filters: object): URLSearchParams => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, String(item)))
      } else {
        // Convertir fechas a UTC antes de enviar
        if ((key === 'fechaInicio' || key === 'fechaFin') && typeof value === 'string') {
          const utcDate = convertToUTC(value)
          params.append(key, utcDate)
        } else {
          params.append(key, String(value))
        }
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
): Promise<AnalisisOcupacionResponseDto> {
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
): Promise<DemografiaHuespedesDto[]> {
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
): Promise<ProcedenciaHuespedesDto[]> {
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
): Promise<RendimientoHabitacionDto[]> {
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
): Promise<MotivosViajeDto[]> {
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
  filtros?: ForecastParamsDto
): Promise<PrediccionOcupacionDto[]> {
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

// Función auxiliar para convertir fecha UTC a local para mostrar
export const convertUTCToLocal = (utcDateString: string): string => {
  try {
    const utcDate = new Date(utcDateString)
    
    // Convertir a fecha local y formatear como YYYY-MM-DD
    const localDate = new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000))
    
    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error al convertir fecha UTC a local:', error)
    return utcDateString
  }
}

// Función auxiliar para formatear fecha para mostrar al usuario
export const formatDateForDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Bogota'
    }).format(date)
  } catch (error) {
    console.error('Error al formatear fecha para mostrar:', error)
    return dateString
  }
} 