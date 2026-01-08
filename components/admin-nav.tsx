"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Database, TrendingUp, LogOut, Menu, LayoutDashboard, Users, Settings, FileText } from "lucide-react"
import { logoutAdmin } from "@/app/admin/login/actions"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AdminData {
  email: string
  full_name: string | null
  role: string
}

export function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const response = await fetch("/api/admin/me")
        if (response.ok) {
          const data = await response.json()
          setAdmin(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch admin data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/scraping", label: "Scraping", icon: Database },
    { href: "/admin/usage", label: "Usage & Billing", icon: TrendingUp },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/logs", label: "Activity Logs", icon: FileText },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  if (loading) {
    return (
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r bg-card">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
      </div>
    )
  }

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-6 py-4 border-b bg-primary/5">
        <Shield className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">Admin Panel</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {admin && (
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {admin.full_name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{admin.full_name || admin.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{admin.role}</p>
            </div>
          </div>
          <form action={logoutAdmin as any}>
            <Button variant="outline" className="w-full bg-transparent" type="submit" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold">Admin Panel</span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r bg-card shadow-sm">
        <div className="flex flex-col h-full">
          <NavContent />
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64" />
    </>
  )
}
