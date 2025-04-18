"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"
import { formatDate, formatCurrency } from "@/lib/utils"

interface SuccessStepProps {
  formData: Partial<CreateRegistroFormulario>
}

export function SuccessStep({ formData }: SuccessStepProps) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="mb-4 text-emerald-500">
          <CheckCircle className="h-20 w-20" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Formulario enviado satisfactoriamente</h2>
        <p className="text-gray-600 text-center max-w-md">
          Su registro ha sido completado con éxito. Gracias por preferirnos.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Resumen de su registro</CardTitle>
          <CardDescription>Detalles de su estancia en Hotel San Miguel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Entrada</p>
              <p className="text-base font-medium">{formData.fecha_inicio ? formatDate(formData.fecha_inicio) : "No disponible"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Salida</p>
              <p className="text-base font-medium">{formData.fecha_fin ? formatDate(formData.fecha_fin) : "No disponible"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Habitación</p>
              <p className="text-base font-medium">{formData.numero_habitacion || "No disponible"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Costo Total</p>
              <p className="text-base font-medium text-primary">{formData.costo ? formatCurrency(formData.costo) : "No disponible"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Número de acompañantes</p>
              <p className="text-base font-medium">{formData.numero_acompaniantes || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Titular</p>
              <p className="text-base font-medium">{formData.nombres} {formData.primer_apellido} {formData.segundo_apellido || ""}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-center">
          <p className="text-sm text-gray-500">
            Si necesita realizar algún cambio, comuníquese con la recepción del hotel.
          </p>
        </CardFooter>
      </Card>

      <div className="text-center">
        <Button variant="outline" onClick={() => window.print()}>
          Imprimir comprobante
        </Button>
      </div>
    </div>
  )
} 