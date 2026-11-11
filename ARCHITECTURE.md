# System Architecture & Technical Design Document

**Application Name**: CodeAIReview (`ai-code-review`)  
**Document Status**: Approved Canonical Design  
**Target Platform**: Next.js 16.2.9 (App Router) | React 19 Canary | Prisma 7.10.0 | Better Auth 1.7.7 | Octokit 5.0.5  
**Version**: 1.0.0  

---

## 1. Executive Summary & Product Vision

### 1.1. Purpose & Mission
**CodeAIReview** is an enterprise-grade automated AI Pull Request and Code Review SaaS platform. It connects seamlessly to GitHub organizations and personal accounts via a GitHub App. Upon receiving pull request events, the platform ingests unified git diffs, executes multi-pass static and LLM-driven code evaluations, and generates targeted, high-signal inline comments and comprehensive review summaries directly on GitHub.

### 1.2. Key Architectural Differentiators
- **Zero Hallucination Reviews**: Multi-pass filtering separates trivial formatting issues from critical architectural regressions, security vulnerabilities, and logic defects.
- **Asynchronous Webhook Decoupling**: Acknowledges GitHub webhook events within sub-second thresholds to prevent GitHub timeout drops, routing review payloads to background execution workers.
- **Modern Next.js 16 Infrastructure**: Utilizes native Next.js 16 `proxy.ts`, asynchronous server components with React 19 Canary, and Tailwind CSS v4.
- **Zero-Trust Multi-Tenancy**: Strict tenant boundary isolation at the database level with short-lived GitHub App installation tokens.

---

## 2. System Architecture & End-to-End Dataflow

### 2.1. High-Level System Architecture Diagram

```
+--------------------------------------------------------------------------------------------------------+
|                                           GitHub Ecosystem                                             |
|                                                                                                        |
|  [Developer PR Action] ----> [GitHub App Webhook Event] <----+ [Inline Review Comments & Check Runs]   |
+------------------------------------+-------------------------+-----------------------------------------+
                                     | (POST /api/webhooks/github)
                                     v
+--------------------------------------------------------------------------------------------------------+
|                                    Next.js 16 Ingress & Gateway Layer                                  |
|                                                                                                        |
|  [proxy.ts]                       HMAC Signature Check & Route Guarding                                |
|  [Route Handler]                  Fast 202 Accepted ACK (<500ms) + Ingestion Payload Normalization       |
+------------------------------------+-------------------------------------------------------------------+
                                     |
                                     v
+--------------------------------------------------------------------------------------------------------+
|                                   Core Business Domain Subsystems                                      |
|                                                                                                        |
|  features/github/                 features/ai/                          features/billing/              |
|  ├── installation.ts              ├── engine/ (Multi-pass Pipeline)     ├── usage-tracker.ts           |
|  ├── repos-query.ts               ├── parser/ (Git Diff & AST Chunking) └── tier-guard.ts              |
|  └── octokit-client.ts            └── prompts/ (Review Templates)                                      |
+------------------------------------+------------------------------------+------------------------------+
                                     |                                    |
                                     v                                    v
+----------------------------------------------------+  +------------------------------------------------+
|          Prisma 7 & PostgreSQL Data Layer          |  |                 External LLM API               |
|                                                    |  |                                                |
|  @prisma/adapter-pg with connection pooler        |  |  Pass 1: Syntax & Security Filter (Fast LLM)   |
|  Generated Client: @/generated/prisma/client       |  |  Pass 2: Architecture & Logic (Deep LLM)       |
+----------------------------------------------------+  +------------------------------------------------+
```

### 2.2. End-to-End Pull Request Review Flow

```
[PR Opened / Synchronized]
           │
           ▼
[GitHub App Webhook: /api/webhooks/github]
           │
           ├─► Verify X-Hub-Signature-256 HMAC (reject invalid)
           ├─► Check Quota / Subscription Tier (Free vs Pro)
           ├─► Return HTTP 202 Accepted immediately
           │
           ▼
[Background AI Review Job Execution]
           │
           ├─► Octokit: Create GitHub Check Run (Status: "in_progress")
           ├─► Octokit: Fetch unified diff & PR metadata
           │
           ▼
[Diff Parsing & Context Assembly]
           │
           ├─► Ignore lockfiles, minified bundles, vendor assets
           ├─► Split large diffs into hunk chunks with syntax boundaries
           │
           ▼
[Multi-Pass LLM Review Engine]
           │
           ├─► Pass 1 (Triage): Security vulnerabilities (OWASP), syntax bugs
           ├─► Pass 2 (Deep): Architectural consistency, race conditions, edge cases
           ├─► Pass 3 (Synthesis): Format markdown comments & line-number mappings
           │
           ▼
[Publishing Review Feedback]
           │
           ├─► Octokit: Post Pull Request Review with inline comments
           ├─► Octokit: Complete Check Run (Status: "completed", Conclusion: "success" | "neutral")
           └─► Prisma: Record ReviewRun metrics (duration, tokens consumed, score)
```

