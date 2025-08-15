"use client"

import { RefreshCcw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getBookingCards, getBookingCardsByHabitacion } from "@/lib/bookings/bookin-card-service"
import { useEffect, useState, useRef, useCallback } from "react"
import { BookingCard } from "@/Types/bookin-card"
import { CreateBookingModal } from "@/components/bookings/create-booking-modal"
import { Button } from "../ui/button"
import { cn } from "@/lib/common/utils"
import BookingCardUI from "./booking-card-ui"

interface BookingsSectionProps {
  roomNumber?: number
  height?: string
  title?: string
  showFilters?: boolean
  createButton?: boolean
}

export function BookingsSection({
  roomNumber,
  height = "300px",
  title = "Reservas",
  showFilters = true,
  createButton = true
}: BookingsSectionProps) {
  const [bookings, setBookings] = useState<BookingCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Toggle para mostrar/ocultar filtros en móvil
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const fetchBookings = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true)
      const data = roomNumber !== undefined 
        ? await getBookingCardsByHabitacion(roomNumber, 10, pageNumber)
        : await getBookingCards(10, pageNumber);

      // Cuando no hay más resultados
      if (!data || data.length === 0) {
        setHasMore(false)
        return
      }

      const dataOrdered = data.sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())

      setBookings(prev => {
        // Evitar duplicados por nombre+fecha (métrica usada actualmente)
        const existingKeys = new Set(prev.map(b => `${b.nombre}-${b.fecha_inicio}`))
        const newBookings = dataOrdered.filter(b => !existingKeys.has(`${b.nombre}-${b.fecha_inicio}`))
        return [...prev, ...newBookings]
      })
    } catch (err) {
      setError('Error al cargar las reservas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [roomNumber])

  // cargar primera página / reset cuando cambie roomNumber
  useEffect(() => {
    setBookings([])
    setPage(1)
    setHasMore(true)
    fetchBookings(1)
  }, [fetchBookings, roomNumber])

  // Observer para paginación infinita
  useEffect(() => {
    if (!hasMore) return

    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        setPage(prev => prev + 1)
      }
    }, options)

    const current = loadingRef.current
    if (current && observer.current) {
      observer.current.observe(current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [hasMore, loading])

  // cuando page cambie >1, traer siguiente página
  useEffect(() => {
    if (page > 1) {
      fetchBookings(page)
    }
  }, [page, fetchBookings])

  const handleBookingCreated = () => {
    // reset y recarga
    setPage(1)
    setHasMore(true)
    setBookings([])
    fetchBookings(1)
  }

  const handleRefresh = () => {
    setBookings([])
    setPage(1)
    setHasMore(true)
    fetchBookings(1)
  }

  if (error) {
    return <div className="p-4 sm:p-6 text-red-500">{error}</div>
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
      {/* Header: título + controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* En móvil, botón que despliega filtros (si están habilitados) */}
          {showFilters && (
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border sm:hidden text-sm"
              onClick={() => setMobileFiltersOpen(v => !v)}
              aria-expanded={mobileFiltersOpen}
              aria-controls="mobile-filters"
              title="Mostrar filtros"
            >
              Filtros
            </button>
          )}

          {/* Search: en móvil take full width, en sm+ ancho fijo */}
          {showFilters && (
            <div className="hidden sm:block relative max-w-[260px] w-[260px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar reserva..." className="pl-8 w-full" aria-label="Buscar reserva" />
            </div>
          )}

          {/* Botón refresh */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-200 shrink-0",
              "hover:bg-slate-100 hover:text-slate-900",
              "active:scale-95 cursor-pointer",
              loading && "animate-spin bg-slate-100"
            )}
            onClick={handleRefresh}
            disabled={loading}
            title="Actualizar reservas"
            aria-label="Actualizar reservas"
          >
            <RefreshCcw size={14} className="text-slate-600" />
          </Button>

          {/* Crear reserva */}
          {createButton && <div className="ml-0 sm:ml-2"><CreateBookingModal onBookingCreated={handleBookingCreated} /></div>}
        </div>
      </div>

      {/* Mobile filters (colapsable) - incluye buscador y leyenda */}
      {showFilters && mobileFiltersOpen && (
        <div id="mobile-filters" className="sm:hidden mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar reserva..." className="pl-8 w-full" aria-label="Buscar reserva" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-600">Pendiente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-gray-600">Completado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Expirado</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop filters (si no visible en móvil) */}
      {showFilters && (
        <div className="hidden sm:block mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-600">Pendiente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-gray-600">Completado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Expirado</span>
            </div>
          </div>

          {/* Tabs: scrollable si exceden */}
          <Tabs defaultValue="all" className="mt-3">
            <div className="overflow-x-auto">
              <TabsList className="flex-nowrap min-w-max">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="active">Activas</TabsTrigger>
                <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                <TabsTrigger value="past">Pasadas</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      )}

      {/* ScrollArea: altura respetando prop `height` y con límites max-h */}
      <ScrollArea
        className={cn("rounded-md border")}
        style={{ height }}
      >
        <div className="space-y-2 p-4">
          {/* Loading skeletons */}
          {loading && bookings.length === 0 ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-12 bg-slate-100 rounded-md" />
                </div>
              ))}
            </>
          ) : (
            bookings.map((booking, i) => (
              <BookingCardUI key={i} booking={booking} />
            ))
          )}

          {/* Sentinel para la paginación infinita */}
          {hasMore && (
            <div ref={loadingRef} className="flex justify-center py-4" aria-live="polite">
              {loading ? <div className="text-sm text-muted-foreground">Cargando más reservas...</div> : <div className="text-sm text-muted-foreground">Desplázate para cargar más</div>}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
