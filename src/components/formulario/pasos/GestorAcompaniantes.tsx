'use client'

import { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { HuespedSecundarioDto } from '@/lib/formulario/schemas/RegistroFormularioDto.schema'
import { toast } from 'sonner'
import { ICity } from 'country-state-city'
import { AcompanianteForm } from './AcompanianteForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Edit, Trash2, User, Users } from 'lucide-react'

interface GestorAcompaniantesProps {
  /** Lista inicial de acompañantes */
  initialAcompaniantes?: HuespedSecundarioDto[]
  /** Callback cuando cambia la lista de acompañantes */
  onAcompaniantesChange?: (acompaniantes: HuespedSecundarioDto[]) => void
  /** Ubicacion de procedencia huesped Principal*/
  procedenciaLocation: ICity | null
  /** Ubicacion de residencia huesped Principal*/
  residenciaLocation: ICity | null
  /** Ubicacion de destino huesped Principal*/
  destinoLocation: ICity | null
  /** Nacionalidad huesped Principal*/
  nacionalidad: string
  /** Componente deshabilitado */
  disabled?: boolean
}

// Debe gestionar la logica de creacion, actualizacion y eliminacion de acompañantes
// Debe pasarle el control del contexto del formulario al field array de acompañantes
// Debe permitirle al usuario agregar, editar (actualizar) y eliminar acompañantes del contexto del formulario
// Debe pasarle los datos de procedencia, nacionalidad y residencia del huesped principal al componente AcompanianteForm
export const GestorAcompaniantes = ({
  onAcompaniantesChange,
  disabled = false,
  procedenciaLocation,
  residenciaLocation,
  destinoLocation,
  nacionalidad,
}: GestorAcompaniantesProps) => {
  const { control, watch } = useFormContext()

  const { append, remove, update } = useFieldArray({
    control,
    name: 'huespedes_secundarios',
  })

  // Estados para controlar la UI
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<
    Partial<HuespedSecundarioDto> | undefined
  >(undefined)

  // Observar cambios en la lista para notificar al padre
  const currentAcompaniantes = watch('huespedes_secundarios') || []

  // Notificar cambios al componente padre
  const notifyChange = (acompaniantes: HuespedSecundarioDto[]) => {
    if (onAcompaniantesChange) {
      onAcompaniantesChange(acompaniantes)
    }
  }

  // Handler para guardar acompañante (crear o actualizar)
  const handleSave = (acompaniante: HuespedSecundarioDto) => {
    if (editingIndex !== null) {
      // Actualizar acompañante existente
      update(editingIndex, acompaniante)
      setEditingIndex(null)
      setEditingData(undefined)
      toast.success('Acompañante actualizado exitosamente')
    } else {
      // Agregar nuevo acompañante
      append(acompaniante)
      toast.success('Acompañante agregado exitosamente')
    }

    setShowForm(false)

    // Notificar cambio con la nueva lista
    const updatedList =
      editingIndex !== null
        ? currentAcompaniantes.map(
          (item: HuespedSecundarioDto, index: number) =>
            index === editingIndex ? acompaniante : item
        )
        : [...currentAcompaniantes, acompaniante]

    notifyChange(updatedList)
  }

  // Handler para eliminar acompañante
  const handleDelete = (acompaniante: HuespedSecundarioDto) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este acompañante? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;
    const indexToDelete = currentAcompaniantes.findIndex(
      (item: HuespedSecundarioDto) =>
        item.numero_documento === acompaniante.numero_documento
    );
    if (indexToDelete !== -1) {
      remove(indexToDelete);
      toast.success('Acompañante eliminado exitosamente');
      // Notificar cambio con la nueva lista
      const updatedList = currentAcompaniantes.filter(
        (_: HuespedSecundarioDto, index: number) => index !== indexToDelete
      );
      notifyChange(updatedList);
    }
    // Si estamos editando este elemento, cancelar la edición
    if (editingIndex === indexToDelete) {
      setEditingIndex(null);
      setEditingData(undefined);
      setShowForm(false);
    }
  }

  // Handler para cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false)
    setEditingIndex(null)
    setEditingData(undefined)
  }

  // Handler para iniciar edición
  const handleEdit = (index: number) => {
    const acompaniante = currentAcompaniantes[index] as HuespedSecundarioDto
    setEditingIndex(index)
    setEditingData(acompaniante)
    setShowForm(true)
  }

  // Handler para iniciar creación
  const handleAdd = () => {
    setEditingIndex(null)
    setEditingData(undefined)
    setShowForm(true)
  }

  // Handler para eliminar desde la lista
  const handleDeleteFromList = (index: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este acompañante? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;
    remove(index);
    toast.success('Acompañante eliminado exitosamente');
    // Notificar cambio con la nueva lista
    const updatedList = currentAcompaniantes.filter(
      (_: HuespedSecundarioDto, idx: number) => idx !== index
    );
    notifyChange(updatedList);
    // Si estamos editando este elemento, cancelar la edición
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingData(undefined);
      setShowForm(false);
    }
  }

  if (disabled) {
    return (
      <div className='space-y-4'>
        <div className='text-center py-8 text-muted-foreground'>
          <Users className='h-12 w-12 mx-auto mb-4 opacity-50' />
          <p>
            Marque la opción &quot;Viaja con acompañantes&quot; para gestionar
            acompañantes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>

      {/* Botón para agregar nuevo acompañante */}
      {!showForm && (
        <div className='flex justify-center'>
          <Button
            type='button'
            variant='outline'
            onClick={handleAdd}
            className='w-full max-w-md text-sm sm:text-base'
          >
            <Plus className='h-4 w-4 mr-2' />
            Agregar Acompañante
          </Button>
        </div>
      )}

      {/* Lista de acompañantes existentes */}
      {currentAcompaniantes.length > 0 && (
        <div className='space-y-4'>
          <h4 className='text-sm sm:text-md font-medium text-foreground flex items-center gap-2'>
            <Users className='h-4 w-4' />
            Acompañantes Registrados ({currentAcompaniantes.length})
          </h4>

          <div className='grid gap-4'>
            {currentAcompaniantes.map(
              (acompaniante: HuespedSecundarioDto, index: number) => (
                <Card
                  key={`${acompaniante.numero_documento}-${index}`}
                  className='border-l-4 border-l-primary w-full max-w-full overflow-hidden'
                >
                  <CardContent className='pt-3 sm:pt-4 px-3 sm:px-6'>
                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0 w-full'>
                      <div className='space-y-2 flex-1 min-w-0 max-w-full'>
                        <div className='flex items-center gap-2 w-full'>
                          <User className='h-4 w-4 text-muted-foreground' />
                          <span className='font-medium text-sm sm:text-base truncate flex-1 min-w-0'>
                            {acompaniante.nombres}{' '}
                            {acompaniante.primer_apellido}{' '}
                            {acompaniante.segundo_apellido || ''}
                          </span>
                          <Badge variant='secondary' className='text-xs sm:text-sm flex-shrink-0 ml-2'>
                            {acompaniante.tipo_documento}
                          </Badge>
                        </div>

                        <div className='text-xs sm:text-sm text-muted-foreground space-y-1 break-words'>
                          <p>
                            <span className='font-medium'>Documento:</span>{' '}
                            {acompaniante.numero_documento}
                          </p>
                        </div>
                      </div>

                      <div className='flex gap-2 w-full sm:w-auto sm:ml-4'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => handleEdit(index)}
                          disabled={showForm}
                          className='flex-1 sm:flex-none text-xs sm:text-sm min-w-0'
                        >
                          <Edit className='h-4 w-4' />
                          <span className='ml-1 sm:hidden'>Editar</span>
                        </Button>

                        <Button
                          type='button'
                          variant='destructive'
                          size='sm'
                          onClick={() => handleDeleteFromList(index)}
                          disabled={showForm}
                          className='flex-1 sm:flex-none text-xs sm:text-sm min-w-0'
                        >
                          <Trash2 className='h-4 w-4' />
                          <span className='ml-1 sm:hidden'>Eliminar</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      )}

      {/* Formulario para crear/editar acompañante */}
      {showForm && (
        <div className='mt-4 sm:mt-6'>
          <Separator className='mb-4 sm:mb-6' />
          <AcompanianteForm
            initialData={editingData}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={editingIndex !== null ? handleDelete : undefined}
            procedenciaLocation={procedenciaLocation}
            residenciaLocation={residenciaLocation}
            destinoLocation={destinoLocation}
            nacionalidad={nacionalidad}
            mode={editingIndex !== null ? 'edit' : 'create'}
          />
        </div>
      )}

      {/* Mensaje cuando no hay acompañantes */}
      {currentAcompaniantes.length === 0 && !showForm && (
        <div className='text-center py-6 sm:py-8 text-muted-foreground px-4'>
          <Users className='h-12 w-12 mx-auto mb-4 opacity-50' />
          <p className='text-sm sm:text-base'>No hay acompañantes registrados</p>
          <p className='text-xs sm:text-sm'>
            Haga clic en &quot;Agregar Acompañante&quot; para comenzar
          </p>
        </div>
      )}
    </div>
  )
}
