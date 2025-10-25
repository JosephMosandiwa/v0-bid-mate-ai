"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface GoogleAddressAutocompleteProps {
  value: string
  onChange: (value: string, placeDetails?: any) => void
  placeholder?: string
  className?: string
  apiKey: string // API key passed as prop instead of reading from env
}

export function GoogleAddressAutocomplete({
  value,
  onChange,
  placeholder = "Start typing an address...",
  className,
  apiKey, // Receive API key as prop
}: GoogleAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key not configured")
      setIsLoading(false)
      return
    }

    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (typeof window !== "undefined" && !(window as any).google) {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = initAutocomplete
        script.onerror = () => {
          setError("Failed to load Google Maps. Please check your API key.")
          setIsLoading(false)
        }
        document.head.appendChild(script)
      } else if ((window as any).google) {
        initAutocomplete()
      }
    }

    const initAutocomplete = () => {
      if (!inputRef.current) return

      try {
        const google = (window as any).google
        // Initialize autocomplete with South African bias
        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "za" }, // Restrict to South Africa
          fields: ["address_components", "formatted_address", "geometry"],
          types: ["address"],
        })

        // Listen for place selection
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace()
          if (place && place.formatted_address) {
            onChange(place.formatted_address, place)
          }
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing autocomplete:", err)
        setError("Failed to initialize address autocomplete")
        setIsLoading(false)
      }
    }

    loadGoogleMaps()

    return () => {
      // Cleanup
      if (autocompleteRef.current && (window as any).google) {
        const google = (window as any).google
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [apiKey])

  if (error) {
    return (
      <div className="space-y-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
        <p className="text-xs text-muted-foreground">
          Address autocomplete unavailable. You can still enter the address manually.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
