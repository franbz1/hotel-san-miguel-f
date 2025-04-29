import { Circle, User, Users, Check } from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface FormStep {
  name: string
  icon: LucideIcon
}

// Definición de los pasos del formulario
export const formSteps: FormStep[] = [
  { name: "Bienvenida", icon: Circle },
  { name: "Datos Personales", icon: User },
  { name: "Acompañantes", icon: Users },
  { name: "Confirmación", icon: Check },
] 