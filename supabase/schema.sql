-- Workboard Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Projects
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  color text default '#3b82f6' not null,
  icon text,
  archived boolean default false not null,
  sort_order integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Contexts
create table if not exists public.contexts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  color text default '#6b7280' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Tasks
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'todo' not null check (status in ('backlog', 'todo', 'in_progress', 'waiting', 'review', 'done')),
  priority text default 'medium' not null check (priority in ('critical', 'high', 'medium', 'low')),
  project_id uuid references public.projects(id) on delete set null,
  context_id uuid references public.contexts(id) on delete set null,
  due_date date,
  sort_order integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Task Comments
create table if not exists public.task_comments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Task Checklists
create table if not exists public.task_checklists (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  title text not null,
  completed boolean default false not null,
  sort_order integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Task Activities
create table if not exists public.task_activities (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  action text not null,
  field text,
  old_value text,
  new_value text,
  created_at timestamptz default now() not null
);

-- Task Worklogs
create table if not exists public.task_worklogs (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null,
  minutes integer not null check (minutes > 0),
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Task Decisions
create table if not exists public.task_decisions (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  reason text not null,
  decided_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Attachments
create table if not exists public.attachments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  type text default 'link' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Tags
create table if not exists public.tags (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  color text default '#6b7280' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Task Tags (junction table)
create table if not exists public.task_tags (
  task_id uuid references public.tasks(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  primary key (task_id, tag_id)
);

-- Daily Notes
create table if not exists public.daily_notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null,
  content text default '' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, date)
);

-- Indexes
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_tasks_context_id on public.tasks(context_id);
create index if not exists idx_tasks_due_date on public.tasks(due_date);
create index if not exists idx_task_comments_task_id on public.task_comments(task_id);
create index if not exists idx_task_checklists_task_id on public.task_checklists(task_id);
create index if not exists idx_task_activities_task_id on public.task_activities(task_id);
create index if not exists idx_task_worklogs_task_id on public.task_worklogs(task_id);
create index if not exists idx_task_decisions_task_id on public.task_decisions(task_id);
create index if not exists idx_attachments_task_id on public.attachments(task_id);
create index if not exists idx_daily_notes_user_date on public.daily_notes(user_id, date);
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_contexts_user_id on public.contexts(user_id);
create index if not exists idx_tags_user_id on public.tags(user_id);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.contexts enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.task_checklists enable row level security;
alter table public.task_activities enable row level security;
alter table public.task_worklogs enable row level security;
alter table public.task_decisions enable row level security;
alter table public.attachments enable row level security;
alter table public.tags enable row level security;
alter table public.task_tags enable row level security;
alter table public.daily_notes enable row level security;

-- RLS Policies: Users can only access their own data

-- Users
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);

-- Projects
create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can create own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

-- Contexts
create policy "Users can view own contexts" on public.contexts for select using (auth.uid() = user_id);
create policy "Users can create own contexts" on public.contexts for insert with check (auth.uid() = user_id);
create policy "Users can update own contexts" on public.contexts for update using (auth.uid() = user_id);
create policy "Users can delete own contexts" on public.contexts for delete using (auth.uid() = user_id);

-- Tasks
create policy "Users can view own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can create own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

-- Task Comments
create policy "Users can view own task comments" on public.task_comments for select using (auth.uid() = user_id);
create policy "Users can create own task comments" on public.task_comments for insert with check (auth.uid() = user_id);
create policy "Users can update own task comments" on public.task_comments for update using (auth.uid() = user_id);
create policy "Users can delete own task comments" on public.task_comments for delete using (auth.uid() = user_id);

-- Task Checklists (accessible by task owner)
create policy "Users can view task checklists" on public.task_checklists for select
  using (exists (select 1 from public.tasks where tasks.id = task_checklists.task_id and tasks.user_id = auth.uid()));
create policy "Users can create task checklists" on public.task_checklists for insert
  with check (exists (select 1 from public.tasks where tasks.id = task_checklists.task_id and tasks.user_id = auth.uid()));
create policy "Users can update task checklists" on public.task_checklists for update
  using (exists (select 1 from public.tasks where tasks.id = task_checklists.task_id and tasks.user_id = auth.uid()));
create policy "Users can delete task checklists" on public.task_checklists for delete
  using (exists (select 1 from public.tasks where tasks.id = task_checklists.task_id and tasks.user_id = auth.uid()));

-- Task Activities
create policy "Users can view own task activities" on public.task_activities for select using (auth.uid() = user_id);
create policy "Users can create own task activities" on public.task_activities for insert with check (auth.uid() = user_id);

-- Task Worklogs
create policy "Users can view own task worklogs" on public.task_worklogs for select using (auth.uid() = user_id);
create policy "Users can create own task worklogs" on public.task_worklogs for insert with check (auth.uid() = user_id);
create policy "Users can update own task worklogs" on public.task_worklogs for update using (auth.uid() = user_id);
create policy "Users can delete own task worklogs" on public.task_worklogs for delete using (auth.uid() = user_id);

-- Task Decisions
create policy "Users can view own task decisions" on public.task_decisions for select using (auth.uid() = user_id);
create policy "Users can create own task decisions" on public.task_decisions for insert with check (auth.uid() = user_id);
create policy "Users can update own task decisions" on public.task_decisions for update using (auth.uid() = user_id);
create policy "Users can delete own task decisions" on public.task_decisions for delete using (auth.uid() = user_id);

-- Attachments
create policy "Users can view own attachments" on public.attachments for select using (auth.uid() = user_id);
create policy "Users can create own attachments" on public.attachments for insert with check (auth.uid() = user_id);
create policy "Users can delete own attachments" on public.attachments for delete using (auth.uid() = user_id);

-- Tags
create policy "Users can view own tags" on public.tags for select using (auth.uid() = user_id);
create policy "Users can create own tags" on public.tags for insert with check (auth.uid() = user_id);
create policy "Users can delete own tags" on public.tags for delete using (auth.uid() = user_id);

-- Task Tags (accessible by tag owner)
create policy "Users can view own task tags" on public.task_tags for select
  using (exists (select 1 from public.tags where tags.id = task_tags.tag_id and tags.user_id = auth.uid()));
create policy "Users can create own task tags" on public.task_tags for insert
  with check (exists (select 1 from public.tags where tags.id = task_tags.tag_id and tags.user_id = auth.uid()));
create policy "Users can delete own task tags" on public.task_tags for delete
  using (exists (select 1 from public.tags where tags.id = task_tags.tag_id and tags.user_id = auth.uid()));

-- Daily Notes
create policy "Users can view own notes" on public.daily_notes for select using (auth.uid() = user_id);
create policy "Users can create own notes" on public.daily_notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes" on public.daily_notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes" on public.daily_notes for delete using (auth.uid() = user_id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$;

-- Trigger to auto-create user on auth signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger function
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers
create trigger set_updated_at before update on public.users for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.projects for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.contexts for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.tasks for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.task_comments for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.task_checklists for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.task_worklogs for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.task_decisions for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.attachments for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.tags for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.daily_notes for each row execute function public.update_updated_at();