---

## 3. Domain Model & Database Schema

The database is built on **PostgreSQL** using **Prisma 7.10** with the `@prisma/adapter-pg` driver adapter.

```
+--------------------+        +---------------------+        +--------------------+
|        User        | 1    * |     Installation    | 1    * |     Repository     |
|--------------------|--------|---------------------|--------|--------------------|
| id: String (PK)    |        | id: String (PK)     |        | id: String (PK)    |
| email: String      |        | githubInstallId: Int|        | githubRepoId: Int  |
| name: String       |        | accountLogin: String|        | fullName: String   |
| image: String?     |        | accountType: String |        | defaultBranch: Str |
| plan: String       |        | installedAt: Date   |        | isPrivate: Boolean |
+--------------------+        +---------------------+        +--------------------+
                                                                        | 1
                                                                        |
                                                                        | *
+--------------------+        +---------------------+        +--------------------+
|   ReviewComment    | *    1 |      ReviewRun      | *    1 |    PullRequest     |
|--------------------|--------|---------------------|--------|--------------------|
| id: String (PK)    |        | id: String (PK)     |        | id: String (PK)    |
| path: String       |        | commitSha: String   |        | prNumber: Int      |
| line: Int          |        | status: Enum        |        | title: String      |
| body: String       |        | tokensUsed: Int     |        | author: String     |
| severity: Enum     |        | summary: String     |        | status: Enum       |
+--------------------+        +---------------------+        +--------------------+
```

### 3.1. Target Prisma Schema Extensions (`prisma/schema.prisma`)

```prisma
enum ReviewStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum CommentSeverity {
  INFO
  WARNING
  CRITICAL
}

enum SubscriptionTier {
  FREE
  PRO
  ENTERPRISE
}

model Installation {
  id              String       @id @default(cuid())
  githubInstallId Int          @unique
  accountLogin    String
  accountType     String       // "User" or "Organization"
  userId          String?
  user            User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  repositories    Repository[]
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([userId])
  @@map("installation")
}

model Repository {
  id              String         @id @default(cuid())
  githubRepoId    Int            @unique
  installationId  String
  installation    Installation   @relation(fields: [installationId], references: [id], onDelete: Cascade)
  fullName        String         // "owner/repo"
  name            String
  defaultBranch   String         @default("main")
  isPrivate       Boolean        @default(false)
  isSyncActive    Boolean        @default(true)
  pullRequests    PullRequest[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([installationId])
  @@index([fullName])
  @@map("repository")
}

model PullRequest {
  id              String         @id @default(cuid())
  repositoryId    String
  repository      Repository     @relation(fields: [repositoryId], references: [id], onDelete: Cascade)
  prNumber        Int
  title           String
  author          String
  baseBranch      String
  headBranch      String
  headSha         String
  reviewRuns      ReviewRun[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@unique([repositoryId, prNumber])
  @@map("pull_request")
}

model ReviewRun {
  id              String          @id @default(cuid())
  pullRequestId   String
  pullRequest     PullRequest     @relation(fields: [pullRequestId], references: [id], onDelete: Cascade)
  commitSha       String
  status          ReviewStatus    @default(PENDING)
  score           Int?            // Quality score 0-100
  summary         String?         @db.Text
  tokensUsed      Int             @default(0)
  durationMs      Int?
  comments        ReviewComment[]
  errorMessage    String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([pullRequestId])
  @@map("review_run")
}

model ReviewComment {
  id              String          @id @default(cuid())
  reviewRunId     String
  reviewRun       ReviewRun       @relation(fields: [reviewRunId], references: [id], onDelete: Cascade)
  filePath        String
  line            Int
  diffHunk        String          @db.Text
  body            String          @db.Text
  severity        CommentSeverity @default(INFO)
  createdAt       DateTime        @default(now())

  @@index([reviewRunId])
  @@map("review_comment")
}
```

