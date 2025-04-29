import { BookingCard } from '../../Types/bookin-card';
import { getCookie, COOKIE_NAMES } from "@/lib/common/cookies";
import { getFormularioById } from "@/lib/formulario/formulario-service";
import { getReservaById } from "@/lib/bookings/reservas-service";
import { getHuespedById } from "@/lib/huespedes/huesped-service";
import { EstadosFormulario } from '@/Types/enums/estadosFormulario';
import { getLinkFormularioById, getLinksFormulario } from "@/lib/formulario/link-formulario-service";
import { LinkFormulario } from '@/Types/link-formulario';
import { BOOKING_ENDPOINTS } from '../common/api';
import { RemoveBookingResponse } from '@/Types/response-delete-booking';

export async function getBookingCards(limit: number, page: number): Promise<BookingCard[]> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const { data: linksFormularios } = await getLinksFormulario(limit, page)

  const bookingCards = linksFormularios.map(async (linkFormulario) => {
    if (linkFormulario.formularioId === null) {
      return {
        link_formulario_id: linkFormulario.id,
        nombre: 'Sin nombre',
        fecha_inicio: linkFormulario.fechaInicio,
        fecha_fin: linkFormulario.fechaFin,
        estado: determinarLinkFormulario(linkFormulario),
        valor: linkFormulario.costo,
        url: linkFormulario.url,
        numero_habitacion: linkFormulario.numeroHabitacion,
        subido_sire: false,
        subido_tra: false,
      }
    }

    const formulario = await getFormularioById(linkFormulario.formularioId)
    const reserva = await getReservaById(formulario.reservaId)
    const huesped = await getHuespedById(formulario.huespedId)

    return {
      link_formulario_id: linkFormulario.id,
      nombre: huesped.nombres,
      fecha_inicio: reserva.fecha_inicio,
      fecha_fin: reserva.fecha_fin,
      estado: determinarLinkFormulario(linkFormulario),
      valor: reserva.costo,
      url: linkFormulario.url,
      numero_habitacion: linkFormulario.numeroHabitacion,
      subido_sire: formulario?.SubidoASire,
      subido_tra: formulario?.SubidoATra
    }
  })

  return Promise.all(bookingCards)
}

export async function getBookingCardByLinkId(id: number): Promise<BookingCard> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const linkFormulario = await getLinkFormularioById(id)

  if (linkFormulario === null) {
    throw new Error('No se encontró el enlace de formulario')
  }

  if (linkFormulario.formularioId === null) {
    return {
      link_formulario_id: linkFormulario.id,
      nombre: 'Sin nombre',
      fecha_inicio: linkFormulario.fechaInicio,
      fecha_fin: linkFormulario.fechaFin,
      estado: determinarLinkFormulario(linkFormulario),
      valor: linkFormulario.costo,
      url: linkFormulario.url,
      numero_habitacion: linkFormulario.numeroHabitacion,
      subido_sire: false,
      subido_tra: false,
    }
  }

  try {
    const formulario = await getFormularioById(linkFormulario.formularioId)
    if (!formulario) {
      throw new Error('No se encontró el formulario asociado')
    }

    const reserva = await getReservaById(formulario.reservaId)
    if (!reserva) {
      throw new Error('No se encontró la reserva asociada')
    }

    const huesped = await getHuespedById(formulario.huespedId)
    if (!huesped) {
      throw new Error('No se encontró el huésped asociado')
    }

    return {
      link_formulario_id: linkFormulario.id,
      nombre: huesped.nombres,
      fecha_inicio: reserva.fecha_inicio,
      fecha_fin: reserva.fecha_fin,
      estado: determinarLinkFormulario(linkFormulario),
      valor: reserva.costo,
      url: linkFormulario.url,
      numero_habitacion: linkFormulario.numeroHabitacion,
      subido_sire: formulario?.SubidoASire ?? false,
      subido_tra: formulario?.SubidoATra ?? false
    }
  } catch (error) {
    console.error('Error al obtener los datos del booking card:', error)
    throw new Error('Error al obtener los datos del booking card')
  }
}

function determinarLinkFormulario(linkFormulario: LinkFormulario): EstadosFormulario {
  if (linkFormulario.completado) {
    return EstadosFormulario.COMPLETADO
  } else if (linkFormulario.expirado && !linkFormulario.completado) {
    return EstadosFormulario.EXPIRADO
  } else if (new Date(linkFormulario.vencimiento) < new Date() && !linkFormulario.completado) {
    return EstadosFormulario.EXPIRADO
  } else {
    return EstadosFormulario.PENDIENTE
  }
}

export async function deleteBookingCard(link_formulario_id: number): Promise<LinkFormulario | RemoveBookingResponse> {
  const token = getCookie(COOKIE_NAMES.TOKEN)
  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const response = await fetch(BOOKING_ENDPOINTS.DELETE(link_formulario_id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    console.log(await response.json());
    throw new Error('Error al eliminar el booking')
  }
  return await response.json()
}
