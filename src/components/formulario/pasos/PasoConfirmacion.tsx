'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LinkFormulario } from '@/Types/link-formulario';

interface PasoConfirmacionProps {
  linkFormulario?: LinkFormulario;
}

export const PasoConfirmacion = ({ linkFormulario }: PasoConfirmacionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Revise y Confirme su Información</h3>
        <p className="text-muted-foreground">
          Verifique que todos los datos sean correctos antes de confirmar el registro.
        </p>
      </div>

      {/* Resumen de la reserva */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos de la Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {linkFormulario ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Fecha de Inicio:</span>
                <p className="font-medium">{new Date(linkFormulario.fechaInicio).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Fecha de Fin:</span>
                <p className="font-medium">{new Date(linkFormulario.fechaFin).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Motivo de Viaje:</span>
                <p className="font-medium">TODO: Mostrar desde formulario</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Costo:</span>
                <p className="font-medium">${linkFormulario.costo.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Habitación:</span>
                <p className="font-medium">{linkFormulario.numeroHabitacion}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Acompañantes:</span>
                <p className="font-medium">TODO: Mostrar desde formulario</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Fecha de Inicio:</span>
                <p className="font-medium">--/--/----</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Fecha de Fin:</span>
                <p className="font-medium">--/--/----</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Motivo de Viaje:</span>
                <p className="font-medium">---------</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Costo:</span>
                <p className="font-medium">$ ----</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Habitación:</span>
                <p className="font-medium">---</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Acompañantes:</span>
                <p className="font-medium">-</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del huésped principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Huésped Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: Mostrar datos reales del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Nombre Completo:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Documento:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Género:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Nacionalidad:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Ocupación:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Residencia:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Procedencia:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Teléfono:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Correo:</span>
              <p className="font-medium">TODO: Mostrar desde formulario</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de acompañantes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Acompañantes</CardTitle>
            <span className="text-sm text-muted-foreground">TODO: Mostrar número real</span>
          </div>
        </CardHeader>
        <CardContent>
          {/* TODO: Mostrar lista de acompañantes o mensaje vacío */}
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <p className="text-sm text-muted-foreground">
              TODO: Mostrar acompañantes desde formulario
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Términos y condiciones */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <div className="text-sm">
                <p className="font-medium">Términos y Condiciones</p>
                <p className="text-muted-foreground mt-1">
                  He leído y acepto los términos y condiciones del Hotel San Miguel, 
                  incluyendo las políticas de privacidad y tratamiento de datos personales.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <div className="text-sm">
                <p className="font-medium">Veracidad de la Información</p>
                <p className="text-muted-foreground mt-1">
                  Declaro que toda la información proporcionada es verdadera y completa. 
                  Entiendo que la falsificación de datos puede resultar en la cancelación de la reserva.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje final */}
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">✅</span>
        </div>
        <h4 className="text-lg font-medium text-green-900 mb-2">
          ¡Todo listo para confirmar!
        </h4>
        <p className="text-sm text-green-800">
          Su registro será procesado inmediatamente una vez confirmado. 
          Recibirá una confirmación por correo electrónico si lo proporcionó.
        </p>
      </div>
    </div>
  );
}; 