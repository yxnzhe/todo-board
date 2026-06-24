# Workboard

A personal productivity command center. Designed for a single user managing work projects, side projects, investments, travel, and personal goals.

## Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS v4, Zustand, React Query, dnd-kit
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Deployment:** Vercel

## Getting Started

### 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor to create all tables, indexes, RLS policies, and triggers
3. Enable Google and GitHub OAuth providers in Authentication > Providers

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Build

```bash
npm run build
npm run preview
```

## Features

- **Kanban Board** - Drag-and-drop task management across Backlog, To Do, In Progress, Waiting, Review, Done
- **Task Detail Panel** - Inline editing of all task fields, checklists, comments, decisions, worklogs, attachments
- **Projects & Contexts** - Organize tasks by project (Mercedes-Benz, Vibathon) and context (Work, Personal, Learning)
- **Daily Notes** - Obsidian-style daily notes with convert-to-task
- **Dashboard** - Overdue tasks, due today, in progress, upcoming deadlines, project summaries
- **Global Search** - Search across tasks, notes, descriptions
- **Decision Log** - Record decisions with title, reason, and date for long-term reference
- **Work Logs** - Manual time tracking with daily totals
- **Activity Timeline** - Automatic history of all task changes
- **Export/Import** - Full workspace backup as JSON
- **Keyboard Shortcuts** - N (new task), / (search), Esc (close)
- **Row Level Security** - All data is user-specific via Supabase RLS
- **Optimistic Updates** - UI updates instantly, syncs in background

## Architecture

```
src/
  lib/           # Supabase client, constants
  types/         # TypeScript interfaces
  services/      # Data access layer (all Supabase queries)
  stores/        # Zustand state management
  hooks/         # React Query hooks
  components/ui/ # Reusable UI primitives
  features/      # Feature-based modules
    auth/        # Login page
    layout/      # Sidebar, AppLayout
    kanban/      # Board, columns, cards, new task dialog
    task/        # Detail panel, checklists, comments, etc.
    dashboard/   # Dashboard widgets
    notes/       # Daily notes
    search/      # Global search dialog
    settings/    # Export/import
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New task |
| `/` | Search |
| `Esc` | Close dialog/panel |
