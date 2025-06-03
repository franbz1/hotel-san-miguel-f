import { EstadoHabitacion } from "@/Types/enums/estadosHabitacion";

// Colores para los bordes según el estado
export const ROOM_STATUS_COLORS: Record<EstadoHabitacion, string> = {
  [EstadoHabitacion.LIBRE]: "emerald",
  [EstadoHabitacion.OCUPADO]: "red",
  [EstadoHabitacion.RESERVADO]: "amber",
  [EstadoHabitacion.EN_DESINFECCION]: "blue",
  [EstadoHabitacion.EN_MANTENIMIENTO]: "purple",
  [EstadoHabitacion.EN_LIMPIEZA]: "yellow",
};

// Función para obtener las clases de borde según el estado
export function getRoomBorderClass(status?: EstadoHabitacion): string {
  if (!status) return "border-gray-300";
  const color = ROOM_STATUS_COLORS[status];
  return `border-${color}-500`;
}

// Función para obtener las clases de texto según el estado
export function getRoomTextClass(status?: EstadoHabitacion): string {
  if (!status) return "text-gray-500";
  const color = ROOM_STATUS_COLORS[status];
  return `text-${color}-600`;
}

// Función para obtener las clases de fondo para badges según el estado
export function getRoomBadgeClass(status?: EstadoHabitacion): string {
  if (!status) return "bg-gray-500";
  const color = ROOM_STATUS_COLORS[status];
  return `bg-${color}-500`;
}

// Función para obtener el texto del estado según el estado
export function getRoomStatusText(status?: EstadoHabitacion): string {
  if (!status) return "Desconocido";
  
  switch (status) {
    case EstadoHabitacion.LIBRE:
      return "Disponible";
    case EstadoHabitacion.OCUPADO:
      return "Ocupada";
    case EstadoHabitacion.RESERVADO:
      return "Reservada";
    case EstadoHabitacion.EN_LIMPIEZA:
      return "En limpieza";
    case EstadoHabitacion.EN_DESINFECCION:
      return "En desinfección";
    case EstadoHabitacion.EN_MANTENIMIENTO:
      return "En mantenimiento";
    default:
      return "Desconocido";
  }
} 