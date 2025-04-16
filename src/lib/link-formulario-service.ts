import { LinkFormulario } from "@/Types/link-formulario";
import { getCookie } from "./cookies";
import { COOKIE_NAMES } from "./cookies";
import { LINK_FORMULARIO_ENDPOINTS } from "./api";

export async function createLinkFormulario(): Promise<LinkFormulario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(LINK_FORMULARIO_ENDPOINTS.CREATE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al crear el link del formulario')
  }

  return response.json()
}

export async function getLinkFormularioById(id: number): Promise<LinkFormulario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(LINK_FORMULARIO_ENDPOINTS.GET_BY_ID(id), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el link del formulario')
  }

  return response.json()
}
