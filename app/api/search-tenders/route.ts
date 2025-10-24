export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return Response.json({ error: "Search query is required" }, { status: 400 })
    }

    console.log("[v0] Searching eTenders API for:", query)

    try {
      const today = new Date()
      const sixMonthsAgo = new Date(today)
      sixMonthsAgo.setMonth(today.getMonth() - 6)
      const sixMonthsAhead = new Date(today)
      sixMonthsAhead.setMonth(today.getMonth() + 6)

      const dateFrom = sixMonthsAgo.toISOString().split("T")[0]
      const dateTo = sixMonthsAhead.toISOString().split("T")[0]

      console.log("[v0] Date range:", dateFrom, "to", dateTo)

      // Fetch the swagger spec to discover correct endpoints
      console.log("[v0] Fetching swagger specification...")
      const swaggerUrl = "https://ocds-api.etenders.gov.za/swagger/v1/swagger.json"

      let swaggerSpec = null
      try {
        const swaggerResponse = await fetch(swaggerUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent": "BidMate-TenderAssistant/1.0",
          },
        })

        if (swaggerResponse.ok) {
          swaggerSpec = await swaggerResponse.json()
          console.log("[v0] Swagger spec loaded successfully")
          console.log("[v0] Available paths:", Object.keys(swaggerSpec.paths || {}))
        } else {
          console.log("[v0] Swagger fetch failed with status:", swaggerResponse.status)
        }
      } catch (swaggerError) {
        console.log("[v0] Could not fetch swagger spec:", swaggerError)
      }

      let possibleEndpoints = []

      if (swaggerSpec && swaggerSpec.paths) {
        const baseUrl = swaggerSpec.servers?.[0]?.url || "https://ocds-api.etenders.gov.za"

        for (const [path, methods] of Object.entries(swaggerSpec.paths)) {
          if (methods.get) {
            const fullUrl = `${baseUrl}${path}?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=100`
            possibleEndpoints.push(fullUrl)
            console.log("[v0] Found endpoint from swagger:", fullUrl)
          }
        }
      }

      if (possibleEndpoints.length === 0) {
        console.log("[v0] Using fallback endpoints")
        possibleEndpoints = [
          `https://ocds-api.etenders.gov.za/api/OCDSReleases?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=100`,
          `https://ocds-api.etenders.gov.za/api/v1/release?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=100`,
          `https://ocds-api.etenders.gov.za/api/v1/releases?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=100`,
        ]
      }

      let apiResponse = null
      let successfulEndpoint = null

      // Try each endpoint until one works
      for (const endpoint of possibleEndpoints) {
        console.log("[v0] Trying endpoint:", endpoint)
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "User-Agent": "BidMate-TenderAssistant/1.0",
            },
          })

          console.log("[v0] Response status:", response.status, "for", endpoint)

          if (response.ok) {
            apiResponse = response
            successfulEndpoint = endpoint
            console.log("[v0] Successfully connected to:", endpoint)
            break
          } else if (response.status !== 404) {
            // Log non-404 errors as they might give us clues
            const errorText = await response.text()
            console.log("[v0] Non-404 error:", response.status, errorText.substring(0, 200))
          }
        } catch (endpointError) {
          console.log("[v0] Endpoint error:", endpoint, endpointError)
          continue
        }
      }

      if (!apiResponse || !apiResponse.ok) {
        throw new Error("All eTenders API endpoints returned errors")
      }

      const data = await apiResponse.json()
      console.log("[v0] eTenders API response structure:", Object.keys(data))
      console.log("[v0] Sample data:", JSON.stringify(data).substring(0, 500))

      // Parse OCDS format response
      let releases = []

      // Handle different OCDS response formats
      if (data.releases) {
        releases = data.releases
      } else if (Array.isArray(data)) {
        releases = data
      } else if (data.data) {
        releases = Array.isArray(data.data) ? data.data : [data.data]
      }

      console.log("[v0] Found releases:", releases.length)

      // Map OCDS releases to our tender format
      const tenders = releases
        .filter((release: any) => {
          // Only include releases with tender information
          return release.tender && release.tender.title
        })
        .map((release: any) => {
          const tender = release.tender
          const parties = release.parties || []

          // Find the buyer/procuring entity
          const buyer = parties.find((p: any) => p.roles?.includes("buyer") || p.roles?.includes("procuringEntity"))

          // Extract value
          let value = "Not specified"
          if (tender.value?.amount) {
            const currency = tender.value.currency || "ZAR"
            const amount = new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: currency,
              minimumFractionDigits: 0,
            }).format(tender.value.amount)
            value = amount
          }

          // Extract dates
          const publishDate = release.date || tender.tenderPeriod?.startDate || new Date().toISOString()
          const closeDate = tender.tenderPeriod?.endDate || tender.submissionDeadline || publishDate

          // Extract category
          const category = tender.mainProcurementCategory || tender.classification?.description || "General"

          const documents = (tender.documents || [])
            .map((doc: any) => ({
              id: doc.id,
              title: doc.title || doc.description || "Tender Document",
              url: doc.url,
              documentType: doc.documentType || "other",
              format: doc.format || "application/pdf",
              description: doc.description,
            }))
            .filter((doc: any) => doc.url) // Only include documents with valid URLs

          console.log("[v0] Extracted documents for tender:", tender.title, "- Count:", documents.length)

          return {
            id: release.ocid || release.id || `tender-${Date.now()}`,
            title: tender.title,
            organization: buyer?.name || "Unknown Organization",
            publishDate: publishDate.split("T")[0],
            closeDate: closeDate.split("T")[0],
            value: value,
            category: category,
            description: tender.description || tender.title,
            url: release.url || `https://etenders.gov.za/tender/${release.ocid}`,
            documents: documents, // Include documents in tender data
          }
        })
        .filter((tender: any) => {
          // Filter by search query
          const searchLower = query.toLowerCase()
          return (
            tender.title.toLowerCase().includes(searchLower) ||
            tender.category.toLowerCase().includes(searchLower) ||
            tender.description.toLowerCase().includes(searchLower) ||
            tender.organization.toLowerCase().includes(searchLower)
          )
        })

      console.log("[v0] Mapped tenders:", tenders.length)
      return Response.json({ tenders })
    } catch (apiError) {
      console.error("[v0] eTenders API integration error:", apiError)

      console.log("[v0] Falling back to enhanced mock data")
      const mockTenders = [
        {
          id: "OCDS-591ADF-NT-2025-001",
          title: "Medical Equipment Supply and Maintenance Services",
          organization: "Department of Health - Gauteng Province",
          publishDate: "2025-01-15",
          closeDate: "2025-02-28",
          value: "R 3,500,000",
          category: "Medical Supplies",
          description:
            "Supply and maintenance of medical equipment for provincial hospitals including diagnostic machines, surgical equipment, and patient monitoring systems. Includes installation, training, and 3-year maintenance contract.",
          url: "https://etenders.gov.za/tender/OCDS-591ADF-NT-2025-001",
          documents: [
            {
              id: "doc-1",
              title: "Request for Proposal",
              url: "https://etenders.gov.za/documents/OCDS-591ADF-NT-2025-001/rfp.pdf",
              documentType: "technicalSpecifications",
              format: "application/pdf",
              description:
                "Detailed technical specifications for the medical equipment supply and maintenance services.",
            },
          ],
        },
        {
          id: "OCDS-591ADF-WC-2025-002",
          title: "IT Infrastructure Upgrade and Cloud Migration",
          organization: "Provincial Government - Western Cape",
          publishDate: "2025-01-10",
          closeDate: "2025-02-15",
          value: "R 8,000,000",
          category: "IT Services",
          description:
            "Comprehensive IT infrastructure upgrade including servers, networking equipment, cybersecurity solutions, and cloud migration services. Must comply with POPIA and government security standards.",
          url: "https://etenders.gov.za/tender/OCDS-591ADF-WC-2025-002",
          documents: [
            {
              id: "doc-2",
              title: "Business Case",
              url: "https://etenders.gov.za/documents/OCDS-591ADF-WC-2025-002/business_case.pdf",
              documentType: "businessCase",
              format: "application/pdf",
              description: "Business case for the IT infrastructure upgrade project.",
            },
          ],
        },
        {
          id: "OCDS-591ADF-JHB-2025-003",
          title: "Road Construction and Maintenance Programme",
          organization: "City of Johannesburg Metropolitan Municipality",
          publishDate: "2025-01-12",
          closeDate: "2025-03-01",
          value: "R 15,000,000",
          category: "Construction",
          description:
            "Construction and maintenance of municipal roads including resurfacing, pothole repairs, drainage system improvements, and traffic management systems. 18-month contract period.",
          url: "https://etenders.gov.za/tender/OCDS-591ADF-JHB-2025-003",
          documents: [
            {
              id: "doc-3",
              title: "Project Plan",
              url: "https://etenders.gov.za/documents/OCDS-591ADF-JHB-2025-003/project_plan.pdf",
              documentType: "projectPlan",
              format: "application/pdf",
              description: "Project plan for the road construction and maintenance programme.",
            },
          ],
        },
        {
          id: "OCDS-591ADF-NT-2025-004",
          title: "Office Furniture and Equipment Supply",
          organization: "National Treasury",
          publishDate: "2025-01-20",
          closeDate: "2025-02-20",
          value: "R 1,200,000",
          category: "Furniture & Equipment",
          description:
            "Supply of office furniture, equipment, and fittings for government offices including ergonomic desks, chairs, filing cabinets, meeting room furniture, and storage solutions. Must meet SABS standards.",
          url: "https://etenders.gov.za/tender/OCDS-591ADF-NT-2025-004",
          documents: [
            {
              id: "doc-4",
              title: "Specification Document",
              url: "https://etenders.gov.za/documents/OCDS-591ADF-NT-2025-004/specification.pdf",
              documentType: "specification",
              format: "application/pdf",
              description: "Specification document for the office furniture and equipment supply.",
            },
          ],
        },
        {
          id: "OCDS-591ADF-EC-2025-005",
          title: "Water Infrastructure Development Project",
          organization: "Department of Water and Sanitation - Eastern Cape",
          publishDate: "2025-01-18",
          closeDate: "2025-03-15",
          value: "R 25,000,000",
          category: "Infrastructure",
          description:
            "Development of water infrastructure including boreholes, water treatment facilities, and distribution networks for rural communities. Includes community training and 5-year maintenance plan.",
          url: "https://etenders.gov.za/tender/OCDS-591ADF-EC-2025-005",
          documents: [
            {
              id: "doc-5",
              title: "Feasibility Study",
              url: "https://etenders.gov.za/documents/OCDS-591ADF-EC-2025-005/feasibility_study.pdf",
              documentType: "feasibilityStudy",
              format: "application/pdf",
              description: "Feasibility study for the water infrastructure development project.",
            },
          ],
        },
        {
          id: "OCDS-591ADF-KZN-2025-006",
          title: "School Building Renovation and Maintenance",
          organization: "Department of Basic Education - KwaZulu-Natal",
          publishDate: "2025-01-22",
          closeDate: "2025-03-10",
          value: "R 12,000,000",
          category: "Construction",
          description:
            "Renovation and maintenance of school buildings including classroom repairs, roof replacements, plumbing, electrical work, and painting. Covers 15 schools across the province.",
          url: "https://etenders.gov.za/tender/OCDS-591ADF-KZN-2025-006",
          documents: [
            {
              id: "doc-6",
              title: "Building Plan",
              url: "https://etenders.gov.za/documents/OCDS-591ADF-KZN-2025-006/building_plan.pdf",
              documentType: "buildingPlan",
              format: "application/pdf",
              description: "Building plan for the school building renovation and maintenance project.",
            },
          ],
        },
        {
          id: "OCDS-591ADF-FS-2025-007",
          title: "Security Services for Government Buildings",
          organization: "Department of Public Works - Free State",
          publishDate: "2025-01-25",
          closeDate: "2025-02-25",
          value: "R 4,500,000",
          category: "Security Services",
          description:
            "Provision of security services for government buildings including armed response, access control, CCTV monitoring, and patrol services. 24/7 coverage required for 36-month period.",
          url: "https://etenders.gov.za/tender/OCDS-591ADF-FS-2025-007",
          documents: [
            {
              id: "doc-7",
              title: "Security Requirements",
              url: "https://etenders.gov.za/documents/OCDS-591ADF-FS-2025-007/security_requirements.pdf",
              documentType: "securityRequirements",
              format: "application/pdf",
              description: "Security requirements for the government buildings.",
            },
          ],
        },
        {
          id: "OCDS-591ADF-LP-2025-008",
          title: "Agricultural Equipment and Machinery Supply",
          organization: "Department of Agriculture - Limpopo",
          publishDate: "2025-01-28",
          closeDate: "2025-03-05",
          value: "R 6,800,000",
          category: "Agricultural Equipment",
          description:
            "Supply of agricultural equipment and machinery for smallholder farmers including tractors, ploughs, irrigation systems, and harvesting equipment. Includes operator training and maintenance support.",
          url: "https://etenders.gov.za/tender/OCDS-591ADF-LP-2025-008",
          documents: [
            {
              id: "doc-8",
              title: "Equipment List",
              url: "https://etenders.gov.za/documents/OCDS-591ADF-LP-2025-008/equipment_list.pdf",
              documentType: "equipmentList",
              format: "application/pdf",
              description: "List of agricultural equipment and machinery required for the supply.",
            },
          ],
        },
      ]

      const filteredTenders = mockTenders.filter(
        (tender) =>
          tender.title.toLowerCase().includes(query.toLowerCase()) ||
          tender.category.toLowerCase().includes(query.toLowerCase()) ||
          tender.description.toLowerCase().includes(query.toLowerCase()) ||
          tender.organization.toLowerCase().includes(query.toLowerCase()),
      )

      return Response.json({
        tenders: filteredTenders,
        warning: "Currently displaying sample tender data. The eTenders API connection is being established.",
        note: "This is demonstration data to showcase the platform's capabilities.",
      })
    }
  } catch (error) {
    console.error("[v0] Tender search error:", error)
    return Response.json({ error: "Failed to search tenders" }, { status: 500 })
  }
}
