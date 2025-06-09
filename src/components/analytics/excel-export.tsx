"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { FacturaCompleta, AnalisisPeriodo } from '@/Types/analytics-types'
import * as XLSX from 'xlsx'
import { useState } from 'react'

interface ExcelExportProps {
  facturas: FacturaCompleta[] | null
  analisisPeriodo: AnalisisPeriodo | null
  fechaInicio: string
  fechaFin: string
}

export function ExcelExport({ facturas, analisisPeriodo, fechaInicio, fechaFin }: ExcelExportProps) {
  const [exporting, setExporting] = useState(false)

  // Función para formatear fecha en zona horaria local
  const formatearFechaLocal = (fechaString: string): string => {
    if (!fechaString) return 'Fecha no disponible'
    
    const fecha = new Date(fechaString)
    if (isNaN(fecha.getTime())) return 'Fecha inválida'
    
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Función para formatear moneda
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  }

  const exportarAExcel = async () => {
    if (!facturas || !analisisPeriodo || facturas.length === 0) {
      alert('No hay datos disponibles para exportar')
      return
    }

    setExporting(true)

    try {
      // Crear un nuevo workbook
      const workbook = XLSX.utils.book_new()

      // Hoja 1: Resumen del Período
      const resumenData = [
        ['REPORTE DE ANALYTICS - HOTEL SAN MIGUEL'],
        [''],
        ['Período de Análisis:', `${formatearFechaLocal(fechaInicio)} - ${formatearFechaLocal(fechaFin)}`],
        ['Fecha de Generación:', new Date().toLocaleDateString('es-ES')],
        [''],
        ['RESUMEN GENERAL'],
        ['Total de Ingresos:', formatearMoneda(analisisPeriodo.totalIngresos)],
        ['Total de Facturas:', analisisPeriodo.totalFacturas],
        ['Promedio por Factura:', formatearMoneda(analisisPeriodo.promedioPorFactura)],
        ['Huéspedes Únicos:', new Set(facturas.map(f => f.huesped.id)).size],
        [''],
        ['ESTADÍSTICAS ADICIONALES'],
        ['Total Días:', Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)) + 1],
        ['Promedio Diario:', formatearMoneda(analisisPeriodo.totalIngresos / Math.max(1, Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)) + 1))],
        ['Facturas por Día:', (analisisPeriodo.totalFacturas / Math.max(1, Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)) + 1)).toFixed(1)]
      ]

      const wsResumen = XLSX.utils.aoa_to_sheet(resumenData)
      XLSX.utils.book_append_sheet(workbook, wsResumen, 'Resumen')

      // Hoja 2: Detalle de Facturas
      const facturasData = [
        ['DETALLE DE FACTURAS'],
        [''],
        ['Fecha', 'ID Factura', 'Huésped', 'Documento', 'Email', 'Teléfono', 'Habitación', 'Estado Reserva', 'Total', 'Fecha Entrada', 'Fecha Salida']
      ]

             facturas.forEach(factura => {
         facturasData.push([
           formatearFechaLocal(factura.fecha_factura),
           (factura.id || 0).toString(),
           `${factura.huesped.nombres || ''} ${factura.huesped.primer_apellido || ''}`.trim(),
           factura.huesped.numero_documento || 'No disponible',
           factura.huesped.email || 'No disponible',
           factura.huesped.telefono || 'No disponible',
           (factura.reserva.habitacion_id || 0).toString(),
           factura.reserva.estado || 'No disponible',
           (factura.total || 0).toString(),
           formatearFechaLocal(factura.reserva.fecha_entrada),
           formatearFechaLocal(factura.reserva.fecha_salida)
         ])
       })

      const wsFacturas = XLSX.utils.aoa_to_sheet(facturasData)
      XLSX.utils.book_append_sheet(workbook, wsFacturas, 'Facturas')

      // Hoja 3: Ingresos por Día
      const ingresosPorDia = facturas.reduce((acc, factura) => {
        const fecha = new Date(factura.fecha_factura).toLocaleDateString('es-ES')
        acc[fecha] = (acc[fecha] || 0) + factura.total
        return acc
      }, {} as Record<string, number>)

      const ingresosDiaData = [
        ['INGRESOS POR DÍA'],
        [''],
        ['Fecha', 'Ingresos', 'Ingresos Formateado']
      ]

      Object.entries(ingresosPorDia)
        .sort(([a], [b]) => new Date(a.split('/').reverse().join('-')).getTime() - 
                           new Date(b.split('/').reverse().join('-')).getTime())
                 .forEach(([fecha, total]) => {
           ingresosDiaData.push([fecha, (total || 0).toString(), formatearMoneda(total || 0)])
         })

      const wsIngresosDia = XLSX.utils.aoa_to_sheet(ingresosDiaData)
      XLSX.utils.book_append_sheet(workbook, wsIngresosDia, 'Ingresos por Día')

             // Hoja 4: Top Huéspedes
       const ingresosPorHuesped = facturas.reduce((acc, factura) => {
         const nombres = factura.huesped.nombres || ''
         const apellido = factura.huesped.primer_apellido || ''
         const nombreHuesped = `${nombres} ${apellido}`.trim() || 'Huésped sin nombre'
         const total = factura.total || 0
         acc[nombreHuesped] = (acc[nombreHuesped] || 0) + total
         return acc
       }, {} as Record<string, number>)

      const topHuespedesData = [
        ['TOP HUÉSPEDES POR INGRESOS'],
        [''],
        ['Posición', 'Huésped', 'Total Ingresos', 'Total Formateado']
      ]

      Object.entries(ingresosPorHuesped)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20) // Top 20
                 .forEach(([nombre, total], index) => {
           topHuespedesData.push([(index + 1).toString(), nombre || 'Sin nombre', (total || 0).toString(), formatearMoneda(total || 0)])
         })

      const wsTopHuespedes = XLSX.utils.aoa_to_sheet(topHuespedesData)
      XLSX.utils.book_append_sheet(workbook, wsTopHuespedes, 'Top Huéspedes')

      // Configurar estilos para las hojas
      const sheets = ['Resumen', 'Facturas', 'Ingresos por Día', 'Top Huéspedes']
      sheets.forEach(sheetName => {
        const ws = workbook.Sheets[sheetName]
        if (ws['!cols']) {
          // Ajustar ancho de columnas
          ws['!cols'] = Array(20).fill({ wch: 15 })
        } else {
          ws['!cols'] = Array(20).fill({ wch: 15 })
        }
      })

      // Generar nombre de archivo
      const fechaInicioFormateada = new Date(fechaInicio).toLocaleDateString('es-ES').replace(/\//g, '-')
      const fechaFinFormateada = new Date(fechaFin).toLocaleDateString('es-ES').replace(/\//g, '-')
      const nombreArchivo = `Analytics_Hotel_${fechaInicioFormateada}_${fechaFinFormateada}.xlsx`

      // Escribir y descargar el archivo
      XLSX.writeFile(workbook, nombreArchivo)

    } catch (error) {
      console.error('Error al exportar a Excel:', error)
      alert('Error al generar el archivo Excel. Por favor, intenta nuevamente.')
    } finally {
      setExporting(false)
    }
  }

  const isDisabled = !facturas || !analisisPeriodo || facturas.length === 0 || exporting

  return (
    <Button
      onClick={exportarAExcel}
      disabled={isDisabled}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Exportar Excel
        </>
      )}
    </Button>
  )
} 