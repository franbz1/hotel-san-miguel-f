'use client';

import { CheckCircle, XCircle, Loader2, RotateCcw, Mail } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';

interface ConfirmacionProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onGoToStart?: () => void;
}

/**
 * Componente que muestra el estado de confirmación del envío del formulario
 * Maneja los estados: cargando, éxito y error con feedback apropiado
 */
export const Confirmacion = ({ 
  isLoading, 
  isSuccess, 
  isError, 
  error, 
  onRetry,
  onGoToStart 
}: ConfirmacionProps) => {

  // Estado de carga
  if (isLoading) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Enviando formulario...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Por favor espere mientras procesamos su información. 
              Este proceso puede tomar unos segundos.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg max-w-md">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                💡 <strong>Consejo:</strong> No cierre esta ventana hasta que se complete el proceso.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Estado de éxito
  if (isSuccess) {
    return (
      <Card className="mx-auto max-w-2xl border-green-200 dark:border-green-800">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500" />
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">
                ¡Registro Completado!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Su información ha sido enviada exitosamente
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg w-full max-w-md space-y-3">
              <h3 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                ✅ ¿Qué sigue ahora?
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-2 text-left">
                <li>• Su registro ha sido procesado correctamente</li>
                <li>• El hotel ha recibido su información</li>
                <li>• Puede cerrar esta ventana de forma segura</li>
                <li>• Recibirá confirmación por email si proporcionó uno</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onGoToStart}
                variant="outline"
                className="border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg max-w-md">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                📞 Si tiene alguna pregunta, puede contactar al hotel directamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Estado de error
  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return (
      <Card className="mx-auto max-w-2xl border-red-200 dark:border-red-800">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-6">
            <XCircle className="h-20 w-20 text-red-500" />
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-red-700 dark:text-red-400">
                Error en el envío
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No se pudo completar su registro
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg w-full max-w-md">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Detalles del error:
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm bg-red-100 dark:bg-red-900/20 p-2 rounded">
                {errorMessage}
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg w-full max-w-md">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                💡 ¿Qué puede hacer?
              </h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 text-left">
                <li>• Verificar su conexión a internet</li>
                <li>• Intentar enviar el formulario nuevamente</li>
                <li>• Contactar al hotel si el problema persiste</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Button
                onClick={onRetry}
                variant="default"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Intentar de nuevo
              </Button>
              
              <Button
                onClick={onGoToStart}
                variant="outline"
                className="flex-1 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/20"
              >
                Volver al inicio
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg w-full max-w-md">
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-2 font-medium">
                📧 ¿Necesita ayuda adicional?
              </p>
              <a 
                href="mailto:reservas@hotelsanmiguel.com?subject=Error en formulario de registro" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline text-sm flex items-center justify-center gap-1"
              >
                <Mail className="h-4 w-4" />
                reservas@hotelsanmiguel.com
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Estado por defecto (no debería llegar aquí)
  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Preparando confirmación...
        </p>
      </CardContent>
    </Card>
  );
}; 