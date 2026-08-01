
# 🤖 DreamDOT: AI Rules of Engagement (Super Saiyan Edition)

You are an expert AI coding assistant working on **DreamDOT**, a Turborepo monorepo containing a Next.js 15 frontend, Express microservices, and a hybrid PostgreSQL/MongoDB database layer. 

Your primary directive is to **strictly adhere** to the language boundaries, logging requirements, and coding conventions defined below. **Never deviate from these rules.**

---

## 1. The Iron Law: Strict Language & File Boundaries
This is the most critical rule. You must strictly separate languages by directory and file type. **No exceptions.**

### 🎨 Frontend (Next.js UI)
* **Language:** TypeScript **ONLY**.
* **File Extensions:** `.ts`, `.tsx`.
* **Scope:** All React components, pages (`page.tsx`), layouts, hooks, context providers, Zustand stores, and utility functions inside `apps/web/src/` (excluding the `app/api` directory).

### ⚙️ Next.js API Routes
* **Language:** JavaScript **ONLY**.
* **File Extensions:** `.js` (e.g., `route.js`).
* **Scope:** All API route handlers inside `apps/web/src/app/api/**/route.js`.
* **Rule:** Do **NOT** use `.ts`, `NextRequest`, or `NextResponse` TypeScript types in API routes. Use standard JavaScript, JSDoc for typing if necessary, and standard `Request`/`Response` objects.

### 🖥️ Backend Microservices
* **Language:** JavaScript (Node.js) **OR** Python **ONLY**.
* **File Extensions:** `.js` (for Node/Express services) or `.py` (for Python services).
* **Scope:** `apps/chat`, `apps/payment`, `apps/web3`, `apps/meta`, `apps/database-mongo`, and any future data/AI services.
* **Rule:** **NEVER** write backend services in Go, Rust, Java, C++, or any other language. If a service is Node-based, use `.js`. If it is Python-based, use `.py`.

---

## 2. Logging & Debugging ("Print Everywhere")
Visibility is paramount. Do not let errors, state changes, or data flows happen silently.

* **JavaScript/TypeScript:** Use `console.log()`, `console.error()`, and `console.warn()` extensively.
* **Python:** Use `print()` or the `logging` module extensively.
* **What to log:**
  * API request payloads and headers (mask sensitive tokens/PII).
  * Database query parameters and execution times.
  * State changes in React components (e.g., `console.log('[UI] User toggled dark mode')`).
  * WebSocket/Socket.IO connection events, room joins, and message payloads.
  * Stripe/Meta webhook events and payload signatures.
* **Rule:** If an error is caught in a `catch` block, you **MUST** `console.log(error)` or `console.error(error)` before handling it. **Never swallow errors silently.**

---

## 3. Coding Standards & Style

### React / Frontend (TypeScript)
* Use **Functional Components** and React Hooks. **NEVER** use Class components.
* Use `const` for component definitions (e.g., `const MyComponent = () => {}`).
* Keep components small and modular. Extract complex logic into custom hooks (`useXxx.ts`) or Zustand stores.
* Use **Tailwind CSS** for styling. Avoid inline styles or CSS-in-JS unless explicitly requested.

### Backend / APIs (JavaScript & Python)
* **Node/Express:** Use ES6+ syntax. Use `async/await` for all asynchronous operations.
* **Python:** Follow PEP 8 guidelines. Use `asyncio` only if the service requires high concurrency; otherwise, standard synchronous Python is fine.
* Always validate incoming request bodies (use Zod for JS, Pydantic for Python).

---

## 4. Import Rules
* **Frontend (Next.js):** **ALWAYS** use absolute imports with the `@/` alias for anything inside `apps/web/src/`.
  * ✅ `import { Button } from '@/components/ui/button'`
  * ❌ `import { Button } from '../../../components/ui/button'`
* **Backend Services:** Use relative imports for local files. Use workspace aliases (e.g., `@repo/database-mongo`) for shared monorepo packages.

---

## 5. Error Handling Rules
* **Frontend:** Wrap critical UI sections in React Error Boundaries. Use `try/catch` in all `async` event handlers and display user-friendly toast notifications (e.g., Sonner) on failure.
* **Backend:** 
  * Always return structured JSON error responses: `{ "error": "Descriptive message", "code": "ERROR_CODE" }`.
  * Use proper HTTP status codes (400 for bad input, 401 for unauthorized, 404 for not found, 500 for server errors).
  * Implement global error-handling middleware in Express.

---

## 6. The "NEVER" List (Strict Prohibitions) 🚫
* 🚫 **NO `any` type in TypeScript:** Never use `any`. Use `unknown`, `never`, or define proper interfaces/types. If stuck, use `as unknown as Type` temporarily but add a `// TODO: Fix type` comment.
* 🚫 **NO new dependencies:** Do not run `npm install` or `pip install` without explicitly asking me first. Use existing dependencies in `package.json` / `requirements.txt`.
* 🚫 **NO language mixing:** Do not write a `.ts` API route. Do not write a `.go` microservice. Do not write a `.py` React component.
* 🚫 **NO silent failures:** Never leave an empty `catch {}` block.
* 🚫 **NO mock data in production logic:** Do not hardcode fake data in API routes. If a DB query fails, throw an error; do not return fake data to hide the bug.
* 🚫 **NO mutating state directly in React:** Always use the setter functions provided by `useState`, `useReducer`, or Zustand.

---

## 7. Database & ORM Rules
* **PostgreSQL (Prisma):** Use the Prisma Client for relational data (Users, Auth, Social Graph, Meta Integrations). Always use Prisma transactions (`prisma.$transaction`) for multi-table writes.
* **MongoDB (Mongoose):** Use Mongoose for document data (Posts, Items, Chat, Transactions). Ensure you are using the shared models from `@repo/database-mongo`.
* **Rule:** Always log the Prisma/Mongoose query parameters using `console.log` before execution during development.

---

## 8. AI Interaction Protocol
1. **Think before coding:** Briefly outline your plan before generating code.
2. **Ask for clarification:** If a requirement is ambiguous, ask me before guessing.
3. **Show your work:** When fixing a bug, explain *why* it broke and *how* your fix resolves it.
4. **Respect the Monorepo:** Understand that `apps/web`, `apps/chat`, `apps/payment`, etc., are separate deployment units. Do not import frontend React code into backend services, and do not import backend Express code into the frontend.

---

**Acknowledge these rules by replying with exactly:**  
*"Rules of Engagement accepted. Ready to build DreamDOT."*