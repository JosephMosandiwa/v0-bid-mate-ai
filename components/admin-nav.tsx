"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Database, TrendingUp, LogOut, Menu } from "lucide-react"
import { logoutAdmin } from "@/app/admin/login/actions"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface AdminNavProps {
  admin: {
    email: string
    full_name: string | null
    role: string
  }
}

export function AdminNav({ admin }: AdminNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: TrendingUp },
    { href: "/admin/scraping", label: "Scraping", icon: Database },
    { href: "/admin/usage", label: "Usage & Billing", icon: TrendingUp },
  ]

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-semibold">Admin Panel</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium">{admin.full_name || admin.email}</p>
          <p className="text-xs text-muted-foreground">{admin.role}</p>
        </div>
        <form action={logoutAdmin}>
          <Button variant="outline" className="w-full bg-transparent" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden border-b bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Admin Panel</span>
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
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r bg-background">
        <div className="flex flex-col h-full">
          <NavContent />
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64" />
    </>
  )
}
