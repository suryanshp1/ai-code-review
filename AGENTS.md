<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Standards & Repository Operating Guide: `ai-code-review`

> **Role & Authority**: This document is the canonical ground truth for all AI coding agents working on this codebase. Strict adherence is mandatory to maintain architectural integrity, type safety, and security.

---

## 1. Project Identity & Mission

`ai-code-review` (branded as **CodeAIReview**) is an automated AI-powered GitHub PR & code review SaaS platform.
- **Purpose**: Ingest pull request webhooks and repo changes via a GitHub App, run intelligent code analysis/review passes using LLMs, and post contextual review summaries and inline comments back to GitHub.
- **Tech Stack**:
  - **Framework**: Next.js 16.2.9 (App Router, React 19.2.4 Canary)
  - **Runtime**: Node.js
  - **Language**: TypeScript 5 (Strict Mode)
  - **ORM**: Prisma 7.10.0 with PostgreSQL driver adapter (`@prisma/adapter-pg`)
  - **Auth**: Better Auth 1.7.7 (GitHub OAuth provider, Prisma adapter)
  - **Integrations**: Octokit 5.0.5 + GitHub App (Webhook secret, App ID, Private Key PEM)
  - **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first config)
  - **UI Primitives**: Base UI (`@base-ui/react`), `@shadcn/react`, `@remixicon/react`
  - **Client State & Cache**: TanStack React Query v5

---

## 2. Framework Invariants & Anti-Hallucination Rules

### 2.1. Next.js 16 Breaking Conventions
1. **Proxy Convention (`proxy.ts`)**:
   - Next.js 16 **deprecated and renamed `middleware.ts` to `proxy.ts`**.
   - The file is located at the project root (`proxy.ts`).
   - The handler function MUST be named `export function proxy(request: NextRequest)`.
   - **DO NOT** create or reference `middleware.ts`.
   - Proxy runs in Node.js runtime by default. Do not add `export const runtime = ...` to `proxy.ts`.
2. **Asynchronous Request APIs**:
   - `params` and `searchParams` in `Page` and `Layout` props are **Promises**. They must be resolved:
     ```tsx
     // Correct in Next.js 15/16:
     export default async function Page({
       params,
       searchParams,
     }: {
       params: Promise<{ id: string }>;
       searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
     }) {
       const { id } = await params;
       const search = await searchParams;
       // ...
     }
     ```
   - Server utilities like `headers()` and `cookies()` from `next/headers` return Promises and **MUST be awaited**:
     ```ts
     const headersList = await headers();
     const cookieStore = await cookies();
     ```
3. **Internal Documentation Source**:
   - Next.js ships full version-matched docs inside the package at `node_modules/next/dist/docs/`.
   - When uncertain about App Router APIs, read files under `node_modules/next/dist/docs/01-app/`.

### 2.2. Prisma 7 Architecture & Invariants
1. **Configuration**:
   - Prisma 7 configuration resides in `prisma7.config.ts` using `defineConfig` from `prisma/config`.
   - Schema is located at `prisma/schema.prisma`.
2. **Client Generation & Import**:
   - Schema generator is configured with `output = "../generated/prisma"`.
   - The generated client is at `@/generated/prisma/client`.
   - **ALWAYS** import Prisma from the singleton at `@/lib/db`:
     ```ts
     import { prisma } from "@/lib/db";
     ```
   - **NEVER** instantiate `new PrismaClient()` directly in application files.
3. **Driver Adapter**:
   - Prisma 7 uses driver adapters. For PostgreSQL, the client uses `PrismaPg` from `@prisma/adapter-pg` initialized with `process.env.DATABASE_URL`.
4. **CLI Commands**:
   - When running CLI migrations or generation, pass `--config prisma7.config.ts`:
     ```bash
     npx prisma generate --config prisma7.config.ts
     npx prisma migrate dev --config prisma7.config.ts
     ```

### 2.3. Better Auth Standards
- Server instance: `@/lib/auth` (configured with `prismaAdapter` and GitHub social provider).
- Client instance: `@/lib/auth-client` (`createAuthClient` from `better-auth/react`).
- Server actions / Server auth checks:
  - Use `features/auth/actions/index.ts`:
    - `getServerSession()`: Retrieves active session on server.
    - `requireAuth(redirectTo?)`: Guards protected server actions/routes.
    - `requireUnauth(redirectTo?)`: Redirects logged-in users away from auth pages.

### 2.4. Design System & Styling (Tailwind v4 + Remix Icons)
- **Tailwind CSS v4**: Configured via `@import "tailwindcss";` in `app/globals.css`. Do not add a legacy `tailwind.config.js`.
- **Icons**:
  - The project standard icon library is `@remixicon/react` (configured in `components.json`).
  - Use Remix Icons (e.g., `RiGithubFill`, `RiGitPullRequestLine`, `RiLoaderLine`, `RiLockLine`).
  - **DO NOT** import icons from `@phosphor-icons/react` or `lucide-react` unless explicitly installed.
