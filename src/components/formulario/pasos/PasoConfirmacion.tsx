'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFormularioContext } from '../FormularioWrapper';

export const PasoConfirmacion = () => {
  const { getAllAvailableData } = useFormularioContext();
  const data = getAllAvailableData();
  
  // Extraer datos para mostrar
  const linkData = data.link;
  const personalData = data.stepData.informacionPersonal;
  const companionData = data.stepData.acompaniantes;

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
          {linkData ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Fecha de Inicio:</span>
                <p className="font-medium">{new Date(linkData.fechaInicio).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Fecha de Fin:</span>
                <p className="font-medium">{new Date(linkData.fechaFin).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Motivo de Viaje:</span>
                <p className="font-medium">{personalData?.motivo_viaje || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Costo:</span>
                <p className="font-medium">${linkData.costo.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Habitación:</span>
                <p className="font-medium">{linkData.numeroHabitacion}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Acompañantes:</span>
                <p className="font-medium">{companionData?.numero_acompaniantes || 0}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No hay datos de reserva disponibles</p>
          )}
        </CardContent>
      </Card>

      {/* Información del huésped principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Huésped Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {personalData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nombre Completo:</span>
                  <p className="font-medium">{personalData.nombres} {personalData.primer_apellido} {personalData.segundo_apellido || ''}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Documento:</span>
                  <p className="font-medium">{personalData.tipo_documento} {personalData.numero_documento}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento:</span>
                  <p className="font-medium">{personalData.fecha_nacimiento.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Género:</span>
                  <p className="font-medium">{personalData.genero}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nacionalidad:</span>
                  <p className="font-medium">{personalData.nacionalidad}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Ocupación:</span>
                  <p className="font-medium">{personalData.ocupacion}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Residencia:</span>
                  <p className="font-medium">{personalData.ciudad_residencia}, {personalData.pais_residencia}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Procedencia:</span>
                  <p className="font-medium">{personalData.ciudad_procedencia}, {personalData.pais_procedencia}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Teléfono:</span>
                  <p className="font-medium">{personalData.telefono || 'No proporcionado'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Correo:</span>
                  <p className="font-medium">{personalData.correo || 'No proporcionado'}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Complete el paso de información personal para ver los datos aquí</p>
          )}
        </CardContent>
      </Card>

      {/* Lista de acompañantes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Acompañantes</CardTitle>
            <span className="text-sm text-muted-foreground">
              {companionData?.numero_acompaniantes || 0} registrados
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {companionData?.huespedes_secundarios && companionData.huespedes_secundarios.length > 0 ? (
            <div className="space-y-4">
              {companionData.huespedes_secundarios.map((huesped, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{huesped.nombres} {huesped.primer_apellido} {huesped.segundo_apellido || ''}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Documento:</span>
                      <p className="font-medium">{huesped.tipo_documento} {huesped.numero_documento}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Nacionalidad:</span>
                      <p className="font-medium">{huesped.nacionalidad}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento:</span>
                      <p className="font-medium">{huesped.fecha_nacimiento.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {companionData?.numero_acompaniantes === 0 
                  ? 'No hay acompañantes registrados para esta reserva'
                  : 'Complete el paso de acompañantes para ver los datos aquí'
                }
              </p>
            </div>
          )}
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