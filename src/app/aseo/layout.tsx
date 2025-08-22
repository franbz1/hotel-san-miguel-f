import { AseoGuard } from "@/components/auth/aseo-guard"
import { Header } from "@/components/layout/header"

interface AseoLayoutProps {
  children: React.ReactNode
}

export default function AseoLayout({ children }: AseoLayoutProps) {
  return (
    <AseoGuard>
      <div className="flex min-h-screen w-full">

        {/* Main Content */}
        <div className="flex-1 w-full p-0 sm:p-2 md:p-8">
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