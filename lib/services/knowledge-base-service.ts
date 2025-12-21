import { createAdminClient } from "@/lib/supabase/admin"

export interface KnowledgeBaseEntry {
  category: string
  field_name: string
  field_value?: string
  field_data?: Record<string, any>
  confidence_score?: number
  verified?: boolean
}

export class KnowledgeBaseService {
  static async getKnowledgeBase(userId: string): Promise<KnowledgeBaseEntry[]> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("company_knowledge_base")
      .select("*")
      .eq("user_id", userId)
      .order("category", { ascending: true })

    if (error) throw error
    return data || []
  }

  static async getFieldValue(userId: string, category: string, fieldName: string): Promise<string | null> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("company_knowledge_base")
      .select("field_value, field_data")
      .eq("user_id", userId)
      .eq("category", category)
      .eq("field_name", fieldName)
      .single()

    if (error || !data) return null
    return data.field_value || JSON.stringify(data.field_data)
  }

  static async upsertEntry(userId: string, entry: KnowledgeBaseEntry): Promise<void> {
    const supabase = createAdminClient()

    await supabase.from("company_knowledge_base").upsert(
      {
        user_id: userId,
        ...entry,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,category,field_name",
      },
    )
  }

  static async autofillTenderForm(userId: string, formFields: string[]): Promise<Record<string, string>> {
    const knowledgeBase = await this.getKnowledgeBase(userId)
    const result: Record<string, string> = {}

    for (const field of formFields) {
      // Try to find matching entry in knowledge base
      const match = knowledgeBase.find(
        (entry) =>
          entry.field_name.toLowerCase() === field.toLowerCase() ||
          entry.field_name.toLowerCase().includes(field.toLowerCase()),
      )

      if (match) {
        result[field] = match.field_value || JSON.stringify(match.field_data)
      }
    }

    return result
  }
}
