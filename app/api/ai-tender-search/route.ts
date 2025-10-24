import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return Response.json({ error: "Search query is required" }, { status: 400 })
    }

    // TODO: Integrate with eTenders API to get real tender data
    // For now, use mock data
    const mockTendersDatabase = [
      {
        id: "T001",
        title: "Medical Equipment Supply and Maintenance",
        organization: "Department of Health - Gauteng",
        publishDate: "2025-01-15",
        closeDate: "2025-02-28",
        value: "R 3,500,000",
        category: "Medical Supplies",
        description:
          "Supply and maintenance of medical equipment for provincial hospitals including diagnostic machines, surgical equipment, and patient monitoring systems.",
        url: "https://etenders.gov.za/tender/T001",
      },
      {
        id: "T002",
        title: "IT Infrastructure Upgrade Project",
        organization: "Provincial Government - Western Cape",
        publishDate: "2025-01-10",
        closeDate: "2025-02-15",
        value: "R 8,000,000",
        category: "IT Services",
        description:
          "Comprehensive IT infrastructure upgrade including servers, networking equipment, cybersecurity solutions, and cloud migration services.",
        url: "https://etenders.gov.za/tender/T002",
      },
      {
        id: "T003",
        title: "Road Construction and Maintenance",
        organization: "City of Johannesburg",
        publishDate: "2025-01-12",
        closeDate: "2025-03-01",
        value: "R 15,000,000",
        category: "Construction",
        description:
          "Construction and maintenance of municipal roads including resurfacing, pothole repairs, and drainage system improvements.",
        url: "https://etenders.gov.za/tender/T003",
      },
      {
        id: "T004",
        title: "Consulting Services for Financial Management",
        organization: "National Treasury",
        publishDate: "2025-01-08",
        closeDate: "2025-02-20",
        value: "R 2,000,000",
        category: "Consulting",
        description:
          "Professional consulting services for financial management system implementation and training for government departments.",
        url: "https://etenders.gov.za/tender/T004",
      },
      {
        id: "T005",
        title: "School Building Construction Project",
        organization: "Department of Education - KwaZulu-Natal",
        publishDate: "2025-01-05",
        closeDate: "2025-03-15",
        value: "R 25,000,000",
        category: "Construction",
        description:
          "Construction of new primary school facilities including classrooms, administration block, sports facilities, and infrastructure.",
        url: "https://etenders.gov.za/tender/T005",
      },
    ]

    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      prompt: `You are an AI assistant helping users find relevant government tenders. 

User Query: "${query}"

Available Tenders:
${JSON.stringify(mockTendersDatabase, null, 2)}

Based on the user's query, analyze which tenders are most relevant and provide:
1. A brief explanation of what you found (2-3 sentences)
2. A JSON array of the most relevant tender IDs

Respond in this exact JSON format:
{
  "response": "Your explanation here",
  "relevantTenderIds": ["T001", "T002"]
}

Only include tenders that are truly relevant to the user's query. If no tenders match, return an empty array and explain why.`,
    })

    const aiResult = JSON.parse(text)
    const relevantTenders = mockTendersDatabase.filter((tender) => aiResult.relevantTenderIds.includes(tender.id))

    return Response.json({
      response: aiResult.response,
      tenders: relevantTenders,
    })
  } catch (error: any) {
    console.error("[v0] AI tender search error:", error)

    if (error?.message?.includes("API key") || error?.message?.includes("authentication")) {
      return Response.json(
        {
          error:
            "OpenAI API key is missing or invalid. Please add your OPENAI_API_KEY environment variable in the Vercel dashboard.",
          errorType: "api_key_required",
          dashboardUrl: "https://vercel.com/dashboard/stores",
        },
        { status: 403 },
      )
    }

    return Response.json({ error: "Failed to search tenders with AI" }, { status: 500 })
  }
}
