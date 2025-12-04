"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AuthCard } from "@/components/auth/auth-card"

export default function SignupPage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [oauthError, setOauthError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedTerms) {
      setError("You must accept the Terms of Use and Privacy Policy")
      return
    }
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
            company_name: companyName,
          },
        },
      })

      if (error) throw error
      router.push("/auth/verify-email")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: "google" | "azure" | "facebook") => {
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
        setOauthError(err.message || `Failed to sign up with ${provider}`)
      }
    }
  }

  return (
    <AuthCard
      title="Create an account"
      description="Get started with your free trial today"
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Acme Corporation"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl"
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
            className="rounded-xl"
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
            className="rounded-xl"
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
            I agree to the{" "}
            <Link href="/legal/terms" className="text-primary hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
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
              Creating account...
            </>
          ) : (
            "Create Account"
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
            onClick={() => handleOAuthSignUp("google")}
            type="button"
          >
            Google
          </Button>
          <Button
            variant="outline"
            className="rounded-xl bg-transparent"
            onClick={() => handleOAuthSignUp("azure")}
            type="button"
          >
            Microsoft
          </Button>
          <Button
            variant="outline"
            className="rounded-xl bg-transparent"
            onClick={() => handleOAuthSignUp("facebook")}
            type="button"
          >
            Facebook
          </Button>
        </div>
      </div>
    </AuthCard>
  )
}
