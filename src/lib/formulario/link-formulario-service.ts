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

// Keys para React Query
export const LINK_FORMULARIO_KEYS = {
  all: ['link-formulario'] as const,
  lists: () => [...LINK_FORMULARIO_KEYS.all, 'list'] as const,
  list: (limit: number, page: number) => [...LINK_FORMULARIO_KEYS.lists(), { limit, page }] as const,
  listByHabitacion: (numeroHabitacion: number, limit: number, page: number) => 
    [...LINK_FORMULARIO_KEYS.lists(), 'habitacion', numeroHabitacion, { limit, page }] as const,
  details: () => [...LINK_FORMULARIO_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...LINK_FORMULARIO_KEYS.details(), id] as const,
  validates: () => [...LINK_FORMULARIO_KEYS.all, 'validate'] as const,
  validate: (token: string) => [...LINK_FORMULARIO_KEYS.validates(), token] as const,
};

// Función para generar link de formulario
export const generateLinkFormularioFn = async (data: GenerateLinkFormularioDto): Promise<string> => {
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

// Función para obtener links de formulario
export const fetchLinksFormulario = async (limit: number, page: number): Promise<LinkFormularioResponse> => {
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

// Función para obtener links por habitación
export const fetchLinksFormularioByHabitacion = async (numeroHabitacion: number, limit: number, page: number): Promise<LinkFormularioResponse> => {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(LINK_FORMULARIO_ENDPOINTS.GET_ALL_BY_HABITACION(numeroHabitacion, limit, page), {
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

// Función para obtener link por ID
export const fetchLinkFormularioById = async (id: number): Promise<LinkFormulario> => {
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

// Función para regenerar link
export const regenerateLinkFormularioFn = async (id: number): Promise<LinkFormulario> => {
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

// Función para validar link
export const validateLinkFormularioFn = async (tokenUrl: string): Promise<ValidateLinkFormularioResponse> => {
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

// Funciones legacy para compatibilidad (opcional, se pueden eliminar después de migrar todos los usos)
export async function generateLinkFormulario(data: GenerateLinkFormularioDto): Promise<string> {
  return generateLinkFormularioFn(data);
}

export async function getLinksFormulario(limit: number, page: number): Promise<LinkFormularioResponse> {
  return fetchLinksFormulario(limit, page);
}

export async function getLinksFormularioByHabitacion(numeroHabitacion: number, limit: number, page: number): Promise<LinkFormularioResponse> {
  return fetchLinksFormularioByHabitacion(numeroHabitacion, limit, page);
}

export async function getLinkFormularioById(id: number): Promise<LinkFormulario> {
  return fetchLinkFormularioById(id);
}

export async function regenerateLinkFormulario(id: number): Promise<LinkFormulario> {
  return regenerateLinkFormularioFn(id);
}

export async function validateLinkFormulario(tokenUrl: string): Promise<ValidateLinkFormularioResponse> {
  return validateLinkFormularioFn(tokenUrl);
}

