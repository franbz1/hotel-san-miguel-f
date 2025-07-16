'use client';
import { LinkFormulario } from "@/Types/link-formulario";

export const PasoBienvenida = ({linkFormulario}: {linkFormulario: LinkFormulario}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">¡Bienvenido al Hotel San Miguel!</h2>
        <p className="text-muted-foreground">
          Complete el siguiente formulario para registrar su estadía.
          <p>Costo: {linkFormulario.costo}</p>
          <p>Número de habitación: {linkFormulario.numeroHabitacion}</p>
        </p>
      </div>
    </div>
  );
}; 