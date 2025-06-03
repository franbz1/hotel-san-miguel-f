import { Huesped, CreateHuespedDto, UpdateHuespedDto } from "@/Types/huesped"
import { HuespedSecundario, CreateHuespedSecundarioDto, UpdateHuespedSecundarioDto } from "@/Types/huespedSecundario"
import { COOKIE_NAMES } from "@/lib/common/cookies"
import { getCookie } from "@/lib/common/cookies"
import { HUESPED_ENDPOINTS, HUESPED_SECUNDARIO_ENDPOINTS } from "@/lib/common/api"

export interface HuespedesResponse {
  data: Huesped[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

export async function getHuespedes(page: number = 1, limit: number = 6): Promise<HuespedesResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los huespedes')
  }

  return response.json()
}

export async function getHuespedByDocument(document: string): Promise<Huesped> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.GET_BY_DOCUMENT(document), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el huesped')
  }

  return response.json()
}

export async function getHuespedById(id: number): Promise<Huesped> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.GET_BY_ID(id), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el huesped')
  }

  return response.json()
}

export interface HuespedesSecundariosResponse {
  data: HuespedSecundario[]
  meta: {
    page: number
    limit: number
    total: number
    lastPage: number
  }
}

// Métodos para huéspedes principales
export async function createHuesped(data: CreateHuespedDto): Promise<Huesped> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al crear el huésped')
  }

  return response.json()
}

export async function updateHuesped(id: number, data: UpdateHuespedDto): Promise<Huesped> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el huésped')
  }

  return response.json()
}

export async function deleteHuesped(id: number): Promise<Huesped> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el huésped')
  }

  return response.json()
}

// Métodos para huéspedes secundarios
export async function getHuespedesSecundarios(page: number = 1, limit: number = 6): Promise<HuespedesSecundariosResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_SECUNDARIO_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los huéspedes secundarios')
  }

  return response.json()
}

export async function getHuespedesSecundariosByHuespedId(huespedId: number, page: number = 1, limit: number = 6): Promise<HuespedesSecundariosResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_SECUNDARIO_ENDPOINTS.GET_BY_HUESPED_ID(huespedId, limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los huéspedes secundarios')
  }

  return response.json()
}

export async function getHuespedSecundarioById(id: number): Promise<HuespedSecundario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_SECUNDARIO_ENDPOINTS.GET_BY_ID(id), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el huésped secundario')
  }

  return response.json()
}

export async function getHuespedSecundarioByDocument(numeroDocumento: string): Promise<HuespedSecundario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_SECUNDARIO_ENDPOINTS.GET_BY_DOCUMENT(numeroDocumento), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el huésped secundario')
  }

  return response.json()
}

export async function createHuespedSecundario(data: CreateHuespedSecundarioDto): Promise<HuespedSecundario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_SECUNDARIO_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al crear el huésped secundario')
  }

  return response.json()
}

export async function updateHuespedSecundario(id: number, data: UpdateHuespedSecundarioDto): Promise<HuespedSecundario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_SECUNDARIO_ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el huésped secundario')
  }

  return response.json()
}

export async function deleteHuespedSecundario(id: number): Promise<HuespedSecundario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(HUESPED_SECUNDARIO_ENDPOINTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el huésped secundario')
  }

  return response.json()
}
