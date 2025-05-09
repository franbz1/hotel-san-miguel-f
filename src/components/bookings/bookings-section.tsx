"use client"

import { RefreshCcw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getBookingCards, getBookingCardsByHabitacion } from "@/lib/bookings/bookin-card-service"
import { useEffect, useState, useRef, useCallback } from "react"
import { BookingCard } from "@/Types/bookin-card"
import BookingCardUI from "@/components/bookings/booking-card-ui"
import { CreateBookingModal } from "@/components/bookings/create-booking-modal"
import { Button } from "../ui/button"
import { cn } from "@/lib/common/utils"

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

  const fetchBookings = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true)
      
      // Usar la función adecuada según si se especifica una habitación o no
      const data = roomNumber !== undefined 
        ? await getBookingCardsByHabitacion(roomNumber, 10, pageNumber)
        : await getBookingCards(10, pageNumber);
        
      if (data.length === 0) {
        setHasMore(false)
        return
      }

      const dataOrdered = data.sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())

      setBookings(prev => {
        const existingIds = new Set(prev.map(b => b.nombre))
        const newBookings = dataOrdered.filter(b => !existingIds.has(b.nombre))
        return [...prev, ...newBookings]
      })
    } catch (err) {
      setError('Error al cargar las reservas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [roomNumber])

  useEffect(() => {
    fetchBookings(1)
  }, [fetchBookings])

  useEffect(() => {
    if (!hasMore) return

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage(prev => prev + 1)
      }
    }, options)

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [hasMore, loading])

  useEffect(() => {
    if (page > 1) {
      fetchBookings(page)
    }
  }, [page, fetchBookings])

  const handleBookingCreated = () => {
    setPage(1)
    setHasMore(true)
    setBookings([])
    fetchBookings(1)
  }

  const handleRefresh = () => {
    setBookings([])
    fetchBookings(1)
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-3">
          {showFilters && (
            <div className="relative max-w-[200px] sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar reserva..." className="pl-8 w-full" />
            </div>
          )}
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
          >
            <RefreshCcw size={14} className="text-slate-600" />
          </Button>
          {createButton && <CreateBookingModal onBookingCreated={handleBookingCreated} />}
        </div>
      </div>

      {showFilters && (
        <>
          <div className="mb-4 flex items-center gap-4">
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

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Activas</TabsTrigger>
              <TabsTrigger value="upcoming">Próximas</TabsTrigger>
              <TabsTrigger value="past">Pasadas</TabsTrigger>
            </TabsList>
          </Tabs>
        </>
      )}


      <ScrollArea className={`rounded-md border`} style={{ height }}>
        <div className="space-y-2 p-4">
          {bookings.length === 0 && !loading ? (
            <div className="text-center text-muted-foreground py-4">
              No hay reservas para mostrar
            </div>
          ) : (
            bookings.map((booking, index) => (
              <BookingCardUI 
                key={`${booking.nombre}-${booking.fecha_inicio}-${index}`} 
                booking={booking}
                onDeleted={handleRefresh}
              />
            ))
          )}
          {hasMore && (
            <div ref={loadingRef} className="flex justify-center py-4">
              {loading && <div>Cargando más reservas...</div>}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 