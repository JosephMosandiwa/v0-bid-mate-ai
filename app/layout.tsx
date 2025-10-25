import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "BidMate - AI-Powered Tender Assistance",
  description: "Win more tenders with AI-powered document analysis and intelligent tender search",
  generator: "v0.app",
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
                console.error('[v0] Unhandled promise rejection:', event.reason);
              });
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <ThemeProvider defaultTheme="dark" storageKey="bidmate-theme">
              {children}
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
