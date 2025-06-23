// Tipos comunes de paginación
export interface PaginationDto {
  page?: number; // Página actual (default: 1, mínimo: 1)
  limit?: number; // Elementos por página (default: 10, mínimo: 1)
}

export interface PaginationMeta {
  page: number; // Página actual
  limit: number; // Límite por página
  total: number; // Total de elementos
  lastPage: number; // Última página disponible
}

export interface PaginatedResponse<T> {
  data: T[]; // Array de elementos
  meta: PaginationMeta;
} 