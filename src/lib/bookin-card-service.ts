import { BookingCard } from './../Types/bookin-card';
import { getCookie, COOKIE_NAMES } from "./cookies";
import { getFormularios } from "./formulario-service";
import { getReservaById } from "./reservas-service";
import { getHuespedById } from './huesped-service';
import { EstadosFormulario } from '@/Types/enums/estadosFormulario';
import { Formulario } from '@/Types/formulario';

export async function getBookingCards(page: number, limit: number): Promise<BookingCard[]> {
  const token = getCookie(COOKIE_NAMES.TOKEN)

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  const { data: formularios } = await getFormularios(page, limit)

  const bookingCards = formularios.map(async (formulario) => {
    const reserva = await getReservaById(formulario.reservaId)
    const huesped = await getHuespedById(formulario.huespedId)

    return {
      nombre: huesped.nombres,
      fecha_inicio: reserva.fecha_inicio,
      fecha_fin: reserva.fecha_fin,
      estado: determinarEstadoFormulario(formulario),
      valor: reserva.costo,
      url: formulario.LinkFormulario.url,
      subido_sire: formulario.SubidoASire,
      subido_tra: formulario.SubidoATra,
    }
  })

  return Promise.all(bookingCards)
}

function determinarEstadoFormulario(formulario: Formulario): EstadosFormulario {
  if (formulario.LinkFormulario.completado) {
    return EstadosFormulario.COMPLETADO
  } else if (formulario.LinkFormulario.expirado) {
    return EstadosFormulario.EXPIRADO
  } else {
    return EstadosFormulario.PENDIENTE
  }
}

