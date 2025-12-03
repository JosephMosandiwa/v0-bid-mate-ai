import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "BidMate - AI-Powered Tender Assistance",
  description:
    "Win more tenders with AI-powered document analysis, intelligent tender search, and strategic bid guidance",
  generator: "v0.app",
  keywords: ["tender", "bidding", "procurement", "South Africa", "government tenders", "AI", "bid strategy"],
  authors: [{ name: "BidMate" }],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#005B8F" },
    { media: "(prefers-color-scheme: dark)", color: "#19A7CE" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                // Suppress MetaMask and external wallet errors
                if (event.reason?.message?.includes('MetaMask') || 
                    event.reason?.message?.includes('ethereum') ||
                    event.reason?.message?.includes('wallet')) {
                  event.preventDefault();
                  return;
                }
                
                // Log fetch errors with more detail
                if (event.reason?.message?.includes('fetch') || event.reason?.message?.includes('Failed to fetch')) {
                  console.error('[v0] Fetch error details:', {
                    message: event.reason?.message,
                    stack: event.reason?.stack,
                    url: event.reason?.url || 'unknown'
                  });
                  // Prevent the error from breaking the app
                  event.preventDefault();
                  return;
                }
                
                console.error('[v0] Unhandled promise rejection:', event.reason);
              });
            `,
          }}
        />
      </head>
      <body className={`font-sans ${inter.variable} ${poppins.variable}`}>
        <ErrorBoundary>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ThemeProvider defaultTheme="dark" storageKey="bidmate-theme">
              {children}
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
