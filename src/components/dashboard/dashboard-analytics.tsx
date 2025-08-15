"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDashboardDiario } from '@/hooks/useAnalytics'
import { Loader2, RefreshCw, DollarSign, Receipt, TrendingUp, AlertCircle, LucideIcon } from 'lucide-react'
import clsx from 'clsx'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "text-emerald-600",
  isLoading = false 
}: { 
  title: string
  value: string
  icon?: LucideIcon
  color?: string
  isLoading?: boolean
}) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className={clsx("w-4 h-4", color)} />}
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        ) : (
          <h3 className={clsx("text-2xl sm:text-3xl font-bold", color)}>{value}</h3>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardAnalytics() {
  const { datos, loading, error, cargarDashboard, limpiarError } = useDashboardDiario()

  // Estados para control móvil
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [hasFetched, setHasFetched] = useState<boolean>(false)

  // Ref para animación (max-height)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Detectar si es móvil (max-width: 767px)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    const setValue = () => setIsMobile(mq.matches)
    setValue()
    mq.addEventListener?.('change', setValue)
    return () => mq.removeEventListener?.('change', setValue)
  }, [])

  // Si no es móvil, cargar dashboard automáticamente (una sola vez)
  useEffect(() => {
    if (!isMobile && !hasFetched) {
      // carga inicial en desktop/tablet
      const run = async () => {
        try {
          await cargarDashboard()
          setHasFetched(true)
        } catch {
          // el hook maneja errores internamente
        }
      }
      run()
    }
  }, [isMobile, hasFetched, cargarDashboard])

  // Cuando el usuario expande en móvil, disparar fetch (solo la primera vez)
  useEffect(() => {
    if (isMobile && mobileOpen && !hasFetched) {
      const run = async () => {
        try {
          await cargarDashboard()
          setHasFetched(true)
        } catch {
          // manejo por hook
        }
      }
      run()
    }
  }, [isMobile, mobileOpen, hasFetched, cargarDashboard])

  // Función para formatear moneda
  const formatearMoneda = (valor: number | undefined): string => {
    if (!valor && valor !== 0) return "$0"
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor as number)
  }

  // Recargar (btn)
  const handleRecargar = async () => {
    try {
      await cargarDashboard()
      setHasFetched(true)
    } catch {
      // ya manejado por hook
    }
  }

  // Render del estado de error (mismo comportamiento, pero adaptado a layout responsive)
  if (error) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-4">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Error al cargar las métricas: {error}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={limpiarError}
                >
                  Cerrar
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleRecargar}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reintentar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Contenido que sí debe cargarse/mostrarse (solo cuando hasFetched === true o no es móvil)
  const statsContent = (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Ingresos Hoy"
        value={datos?.ingresosDiarios ? formatearMoneda(datos.ingresosDiarios.totalRevenue) : "$0"}
        icon={DollarSign}
        color="text-emerald-600"
        isLoading={loading}
      />

      <StatCard
        title="Facturas Hoy"
        value={datos?.ingresosDiarios ? String(datos.ingresosDiarios.invoiceCount ?? 0) : "0"}
        icon={Receipt}
        color="text-blue-600"
        isLoading={loading}
      />

      <StatCard
        title="Promedio/Factura"
        value={datos?.ingresosDiarios ? formatearMoneda(datos.ingresosDiarios.averagePerInvoice) : "$0"}
        icon={TrendingUp}
        color="text-purple-600"
        isLoading={loading}
      />

      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Análisis Detallado</p>
          <div className="flex flex-col gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecargar}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar
                </>
              )}
            </Button>
          </div>
          {datos?.ingresosDiarios && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Última actualización: {new Date().toLocaleTimeString('es-CO')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Skeletons para mostrar mientras carga en la primera carga
  const skeletons = (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 sm:p-6">
            <div className="h-6 bg-slate-100 rounded mb-3 animate-pulse" />
            <div className="h-8 bg-slate-100 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="mb-8">
      {/* Header con toggle visible solo en móvil */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg sm:text-xl font-semibold">Análisis Diario</h2>

        {/* Toggle visible únicamente en móviles */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            className="md:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm"
            aria-expanded={mobileOpen}
            aria-controls="dashboard-analytics-panel"
            onClick={() => setMobileOpen(v => !v)}
            title={mobileOpen ? "Ocultar métricas" : "Mostrar métricas"}
          >
            {mobileOpen ? "Ocultar métricas" : "Ver métricas"}
          </button>
        </div>
      </div>

      {/* Si no es móvil: mostramos siempre (y se carga en mount) */}
      {!isMobile && (
        <div>
          {loading && !hasFetched ? skeletons : statsContent}
        </div>
      )}

      {/* Si es móvil: contenido colapsable; solo render y fetch cuando mobileOpen -> hasFetched se controla arriba */}
      {isMobile && (
        <div
          id="dashboard-analytics-panel"
          ref={containerRef}
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
          style={{ maxHeight: mobileOpen ? (hasFetched ? 2000 : 1000) : 0 }}
        >
          <div className="pt-2">
            {/* Si estamos en la primera carga y loading -> mostrar skeletons, si no, mostrar statsContent (cuando hasFetched o ya cargado) */}
            {loading && !hasFetched ? skeletons : statsContent}
          </div>
        </div>
      )}
    </div>
  )
}
