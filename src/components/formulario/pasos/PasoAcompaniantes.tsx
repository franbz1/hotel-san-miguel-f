'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PasoAcompaniantes = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Información de Acompañantes</h3>
          <Button type="button" variant="outline" size="sm">
            Agregar Acompañante
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Agregue la información de las personas que lo acompañarán durante su estadía.
          Si viaja solo, puede omitir este paso.
        </p>
      </div>

      {/* TODO: Implementar lógica de acompañantes dinámicos */}
      <div className="space-y-4">
        {/* Mensaje cuando no hay acompañantes */}
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <h4 className="text-lg font-medium mb-2">No hay acompañantes registrados</h4>
                     <p className="text-sm text-muted-foreground mb-4">
             Haga clic en &quot;Agregar Acompañante&quot; para registrar a las personas que lo acompañan.
           </p>
        </div>

        {/* Ejemplo de tarjeta de acompañante (oculta por defecto) */}
        <Card className="hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Acompañante #1</CardTitle>
              <Button type="button" variant="ghost" size="sm">
                Eliminar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TODO: Implementar campos de acompañante */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Documento</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Número de Documento</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primer Apellido</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Segundo Apellido</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Nombres</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Nacimiento</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Género</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nacionalidad</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ocupación</label>
                <div className="h-10 bg-gray-100 rounded border"></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Información de Ubicación</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TODO: Implementar campos de ubicación */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">País de Residencia</label>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ciudad de Residencia</label>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">País de Procedencia</label>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ciudad de Procedencia</label>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Contacto (Opcional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono</label>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Correo Electrónico</label>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Información importante:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los acompañantes deben presentar documento de identificación válido</li>
          <li>• La información debe coincidir con los documentos oficiales</li>
          <li>• Puede agregar o eliminar acompañantes en cualquier momento</li>
        </ul>
      </div>
    </div>
  );
}; 