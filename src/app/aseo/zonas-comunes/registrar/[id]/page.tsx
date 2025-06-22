'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RegistroAseoZonaComunForm } from '@/components/aseo/registro-aseo-zona-comun-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';

export default function RegistrarAseoZonaComunPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [zonaComunId, setZonaComunId] = useState<number | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [usuarioNombre, setUsuarioNombre] = useState<string | null>(null);
  const [nombreZonaComun, setNombreZonaComun] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const zonaComunIdParam = params?.id as string;
    const usuarioIdParam = searchParams.get('usuarioId');
    const usuarioNombreParam = searchParams.get('usuarioNombre');
    const nombreZonaComunParam = searchParams.get('nombreZonaComun');

    if (!zonaComunIdParam || !usuarioIdParam) {
      setError('Faltan parámetros requeridos: ID de zona común y usuarioId');
      setIsLoading(false);
      return;
    }

    const zonaComunIdNumber = parseInt(zonaComunIdParam);
    const usuarioIdNumber = parseInt(usuarioIdParam);
    const usuarioNombre = usuarioNombreParam;
    const nombreZonaComun = nombreZonaComunParam;

    if (isNaN(zonaComunIdNumber) || isNaN(usuarioIdNumber)) {
      setError('Los parámetros ID de zona común y usuarioId deben ser números válidos');
      setIsLoading(false);
      return;
    }

    if (zonaComunIdNumber <= 0 || usuarioIdNumber <= 0) {
      setError('Los parámetros ID de zona común y usuarioId deben ser mayores a 0');
      setIsLoading(false);
      return;
    }

    setZonaComunId(zonaComunIdNumber);
    setUsuarioId(usuarioIdNumber);
    setUsuarioNombre(usuarioNombre);
    setNombreZonaComun(nombreZonaComun);
    setError(null);
    setIsLoading(false);
  }, [params, searchParams]);

  const handleSuccess = () => {
    // Redirigir de vuelta a la página de zonas comunes después del éxito
    router.push('/aseo/zonas-comunes');
  };

  const handleCancel = () => {
    // Redirigir de vuelta a la página de zonas comunes si cancela
    router.push('/aseo/zonas-comunes');
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

  if (error || zonaComunId === null || usuarioId === null || usuarioNombre === null || nombreZonaComun === null) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        {/* Header con navegación */}
        <div className="flex items-center gap-4">
          <Link href="/aseo/zonas-comunes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Zonas Comunes
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Registrar Aseo Zona Común</h1>
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
              <Link href="/aseo/zonas-comunes">
                <Button>
                  Volver a Zonas Comunes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <RegistroAseoZonaComunForm
        zonaComunId={zonaComunId}
        usuarioId={usuarioId}
        usuarioNombre={usuarioNombre}
        nombreZonaComun={nombreZonaComun}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
} 