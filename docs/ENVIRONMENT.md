# Environment & secrets

This file documents environment variables required to run the app locally and in production.

Important notes

- Never commit real secrets to the repository. Use `.env.local` for local development and your cloud provider's secret store (Azure Key Vault, Vercel/GitHub Actions secrets) for production.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` server-only.

Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase URL (public). Used by browser & server clients.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon public key. Safe for client-side use.
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-only). Grants elevated privileges; do NOT expose to the browser.
- `OPENAI_API_KEY` — OpenAI API key (server-side). Used for AI endpoints.
- `STRIPE_SECRET_KEY` — Stripe secret key (server-side). Used to create charges and manage payments.
- `SCRAPING_API_KEY` — API key used by scrapers (server-side).
- `USE_CUSTOM_PROMPT` — Optional feature flag; set to `true` or `false`.

Local development

1. Copy `.env.example` to `.env.local`.
2. Fill in values with your local/test keys.

- Deployment / provider secrets

- Add the same variables into your deployment platform's environment/secret configuration (Azure App Service/Functions, Vercel, GitHub Actions, etc.).
- Set `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` to "Production" scope and do NOT mark them as public.

Security recommendations

- Use provider secrets and restrict access to production keys.
- Rotate keys periodically and limit service role access.

Troubleshooting

- If you see runtime errors mentioning missing keys (e.g. `STRIPE_SECRET_KEY is not set`), verify the corresponding variable is present in the environment for the runtime (server vs browser).
