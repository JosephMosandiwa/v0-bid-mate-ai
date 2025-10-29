import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CustomTenderDetailClient } from "./custom-tender-detail-client"

export default async function CustomTenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/custom-tenders/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    redirect("/dashboard/tenders")
  }

  const data = await response.json()

  return <CustomTenderDetailClient tender={data.tender} documents={data.documents} analysis={data.analysis} />
}
