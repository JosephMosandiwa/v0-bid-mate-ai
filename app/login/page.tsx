"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AuthCard } from "@/components/auth/auth-card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [oauthError, setOauthError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "azure" | "facebook") => {
    setOauthError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      if (
        err.message?.includes("provider") ||
        err.message?.includes("not enabled") ||
        err.message?.includes("Unsupported")
      ) {
        setOauthError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication is not configured yet.`)
      } else {
        setOauthError(err.message || `Failed to sign in with ${provider}`)
      }
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account to continue"
      footer={
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full rounded-xl" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
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
            className="rounded-xl bg-transparent"
            onClick={() => handleOAuthSignIn("google")}
            type="button"
          >
            Google
          </Button>
          <Button
            variant="outline"
            className="rounded-xl bg-transparent"
            onClick={() => handleOAuthSignIn("azure")}
            type="button"
          >
            Microsoft
          </Button>
          <Button
            variant="outline"
            className="rounded-xl bg-transparent"
            onClick={() => handleOAuthSignIn("facebook")}
            type="button"
          >
            Facebook
          </Button>
        </div>
      </div>
    </AuthCard>
  )
}
