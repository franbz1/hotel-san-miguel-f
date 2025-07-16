"use client"
import { Formulario } from "@/components/formulario/Formulario"
import { FormularioGuard } from "@/components/formulario/FormularioGuard"

/**
 * Página de registro de formulario
 * @returns {JSX.Element}
 */
export default function RegistroFormularioPage() {
  // Renderizar el formulario
  return (
    <FormularioGuard>
      {({ linkFormulario }) => <Formulario linkFormulario={linkFormulario} />}
    </FormularioGuard>
  )
} 