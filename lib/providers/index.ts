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
 * Simple provider abstraction with retry logic and fallbacks.
 * - If `AZURE_OPENAI_ENDPOINT` + `AZURE_OPENAI_KEY` + `AZURE_OPENAI_DEPLOYMENT` are set, calls Azure OpenAI chat completions.
 * - Otherwise tries Gemini (stable v1 endpoint)
 * - Falls back to OpenAI if Gemini fails
 * - Implements exponential backoff retry for transient failures
 */
export async function generateTextViaProvider(opts: GenerateOptions) {
  const { model, prompt } = opts
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
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
          throw new ProviderError(`Azure OpenAI request failed: ${res.status} ${text}`, res.status)
        }

        const data = await res.json()
        const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text
        return { text: content ?? "" }
      }

      // Check for Gemini/Google
      let geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

      if (model.startsWith("gemini") && geminiKey) {
        geminiKey = geminiKey.trim()

        // Use stable v1 endpoint for production reliability
        // gemini-1.5-flash is available on v1 endpoint
        const geminiModel = model.includes("flash") ? "gemini-1.5-flash" : "gemini-pro"
        const apiVersion = "v1" // Changed from v1beta to stable v1

        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${geminiModel}:generateContent?key=${geminiKey}`

        console.log(`[v0] Provider: Gemini (Model: ${geminiModel}, API: ${apiVersion}) - attempt ${attempt}/${maxRetries}`)

        const body = {
          contents: [
            {
              role: "user",
              parts: [{ text: `${opts.system ? opts.system + "\n\n" : ""}${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2,
            maxOutputTokens: opts.maxTokens || 4000
          }
        }

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        })

        if (!res.ok) {
          const text = await res.text()
          console.error(`[v0] Gemini Error (${res.status}): ${text}`)

          // If quota exceeded or rate limit, try fallback immediately
          if (res.status === 429 || res.status === 403) {
            console.log('[v0] Gemini quota/rate limit - falling back to OpenAI')
            throw new ProviderError(`Gemini API quota/rate limit: ${res.status}`, res.status, true)
          }

          throw new ProviderError(`Gemini API request failed: ${res.status} ${text}`, res.status)
        }

        const data = await res.json()
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text

        if (!content) {
          throw new ProviderError('Gemini returned empty response', 500)
        }

        return { text: content }
      }

      // Fallback: OpenAI (openai package must be installed and `OPENAI_API_KEY` set)
      const openaiKey = process.env.OPENAI_API_KEY
      if (!openaiKey) throw new ProviderError("No OpenAI credentials found (set OPENAI_API_KEY or AZURE_OPENAI_* env vars)", 500)

      console.log(`[v0] Provider: OpenAI - attempt ${attempt}/${maxRetries}`)

      const client = new OpenAI({ apiKey: openaiKey })

      const resp = await client.chat.completions.create({
        model,
        messages: [{ role: "system", content: opts.system || "" }, { role: "user", content: prompt }],
        max_tokens: opts.maxTokens || 1500,
        temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2,
      })

      const content = resp.choices?.[0]?.message?.content
      return { text: content ?? "" }

    } catch (error: any) {
      lastError = error
      const shouldFallback = error instanceof ProviderError && error.shouldFallback

      console.error(`[v0] Provider attempt ${attempt}/${maxRetries} failed:`, error.message)

      // If this was a quota/rate limit error, try different provider immediately
      if (shouldFallback && attempt < maxRetries) {
        console.log('[v0] Attempting fallback to different provider...')
        continue
      }

      // For other errors, use exponential backoff before retry
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(`[v0] Retrying in ${delay}ms...`)
        await sleep(delay)
        continue
      }

      // Max retries exceeded
      break
    }
  }

  // All attempts failed
  throw new ProviderError(
    `All AI providers failed after ${maxRetries} attempts. Last error: ${lastError?.message}`,
    500
  )
}

// Helper class for provider errors
class ProviderError extends Error {
  statusCode: number
  shouldFallback: boolean

  constructor(message: string, statusCode: number, shouldFallback: boolean = false) {
    super(message)
    this.name = 'ProviderError'
    this.statusCode = statusCode
    this.shouldFallback = shouldFallback
  }
}

// Helper sleep function
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
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
