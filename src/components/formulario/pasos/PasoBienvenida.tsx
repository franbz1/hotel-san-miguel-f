'use client';
import { LinkFormulario } from "@/Types/link-formulario";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, CreditCardIcon, KeyIcon } from "lucide-react";

export const PasoBienvenida = ({linkFormulario}: {linkFormulario: LinkFormulario}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header de bienvenida - Layout horizontal en pantallas grandes */}
      <div className="lg:flex lg:items-center lg:space-x-8 space-y-6 lg:space-y-0">
        {/* Icono y título */}
        <div className="lg:flex-shrink-0 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4 lg:mb-0">
            <MapPinIcon className="w-8 h-8" />
          </div>
        </div>
        
        {/* Contenido textual */}
        <div className="lg:flex-1 text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            ¡Bienvenido al Hotel San Miguel!
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Estamos emocionados de recibirle. Complete el siguiente formulario para registrar su estadía con nosotros.
          </p>
        </div>
      </div>

      {/* Información de la reserva */}
      <Card className="border-2 border-dashed border-border bg-accent/30">
        <CardContent className="pt-6">
          <div className="text-center lg:text-left mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Detalles de su Reserva
            </h3>
            <p className="text-sm text-muted-foreground">
              Verifique que la información sea correcta
            </p>
          </div>

          {/* Grid responsivo - 3 columnas en pantallas grandes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Habitación */}
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <KeyIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Habitación</p>
                <Badge variant="secondary" className="mt-1 font-semibold">
                  # {linkFormulario.numeroHabitacion}
                </Badge>
              </div>
            </div>

            {/* Costo */}
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Costo Total</p>
                <Badge variant="default" className="mt-1 font-semibold text-base">
                  {formatCurrency(linkFormulario.costo)}
                </Badge>
              </div>
            </div>

            {/* Fechas - Ocupa más espacio en layouts específicos */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow h-full">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-3">Período de Estadía</p>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">ENTRADA:</span>
                      <Badge variant="outline" className="font-medium text-xs break-words">
                        {formatDate(linkFormulario.fechaInicio)}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">SALIDA:</span>
                      <Badge variant="outline" className="font-medium text-xs break-words">
                        {formatDate(linkFormulario.fechaFin)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 