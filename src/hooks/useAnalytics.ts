'use client'

import { useState, useCallback } from 'react'
import { AnalyticsService } from '@/lib/analytics/analytics.service'
import { 
  IngresosDiarios, 
  IngresosMensuales, 
  FacturaCompleta, 
  AnalisisPeriodo,
  UseAnalyticsReturn 
} from '@/Types/analytics-types'

/**
 * Custom hook para manejo de analíticas del hotel
 * Proporciona funciones para obtener datos de ingresos y facturas con manejo de estado
 */
export function useAnalytics(): UseAnalyticsReturn {
  // Estados para almacenar los datos
  const [ingresosDiarios, setIngresosDiarios] = useState<IngresosDiarios | null>(null)
  const [ingresosMensuales, setIngresosMensuales] = useState<IngresosMensuales | null>(null)
  const [facturasPorRango, setFacturasPorRango] = useState<FacturaCompleta[] | null>(null)
  
  // Estados para loading y errores
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Función para limpiar errores
  const limpiarError = useCallback(() => {
    setError(null)
  }, [])

  // Función para manejar errores de forma consistente
  const manejarError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    setError(errorMessage)
    console.error('Error en useAnalytics:', errorMessage)
  }, [])

  // Función para obtener ingresos diarios
  const obtenerIngresosDiarios = useCallback(async (fecha: string): Promise<IngresosDiarios> => {
    setLoading(true)
    setError(null)
    
    try {
      const datos = await AnalyticsService.obtenerIngresosDiarios(fecha)
      setIngresosDiarios(datos)
      return datos
    } catch (err) {
      manejarError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [manejarError])

  // Función para obtener ingresos mensuales
  const obtenerIngresosMensuales = useCallback(async (año: number, mes: number): Promise<IngresosMensuales> => {
    setLoading(true)
    setError(null)
    
    try {
      const datos = await AnalyticsService.obtenerIngresosMensuales(año, mes)
      setIngresosMensuales(datos)
      return datos
    } catch (err) {
      manejarError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [manejarError])

  // Función para obtener facturas por rango de fechas
  const obtenerFacturasPorRango = useCallback(async (fechaInicio: string, fechaFin: string): Promise<FacturaCompleta[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const datos = await AnalyticsService.obtenerFacturasPorRango(fechaInicio, fechaFin)
      setFacturasPorRango(datos)
      return datos
    } catch (err) {
      manejarError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [manejarError])

  // Función para analizar período personalizado
  const analizarPeriodo = useCallback(async (fechaInicio: string, fechaFin: string): Promise<AnalisisPeriodo> => {
    setLoading(true)
    setError(null)
    
    try {
      const datos = await AnalyticsService.analizarPeriodo(fechaInicio, fechaFin)
      return datos
    } catch (err) {
      manejarError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [manejarError])

  return {
    // Estados
    ingresosDiarios,
    ingresosMensuales,
    facturasPorRango,
    loading,
    error,
    
    // Funciones
    obtenerIngresosDiarios,
    obtenerIngresosMensuales,
    obtenerFacturasPorRango,
    analizarPeriodo,
    limpiarError
  }
}

// Hook adicional para datos del dashboard diario
export function useDashboardDiario() {
  const [datos, setDatos] = useState<{
    ingresosDiarios: IngresosDiarios | null,
    facturas: FacturaCompleta[] | null
  }>({
    ingresosDiarios: null,
    facturas: null
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const cargarDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const dashboardData = await AnalyticsService.cargarDashboardDiario()
      setDatos({
        ingresosDiarios: dashboardData.ingresosDiarios,
        facturas: dashboardData.facturas
      })
      return dashboardData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar dashboard'
      setError(errorMessage)
      console.error('Error en useDashboardDiario:', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const limpiarError = useCallback(() => {
    setError(null)
  }, [])

  return {
    datos,
    loading,
    error,
    cargarDashboard,
    limpiarError
  }
}

// Hook para reporte mensual
export function useReporteMensual() {
  const [reporte, setReporte] = useState<{
    resumen: IngresosMensuales | null,
    detalles: FacturaCompleta[] | null
  }>({
    resumen: null,
    detalles: null
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const generarReporte = useCallback(async (año: number, mes: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const reporteData = await AnalyticsService.generarReporteMensual(año, mes)
      setReporte({
        resumen: reporteData.resumen,
        detalles: reporteData.detalles
      })
      return reporteData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar reporte mensual'
      setError(errorMessage)
      console.error('Error en useReporteMensual:', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const limpiarError = useCallback(() => {
    setError(null)
  }, [])

  return {
    reporte,
    loading,
    error,
    generarReporte,
    limpiarError
  }
} 