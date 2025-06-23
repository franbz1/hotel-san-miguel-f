import { AseoGuard } from "@/components/auth/aseo-guard"
import { Header } from "@/components/layout/header"

interface AseoLayoutProps {
  children: React.ReactNode
}

export default function AseoLayout({ children }: AseoLayoutProps) {
  return (
    <AseoGuard>
      <div className="container mx-auto px-4 py-6">

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AseoGuard>
  )
} 