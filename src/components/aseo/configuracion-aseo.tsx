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
import { CheckCircle2, AlertCircle, Clock, Bell, RotateCcw } from "lucide-react";

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
  });

  const [hasChanges, setHasChanges] = useState(false);

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
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [configuracion]);

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof UpdateConfiguracionAseoDto, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) return;

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
      });
      setHasChanges(false);
      reset();
    }
  };

  // Reset automático después del éxito
  useEffect(() => {
    if (isSuccess) {
      setHasChanges(false);
      // Refrescar datos después de 2 segundos
      setTimeout(() => {
        refetch();
        reset();
      }, 2000);
    }
  }, [isSuccess, refetch, reset]);

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

  return (
    <div className="space-y-6">
      {/* Alertas de estado */}
      {isSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configuración actualizada exitosamente
          </AlertDescription>
        </Alert>
      )}

      {updateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{updateError}</AlertDescription>
        </Alert>
      )}

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