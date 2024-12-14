# Human Event Discussion Summarizer

## Project Information

This is a [Next.js](https://nextjs.org/) project built to summarize and ask questions about discussion boards for HON 171/272 (Human Event) at [Arizona State University](https://www.asu.edu/). It uses the [xAI's Grok-beta model](https://x.ai/api) to generate summaries and responses, and is powered by [Convex](https://www.convex.dev/) for the backend.

## Prerequisites

- Node.js and Bun installed
- Accounts and API keys for:
  - Canvas
  - Convex
  - xAI
  - Posthog
  - Clerk

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   CANVAS_ACCESS_TOKEN=<your-canvas-access-token>
   XAI_API_KEY=<your-xai-api-key>
   NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-key>
   NEXT_PUBLIC_POSTHOG_HOST=<your-posthog-host-url>
   CONVEX_DEPLOYMENT=<your-convex-deployment>
   NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

4. Set up Convex:

   ```
   bunx convex dev
   ```

5. Run the development server:

   ```
   bun dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to see the website live.

## TODOS:

- [x] Make history sidebar w/ delete discussion button
- [x] Improve analytics
- [ ] Vercel AI SDK integration
- [ ] Potentially switch models
