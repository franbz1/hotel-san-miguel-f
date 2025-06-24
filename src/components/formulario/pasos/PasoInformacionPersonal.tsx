'use client';

export const PasoInformacionPersonal = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Datos de la Reserva</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TODO: Implementar campos de reserva */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Inicio</label>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Fin</label>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Motivo de Viaje</label>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Costo</label>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Número de Habitación</label>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Número de Acompañantes</label>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Datos Personales del Huésped</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TODO: Implementar campos de datos personales */}
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
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de Ubicación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TODO: Implementar campos de ubicación con useCountryStateCity */}
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Nacionalidad</label>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ocupación</label>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de Contacto (Opcional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TODO: Implementar campos de contacto */}
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
    </div>
  );
}; 