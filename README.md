# BidMateAI

_Automatically synced with your [v0.app](https://v0.app) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/jmosandiwa-9269s-projects/v0-bid-mate-ai-xk)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Wf7xXE9Ytvj)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/jmosandiwa-9269s-projects/v0-bid-mate-ai-xk](https://vercel.com/jmosandiwa-9269s-projects/v0-bid-mate-ai-xk)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/Wf7xXE9Ytvj](https://v0.app/chat/projects/Wf7xXE9Ytvj)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Developer setup (Node version & install)

- This project requires Node.js >= 20.9.0 (Next.js target). We include an `.nvmrc` with `20.9.0` for convenience.
- Recommended local setup (using nvm):

```bash
# install Node 20.9.0 and use it
nvm install 20.9.0
nvm use 20.9.0

# install dependencies (Windows PowerShell-friendly)
pnpm run ci:install

# start dev server
pnpm dev
```

- If you are on Windows and encounter PowerShell script signing prompts, use the `ci:install` script which runs corepack enable non-interactively:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "echo y | corepack enable; pnpm install --frozen-lockfile --no-interactive"
```

Add your environment variables by copying `.env.example` to `.env.local` and filling values before running `pnpm dev`.
