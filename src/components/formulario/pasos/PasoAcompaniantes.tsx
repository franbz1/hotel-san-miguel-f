'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { GestorAcompaniantes } from './GestorAcompaniantes';
import { useFormularioContext } from '../FormularioWrapper';
import { huespedSecundarioSchema } from '@/lib/formulario/schemas/RegistroFormularioDto.schema';
import { z } from 'zod';

type HuespedSecundarioFormData = z.infer<typeof huespedSecundarioSchema>;

export const PasoAcompaniantes = () => {
  const { setValue, watch } = useFormContext();
  const { stepData, updateStepData } = useFormularioContext();

  // Obtener datos actuales del formulario
  const currentAcompaniantes = watch('huespedes_secundarios') || [];

  // Sincronizar con datos del paso si existen
  const initialAcompaniantes = stepData.acompaniantes?.huespedes_secundarios || currentAcompaniantes;

  // Función para manejar cambios en la lista de acompañantes
  const handleAcompaniantesChange = (acompaniantes: HuespedSecundarioFormData[]) => {
    const numeroAcompaniantes = acompaniantes.length;
    
    // Actualizar campos del formulario principal
    setValue('huespedes_secundarios', acompaniantes);
    setValue('numero_acompaniantes', numeroAcompaniantes);
    
    // Actualizar datos del paso
    updateStepData('acompaniantes', {
      numero_acompaniantes: numeroAcompaniantes,
      huespedes_secundarios: acompaniantes
    });
  };

  // Sincronizar estado inicial si hay datos previos
  useEffect(() => {
    if (initialAcompaniantes.length > 0) {
      const numeroAcompaniantes = initialAcompaniantes.length;
      setValue('huespedes_secundarios', initialAcompaniantes);
      setValue('numero_acompaniantes', numeroAcompaniantes);
    }
  }, [initialAcompaniantes, setValue]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de Acompañantes</h3>
        <p className="text-sm text-muted-foreground">
          Agregue la información de las personas que lo acompañarán durante su estadía.
          Si viaja solo, puede omitir este paso.
        </p>
      </div>

      <GestorAcompaniantes
        initialAcompaniantes={initialAcompaniantes}
        onAcompaniantesChange={handleAcompaniantesChange}
        disabled={false}
      />
    </div>
  );
}; 