---

## 4. AI Review Engine (`features/ai`)

### 4.1. Ingestion & Diff Pre-processing
Reviewing raw diffs naively leads to token exhaustion and noisy comments on auto-generated code.
1. **File Exclusion Filter**: Automatically skip lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `cargo.lock`), generated code (`generated/prisma/*`, `*.min.js`), and binary assets (`*.png`, `*.wasm`).
2. **Hunk Chunking**: Diffs exceeding the token budget (e.g. >12k tokens) are parsed into individual file hunks and processed in topological dependency order.

### 4.2. Multi-Pass Review Pipeline
1. **Pass 1 — Security & Static Hygiene (Fast/Triage)**:
   - Scans diff for secrets/keys, SQL injections, insecure deserialization, and syntax bugs.
   - Discards non-actionable stylistic complaints (formatting is handled by Prettier/ESLint, not AI).
2. **Pass 2 — Deep Architecture & Logic Review**:
   - Inspects state race conditions, missing error boundaries, asynchronous memory leaks, and breaking API changes.
   - Evaluates adherence to project design patterns (e.g. Next.js 16 conventions, server vs. client component isolation).
3. **Pass 3 — Synthesis & GitHub Comment Formatting**:
   - Maps diff lines to precise GitHub pull request review comments (`path`, `line`, `side`, `body`).
   - Generates high-level executive summary: What changed, key risks, and verification checklist.

---

## 5. Frontend & UI/UX Design System

Following our **Frontend Engineering Guidelines**, the UI is designed as a focused, dark-themed engineering command center:

### 5.1. Design Language & Visual Hierarchy
- **Canvas & Palette**: 
  - Primary Background: Pitch Black (`#000000`) and Deep Charcoal Zinc (`#09090b`).
  - Borders: Crisp, ultra-thin border rules (`border-zinc-800`).
  - Accents: Emerald (`#10b981`) for passing reviews and synced states; Amber (`#f59e0b`) for warnings; Rose (`#f43f5e`) for critical security flags.
- **Typography**:
  - Headings & Body: Geist Sans (`font-sans`).
  - Diffs, Code Blocks, Metrics: Geist Mono (`font-mono`).
- **Icons**: Standardized on `@remixicon/react` across all modules.

### 5.2. Core Route Structure
- `/`: Public landing page with GitHub OAuth entry point.
- `/dashboard`: High-level review overview, pending PR runs, code health metric charts.
- `/dashboard/repos`: Installed repository inventory with active sync triggers and visibility badges.
- `/dashboard/pull-request`: Live review history stream with searchable filters and failure diagnostics.
- `/dashboard/github`: GitHub App installation management and organization permission status.
- `/dashboard/settings`: Account profile, token quota, and subscription details.

---

## 6. Security, Compliance & Isolation Architecture

1. **Webhook Integrity**: Every webhook payload to `/api/webhooks/github` is verified using Node.js `crypto.timingSafeEqual` against `GITHUB_WEBHOOK_SECRET` before processing.
2. **GitHub App Token Rotation**: The application creates short-lived (1-hour) installation access tokens via RS256 JWT authenticated by `GITHUB_APP_PRIVATE_KEY`. No persistent user tokens are stored.
3. **Tenant Isolation**: Queries enforce strict multi-tenant constraints via `installationId` and authenticated `userId`.
4. **Code Confidentiality**: Source code diffs are transmitted directly to the LLM via encrypted API calls with zero-data-retention guarantees. Customer code is never stored in vector stores without explicit consent.

---

## 7. Operational Runbook & Verification Commands

| Action | Command | Expected Outcome |
| :--- | :--- | :--- |
| **Typecheck** | `npx tsc --noEmit` | Clean output with 0 errors. |
| **Database Generation** | `npx prisma generate --config prisma7.config.ts` | Types generated to `generated/prisma/client`. |
| **Schema Migration** | `npx prisma migrate dev --config prisma7.config.ts` | Local PostgreSQL migration executed and synced. |
| **Lint Check** | `npm run lint` | ESLint passes cleanly across App and Features. |
| **Dev Environment** | `npm run dev` | Next.js server operational on `http://localhost:3000`. |
| **Production Build** | `npm run build` | Zero build or SSG hydration errors. |

