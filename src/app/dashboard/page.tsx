"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import { RoomsSection } from "@/components/rooms-section"
import { BookingsSection } from "@/components/bookings-section"

const StatCard = ({ title, value, color }: { title: string; value: string; color: string }) => {
  return (
    <Card>
      <CardContent className={`p-6 flex flex-col items-center justify-center ${color}`}>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className={`text-3xl font-bold`}>{value}</h3>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Hotel San Miguel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <UserNav />
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Habitaciones" value="127" color="text-emerald-600" />
          <StatCard title="Ocupación" value="6.5%" color="text-red-600" />
          <StatCard title="Reservas Activas" value="6+" color="text-emerald-600" />
          <StatCard title="Pendientes" value="0" color="text-gray-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rooms Panel */}
          <RoomsSection />

          {/* Bookings Panel */}
          <BookingsSection />
        </div>
      </div>
    </div>
  )
}
