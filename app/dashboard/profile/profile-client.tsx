"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { GoogleAddressAutocomplete } from "@/components/google-address-autocomplete"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ProfileClientProps {
  googleMapsApiKey: string
}

export default function ProfileClient({ googleMapsApiKey }: ProfileClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Personal Information State
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    job_title: "",
  })

  // Company Information State
  const [company, setCompany] = useState({
    company_name: "",
    registration_number: "",
    tax_number: "",
    bee_status: "",
    vat_number: "",
    industry: "",
    company_size: "",
    address_line1: "",
    address_line2: "",
    city: "",
    province: "",
    postal_code: "",
    country: "South Africa",
    website: "",
  })

  const handleAddressChange = (address: string, placeDetails?: any) => {
    setCompany({ ...company, address_line1: address })

    // Optionally extract city, province, postal code from place details
    if (placeDetails?.address_components) {
      const components = placeDetails.address_components
      const city = components.find((c: any) => c.types.includes("locality"))?.long_name
      const province = components.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name
      const postalCode = components.find((c: any) => c.types.includes("postal_code"))?.long_name

      setCompany((prev) => ({
        ...prev,
        address_line1: address,
        ...(city && { city }),
        ...(province && { province: province.toLowerCase().replace(/\s+/g, "-") }),
        ...(postalCode && { postal_code: postalCode }),
      }))
    }
  }
  ;<div className="space-y-2">
    <Label htmlFor="address_line1">Address Line 1</Label>
    <GoogleAddressAutocomplete
      value={company.address_line1}
      onChange={handleAddressChange}
      placeholder="Start typing your address..."
      apiKey={googleMapsApiKey}
    />
    <p className="text-xs text-muted-foreground">
      Start typing to search for your address. City, province, and postal code will be auto-filled.
    </p>
  </div>
}
