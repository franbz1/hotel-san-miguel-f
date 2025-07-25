'use client'

import { ICity } from 'country-state-city'
import { GestorAcompaniantes } from './GestorAcompaniantes'
import { useFormContext } from 'react-hook-form'
import { HuespedSecundarioDto } from '@/lib/formulario/schemas/RegistroFormularioDto.schema'
import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

// Debe permitir crud de acompañantes con el componente gestor de acompañantes
// Debe preguntar si viaja con acompañantes o solo (si lo marca como verdadero renderiza gestor de acompañantes)
// Debe recibir los datos de locacion de procedencia, nacionalidad y residencia del huesped principal y pasarlos al gestor de acompañantes
// Debe calcular el numero de acompañantes y actualizar el campo numero_acompaniantes
export const PasoAcompaniantes = ({
  procedenciaLocation,
  residenciaLocation,
  nacionalidad,
  destinoLocation,
}: {
  procedenciaLocation: ICity | null
  residenciaLocation: ICity | null
  nacionalidad: string
  destinoLocation: ICity | null
}) => {
  const [viajaConAcompaniantes, setViajaConAcompaniantes] = useState(false)

  const {
    watch,
    setValue,
  } = useFormContext()

  const initialAcompaniantes = watch('huespedes_secundarios') || []

  // Inicializar el estado del checkbox basado en si ya hay acompañantes
  useEffect(() => {
    if (initialAcompaniantes.length > 0) {
      setViajaConAcompaniantes(true)
    }
  }, [initialAcompaniantes.length])

  // Asegurar que si no hay acompañantes, el número de acompañantes sea 0
  useEffect(() => {
    if (initialAcompaniantes.length === 0) {
      setValue('numero_acompaniantes', 0)
    }
  }, [initialAcompaniantes.length, setValue])

  const handleAcompaniantesChange = (acompaniantes: HuespedSecundarioDto[]) => {
    setValue('huespedes_secundarios', acompaniantes)
    // Calcular y actualizar el número de acompañantes
    setValue('numero_acompaniantes', acompaniantes.length)
  }

  const handleViajaConAcompaniantesChange = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === 'indeterminate' ? false : checked
    setViajaConAcompaniantes(isChecked)
    
    // Si se desmarca, limpiar los acompañantes
    if (!isChecked) {
      setValue('huespedes_secundarios', [])
      setValue('numero_acompaniantes', 0)
    }
  }

  const TooltipWrapper = ({
    children,
    tooltip,
  }: {
    children: React.ReactNode
    tooltip: string
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='flex items-center gap-1'>
            {children}
            <InfoIcon className='h-4 w-4 text-muted-foreground hover:text-primary cursor-help' />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='max-w-xs'>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className='space-y-8 max-w-4xl mx-auto'>
      {/* Información de Acompañantes */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold text-primary flex items-center gap-2'>
            👥 Información de Acompañantes
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Agregue la información de las personas que lo acompañarán durante su
              estadía. Si viaja solo, puede omitir este paso.
            </p>
            
            <div className='flex items-center space-x-3 p-4 border rounded-lg bg-muted/50'>
              <Checkbox
                id='viaja-con-acompaniantes'
                checked={viajaConAcompaniantes}
                onCheckedChange={handleViajaConAcompaniantesChange}
              />
              <TooltipWrapper
                tooltip='Marque esta opción si viaja con otras personas'
              >
                <label 
                  htmlFor='viaja-con-acompaniantes'
                  className='text-sm font-medium cursor-pointer'
                >
                  Viaja con acompañantes
                </label>
              </TooltipWrapper>
            </div>
          </div>

          {/* Gestor de Acompañantes */}
          <div className={`transition-all duration-300 ${
            viajaConAcompaniantes ? 'opacity-100' : 'opacity-50'
          }`}>
            <GestorAcompaniantes
              nacionalidad={nacionalidad}
              procedenciaLocation={procedenciaLocation}
              residenciaLocation={residenciaLocation}
              destinoLocation={destinoLocation}
              initialAcompaniantes={initialAcompaniantes}
              onAcompaniantesChange={handleAcompaniantesChange}
              disabled={!viajaConAcompaniantes}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
