'use client';

import { LinkFormulario } from '@/Types/link-formulario';

interface PasoBienvenidaProps {
  linkFormulario?: LinkFormulario;
}

export const PasoBienvenida = ({ linkFormulario }: PasoBienvenidaProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">¡Bienvenido al Hotel San Miguel!</h2>
        <p className="text-muted-foreground">
          Complete el siguiente formulario para registrar su estadía.
        </p>
        {linkFormulario && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Reserva confirmada:</strong> Habitación {linkFormulario.numeroHabitacion} 
              del {new Date(linkFormulario.fechaInicio).toLocaleDateString()} 
              al {new Date(linkFormulario.fechaFin).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Información requerida:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Datos personales del huésped principal</li>
            <li>• Información de acompañantes (si aplica)</li>
            <li>• Documentos de identificación válidos</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-medium text-amber-900 mb-2">Tiempo estimado:</h3>
          <p className="text-sm text-amber-800">
            El proceso de registro tomará aproximadamente 5-10 minutos.
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">Privacidad y seguridad:</h3>
          <p className="text-sm text-green-800">
            Sus datos están protegidos y serán utilizados únicamente para el registro hotelero 
            según las normativas vigentes.
          </p>
        </div>
      </div>

      {/* TODO: Agregar términos y condiciones checkbox */}
      <div className="pt-4">
        <p className="text-sm text-muted-foreground text-center">
          Al continuar, acepta nuestros términos y condiciones de servicio.
        </p>
      </div>
    </div>
  );
}; 