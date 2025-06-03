"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { getHabitacionByNumero } from "@/lib/rooms/habitacion-service"
import { Habitacion } from "@/Types/habitacion"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

// Importación de los componentes modulares
import { RoomBookings } from "@/components/rooms/room-bookings"
import { RoomAnalytics } from "@/components/rooms/room-analytics"
import { RoomInfoEditor } from "@/components/rooms/room-info-editor"
import { RoomCleaningHistory } from "@/components/rooms/room-cleaning-history"

export default function RoomDetails() {
  const params = useParams()
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHabitacion() {
      try {
        const numero = parseInt(params.numero as string)
        if (isNaN(numero)) {
          throw new Error("Número de habitación inválido")
        }
        
        const data = await getHabitacionByNumero(numero)
        setHabitacion(data)
        setLoading(false)
      } catch (err) {
        console.error("Error al cargar los datos de la habitación:", err)
        setError("No se pudo cargar la información de la habitación")
        setLoading(false)
      }
    }

    fetchHabitacion()
  }, [params.numero])

  const handleRoomUpdated = async () => {
    if (!params.numero) return;
    
    try {
      setLoading(true)
      const numero = parseInt(params.numero as string)
      const data = await getHabitacionByNumero(numero)
      setHabitacion(data)
    } catch (err) {
      console.error("Error al recargar los datos de la habitación:", err)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto p-6 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="text-center text-red-500">
                <p className="text-lg">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto p-4 md:p-6">
        {/* Top Row - Room Info and Illustration */}
        <div className="mb-6">
          <RoomInfoEditor 
            habitacion={habitacion} 
            loading={loading} 
            onRoomUpdated={handleRoomUpdated}
          />
        </div>
        
        {/* Middle Row - Reservation and Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Bookings */}
          <div className="md:col-span-2">
            <RoomBookings 
              habitacion={habitacion} 
              loading={loading} 
              onReservaDeleted={handleRoomUpdated}
            />
          </div>

          {/* Analytics */}
          <div className="md:col-span-1">
            <RoomAnalytics habitacion={habitacion} loading={loading} />
          </div>
        </div>

        {/* Bottom Row - Cleaning History */}
        <div className="grid grid-cols-1 gap-6">
          <RoomCleaningHistory habitacion={habitacion} loading={loading} />
        </div>
      </main>
    </div>
  )
}
