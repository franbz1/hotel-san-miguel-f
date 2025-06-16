import { RoleType } from "@/lib/common/constants/constants"
import { RegistroAseoHabitacion } from "./aseo/RegistroAseoHabitacion"

export interface Usuario {
  id: number
  nombre: string
  rol: RoleType
  password: string

  registros_aseo_habitacion?: RegistroAseoHabitacion[];

  
  createdAt: string
  updatedAt: string
  deleted: boolean
}

export interface CreateUsuarioDto {
  nombre: string
  rol: RoleType
  password: string
}

export interface UpdateUsuarioDto {
  nombre?: string
  rol?: RoleType
  password?: string
}

export interface UsuariosResponse {
  data: Usuario[]
  meta: {
    page: number
    limit: number
    totalUsuarios: number
    lastPage: number
  }
} 