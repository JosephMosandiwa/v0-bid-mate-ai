"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface GoogleAddressAutocompleteProps {
  value: string
  onChange: (value: string, placeDetails?: any) => void
  placeholder?: string
  className?: string
  apiKey: string
}

export function GoogleAddressAutocomplete({
  value,
  onChange,
  placeholder = "Start typing an address...",
  className,
  apiKey,
}: GoogleAddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const autocompleteElementRef = useRef<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key not configured")
      setIsLoading(false)
      return
    }

    const loadGoogleMaps = () => {
      if (typeof window !== "undefined" && !(window as any).google) {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
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

    const initAutocomplete = async () => {
      if (!containerRef.current) return

      try {
        const google = (window as any).google

        const { PlaceAutocompleteElement } = await google.maps.importLibrary("places")

        // Create the autocomplete element
        const autocompleteElement = new PlaceAutocompleteElement({
          componentRestrictions: { country: "za" }, // Restrict to South Africa
          fields: ["address_components", "formatted_address", "geometry"],
          types: ["address"],
        })

        // Clear container and append the new element
        containerRef.current.innerHTML = ""
        containerRef.current.appendChild(autocompleteElement)
        autocompleteElementRef.current = autocompleteElement

        // Listen for place selection
        autocompleteElement.addEventListener("gmp-placeselect", async (event: any) => {
          const place = event.place
          if (place) {
            await place.fetchFields({
              fields: ["address_components", "formatted_address", "geometry"],
            })

            if (place.formattedAddress) {
              setInputValue(place.formattedAddress)
              onChange(place.formattedAddress, {
                address_components: place.addressComponents,
                formatted_address: place.formattedAddress,
                geometry: place.location,
              })
            }
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
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [apiKey, onChange])

  if (error) {
    return (
      <div className="space-y-2">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            onChange(e.target.value)
          }}
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
    <div className="space-y-2">
      {isLoading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading address autocomplete...</span>
        </div>
      )}
      <div
        ref={containerRef}
        className={`${isLoading ? "hidden" : ""} [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-input [&_input]:bg-background [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:ring-offset-background [&_input]:placeholder:text-muted-foreground [&_input]:focus-visible:outline-none [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-ring [&_input]:focus-visible:ring-offset-2 [&_input]:disabled:cursor-not-allowed [&_input]:disabled:opacity-50 ${className}`}
      />
    </div>
  )
}
