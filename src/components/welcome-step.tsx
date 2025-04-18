"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CreateRegistroFormulario } from "@/Types/registro-formularioDto"

interface WelcomeStepProps {
  formData: Partial<CreateRegistroFormulario>
  onNext: () => void
}

export function WelcomeStep({ formData, onNext }: WelcomeStepProps) {
  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Bienvenido al Registro de Huéspedes</h2>
        <p className="text-gray-600">
          Por favor complete el formulario con sus datos y los de sus acompañantes
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
            1
          </div>
          <div className="text-sm font-medium">Datos personales</div>
          <div className="h-0.5 w-10 bg-gray-200"></div>
          <div className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
          <div className="text-sm text-gray-600 font-medium">Datos acompañantes</div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Información de la Reserva</CardTitle>
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
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" onClick={onNext}>
          Comenzar Registro
        </Button>
      </div>
    </div>
  )
} 