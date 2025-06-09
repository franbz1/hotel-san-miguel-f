import { ANALYTICS_ENDPOINTS } from '@/lib/common/api'
import { 
  IngresosDiarios, 
  IngresosMensuales, 
  FacturaCompleta, 
  AnalisisPeriodo
} from '@/Types/analytics-types'
import { COOKIE_NAMES, getCookie } from '../common/cookies'

// Función utilitaria para manejo de errores específicos de analytics
export function manejarErrorAnalytics(error: unknown, response?: Response): string {
  if (response?.status) {
    switch (response.status) {
      case 400:
        return 'Parámetros inválidos. Verifica el formato de las fechas.'
      case 401:
        return 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      case 403:
        return 'No tienes permisos para acceder a esta información.'
      case 500:
        return 'Error del servidor. Intenta nuevamente más tarde.'
      default:
        return 'Error inesperado. Contacta al soporte técnico.'
    }
  }
  return (error as Error)?.message || 'Error desconocido al procesar la solicitud.'
}

// Función utilitaria para realizar peticiones con manejo de errores
async function realizarPeticionAnalytics<T>(url: string, metodo: string = 'GET'): Promise<T> {
  try {
    const token = getCookie(COOKIE_NAMES.TOKEN)
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado')
    }

    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorMessage = manejarErrorAnalytics(null, response)
      throw new Error(errorMessage)
    }

    const datos = await response.json()
    console.log(datos)
    return datos
  } catch (error) {
    const errorMessage = manejarErrorAnalytics(error)
    throw new Error(errorMessage)
  }
}

// Función para validar formato de fecha YYYY-MM-DD
function validarFormatoFecha(fecha: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(fecha)) return false
  
  const date = new Date(fecha)
  return date instanceof Date && !isNaN(date.getTime())
}

// Función para validar rango de fechas
function validarRangoFechas(fechaInicio: string, fechaFin: string): void {
  if (!validarFormatoFecha(fechaInicio)) {
    throw new Error('Formato de fecha de inicio inválido. Use YYYY-MM-DD')
  }
  
  if (!validarFormatoFecha(fechaFin)) {
    throw new Error('Formato de fecha de fin inválido. Use YYYY-MM-DD')
  }
  
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  
  if (inicio > fin) {
    throw new Error('La fecha de inicio debe ser anterior o igual a la fecha de fin')
  }
}

export class AnalyticsService {
  /**
   * Obtiene estadísticas de ingresos para una fecha específica
   * @param fecha - Fecha en formato YYYY-MM-DD
   * @returns Promise con los ingresos diarios
   */
  static async obtenerIngresosDiarios(fecha: string): Promise<IngresosDiarios> {
    if (!validarFormatoFecha(fecha)) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD')
    }

    const url = ANALYTICS_ENDPOINTS.DAILY_REVENUE(fecha)
    return realizarPeticionAnalytics<IngresosDiarios>(url)
  }

  /**
   * Obtiene estadísticas de ingresos para un mes completo
   * @param año - Año a analizar
   * @param mes - Mes (1-12) donde 1=enero, 12=diciembre
   * @returns Promise con los ingresos mensuales
   */
  static async obtenerIngresosMensuales(año: number, mes: number): Promise<IngresosMensuales> {
    if (mes < 1 || mes > 12) {
      throw new Error('El mes debe estar entre 1 y 12')
    }

    if (año < 1900 || año > 2100) {
      throw new Error('Año inválido')
    }

    const url = ANALYTICS_ENDPOINTS.MONTHLY_REVENUE(año, mes)
    return realizarPeticionAnalytics<IngresosMensuales>(url)
  }

  /**
   * Obtiene lista completa de facturas en un rango de fechas específico
   * @param fechaInicio - Fecha de inicio en formato YYYY-MM-DD
   * @param fechaFin - Fecha de fin en formato YYYY-MM-DD
   * @returns Promise con las facturas del rango
   */
  static async obtenerFacturasPorRango(fechaInicio: string, fechaFin: string): Promise<FacturaCompleta[]> {
    validarRangoFechas(fechaInicio, fechaFin)

    const url = ANALYTICS_ENDPOINTS.INVOICES_RANGE(fechaInicio, fechaFin)
    return realizarPeticionAnalytics<FacturaCompleta[]>(url)
  }

  /**
   * Analiza un período específico y calcula estadísticas personalizadas
   * @param fechaInicio - Fecha de inicio en formato YYYY-MM-DD
   * @param fechaFin - Fecha de fin en formato YYYY-MM-DD
   * @returns Promise con el análisis completo del período
   */
  static async analizarPeriodo(fechaInicio: string, fechaFin: string): Promise<AnalisisPeriodo> {
    validarRangoFechas(fechaInicio, fechaFin)

    const facturas = await this.obtenerFacturasPorRango(fechaInicio, fechaFin)
    
    // Calcular estadísticas personalizadas
    const totalIngresos = facturas.reduce((sum, factura) => sum + factura.total, 0)
    const totalFacturas = facturas.length
    const promedioPorFactura = totalFacturas > 0 ? totalIngresos / totalFacturas : 0

    return {
      periodo: { fechaInicio, fechaFin },
      totalIngresos: Math.round(totalIngresos * 100) / 100, // Redondear a 2 decimales
      totalFacturas,
      promedioPorFactura: Math.round(promedioPorFactura * 100) / 100, // Redondear a 2 decimales
      facturas
    }
  }

  /**
   * Obtiene datos para dashboard del día actual
   * @returns Promise con datos del dashboard diario
   */
  static async cargarDashboardDiario(): Promise<{
    ingresosDiarios: IngresosDiarios,
    facturas: FacturaCompleta[]
  }> {
    const fechaHoy = new Date().toISOString().split('T')[0]
    
    const [ingresosDiarios, facturas] = await Promise.all([
      this.obtenerIngresosDiarios(fechaHoy),
      this.obtenerFacturasPorRango(fechaHoy, fechaHoy)
    ])

    return {
      ingresosDiarios,
      facturas
    }
  }

  /**
   * Genera reporte mensual completo
   * @param año - Año del reporte
   * @param mes - Mes del reporte (1-12)
   * @returns Promise con el reporte mensual completo
   */
  static async generarReporteMensual(año: number, mes: number): Promise<{
    resumen: IngresosMensuales,
    detalles: FacturaCompleta[]
  }> {
    const ingresosMensuales = await this.obtenerIngresosMensuales(año, mes)
    
    // Obtener primer y último día del mes
    const primerDia = new Date(año, mes - 1, 1).toISOString().split('T')[0]
    const ultimoDia = new Date(año, mes, 0).toISOString().split('T')[0]
    
    const facturas = await this.obtenerFacturasPorRango(primerDia, ultimoDia)
    
    return {
      resumen: ingresosMensuales,
      detalles: facturas
    }
  }
} 