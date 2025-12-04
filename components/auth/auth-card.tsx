import type React from "react"
import { FileText } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground font-heading">BidMate</span>
        </Link>

        <Card className="border-border rounded-xl shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
            {footer && <div className="mt-6 text-center">{footer}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
