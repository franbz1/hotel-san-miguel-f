'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AcompanianteForm } from './AcompanianteForm';
import { huespedSecundarioSchema } from '@/lib/formulario/schemas/RegistroFormularioDto.schema';
import { TipoDocumentoHuespedSecundario } from '@/Types/enums/tipoDocumentoHuespedSecundario';
import { Genero } from '@/Types/enums/generos';
import { toast } from 'sonner';
import { z } from 'zod';
import { Plus, Edit, Trash2, Users, User } from 'lucide-react';

type HuespedSecundarioFormData = z.infer<typeof huespedSecundarioSchema>;

interface GestorAcompaniantesProps {
  /** Lista inicial de acompañantes */
  initialAcompaniantes?: HuespedSecundarioFormData[];
  /** Callback cuando cambia la lista de acompañantes */
  onAcompaniantesChange?: (acompaniantes: HuespedSecundarioFormData[]) => void;
  /** Componente deshabilitado */
  disabled?: boolean;
}

export const GestorAcompaniantes = ({
  initialAcompaniantes = [],
  onAcompaniantesChange,
  disabled = false
}: GestorAcompaniantesProps) => {
  // Estado local de acompañantes
  const [acompaniantes, setAcompaniantes] = useState<HuespedSecundarioFormData[]>(initialAcompaniantes);
  
  // Estado del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Función para notificar cambios al componente padre
  const notifyChange = (newAcompaniantes: HuespedSecundarioFormData[]) => {
    setAcompaniantes(newAcompaniantes);
    onAcompaniantesChange?.(newAcompaniantes);
  };

  // Manejar agregar nuevo acompañante
  const handleAddAcompaniante = () => {
    setEditingIndex(null);
    setIsEditing(false);
    setShowForm(true);
  };

  // Manejar editar acompañante
  const handleEditAcompaniante = (index: number) => {
    setEditingIndex(index);
    setIsEditing(true);
    setShowForm(true);
  };

  // Manejar eliminar acompañante
  const handleDeleteAcompaniante = (index: number) => {
    const acompaniante = acompaniantes[index];
    const newAcompaniantes = acompaniantes.filter((_, i) => i !== index);
    notifyChange(newAcompaniantes);
    
    toast.success(`Acompañante ${acompaniante.nombres} ${acompaniante.primer_apellido} eliminado`);
  };

  // Manejar guardar acompañante (crear o actualizar)
  const handleSaveAcompaniante = (data: HuespedSecundarioFormData) => {
    let newAcompaniantes: HuespedSecundarioFormData[];

    if (isEditing && editingIndex !== null) {
      // Actualizar acompañante existente
      newAcompaniantes = acompaniantes.map((acompaniante, index) => 
        index === editingIndex ? data : acompaniante
      );
      toast.success('Acompañante actualizado correctamente');
    } else {
      // Agregar nuevo acompañante
      newAcompaniantes = [...acompaniantes, data];
      toast.success('Acompañante agregado correctamente');
    }

    notifyChange(newAcompaniantes);
    handleCancelForm();
  };

  // Manejar cancelar formulario
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setIsEditing(false);
  };

  // Formatear tipo de documento para mostrar
  const formatTipoDocumento = (tipo: TipoDocumentoHuespedSecundario) => {
    const labels = {
      [TipoDocumentoHuespedSecundario.CC]: 'CC',
      [TipoDocumentoHuespedSecundario.TI]: 'TI',
      [TipoDocumentoHuespedSecundario.PASAPORTE]: 'Pasaporte',
      [TipoDocumentoHuespedSecundario.CE]: 'CE',
      [TipoDocumentoHuespedSecundario.REGISTRO_CIVIL]: 'RC',
      [TipoDocumentoHuespedSecundario.PEP]: 'PEP',
      [TipoDocumentoHuespedSecundario.DNI]: 'DNI'
    };
    return labels[tipo] || tipo;
  };

  // Formatear género para mostrar
  const formatGenero = (genero: Genero) => {
    const labels = {
      [Genero.MASCULINO]: 'M',
      [Genero.FEMENINO]: 'F',
      [Genero.OTRO]: 'Otro'
    };
    return labels[genero] || genero;
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Acompañantes</h3>
          <Badge variant="secondary" className="ml-2">
            {acompaniantes.length}
          </Badge>
        </div>
        
        {!showForm && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddAcompaniante}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Acompañante
          </Button>
        )}
      </div>

      {/* Información */}
      <div className="text-sm text-muted-foreground">
        Agregue la información de las personas que lo acompañarán durante su estadía.
        Si viaja solo, puede omitir este paso.
      </div>

      {/* Formulario de Acompañante */}
      {showForm && (
        <AcompanianteForm
          mode={isEditing ? 'edit' : 'create'}
          title={isEditing ? 'Editar Acompañante' : 'Agregar Acompañante'}
          initialData={isEditing && editingIndex !== null ? acompaniantes[editingIndex] : undefined}
          onSave={handleSaveAcompaniante}
          onCancel={handleCancelForm}
        />
      )}

      {/* Lista de Acompañantes */}
      <div className="space-y-4">
        {acompaniantes.length === 0 ? (
          // Estado vacío
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No hay acompañantes registrados
              </h4>
                             <p className="text-sm text-gray-600 text-center mb-4">
                 Haga clic en &quot;Agregar Acompañante&quot; para registrar a las personas que lo acompañan.
               </p>
              {!showForm && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddAcompaniante}
                  disabled={disabled}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Primer Acompañante
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          // Lista de acompañantes
          acompaniantes.map((acompaniante, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {acompaniante.nombres} {acompaniante.primer_apellido}
                        {acompaniante.segundo_apellido && ` ${acompaniante.segundo_apellido}`}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {formatTipoDocumento(acompaniante.tipo_documento)} {acompaniante.numero_documento}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatGenero(acompaniante.genero)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAcompaniante(index)}
                      disabled={disabled || showForm}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAcompaniante(index)}
                      disabled={disabled || showForm}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Nacionalidad:</span>
                    <p className="text-gray-900">{acompaniante.nacionalidad}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Ocupación:</span>
                    <p className="text-gray-900">{acompaniante.ocupacion}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Fecha de Nacimiento:</span>
                    <p className="text-gray-900">
                      {new Date(acompaniante.fecha_nacimiento).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Residencia:</span>
                    <p className="text-gray-900">
                      {acompaniante.ciudad_residencia}, {acompaniante.pais_residencia}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Procedencia:</span>
                    <p className="text-gray-900">
                      {acompaniante.ciudad_procedencia}, {acompaniante.pais_procedencia}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Destino:</span>
                    <p className="text-gray-900">
                      {acompaniante.ciudad_destino}, {acompaniante.pais_destino}
                    </p>
                  </div>
                  
                  {/* Información de contacto (si existe) */}
                  {(acompaniante.telefono || acompaniante.correo) && (
                    <>
                      {acompaniante.telefono && (
                        <div>
                          <span className="font-medium text-gray-600">Teléfono:</span>
                          <p className="text-gray-900">{acompaniante.telefono}</p>
                        </div>
                      )}
                      {acompaniante.correo && (
                        <div>
                          <span className="font-medium text-gray-600">Correo:</span>
                          <p className="text-gray-900">{acompaniante.correo}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Información adicional */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Información importante:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Toda la información es obligatoria excepto el teléfono y correo electrónico</li>
          <li>• Puede editar o eliminar acompañantes en cualquier momento</li>
          <li>• Los datos se validarán automáticamente antes de continuar</li>
        </ul>
      </div>
    </div>
  );
}; 