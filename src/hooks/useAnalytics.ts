"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getAnalyticsOcupacion,
  getAnalyticsDemografia,
  getAnalyticsProcedencia,
  getAnalyticsRendimiento,
  getAnalyticsMotivosViaje,
  getAnalyticsForecast,
  getAnalyticsDashboard,
} from "@/lib/analytics/analytics-service"
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

// Hook para el dashboard ejecutivo
export function useAnalyticsDashboard(filtros?: FiltrosDashboardDto) {
  const [data, setData] = useState<DashboardEjecutivoDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extraer propiedades individuales para dependencias estables
  const fechaInicio = filtros?.fechaInicio
  const fechaFin = filtros?.fechaFin

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Reconstruir objeto filtros con propiedades actuales
      const filtrosActuales = fechaInicio || fechaFin ? {
        ...(fechaInicio && { fechaInicio }),
        ...(fechaFin && { fechaFin })
      } : undefined
      
      const response = await getAnalyticsDashboard(filtrosActuales)
      console.log("response", response)
      setData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [fechaInicio, fechaFin])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Hook para análisis de ocupación
export function useAnalyticsOcupacion(filtros?: FiltrosOcupacionDto) {
  const [data, setData] = useState<AnalisisOcupacionResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAnalyticsOcupacion(filtros)
      // Extraemos solo los datos útiles de la respuesta
      setData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar ocupación:', err)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Hook para demografía de huéspedes
export function useAnalyticsDemografia(filtros?: FiltrosAnalyticsDto) {
  const [data, setData] = useState<DemografiaHuespedesDto[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAnalyticsDemografia(filtros)
      setData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar demografía:', err)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Hook para procedencia de huéspedes
export function useAnalyticsProcedencia(filtros?: FiltrosAnalyticsDto) {
  const [data, setData] = useState<ProcedenciaHuespedesDto[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAnalyticsProcedencia(filtros)
      setData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar procedencia:', err)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Hook para rendimiento de habitaciones
export function useAnalyticsRendimiento(filtros?: FiltrosAnalyticsDto) {
  const [data, setData] = useState<RendimientoHabitacionDto[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAnalyticsRendimiento(filtros)
      setData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar rendimiento:', err)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Hook para motivos de viaje
export function useAnalyticsMotivosViaje(filtros?: FiltrosAnalyticsDto) {
  const [data, setData] = useState<MotivosViajeDto[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAnalyticsMotivosViaje(filtros)
      setData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar motivos de viaje:', err)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Hook para forecast de ocupación
export function useAnalyticsForecast(filtros?: ForecastParamsDto) {
  const [data, setData] = useState<PrediccionOcupacionDto[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAnalyticsForecast(filtros)
      setData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar forecast:', err)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Hook genérico para cualquier tipo de analytics (opcional)
export function useAnalytics<TData, TFilters>(
  asyncFunction: (filtros?: TFilters) => Promise<TData>,
  filtros?: TFilters
) {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await asyncFunction(filtros)
      setData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error al cargar datos:', err)
    } finally {
      setLoading(false)
    }
  }, [asyncFunction, filtros])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
} 