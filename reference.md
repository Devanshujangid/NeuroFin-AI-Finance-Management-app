# NeuroFin – Database & Auth Reference

## Tech Stack
- Auth: Clerk
- Database: Supabase (PostgreSQL)
- ORM: ❌ Not using Prisma (manual SQL + supabase-js)
- Runtime: Next.js (App Router)

---

## Database Schema (public)

### users
- id (uuid, PK)
- clerk_user_id (text, unique)
- name (text)
- email (text)
- image_url (text, nullable)
- created_at (timestamptz)
- updated_at (timestamptz)

### accounts
- id (uuid, PK)
- user_id (uuid, FK → users.id)
- name (text)
- type (account_type enum)
- balance (numeric)
- is_default (bool)

### transactions
- id (uuid, PK)
- user_id (uuid, FK)
- account_id (uuid, FK)
- type (transaction_type enum)
- amount (numeric)
- status (transaction_status enum)
- is_recurring (bool)
- recurring_interval (enum)
- next_recurring_date (timestamptz)

### budgets
- id (uuid, PK)
- user_id (uuid, unique FK)
- amount (numeric)
- last_alert_sent (timestamptz)

---

## Important Architecture Decisions

1. Clerk does NOT auto-insert users into DB
2. On first login:
   - Read `clerk_user_id`
   - Insert user into `public.users`
3. Supabase is source of truth for app data
4. Auth ≠ Persistence

---

## User Sync Logic (Concept)

On authenticated page load:
- Check if user exists in DB
- If not → insert user
- Never duplicate users
