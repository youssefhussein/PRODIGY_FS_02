# Employee Management System (PRODIGY_FS_02)

A secure web application for managing employee records with authentication and
validation.

## What This Project Delivers

- **Create** new employee records
- **Read** employee records in a dashboard table
- **Update** existing employee records
- **Delete** employee records with confirmation
- **Authentication** with email/password (login, register, logout)
- **Authorization** checks before all employee actions
- **Validation** using both client input rules and Zod server-side schemas
- **Data isolation** so users only access their own employee records
- **Responsive UI** with light/dark theme support

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** SQLite (LibSQL client)
- **ORM:** Drizzle ORM + Drizzle Kit
- **Auth:** Better Auth + Drizzle adapter
- **Validation:** Zod
- **Code quality:** Biome
- **Package manager:** pnpm

## Key Security & Validation Notes

- Protected dashboard routes redirect unauthenticated users to `/login`
- All employee server actions require a valid session
- Employee payloads are validated with Zod before database writes
- Update/Delete operations verify record ownership (`userId`) before mutating
  data

## Employee Data Model

Each employee record includes:

- `name` (required)
- `email` (required, valid email format)
- `position` (optional)
- `department` (optional)
- `salary` (optional, positive integer)
- `hireDate` (optional)

## Knowledge Gained

- Building full-stack CRUD flows with Next.js App Router and server actions
- Implementing authentication/session-based route protection with Better Auth
- Enforcing secure, centralized validation using Zod
- Modeling relational data with Drizzle ORM and ownership-based access control
- Structuring practical dashboard UX (modals, optimistic interactions, feedback
  states)

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Set required variables in `.env`:
   - `BETTER_AUTH_SECRET`
   - `DATABASE_URL` (default local SQLite: `file:./db.sqlite`)
4. Sync schema to database:
   ```bash
   pnpm db:push
   ```
5. Start development server:
   ```bash
   pnpm dev
   ```
