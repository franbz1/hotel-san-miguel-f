'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RegistroAseoHabitacionForm } from '@/components/aseo/registro-aseo-habitacion-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';

export default function RegistrarAseoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [habitacionId, setHabitacionId] = useState<number | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [usuarioNombre, setUsuarioNombre] = useState<string | null>(null);
  const [numeroHabitacion, setNumeroHabitacion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const habitacionIdParam = searchParams.get('habitacionId');
    const usuarioIdParam = searchParams.get('usuarioId');
    const usuarioNombreParam = searchParams.get('usuarioNombre');
    const numeroHabitacionParam = searchParams.get('numeroHabitacion');

    if (!habitacionIdParam || !usuarioIdParam) {
      setError('Faltan parámetros requeridos: habitacionId y usuarioId');
      setIsLoading(false);
      return;
    }

    const habitacionIdNumber = parseInt(habitacionIdParam);
    const usuarioIdNumber = parseInt(usuarioIdParam);
    const usuarioNombre = usuarioNombreParam;
    const numeroHabitacion = numeroHabitacionParam;

    if (isNaN(habitacionIdNumber) || isNaN(usuarioIdNumber)) {
      setError('Los parámetros habitacionId y usuarioId deben ser números válidos');
      setIsLoading(false);
      return;
    }

    if (habitacionIdNumber <= 0 || usuarioIdNumber <= 0) {
      setError('Los parámetros habitacionId y usuarioId deben ser mayores a 0');
      setIsLoading(false);
      return;
    }

    setHabitacionId(habitacionIdNumber);
    setUsuarioId(usuarioIdNumber);
    setUsuarioNombre(usuarioNombre);
    setNumeroHabitacion(numeroHabitacion);
    setError(null);
    setIsLoading(false);
  }, [searchParams]);

  const handleSuccess = () => {
    // Redirigir de vuelta a la página de habitaciones después del éxito
    router.push('/aseo/habitaciones');
  };

  const handleCancel = () => {
    // Redirigir de vuelta a la página de habitaciones si cancela
    router.push('/aseo/habitaciones');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
          <span className="ml-2">Cargando formulario...</span>
        </div>
      </div>
    );
  }

  if (error || habitacionId === null || usuarioId === null || usuarioNombre === null || numeroHabitacion === null) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        {/* Header con navegación */}
        <div className="flex items-center gap-4">
          <Link href="/aseo/habitaciones">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Habitaciones
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Registrar Aseo</h1>
            <p className="text-muted-foreground">Error en los parámetros</p>
          </div>
        </div>

        {/* Error */}
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Link href="/aseo/habitaciones">
                <Button>
                  Volver a Habitaciones
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">

      {/* Formulario */}
      <RegistroAseoHabitacionForm
        habitacionId={habitacionId}
        usuarioId={usuarioId}
        usuarioNombre={usuarioNombre}
        numeroHabitacion={numeroHabitacion}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
} 