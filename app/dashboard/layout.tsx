import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Toaster } from "sonner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      <Toaster position="top-right" />
    </div>
  )
}
