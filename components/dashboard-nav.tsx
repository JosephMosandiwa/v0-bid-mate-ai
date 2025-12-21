"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Home,
  Search,
  Sparkles,
  LogOut,
  Menu,
  User,
  FolderOpen,
  Calculator,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Building2,
} from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [tendersOpen, setTendersOpen] = useState(true)

  const handleLogout = async () => {
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Failed to log out")
      return
    }
    router.push("/")
  }

  const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/strategist", label: "AI Strategist", icon: MessageSquare, badge: "New" },
  ]

  const tenderNavItems = [
    { href: "/dashboard/tenders", label: "My Tenders", icon: FileText },
    { href: "/dashboard/search", label: "Search Tenders", icon: Search },
    { href: "/dashboard/analyze", label: "AI Analyzer", icon: Sparkles },
  ]

  const toolNavItems = [
    { href: "/dashboard/boq", label: "Bill of Quantities", icon: Calculator },
    { href: "/dashboard/documents", label: "Documents", icon: FolderOpen },
  ]

  const settingsNavItems = [
    { href: "/dashboard/account", label: "Account Settings", icon: User },
    { href: "/dashboard/companies", label: "My Companies", icon: Building2 },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ item, onClick }: { item: (typeof mainNavItems)[0]; onClick?: () => void }) => {
    const Icon = item.icon
    const active = isActive(item.href)
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
          active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <Badge variant={active ? "secondary" : "default"} className="text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  const NavSection = ({
    title,
    items,
    collapsible = false,
    defaultOpen = true,
  }: {
    title: string
    items: typeof mainNavItems
    collapsible?: boolean
    defaultOpen?: boolean
  }) => {
    if (collapsible) {
      return (
        <Collapsible open={tendersOpen} onOpenChange={setTendersOpen} className="space-y-1">
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
            {title}
            <ChevronDown className={`h-4 w-4 transition-transform ${tendersOpen ? "" : "-rotate-90"}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {items.map((item) => (
              <NavLink key={item.href} item={item} onClick={() => setOpen(false)} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <div className="space-y-1">
        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
        {items.map((item) => (
          <NavLink key={item.href} item={item} onClick={() => setOpen(false)} />
        ))}
      </div>
    )
  }

  const NavContent = () => (
    <div className="space-y-6">
      {/* Main */}
      <div className="space-y-1">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} onClick={() => setOpen(false)} />
        ))}
      </div>

      {/* Tenders */}
      <NavSection title="Tenders" items={tenderNavItems} collapsible defaultOpen />

      {/* Tools */}
      <NavSection title="Tools" items={toolNavItems} />

      {/* Settings */}
      <NavSection title="Account" items={settingsNavItems} />
      <NavSection
        title="Companies"
        items={[{ href: "/dashboard/companies", label: "My Companies", icon: Building2 }]}
      />
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card/50 flex-col">
        <div className="p-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">BidMate</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          <NavContent />
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          {/* Help Link */}
          <Link
            href="/support"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </Link>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden border-b border-border bg-card/50 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          <span className="text-xl font-bold text-foreground">BidMate</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">B</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">BidMate</span>
                </Link>
              </div>
              <nav className="p-3 overflow-y-auto max-h-[calc(100vh-180px)]">
                <NavContent />
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-background">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  )
}
