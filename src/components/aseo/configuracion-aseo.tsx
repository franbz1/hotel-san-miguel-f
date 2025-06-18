"use client";

import { useState, useEffect } from "react";
import { useConfiguracionAseoManager } from "@/hooks/aseo";
import { UpdateConfiguracionAseoDto } from "@/Types/aseo/ConfiguracionAseo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Clock, Bell, RotateCcw, Brush, Shield, Beaker, Bed, Bath, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function ConfiguracionAseoComponent() {
  const {
    configuracion,
    isLoading,
    isError,
    error,
    updateConfiguracion,
    isUpdating,
    isSuccess,
    updateError,
    reset,
    refetch
  } = useConfiguracionAseoManager();

  const [formData, setFormData] = useState<UpdateConfiguracionAseoDto>({
    hora_limite_aseo: "",
    hora_proceso_nocturno_utc: "",
    frecuencia_rotacion_colchones: 180,
    dias_aviso_rotacion_colchones: 5,
    habilitar_notificaciones: false,
    email_notificaciones: "",
    elementos_aseo_default: [],
    elementos_proteccion_default: [],
    productos_quimicos_default: [],
    areas_intervenir_habitacion_default: [],
    areas_intervenir_banio_default: [],
    procedimiento_aseo_habitacion_default: "",
    procedimiento_desinfeccion_habitacion_default: "",
    procedimiento_rotacion_colchones_default: "",
    procedimiento_limieza_zona_comun_default: "",
    procedimiento_desinfeccion_zona_comun_default: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Estados para nuevos elementos de arrays
  const [newElementoAseo, setNewElementoAseo] = useState("");
  const [newElementoProteccion, setNewElementoProteccion] = useState("");
  const [newProductoQuimico, setNewProductoQuimico] = useState("");
  const [newAreaHabitacion, setNewAreaHabitacion] = useState("");
  const [newAreaBanio, setNewAreaBanio] = useState("");

  // Cargar datos iniciales cuando se obtiene la configuración
  useEffect(() => {
    if (configuracion) {
      const newFormData: UpdateConfiguracionAseoDto = {
        hora_limite_aseo: configuracion.hora_limite_aseo || "",
        hora_proceso_nocturno_utc: configuracion.hora_proceso_nocturno_utc || "",
        frecuencia_rotacion_colchones: configuracion.frecuencia_rotacion_colchones || 180,
        dias_aviso_rotacion_colchones: configuracion.dias_aviso_rotacion_colchones || 5,
        habilitar_notificaciones: configuracion.habilitar_notificaciones || false,
        email_notificaciones: configuracion.email_notificaciones || "",
        elementos_aseo_default: configuracion.elementos_aseo_default || [],
        elementos_proteccion_default: configuracion.elementos_proteccion_default || [],
        productos_quimicos_default: configuracion.productos_quimicos_default || [],
        areas_intervenir_habitacion_default: configuracion.areas_intervenir_habitacion_default || [],
        areas_intervenir_banio_default: configuracion.areas_intervenir_banio_default || [],
        procedimiento_aseo_habitacion_default: configuracion.procedimiento_aseo_habitacion_default || "",
        procedimiento_desinfeccion_habitacion_default: configuracion.procedimiento_desinfeccion_habitacion_default || "",
        procedimiento_rotacion_colchones_default: configuracion.procedimiento_rotacion_colchones_default || "",
        procedimiento_limieza_zona_comun_default: configuracion.procedimiento_limieza_zona_comun_default || "",
        procedimiento_desinfeccion_zona_comun_default: configuracion.procedimiento_desinfeccion_zona_comun_default || "",
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [configuracion]);

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof UpdateConfiguracionAseoDto, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Agregar elemento a array
  const addElementToArray = (field: keyof UpdateConfiguracionAseoDto, newElement: string, setter: (value: string) => void) => {
    if (!newElement.trim()) return;
    
    const currentArray = (formData[field] as string[]) || [];
    if (currentArray.includes(newElement.trim())) {
      toast.error("Este elemento ya existe en la lista");
      return;
    }
    
    if (currentArray.length >= 50) {
      toast.error("No se pueden agregar más de 50 elementos");
      return;
    }

    const updatedArray = [...currentArray, newElement.trim()];
    handleInputChange(field, updatedArray);
    setter("");
  };

  // Remover elemento del array
  const removeElementFromArray = (field: keyof UpdateConfiguracionAseoDto, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    const updatedArray = currentArray.filter((_, i) => i !== index);
    handleInputChange(field, updatedArray);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      toast.info("No hay cambios para guardar");
      return;
    }

    updateConfiguracion(formData);
  };

  // Reiniciar formulario
  const handleReset = () => {
    if (configuracion) {
      setFormData({
        hora_limite_aseo: configuracion.hora_limite_aseo || "",
        hora_proceso_nocturno_utc: configuracion.hora_proceso_nocturno_utc || "",
        frecuencia_rotacion_colchones: configuracion.frecuencia_rotacion_colchones || 180,
        dias_aviso_rotacion_colchones: configuracion.dias_aviso_rotacion_colchones || 5,
        habilitar_notificaciones: configuracion.habilitar_notificaciones || false,
        email_notificaciones: configuracion.email_notificaciones || "",
        elementos_aseo_default: configuracion.elementos_aseo_default || [],
        elementos_proteccion_default: configuracion.elementos_proteccion_default || [],
        productos_quimicos_default: configuracion.productos_quimicos_default || [],
        areas_intervenir_habitacion_default: configuracion.areas_intervenir_habitacion_default || [],
        areas_intervenir_banio_default: configuracion.areas_intervenir_banio_default || [],
        procedimiento_aseo_habitacion_default: configuracion.procedimiento_aseo_habitacion_default || "",
        procedimiento_desinfeccion_habitacion_default: configuracion.procedimiento_desinfeccion_habitacion_default || "",
        procedimiento_rotacion_colchones_default: configuracion.procedimiento_rotacion_colchones_default || "",
        procedimiento_limieza_zona_comun_default: configuracion.procedimiento_limieza_zona_comun_default || "",
        procedimiento_desinfeccion_zona_comun_default: configuracion.procedimiento_desinfeccion_zona_comun_default || "",
      });
      setHasChanges(false);
      reset();
    }
  };

  // Manejo de notificaciones con Sonner
  useEffect(() => {
    if (isSuccess) {
      toast.success("Configuración actualizada exitosamente");
      setHasChanges(false);
      // Refrescar datos después de 2 segundos
      setTimeout(() => {
        refetch();
        reset();
      }, 2000);
    }
  }, [isSuccess, refetch, reset]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    }
  }, [updateError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner className="w-8 h-8" />
        <span className="ml-2 text-gray-600">Cargando configuración...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Error al cargar la configuración'}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            className="ml-2"
          >
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Componente para manejar arrays de elementos
  const ArrayFieldComponent = ({ 
    title, 
    field, 
    items, 
    newValue, 
    setNewValue, 
    placeholder,
    icon: Icon 
  }: {
    title: string;
    field: keyof UpdateConfiguracionAseoDto;
    items: string[];
    newValue: string;
    setNewValue: (value: string) => void;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Configura los elementos por defecto para {title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addElementToArray(field, newValue, setNewValue);
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => addElementToArray(field, newValue, setNewValue)}
            disabled={!newValue.trim()}
          >
            Agregar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <span className="text-sm truncate">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeElementFromArray(field, index)}
                className="h-6 w-6 p-0 hover:bg-red-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        {items.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No hay elementos configurados
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuración de Horarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Configuración de Horarios
            </CardTitle>
            <CardDescription>
              Define los horarios límite y procesos automáticos del sistema de aseo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_limite_aseo">Hora límite de aseo</Label>
                <Input
                  id="hora_limite_aseo"
                  type="time"
                  value={formData.hora_limite_aseo || ""}
                  onChange={(e) => handleInputChange('hora_limite_aseo', e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Hora límite para completar las tareas de aseo del día
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_proceso_nocturno">Hora de proceso nocturno (UTC)</Label>
                <Input
                  id="hora_proceso_nocturno"
                  type="time"
                  value={formData.hora_proceso_nocturno_utc || ""}
                  onChange={(e) => handleInputChange('hora_proceso_nocturno_utc', e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Hora en que se ejecutan los procesos automáticos nocturnos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Rotación de Colchones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Rotación de Colchones
            </CardTitle>
            <CardDescription>
              Establece la frecuencia y avisos para la rotación de colchones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frecuencia_rotacion">
                  Frecuencia de rotación (días)
                </Label>
                <Input
                  id="frecuencia_rotacion"
                  type="number"
                  min="30"
                  max="365"
                  value={formData.frecuencia_rotacion_colchones || 180}
                  onChange={(e) => handleInputChange('frecuencia_rotacion_colchones', parseInt(e.target.value) || 180)}
                  className="w-full"
                  placeholder="180"
                />
                <p className="text-xs text-gray-500">
                  Cada cuántos días se debe rotar un colchón
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dias_aviso">
                  Días de aviso previo
                </Label>
                <Input
                  id="dias_aviso"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.dias_aviso_rotacion_colchones || 5}
                  onChange={(e) => handleInputChange('dias_aviso_rotacion_colchones', parseInt(e.target.value) || 5)}
                  className="w-full"
                  placeholder="5"
                />
                <p className="text-xs text-gray-500">
                  Con cuántos días de anticipación avisar sobre la rotación
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura el sistema de notificaciones del módulo de aseo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="habilitar_notificaciones"
                checked={formData.habilitar_notificaciones || false}
                onCheckedChange={(checked) => handleInputChange('habilitar_notificaciones', checked as boolean)}
              />
              <Label htmlFor="habilitar_notificaciones">
                Habilitar notificaciones por email
              </Label>
            </div>

            {formData.habilitar_notificaciones && (
              <div className="space-y-2">
                <Label htmlFor="email_notificaciones">
                  Email para notificaciones
                </Label>
                <Input
                  id="email_notificaciones"
                  type="email"
                  value={formData.email_notificaciones || ""}
                  onChange={(e) => handleInputChange('email_notificaciones', e.target.value)}
                  className="w-full"
                  placeholder="admin@hotel.com"
                />
                <p className="text-xs text-gray-500">
                  Dirección de email donde se enviarán las notificaciones del sistema
                </p>
              </div>
            )}
          </CardContent>
        </Card>

                 {/* Elementos de Aseo */}
         <ArrayFieldComponent
           title="Elementos de Aseo"
           field="elementos_aseo_default"
           items={formData.elementos_aseo_default || []}
           newValue={newElementoAseo}
           setNewValue={setNewElementoAseo}
           placeholder="Ej: Escoba, Trapeador, Aspiradora..."
           icon={Brush}
         />

        {/* Elementos de Protección */}
        <ArrayFieldComponent
          title="Elementos de Protección"
          field="elementos_proteccion_default"
          items={formData.elementos_proteccion_default || []}
          newValue={newElementoProteccion}
          setNewValue={setNewElementoProteccion}
          placeholder="Ej: Guantes, Mascarilla, Gafas..."
          icon={Shield}
        />

        {/* Productos Químicos */}
        <ArrayFieldComponent
          title="Productos Químicos"
          field="productos_quimicos_default"
          items={formData.productos_quimicos_default || []}
          newValue={newProductoQuimico}
          setNewValue={setNewProductoQuimico}
          placeholder="Ej: Desinfectante, Detergente, Jabón..."
          icon={Beaker}
        />

        {/* Áreas Habitación */}
        <ArrayFieldComponent
          title="Áreas a Intervenir - Habitación"
          field="areas_intervenir_habitacion_default"
          items={formData.areas_intervenir_habitacion_default || []}
          newValue={newAreaHabitacion}
          setNewValue={setNewAreaHabitacion}
          placeholder="Ej: Cama, Escritorio, Armario..."
          icon={Bed}
        />

        {/* Áreas Baño */}
        <ArrayFieldComponent
          title="Áreas a Intervenir - Baño"
          field="areas_intervenir_banio_default"
          items={formData.areas_intervenir_banio_default || []}
          newValue={newAreaBanio}
          setNewValue={setNewAreaBanio}
          placeholder="Ej: Inodoro, Lavamanos, Ducha..."
          icon={Bath}
        />

        {/* Procedimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Procedimientos Estándar
            </CardTitle>
            <CardDescription>
              Define los procedimientos por defecto para las diferentes tareas de aseo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="procedimiento_aseo_habitacion">
                Procedimiento de Aseo de Habitación
              </Label>
              <Textarea
                id="procedimiento_aseo_habitacion"
                value={formData.procedimiento_aseo_habitacion_default || ""}
                onChange={(e) => handleInputChange('procedimiento_aseo_habitacion_default', e.target.value)}
                placeholder="Describe el procedimiento estándar para el aseo de habitaciones..."
                className="min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500">
                Máximo 1000 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedimiento_desinfeccion_habitacion">
                Procedimiento de Desinfección de Habitación
              </Label>
              <Textarea
                id="procedimiento_desinfeccion_habitacion"
                value={formData.procedimiento_desinfeccion_habitacion_default || ""}
                onChange={(e) => handleInputChange('procedimiento_desinfeccion_habitacion_default', e.target.value)}
                placeholder="Describe el procedimiento estándar para la desinfección de habitaciones..."
                className="min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500">
                Máximo 1000 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedimiento_rotacion_colchones">
                Procedimiento de Rotación de Colchones
              </Label>
              <Textarea
                id="procedimiento_rotacion_colchones"
                value={formData.procedimiento_rotacion_colchones_default || ""}
                onChange={(e) => handleInputChange('procedimiento_rotacion_colchones_default', e.target.value)}
                placeholder="Describe el procedimiento estándar para la rotación de colchones..."
                className="min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500">
                Máximo 1000 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedimiento_limpieza_zona_comun">
                Procedimiento de Limpieza de Zona Común
              </Label>
              <Textarea
                id="procedimiento_limpieza_zona_comun"
                value={formData.procedimiento_limieza_zona_comun_default || ""}
                onChange={(e) => handleInputChange('procedimiento_limieza_zona_comun_default', e.target.value)}
                placeholder="Describe el procedimiento estándar para la limpieza de zonas comunes..."
                className="min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500">
                Máximo 1000 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedimiento_desinfeccion_zona_comun">
                Procedimiento de Desinfección de Zona Común
              </Label>
              <Textarea
                id="procedimiento_desinfeccion_zona_comun"
                value={formData.procedimiento_desinfeccion_zona_comun_default || ""}
                onChange={(e) => handleInputChange('procedimiento_desinfeccion_zona_comun_default', e.target.value)}
                placeholder="Describe el procedimiento estándar para la desinfección de zonas comunes..."
                className="min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500">
                Máximo 1000 caracteres
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isUpdating}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!hasChanges || isUpdating}
            className="min-w-[120px]"
          >
            {isUpdating ? (
              <>
                <LoadingSpinner className="w-4 h-4 mr-2" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 