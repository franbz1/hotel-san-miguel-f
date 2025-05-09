import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Header } from "@/components/layout/header"

export default function RoomDetails() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bed Illustration or Room Image */}
          <div className="md:col-span-1">
            {(() => {
              // Example room data - this would come from your API or props
              const roomData = {
                status: "available", // Possible values: available, occupied, cleaning, maintenance
              }

              // Determine border color based on room status
              const getBorderColorClass = (status) => {
                switch (status) {
                  case "available":
                    return "border-emerald-500"
                  case "occupied":
                    return "border-blue-500"
                  case "cleaning":
                    return "border-yellow-500"
                  case "maintenance":
                    return "border-red-500"
                  default:
                    return "border-gray-300"
                }
              }

              return (
                <div
                  className={`border ${getBorderColorClass(roomData.status)} rounded-md p-4 flex justify-center overflow-hidden`}
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full max-w-[200px] text-emerald-500"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                  >
                    <rect x="10" y="50" width="80" height="30" rx="2" />
                    <rect x="15" y="40" width="70" height="10" rx="2" />
                    <rect x="15" y="30" width="70" height="10" rx="2" />
                    <line x1="15" y1="40" x2="15" y2="80" />
                    <line x1="85" y1="40" x2="85" y2="80" />
                  </svg>

                </div>
              )
            })()}
          </div>

          {/* Middle Column - Search and Reservation */}
          <div className="md:col-span-1 space-y-4">
            <p>aqui va la seccion de bookings unicamente de esta habitacion</p>
          </div>

          {/* Right Column - Chart */}
          <div className="md:col-span-1">
            <Card className="border shadow-sm h-full">
              <CardContent className="p-4 flex items-center justify-center">
                <p>aqui va la analitica de la habitacion</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Room Info Card */}
          <div className="md:col-span-1">
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <p>aqui va la info de la habitacion</p>
              </CardContent>
            </Card>
          </div>

          {/* Cleaning History */}
          <div className="md:col-span-2">
            <Card className="border shadow-sm h-full">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">HISTORIAL DE ASEO...</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {/* Aquí se podría agregar una tabla o lista con el historial de aseo */}
                <div className="text-sm text-gray-500">No hay registros de aseo para mostrar.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
