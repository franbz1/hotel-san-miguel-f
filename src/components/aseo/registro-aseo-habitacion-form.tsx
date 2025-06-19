"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRegistroAseoHabitacion } from "@/hooks/aseo";
import { useConfiguracionAseo } from "@/hooks/aseo/useConfiguracionAseo";
import { CreateRegistroAseoHabitacionDto } from "@/Types/aseo/RegistroAseoHabitacion";
import { createRegistroAseoHabitacionDtoSchema } from "@/lib/aseo/schemas";
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckSquare, RotateCcw, X, Plus } from "lucide-react";
import { toast } from "sonner";

interface RegistroAseoHabitacionFormProps {
  habitacionId: number;
  usuarioId: number;
  usuarioNombre: string;
  numeroHabitacion: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreateRegistroAseoHabitacionDto>;
}

export function RegistroAseoHabitacionForm({ 
  habitacionId,
  usuarioId,
  usuarioNombre,
  numeroHabitacion,
  onSuccess, 
  onCancel, 
  defaultValues 
}: RegistroAseoHabitacionFormProps) {
  const {
    createRegistro,
    isCreating,
    isError,
    error,
    isSuccess,
    reset: resetMutation,
    createdRegistro,
  } = useCreateRegistroAseoHabitacion();

  // Cargar configuración de aseo para valores por defecto
  const {
    configuracion,
    isLoading: isLoadingConfig,
    error: configError
  } = useConfiguracionAseo();

  // Configuración de React Hook Form con Zod
  const form = useForm<CreateRegistroAseoHabitacionDto>({
    resolver: zodResolver(createRegistroAseoHabitacionDtoSchema),
    defaultValues: {
      usuarioId,
      habitacionId,
      fecha_registro: new Date().toISOString(), // Mantener en UTC internamente
      areas_intervenidas: configuracion?.areas_intervenir_habitacion_default || [],
      areas_intervenidas_banio: configuracion?.areas_intervenir_banio_default || [],
      procedimiento_rotacion_colchones: configuracion?.procedimiento_rotacion_colchones_default || "",
      tipos_realizados: [],
      objetos_perdidos: false,
      rastros_de_animales: false,
      observaciones: "",
      ...defaultValues,
    },
    mode: "onChange"
  });

  const { 
    control, 
    handleSubmit, 
    reset: resetForm, 
    setValue, 
    watch, 
    formState: { errors, isDirty, isValid } 
  } = form;

  // Watch para valores del formulario
  const watchedValues = watch();

  // Estados para nuevos elementos de arrays
  const [newAreaHabitacion, setNewAreaHabitacion] = React.useState("");
  const [newAreaBanio, setNewAreaBanio] = React.useState("");
  
  // Estado para controlar notificaciones ya mostradas
  const [configNotificationsShown, setConfigNotificationsShown] = React.useState({
    loading: false,
    success: false,
    error: false
  });

  // Efecto para cargar valores por defecto de la configuración
  useEffect(() => {
    if (configuracion && !isLoadingConfig) {
      // Actualizar valores por defecto cuando se carga la configuración
      if (configuracion.areas_intervenir_habitacion_default && watchedValues.areas_intervenidas.length === 0) {
        setValue('areas_intervenidas', configuracion.areas_intervenir_habitacion_default, { 
          shouldDirty: false 
        });
      }
      
      if (configuracion.areas_intervenir_banio_default && watchedValues.areas_intervenidas_banio.length === 0) {
        setValue('areas_intervenidas_banio', configuracion.areas_intervenir_banio_default, { 
          shouldDirty: false 
        });
      }

      if (configuracion.procedimiento_rotacion_colchones_default && !watchedValues.procedimiento_rotacion_colchones) {
        setValue('procedimiento_rotacion_colchones', configuracion.procedimiento_rotacion_colchones_default, { 
          shouldDirty: false 
        });
      }
    }
  }, [configuracion, isLoadingConfig, setValue, watchedValues]);

  // Función para agregar área a la lista
  const addArea = (type: 'habitacion' | 'banio', value: string) => {
    if (!value.trim()) return;

    const fieldName = type === 'habitacion' ? 'areas_intervenidas' : 'areas_intervenidas_banio';
    const currentAreas = watchedValues[fieldName] || [];

    if (currentAreas.includes(value.trim())) {
      toast.error("Esta área ya está en la lista");
      return;
    }

    setValue(fieldName, [...currentAreas, value.trim()], { 
      shouldDirty: true, 
      shouldValidate: true 
    });

    // Limpiar el input
    if (type === 'habitacion') {
      setNewAreaHabitacion("");
    } else {
      setNewAreaBanio("");
    }
  };

  // Función para remover área de la lista
  const removeArea = (type: 'habitacion' | 'banio', index: number) => {
    const fieldName = type === 'habitacion' ? 'areas_intervenidas' : 'areas_intervenidas_banio';
    const currentAreas = watchedValues[fieldName] || [];
    const updatedAreas = currentAreas.filter((_, i) => i !== index);
    
    setValue(fieldName, updatedAreas, { 
      shouldDirty: true, 
      shouldValidate: true 
    });
  };

  // Función para manejar tipos de aseo
  const handleTipoAseoChange = (tipo: TiposAseo, checked: boolean) => {
    const currentTipos = watchedValues.tipos_realizados || [];
    
    if (checked) {
      setValue('tipos_realizados', [...currentTipos, tipo], { 
        shouldDirty: true, 
        shouldValidate: true 
      });
    } else {
      setValue('tipos_realizados', currentTipos.filter(t => t !== tipo), { 
        shouldDirty: true, 
        shouldValidate: true 
      });
    }
  };

  // Manejar envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    // Asegurar que la fecha se envía en UTC
    const dataToSend = {
      ...data,
      fecha_registro: data.fecha_registro // Ya está en UTC gracias a localToUtc
    };
    
    createRegistro(dataToSend);
  });

  // Manejar reset del formulario
  const handleReset = () => {
    resetForm();
    resetMutation();
    setNewAreaHabitacion("");
    setNewAreaBanio("");
  };

  // Efectos para notificaciones
  useEffect(() => {
    if (isSuccess && createdRegistro) {
      toast.success("Registro de aseo creado exitosamente");
      handleReset();
      onSuccess?.();
    }
  }, [isSuccess, createdRegistro, onSuccess]);

  useEffect(() => {
    if (isError && error) {
      toast.error(error);
    }
  }, [isError, error]);

  // Efectos para notificar estado de configuración
  useEffect(() => {
    if (configError && !configNotificationsShown.error) {
      toast.warning(`No se pudo cargar la configuración predeterminada: ${configError}`);
      setConfigNotificationsShown(prev => ({ ...prev, error: true }));
    }
  }, [configError, configNotificationsShown.error]);

  // Notificar cuando la configuración se carga exitosamente
  useEffect(() => {
    if (configuracion && !isLoadingConfig && !configError && !configNotificationsShown.success) {
      toast.success("Configuración predeterminada cargada exitosamente");
      setConfigNotificationsShown(prev => ({ ...prev, success: true }));
    }
  }, [configuracion, isLoadingConfig, configError, configNotificationsShown.success]);

  // Notificar cuando está cargando la configuración
  useEffect(() => {
    if (isLoadingConfig && !configNotificationsShown.loading) {
      toast.info("Cargando configuración predeterminada...");
      setConfigNotificationsShown(prev => ({ ...prev, loading: true }));
    }
  }, [isLoadingConfig, configNotificationsShown.loading]);

  // Componente para manejar arrays de áreas
  const AreasFieldComponent = ({ 
    title, 
    type, 
    newValue, 
    setNewValue, 
    placeholder 
  }: {
    title: string;
    type: 'habitacion' | 'banio';
    newValue: string;
    setNewValue: (value: string) => void;
    placeholder: string;
  }) => {
    const fieldName = type === 'habitacion' ? 'areas_intervenidas' : 'areas_intervenidas_banio';
    const areas = watchedValues[fieldName] || [];
    const fieldError = errors[fieldName];

    return (
      <div className="space-y-4">
        <Label>{title}</Label>
        
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArea(type, newValue);
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => addArea(type, newValue)}
            disabled={!newValue.trim()}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {fieldError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {fieldError.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {areas.map((area, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <span className="text-sm truncate">{area}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArea(type, index)}
                className="h-6 w-6 p-0 hover:bg-red-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {areas.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No se han agregado áreas
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Nuevo Registro de Aseo - Habitación {numeroHabitacion}
        </CardTitle>
        <CardDescription>
          Completa la información del registro de aseo realizado por el usuario {usuarioNombre}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Usuario</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-sm font-medium">Usuario: {usuarioNombre}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Habitación</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-sm font-medium">Habitación: {numeroHabitacion}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_registro">Fecha y Hora *</Label>
              <Controller
                name="fecha_registro"
                control={control}
                render={({ field }) => {
                  // Función para convertir UTC a datetime-local
                  const utcToLocal = (utcString: string): string => {
                    const date = new Date(utcString);
                    // Ajustar a zona horaria local para mostrar en datetime-local
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                    return localDate.toISOString().slice(0, 16);
                  };

                  // Función para convertir datetime-local a UTC
                  const localToUtc = (localString: string): string => {
                    const localDate = new Date(localString);
                    return localDate.toISOString();
                  };

                  return (
                    <Input
                      id="fecha_registro"
                      type="datetime-local"
                      value={field.value ? utcToLocal(field.value) : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          field.onChange(localToUtc(e.target.value));
                        } else {
                          field.onChange("");
                        }
                      }}
                      className="w-full"
                    />
                  );
                }}
              />
              {errors.fecha_registro && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.fecha_registro.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Tipos de aseo realizados */}
          <div className="space-y-4">
            <Label>Tipos de Aseo Realizados *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.values(TiposAseo).map((tipo) => (
                <div key={tipo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tipo-${tipo}`}
                    checked={watchedValues.tipos_realizados?.includes(tipo) || false}
                    onCheckedChange={(checked) => handleTipoAseoChange(tipo, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`tipo-${tipo}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {tipo.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
            {errors.tipos_realizados && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.tipos_realizados.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Áreas intervenidas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AreasFieldComponent
              title="Áreas Intervenidas - Habitación *"
              type="habitacion"
              newValue={newAreaHabitacion}
              setNewValue={setNewAreaHabitacion}
              placeholder="Ej: Cama, Escritorio, Armario..."
            />

            <AreasFieldComponent
              title="Áreas Intervenidas - Baño *"
              type="banio"
              newValue={newAreaBanio}
              setNewValue={setNewAreaBanio}
              placeholder="Ej: Inodoro, Lavamanos, Ducha..."
            />
          </div>

          {/* Procedimiento de rotación de colchones */}
          {watchedValues.tipos_realizados?.includes(TiposAseo.ROTACION_COLCHONES) && (
            <div className="space-y-2">
              <Label htmlFor="procedimiento_rotacion_colchones">
                Procedimiento de Rotación de Colchones
              </Label>
              <Controller
                name="procedimiento_rotacion_colchones"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="procedimiento_rotacion_colchones"
                    placeholder="Describe el procedimiento de rotación de colchones realizado..."
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                )}
              />
              {errors.procedimiento_rotacion_colchones && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.procedimiento_rotacion_colchones.message}
                  </AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-gray-500">
                Entre 10 y 500 caracteres
              </p>
            </div>
          )}

          {/* Hallazgos */}
          <div className="space-y-4">
            <Label>Hallazgos durante el aseo</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="objetos_perdidos"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="objetos_perdidos"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="objetos_perdidos">
                  Se encontraron objetos perdidos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="rastros_de_animales"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="rastros_de_animales"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="rastros_de_animales">
                  Se encontraron rastros de animales
                </Label>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Controller
              name="observaciones"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="observaciones"
                  placeholder="Observaciones adicionales sobre el aseo realizado..."
                  className="min-h-[100px]"
                  maxLength={1000}
                />
              )}
            />
            {errors.observaciones && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.observaciones.message}
                </AlertDescription>
              </Alert>
            )}
            <p className="text-xs text-gray-500">
              Opcional. Entre 5 y 1000 caracteres si se especifica.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleReset();
                onCancel?.();
              }}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={!isDirty || isCreating}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || !isValid || isCreating}
              className="min-w-[120px]"
            >
              {isCreating ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Guardando...
                </>
              ) : (
                'Crear Registro'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 