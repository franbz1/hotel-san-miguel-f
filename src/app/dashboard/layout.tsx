import { DashboardGuard } from "@/components/auth/dashboard-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardGuard>
      <div className="flex min-h-screen w-full">
        {/* Aquí irá el sidebar */}
        <main className="flex-1 w-full p-0 sm:p-2 md:p-8">
          {children}
        </main>
      </div>
    </DashboardGuard>
  )
}