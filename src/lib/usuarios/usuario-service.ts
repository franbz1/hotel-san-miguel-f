import { Usuario, CreateUsuarioDto, UpdateUsuarioDto, UsuariosResponse } from "@/Types/usuario"
import { COOKIE_NAMES } from "@/lib/common/cookies"
import { getCookie } from "@/lib/common/cookies"
import { USUARIO_ENDPOINTS } from "@/lib/common/api"

export async function getUsuarios(page: number = 1, limit: number = 10): Promise<UsuariosResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(USUARIO_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios')
  }

  return response.json()
}

export async function getUsuarioById(id: number): Promise<Usuario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(USUARIO_ENDPOINTS.GET_BY_ID(id), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el usuario')
  }

  return response.json()
}

export async function createUsuario(data: CreateUsuarioDto): Promise<Usuario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(USUARIO_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al crear el usuario')
  }

  return response.json()
}

export async function updateUsuario(id: number, data: UpdateUsuarioDto): Promise<Usuario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(USUARIO_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el usuario')
  }

  return response.json()
}

export async function deleteUsuario(id: number): Promise<Usuario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(USUARIO_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el usuario')
  }

  return response.json()
} 