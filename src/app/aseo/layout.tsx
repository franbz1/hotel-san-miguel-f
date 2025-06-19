import { AseoGuard } from "@/components/auth/aseo-guard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Users, 
  ClipboardList, 
  BarChart3
} from "lucide-react"
import { UserNav } from "@/components/user-nav"

interface AseoLayoutProps {
  children: React.ReactNode
}

export default function AseoLayout({ children }: AseoLayoutProps) {
  return (
    <AseoGuard>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Módulo de Aseo
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Hotel San Miguel
            </p>
          </div>
          
          <nav className="px-4 pb-4">
            <ul className="space-y-2">
              <li>
                <Link href="/aseo">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 h-10"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </li>
              
              <li>
                <Link href="/aseo/habitaciones">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 h-10"
                  >
                    <Users className="h-4 w-4" />
                    Habitaciones
                  </Button>
                </Link>
              </li>
              
              <li>
                <Link href="/aseo/registros">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 h-10"
                  >
                    <ClipboardList className="h-4 w-4" />
                    Registros
                  </Button>
                </Link>
              </li>
              
              <li>
                <Link href="/aseo/reportes">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 h-10"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Reportes
                  </Button>
                </Link>
              </li>
              
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-medium text-gray-900">
                  Sistema de Gestión de Aseo
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <UserNav />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AseoGuard>
  )
} 