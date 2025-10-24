"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [oauthError, setOauthError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      // Show success message - user needs to verify email
      router.push("/auth/verify-email")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: "google" | "azure" | "facebook") => {
    setOauthError("")
    console.log("[v0] Attempting OAuth sign up with provider:", provider)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.log("[v0] OAuth error:", error)
        throw error
      }
    } catch (err: any) {
      console.error("[v0] OAuth sign up failed:", err)

      // Check if it's a provider not enabled error
      if (
        err.message?.includes("provider") ||
        err.message?.includes("not enabled") ||
        err.message?.includes("Unsupported")
      ) {
        setOauthError(
          `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication is not configured yet. Please contact support or use email/password signup.`,
        )
      } else {
        setOauthError(err.message || `Failed to sign up with ${provider}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">BidMate</span>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Get started with your free trial today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {oauthError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{oauthError}</AlertDescription>
                </Alert>
              )}

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => handleOAuthSignUp("google")}
                  type="button"
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => handleOAuthSignUp("azure")}
                  type="button"
                >
                  Microsoft
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => handleOAuthSignUp("facebook")}
                  type="button"
                >
                  Facebook
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
