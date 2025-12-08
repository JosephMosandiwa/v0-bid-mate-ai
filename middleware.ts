import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/auth",
    "/terms",
    "/privacy",
    "/cookies",
    "/contact",
    "/support",
    "/about",
  ]

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // If user is authenticated
  if (user) {
    // Don't check onboarding for the onboarding page itself or auth routes
    if (pathname.startsWith("/onboarding") || pathname.startsWith("/auth")) {
      return supabaseResponse
    }

    // Check if user has completed onboarding for dashboard routes
    if (pathname.startsWith("/dashboard")) {
      const { data: prefs } = await supabase
        .from("strategist_user_preferences")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .single()

      // If no preferences record or onboarding not completed, redirect to onboarding
      if (!prefs || !prefs.onboarding_completed) {
        const url = request.nextUrl.clone()
        url.pathname = "/onboarding"
        return NextResponse.redirect(url)
      }
    }

    // If user is authenticated and trying to access login/signup, redirect to dashboard
    if (pathname === "/login" || pathname === "/signup") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (let them handle their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
}
