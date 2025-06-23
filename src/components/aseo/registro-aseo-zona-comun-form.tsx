"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRegistroAseoZonaComun } from "@/hooks/aseo";
import { CreateRegistroAseoZonaComunDto } from "@/Types/aseo/RegistroAseoZonaComun";
import { createRegistroAseoZonaComunDtoSchema } from "@/lib/aseo/schemas";
import { TiposAseo } from "@/Types/aseo/tiposAseoEnum";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircle, RotateCcw, ArrowLeft, Building } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface RegistroAseoZonaComunFormProps {
  zonaComunId: number;
  usuarioId: number;
  usuarioNombre: string;
  nombreZonaComun: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreateRegistroAseoZonaComunDto>;
}

export function RegistroAseoZonaComunForm({ 
  zonaComunId,
  usuarioId,
  usuarioNombre,
  nombreZonaComun,
  onSuccess, 
  onCancel, 
  defaultValues 
}: RegistroAseoZonaComunFormProps) {
  const {
    createRegistro,
    isCreating,
    isError,
    error,
    isSuccess,
    reset: resetMutation,
    createdRegistro,
  } = useCreateRegistroAseoZonaComun();

  // Configuración de React Hook Form con Zod
  const form = useForm<CreateRegistroAseoZonaComunDto>({
    resolver: zodResolver(createRegistroAseoZonaComunDtoSchema),
    defaultValues: {
      usuarioId,
      zonaComunId,
      fecha_registro: new Date().toISOString(),
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
    createRegistro(data);
  });

  // Manejar reset del formulario
  const handleReset = () => {
    resetForm();
    resetMutation();
  };

  // Efectos para notificaciones
  useEffect(() => {
    if (isSuccess && createdRegistro) {
      toast.success("Registro de aseo de zona común creado exitosamente");
      handleReset();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isSuccess, createdRegistro, onSuccess]);

  useEffect(() => {
    if (isError && error) {
      toast.error(error);
    }
  }, [isError, error]);

  // Formatear fecha para mostrar localmente
  const utcToLocal = (utcString: string): string => {
    const date = new Date(utcString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  // Convertir fecha local a UTC
  const localToUtc = (localString: string): string => {
    const localDate = new Date(localString);
    return localDate.toISOString();
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            <div>
              <CardTitle>Nuevo Registro de Aseo - {nombreZonaComun}</CardTitle>
              <CardDescription>
                Completa la información del registro de aseo realizado por el usuario {usuarioNombre}
              </CardDescription>
            </div>
          </div>
          <Link href="/aseo/zonas-comunes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
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
              <Label>Zona Común</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-sm font-medium">Zona: {nombreZonaComun}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_registro">Fecha y Hora *</Label>
              <Controller
                name="fecha_registro"
                control={control}
                render={({ field }) => (
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
                )}
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
            <div className="grid grid-cols-2 gap-4">
              {[TiposAseo.LIMPIEZA, TiposAseo.DESINFECCION].map((tipo) => (
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