import { DashboardGuard } from "@/components/auth/dashboard-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardGuard>
      <div className="flex min-h-screen">
        {/* Aquí irá el sidebar */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </DashboardGuard>
  )
} 