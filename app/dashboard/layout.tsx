import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