- **UI Components**:
  - Located in `components/ui/`. Built on top of `@base-ui/react` and `@shadcn/react`.
  - Always check `components/ui/` before creating custom base UI controls.

---

## 3. Directory Layout & Feature Modular Architecture

The codebase enforces a **Feature-Sliced / Domain-Driven Architecture**. Application logic must be grouped by business domain rather than technical layers.

```
ai-code-review/
├── app/                         # Next.js App Router (Thin routing layer only)
│   ├── (auth)/                  # Public auth routes (e.g. /sign-in)
│   ├── (protected)/             # Authenticated routes (/dashboard, /dashboard/github)
│   ├── api/                     # Route handlers (e.g. /api/auth/[...all], webhooks)
│   ├── globals.css              # Tailwind v4 root styles & theme variables
│   ├── layout.tsx               # Root layout (Providers, fonts, metadata)
│   └── page.tsx                 # Landing / root page
├── features/                    # Domain modules (Core business logic)
│   ├── auth/                    # Authentication domain (actions, components, utils)
│   ├── dashboard/               # Dashboard UI, nav items, sidebar, shell, repo lists
│   ├── github/                  # GitHub App, Octokit clients, installations, webhooks
│   └── ai/                      # AI code review engine, prompt chains, LLM integrations
├── components/
│   ├── ui/                      # Reusable headless design system components (shadcn/base-ui)
│   └── providers/               # Context providers (Theme, React Query)
├── lib/                         # Global infrastructure singletons & shared helpers
│   ├── auth.ts                  # Better Auth server configuration
│   ├── auth-client.ts           # Better Auth client export
│   ├── db.ts                    # Prisma 7 client singleton with pg driver adapter
│   └── utils.ts                 # Styling utilities (cn helper)
├── prisma/
│   ├── migrations/              # Prisma database migrations
│   └── schema.prisma            # Canonical Prisma database schema
├── generated/                   # Generated Prisma client output (DO NOT edit manually)
├── proxy.ts                     # Next.js 16 Request Proxy / Guard
├── prisma7.config.ts            # Prisma 7 CLI configuration
├── package.json                 # Dependency manifests & npm scripts
└── AGENTS.md                    # This agent instruction file
```

### Module Boundaries:
- `app/` files should be thin wrappers that import feature components and feature actions.
- Each domain under `features/<domain>` encapsulates:
  - `components/`: UI components specific to this feature.
  - `server/` or `actions/`: Server actions (`"use server"`), queries, and data mutations.
  - `lib/` or `utils/`: Feature-specific types, helpers, and schemas.
  - `hooks/`: Feature-specific React hooks.

---

## 4. Code Standards & TypeScript Guidelines

1. **Strict Type Safety**:
   - `noImplicitAny` is enforced. Never use `any`. Use `unknown` with type guards if uncertain.
   - Define explicit return types for server actions and public API helpers.
2. **Server vs. Client Components**:
   - **Default to Server Components (RSC)**.
   - Use `"use client"` directive only when components require:
     - React state (`useState`, `useReducer`)
     - React lifecycle / effects (`useEffect`)
     - Event listeners (`onClick`, `onChange`)
     - Browser-only APIs
   - **Security boundary**: Never import `@/lib/db`, `@/lib/auth`, or GitHub App private keys inside a `"use client"` file.
3. **Path Aliasing**:
   - Always use the `@/*` alias mapped in `tsconfig.json`:
     - `@/features/...`
     - `@/components/...`
     - `@/lib/...`
4. **Environment Variables**:
   - Client-accessible environment variables must be prefixed with `NEXT_PUBLIC_` (e.g. `NEXT_PUBLIC_GITHUB_PUBLIC_LINK`).
   - Server secrets (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET`) must never have `NEXT_PUBLIC_` prefixes.

---

## 5. Development & Verification Workflow

Agents must verify their work using the following commands:

| Command | Purpose |
| :--- | :--- |
| `npx tsc --noEmit` | **Typecheck verification**. Must pass with 0 errors before declaring done. |
| `npm run lint` | ESLint check across all files. |
| `npm run dev` | Runs the Next.js development server on `http://localhost:3000`. |
| `npm run build` | Full production build. Ensures zero build/SSG/hydration errors. |
| `npx prisma generate --config prisma7.config.ts` | Regenerates Prisma client into `generated/prisma/client`. |
| `npx prisma migrate dev --config prisma7.config.ts` | Applies schema changes in development. |

---

## 6. Critical Agent Execution Rules

1. **Preserve Next.js Rule Markers**: The `<!-- BEGIN:nextjs-agent-rules -->` block at the top of this file is managed by Next.js tooling. Do not remove or alter its boundary comments.
2. **Verify Dependencies Before Importing**: Before adding an import, inspect `package.json` to verify the package is installed. Do not guess package names.
3. **Database Changes**: Always update `prisma/schema.prisma` and run migration/generation commands. Never write raw SQL migrations manually without Prisma tracking.
4. **Zero Broken Builds**: Before reporting completion to the user, run `npx tsc --noEmit` to ensure no compile-time regressions were introduced.
