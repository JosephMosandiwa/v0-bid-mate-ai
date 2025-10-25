import type React from "react"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Authentication is now handled by individual pages
  return (
    <div className="min-h-screen bg-background">
      <main className="w-full">{children}</main>
    </div>
  )
}
