import OpenAI from "openai"
import { streamText as aiStreamText, convertToModelMessages as aiConvertToModelMessages, DefaultChatTransport as aiDefaultChatTransport } from "ai"

type GenerateOptions = {
  model: string
  prompt: string
  system?: string
  temperature?: number
  maxTokens?: number
}

/**
 * Simple provider abstraction.
 * - If `AZURE_OPENAI_ENDPOINT` + `AZURE_OPENAI_KEY` + `AZURE_OPENAI_DEPLOYMENT` are set, calls Azure OpenAI chat completions.
 * - Otherwise falls back to OpenAI (requires `OPENAI_API_KEY`).
 */
export async function generateTextViaProvider(opts: GenerateOptions) {
  const { model, prompt } = opts

  // Prefer Azure if configured
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT
  const azureKey = process.env.AZURE_OPENAI_KEY
  const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT

  if (azureEndpoint && azureKey && azureDeployment) {
    // Use Azure Chat Completions endpoint
    const url = `${azureEndpoint.replace(/\/$/, "")}/openai/deployments/${azureDeployment}/chat/completions?api-version=2023-05-15`
    const body = {
      messages: [{ role: "system", content: opts.system || "" }, { role: "user", content: prompt }],
      max_tokens: opts.maxTokens || 1500,
      temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2,
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": azureKey,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Azure OpenAI request failed: ${res.status} ${text}`)
    }

    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text
    return { text: content ?? "" }
  }

  // Fallback: OpenAI (openai package must be installed and `OPENAI_API_KEY` set)
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) throw new Error("No OpenAI credentials found (set OPENAI_API_KEY or AZURE_OPENAI_* env vars)")

  const client = new OpenAI({ apiKey: openaiKey })

  const resp = await client.chat.completions.create({
    model,
    messages: [{ role: "system", content: opts.system || "" }, { role: "user", content: prompt }],
    max_tokens: opts.maxTokens || 1500,
    temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2,
  })

  const content = resp.choices?.[0]?.message?.content
  return { text: content ?? "" }
}

export default generateTextViaProvider

// Streaming wrapper that delegates to the `ai` SDK but injects provider credentials
type StreamOptions = {
  model: string
  messages: Array<{ role: string; content: string }>
  temperature?: number
  maxTokens?: number
  abortSignal?: AbortSignal
  onFinish?: (args: { text: string; isAborted?: boolean }) => Promise<void> | void
}

export function streamTextViaProvider(opts: StreamOptions) {
  const openaiKey = process.env.OPENAI_API_KEY
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT
  const azureKey = process.env.AZURE_OPENAI_KEY

  const providerOptions: any = {}
  if (azureEndpoint && azureKey) {
    providerOptions.azure = {
      apiKey: azureKey,
      endpoint: azureEndpoint,
    }
  } else if (openaiKey) {
    providerOptions.openai = {
      apiKey: openaiKey,
    }
  }

  // Delegate to ai.streamText, preserving the SDK's stream response helpers
  return aiStreamText({
    model: opts.model,
    messages: opts.messages,
    temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2,
    maxTokens: opts.maxTokens || 1500,
    abortSignal: opts.abortSignal,
    onFinish: opts.onFinish,
    providerOptions,
  } as any)
}

export const convertToModelMessages = aiConvertToModelMessages
export const DefaultChatTransport = aiDefaultChatTransport
