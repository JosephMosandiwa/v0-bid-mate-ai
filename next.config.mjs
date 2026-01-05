/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
}

// Note: `eslint` and `typescript` build-ignore options are intentionally
// removed here because newer Next.js versions don't support them in
// `next.config.mjs`. Lint/type checks should be enforced in CI instead
// (see .github/workflows/ci.yml) and developers should fix issues locally.

export default nextConfig
