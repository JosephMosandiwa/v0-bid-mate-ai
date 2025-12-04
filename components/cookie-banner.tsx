"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Cookie } from "lucide-react"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        essential: true,
        analytics: true,
        functional: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      }),
    )
    setIsVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        essential: true,
        analytics: false,
        functional: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      }),
    )
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border rounded-2xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">We use cookies</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to improve your experience and analyze site usage. Read our{" "}
                <Link href="/cookies" className="underline hover:text-primary">
                  Cookie Policy
                </Link>{" "}
                for more information.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={acceptEssential}
              className="flex-1 md:flex-none bg-transparent"
            >
              Essential Only
            </Button>
            <Button size="sm" onClick={acceptAll} className="flex-1 md:flex-none">
              Accept All
            </Button>
          </div>
          <button
            onClick={acceptEssential}
            className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
