import { LinkFormulario } from "@/Types/link-formulario";
import { getCookie, COOKIE_NAMES } from "@/lib/common/cookies";
import { LINK_FORMULARIO_ENDPOINTS } from "@/lib/common/api";
import { Role, RoleType } from "@/lib/common/constants/constants";

export interface LinkFormularioResponse {
  data: LinkFormulario[]
  meta: {
    page: number
    limit: number
  }
}

export interface GenerateLinkFormularioDto {
  numeroHabitacion: number
  fechaInicio: Date
  fechaFin: Date
  costo: number
}

export interface ValidateLinkFormularioResponse {
  id: number
  rol: RoleType
  exp: number
  iat: number
}

export async function generateLinkFormulario(data: GenerateLinkFormularioDto): Promise<string> {
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
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    console.log(await response.json())
    throw new Error('Error al generar el enlace del formulario')
  }

  const url = await response.text()
  return url
}

export async function getLinksFormulario(limit: number, page: number): Promise<LinkFormularioResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }
  
  const response = await fetch(LINK_FORMULARIO_ENDPOINTS.GET_ALL(limit, page), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al obtener los links de los formularios')
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

export async function regenerateLinkFormulario(id: number): Promise<LinkFormulario> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(LINK_FORMULARIO_ENDPOINTS.REGENERATE(id), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al regenerar el link del formulario')
  }

  return response.json()
}

export async function validateLinkFormulario(tokenUrl: string): Promise<ValidateLinkFormularioResponse> {
  try {
    const response = await fetch(LINK_FORMULARIO_ENDPOINTS.VALIDATE(tokenUrl), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Error al procesar la respuesta del servidor');
    }

    // Manejo de errores basado en códigos HTTP
    if (!response.ok) {
      console.log(data.message)
      const errorMessage = data.message || 'Error al validar el link del formulario';
      throw new Error(
        errorMessage === 'Formulario ya completado' || 
        errorMessage === 'Link expirado' ||
        errorMessage === 'Link invalido' ||
        errorMessage === 'Link inválido o expirado'
          ? errorMessage 
          : 'Error al validar el link del formulario'
      );
    }

    // Verificar el rol
    if (data.rol !== Role.REGISTRO_FORMULARIO) {
      throw new Error('El rol del link del formulario no es válido');
    }

    return data;
  } catch (error) {
    // Re-lanzar el error original o crear uno nuevo según el caso
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Error de conexión al validar el formulario');
    }
  }
}

