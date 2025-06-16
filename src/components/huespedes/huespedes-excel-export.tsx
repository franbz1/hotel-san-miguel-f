"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Huesped } from '@/Types/huesped'
import * as XLSX from 'xlsx'
import { useState } from 'react'

interface HuespedesExcelExportProps {
  huespedes: Huesped[]
  filteredHuespedes: Huesped[]
  searchTerm: string
  tipoDocFilter: string
}

export function HuespedesExcelExport({ 
  huespedes, 
  filteredHuespedes, 
  searchTerm, 
  tipoDocFilter 
}: HuespedesExcelExportProps) {
  const [exporting, setExporting] = useState(false)

  // Función para formatear fecha en zona horaria local
  const formatearFechaLocal = (fecha: Date): string => {
    if (!fecha) return 'Fecha no disponible'
    
    const fechaObj = new Date(fecha)
    if (isNaN(fechaObj.getTime())) return 'Fecha inválida'
    
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Función para calcular edad
  const calcularEdad = (fechaNacimiento: Date): number => {
    if (!fechaNacimiento) return 0
    
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth()
    
    if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    
    return edad
  }

  const exportarAExcel = async () => {
    if (!huespedes || huespedes.length === 0) {
      alert('No hay datos disponibles para exportar')
      return
    }

    setExporting(true)

    try {
      // Crear un nuevo workbook
      const workbook = XLSX.utils.book_new()

      // Calcular estadísticas
      const totalHuespedes = huespedes.length
      const huespedesConReservas = huespedes.filter(h => h.reservas && h.reservas.length > 0).length
      const huespedesConEmail = huespedes.filter(h => h.correo).length
      const huespedesConTelefono = huespedes.filter(h => h.telefono).length
      const totalReservas = huespedes.reduce((total, h) => total + (h.reservas ? h.reservas.length : 0), 0)

      // Hoja 1: Resumen General
      const resumenData = [
        ['REPORTE DE HUÉSPEDES - HOTEL SAN MIGUEL'],
        [''],
        ['Fecha de Generación:', new Date().toLocaleDateString('es-ES')],
        [''],
        ['RESUMEN GENERAL'],
        ['Total de Huéspedes:', totalHuespedes],
        ['Huéspedes con Reservas:', huespedesConReservas],
        ['Huéspedes sin Reservas:', totalHuespedes - huespedesConReservas],
        ['Total de Reservas:', totalReservas],
        ['Promedio Reservas por Huésped:', totalHuespedes > 0 ? (totalReservas / totalHuespedes).toFixed(1) : 0],
        [''],
        ['INFORMACIÓN DE CONTACTO'],
        ['Huéspedes con Email:', huespedesConEmail],
        ['Huéspedes con Teléfono:', huespedesConTelefono],
        ['Huéspedes con Contacto Completo:', huespedes.filter(h => h.correo && h.telefono).length],
        [''],
        ['FILTROS APLICADOS'],
        ['Búsqueda:', searchTerm || 'Sin filtro'],
        ['Tipo de Documento:', tipoDocFilter !== 'all' ? tipoDocFilter : 'Todos'],
        ['Resultados Filtrados:', filteredHuespedes.length],
        ['% de Resultados:', totalHuespedes > 0 ? ((filteredHuespedes.length / totalHuespedes) * 100).toFixed(1) + '%' : '0%']
      ]

      const wsResumen = XLSX.utils.aoa_to_sheet(resumenData)
      XLSX.utils.book_append_sheet(workbook, wsResumen, 'Resumen')

      // Hoja 2: Detalle de Huéspedes
      const huespedesData = [
        ['DETALLE COMPLETO DE HUÉSPEDES'],
        [''],
        [
          'ID',
          'Nombres',
          'Primer Apellido', 
          'Segundo Apellido',
          'Tipo Documento',
          'Número Documento',
          'Fecha Nacimiento',
          'Edad',
          'Género',
          'Nacionalidad',
          'País Residencia',
          'Ciudad Residencia',
          'Ocupación',
          'Email',
          'Teléfono',
          'Cantidad Reservas',
          'Fecha Registro',
          'Última Actualización'
        ]
      ]

      filteredHuespedes.forEach(huesped => {
        huespedesData.push([
          huesped.id?.toString() || '',
          huesped.nombres || '',
          huesped.primer_apellido || '',
          huesped.segundo_apellido || '',
          huesped.tipo_documento || '',
          huesped.numero_documento || '',
                     formatearFechaLocal(huesped.fecha_nacimiento),
           calcularEdad(huesped.fecha_nacimiento).toString(),
           huesped.genero || '',
          huesped.nacionalidad || '',
          huesped.pais_residencia || '',
          huesped.ciudad_residencia || '',
          huesped.ocupacion || '',
                     huesped.correo || 'Sin email',
           huesped.telefono || 'Sin teléfono',
           (huesped.reservas ? huesped.reservas.length : 0).toString(),
          formatearFechaLocal(huesped.createdAt),
          formatearFechaLocal(huesped.updatedAt)
        ])
      })

      const wsHuespedes = XLSX.utils.aoa_to_sheet(huespedesData)
      XLSX.utils.book_append_sheet(workbook, wsHuespedes, 'Huéspedes')

      // Hoja 3: Estadísticas por Tipo de Documento
      const tiposDocumento = filteredHuespedes.reduce((acc, huesped) => {
        const tipo = huesped.tipo_documento || 'Sin especificar'
        acc[tipo] = (acc[tipo] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const tiposDocData = [
        ['ESTADÍSTICAS POR TIPO DE DOCUMENTO'],
        [''],
        ['Tipo de Documento', 'Cantidad', 'Porcentaje']
      ]

      Object.entries(tiposDocumento)
        .sort(([,a], [,b]) => b - a)
        .forEach(([tipo, cantidad]) => {
          const porcentaje = filteredHuespedes.length > 0 ? ((cantidad / filteredHuespedes.length) * 100).toFixed(1) : '0'
          tiposDocData.push([tipo, cantidad.toString(), porcentaje + '%'])
        })

      const wsTiposDoc = XLSX.utils.aoa_to_sheet(tiposDocData)
      XLSX.utils.book_append_sheet(workbook, wsTiposDoc, 'Por Tipo Documento')

      // Hoja 4: Huéspedes por País
      const huespedePorPais = filteredHuespedes.reduce((acc, huesped) => {
        const pais = huesped.pais_residencia || 'No especificado'
        acc[pais] = (acc[pais] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const paiseData = [
        ['HUÉSPEDES POR PAÍS DE RESIDENCIA'],
        [''],
        ['País', 'Cantidad', 'Porcentaje']
      ]

      Object.entries(huespedePorPais)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20) // Top 20 países
        .forEach(([pais, cantidad]) => {
          const porcentaje = filteredHuespedes.length > 0 ? ((cantidad / filteredHuespedes.length) * 100).toFixed(1) : '0'
          paiseData.push([pais, cantidad.toString(), porcentaje + '%'])
        })

      const wsPaises = XLSX.utils.aoa_to_sheet(paiseData)
      XLSX.utils.book_append_sheet(workbook, wsPaises, 'Por País')

      // Hoja 5: Huéspedes con Más Reservas
      const huespedesConReservasDetalle = filteredHuespedes
        .filter(h => h.reservas && h.reservas.length > 0)
        .sort((a, b) => (b.reservas?.length || 0) - (a.reservas?.length || 0))

      const topReservasData = [
        ['TOP HUÉSPEDES POR CANTIDAD DE RESERVAS'],
        [''],
        ['Posición', 'Nombres', 'Apellidos', 'Documento', 'Email', 'Teléfono', 'Cantidad Reservas', 'País']
      ]

      huespedesConReservasDetalle.slice(0, 50).forEach((huesped, index) => {
        topReservasData.push([
          (index + 1).toString(),
          huesped.nombres || '',
          `${huesped.primer_apellido} ${huesped.segundo_apellido || ''}`.trim(),
          huesped.numero_documento || '',
          huesped.correo || 'Sin email',
          huesped.telefono || 'Sin teléfono',
          (huesped.reservas?.length || 0).toString(),
          huesped.pais_residencia || ''
        ])
      })

      const wsTopReservas = XLSX.utils.aoa_to_sheet(topReservasData)
      XLSX.utils.book_append_sheet(workbook, wsTopReservas, 'Top Reservas')

      // Hoja 6: Análisis de Edades
      const edades = filteredHuespedes
        .filter(h => h.fecha_nacimiento)
        .map(h => calcularEdad(h.fecha_nacimiento))
        .filter(edad => edad > 0)

      const rangoEdades = {
        '18-25': edades.filter(e => e >= 18 && e <= 25).length,
        '26-35': edades.filter(e => e >= 26 && e <= 35).length,
        '36-45': edades.filter(e => e >= 36 && e <= 45).length,
        '46-55': edades.filter(e => e >= 46 && e <= 55).length,
        '56-65': edades.filter(e => e >= 56 && e <= 65).length,
        '66+': edades.filter(e => e > 65).length
      }

      const edadPromedio = edades.length > 0 ? (edades.reduce((sum, edad) => sum + edad, 0) / edades.length).toFixed(1) : '0'

      const edadesData = [
        ['ANÁLISIS DE EDADES'],
        [''],
        ['Estadísticas Generales'],
        ['Total con Fecha de Nacimiento:', edades.length],
        ['Edad Promedio:', edadPromedio + ' años'],
        ['Edad Mínima:', edades.length > 0 ? Math.min(...edades) + ' años' : 'N/A'],
        ['Edad Máxima:', edades.length > 0 ? Math.max(...edades) + ' años' : 'N/A'],
        [''],
        ['Distribución por Rangos'],
        ['Rango de Edad', 'Cantidad', 'Porcentaje']
      ]

      Object.entries(rangoEdades).forEach(([rango, cantidad]) => {
        const porcentaje = edades.length > 0 ? ((cantidad / edades.length) * 100).toFixed(1) : '0'
        edadesData.push([rango, cantidad.toString(), porcentaje + '%'])
      })

      const wsEdades = XLSX.utils.aoa_to_sheet(edadesData)
      XLSX.utils.book_append_sheet(workbook, wsEdades, 'Análisis Edades')

      // Configurar estilos para las hojas
      const sheets = ['Resumen', 'Huéspedes', 'Por Tipo Documento', 'Por País', 'Top Reservas', 'Análisis Edades']
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
      const fechaActual = new Date().toLocaleDateString('es-ES').replace(/\//g, '-')
      const filtroTexto = searchTerm ? `_Filtrado_${searchTerm.replace(/[^a-zA-Z0-9]/g, '_')}` : ''
      const tipoDocTexto = tipoDocFilter !== 'all' ? `_${tipoDocFilter}` : ''
      const nombreArchivo = `Huespedes_Hotel${filtroTexto}${tipoDocTexto}_${fechaActual}.xlsx`

      // Escribir y descargar el archivo
      XLSX.writeFile(workbook, nombreArchivo)

    } catch (error) {
      console.error('Error al exportar a Excel:', error)
      alert('Error al generar el archivo Excel. Por favor, intenta nuevamente.')
    } finally {
      setExporting(false)
    }
  }

  const isDisabled = !huespedes || huespedes.length === 0 || exporting

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