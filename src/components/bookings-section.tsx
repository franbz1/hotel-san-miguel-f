"use client"

import { Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getBookingCards } from "@/lib/bookin-card-service"
import { useEffect, useState } from "react"
import { BookingCard } from "@/Types/bookin-card"
import BookingCardUI from "./booking-card-ui"

export function BookingsSection() {
  const [bookings, setBookings] = useState<BookingCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingCards(1, 10)
        setBookings(data)
      } catch (err) {
        setError('Error al cargar las reservas')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return <div className="p-6">Cargando reservas...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Reservas</h2>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar reserva..." className="pl-8 w-full" />
          </div>
          <Button>
            <span className="mr-2">Crear reserva</span>
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

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

      <ScrollArea className="h-[300px] rounded-md border">
        <div className="space-y-2 p-4">
          {bookings.map((booking, index) => (
            <BookingCardUI key={index} booking={booking} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 