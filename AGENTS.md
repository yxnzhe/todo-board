# Workboard - Developer Notes

## Build & Verify

```bash
npm run build        # TypeScript check + Vite build
npm run dev          # Dev server
```

## Project Structure

- Feature-based folder structure under `src/features/`
- All Supabase queries isolated in `src/services/` (never in UI components)
- State management via Zustand (`src/stores/`)
- Data fetching via React Query hooks (`src/hooks/`)
- Reusable UI primitives in `src/components/ui/`

## Conventions

- All inter-file imports use `@/` path alias (maps to `./src/`)
- TailwindCSS v4 with custom theme vars in `src/index.css`
- Dark theme only (bg-bg-primary, text-text-primary, border-border, etc.)
- 13px base font size, dense/compact UI
- lucide-react for icons
- date-fns for date formatting
- Optimistic updates via React Query mutations

## Database

- Schema in `supabase/schema.sql`
- All tables have RLS policies
- UUIDs for all IDs
- `updated_at` auto-managed by triggers
- User profile auto-created on auth signup

## TypeScript

- TypeScript ~6.0 with `ignoreDeprecations: "6.0"` for baseUrl/paths support
- Path alias resolved by both Vite (resolve.alias) and TS (tsconfig paths)
