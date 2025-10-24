"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    if (!error.message?.includes("MetaMask") && !error.message?.includes("ethereum")) {
      console.error("[v0] Error caught by boundary:", error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.error?.message?.includes("MetaMask") || this.state.error?.message?.includes("ethereum")) {
        return this.props.children
      }

      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground">Please refresh the page to try again.</p>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
