"use client"

import { RoomsSection } from "@/components/rooms/rooms-section"
import { BookingsSection } from "@/components/bookings/bookings-section"
import { Header } from "@/components/layout/header"
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics"

export default function DashboardPage() {

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Analytics Dashboard */}
      <div className="container mx-auto px-4 py-6">
        <DashboardAnalytics />

        <div className="space-y-6">
          {/* Primera fila: Habitaciones y Reservas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rooms Panel */}
            <RoomsSection />

            {/* Bookings Panel */}
            <BookingsSection title="Formularios de reservas" />
          </div>

        </div>
      </div>
    </div>
  )
}
