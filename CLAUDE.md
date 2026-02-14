# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**carmu-api** is a REST API for a point-of-sale (POS) system built with Express.js, TypeScript, and MongoDB (Mongoose). It includes real-time updates via Socket.IO.

## Commands

```bash
pnpm dev              # Start dev server (ts-node-dev with path aliases)
pnpm build            # Compile TypeScript to ./build
pnpm start            # Run production build
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm format:check     # Prettier check
pnpm format:write     # Prettier auto-fix
pnpm presets          # Setup Cloudinary presets
```

## Architecture

MVC-inspired structure under `src/`:

- **`index.ts`** — Entry point: creates HTTP server, attaches Socket.IO
- **`app.ts`** — Express app setup, middleware registration, route mounting
- **`db.ts`** — MongoDB connection via Mongoose
- **`controllers/`** — Route handlers (async functions per endpoint)
- **`models/`** — Mongoose schemas with pre/post hooks for business logic (password hashing, slug generation, invoice calculations)
- **`routes/`** — Express routers with OpenAPI/Swagger JSDoc comments; aggregated in `routes/index.ts`
- **`middleware/`** — JWT auth (`UserAuth`, `AdminAuth`, `editorAuth`), file uploads (`formData` using Busboy → Cloudinary)
- **`types/`** — TypeScript interfaces; extends Express Request type
- **`utils/`** — Helpers, token creation, slug generation, error handling
- **`utils/errors/`** — Custom error classes (AuthError, ValidationError, NotFoundError, CashboxError, CloudError, InvalidSignInError)
- **`sockets/`** — Socket.IO event handlers (e.g., category room updates)
- **`docs/`** — Swagger schema definitions

## Key Patterns

- **Error handling**: Custom error classes in `utils/errors/` mapped to HTTP status codes by `utils/sendError.ts`
- **API response format**: `{ ok: true, data }` for success; `{ ok: false, message, code }` for errors. Uses `ResponseInfo` class.
- **Authentication**: JWT Bearer tokens verified in middleware. Role-based access (user/editor/admin).
- **File uploads**: Busboy parses multipart form data, uploads to Cloudinary, attaches results to request.
- **Mongoose hooks**: Pre-save hooks handle password encryption (bcryptjs), slug generation, order numbering, and invoice total calculations.
- **Swagger docs**: Available at `/api-docs` endpoint.

## Naming Conventions

| Layer       | Pattern                   | Example                 |
| ----------- | ------------------------- | ----------------------- |
| Controller  | `{Feature}.controller.ts` | `Invoice.controller.ts` |
| Model       | `{Feature}.model.ts`      | `Product.model.ts`      |
| Router      | `{Feature}.router.ts`     | `Cashbox.router.ts`     |
| Error class | `{Type}Error.ts`          | `NotFoundError.ts`      |

## Code Style

- Prettier: single quotes, semicolons, trailing commas, 120 char width, 2-space indent
- ESLint: standard + prettier config; unused vars prefixed with `_` are allowed
- Pre-commit: Husky + lint-staged runs ESLint on changed files
- Conventional commits with optional scope: `feat(invoice): ...`, `fix: ...`, `refactor: ...`

## Environment

Requires `.env` file (see `.env.example`): MongoDB URL, JWT secret, Cloudinary credentials, mail config. `APP_ENV` toggles `local`/`production`.
