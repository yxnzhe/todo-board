export const TASK_STATUSES = [
  { value: 'backlog', label: 'Backlog', color: '#6b7280' },
  { value: 'todo', label: 'To Do', color: '#3b82f6' },
  { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'waiting', label: 'Waiting', color: '#8b5cf6' },
  { value: 'done', label: 'Done', color: '#10b981' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'critical', label: 'Critical', color: '#ef4444', icon: '!!!' },
  { value: 'high', label: 'High', color: '#f97316', icon: '!!' },
  { value: 'medium', label: 'Medium', color: '#eab308', icon: '!' },
  { value: 'low', label: 'Low', color: '#6b7280', icon: '-' },
] as const;

export const KANBAN_COLUMNS: Array<{ status: import('@/types').TaskStatus; label: string }> = [
  { status: 'backlog', label: 'Backlog' },
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'waiting', label: 'Waiting' },
  { status: 'done', label: 'Done' },
];

export const DEFAULT_PROJECT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

export const SIDEBAR_VIEWS = [
  { key: 'inbox', label: 'Inbox', icon: 'Inbox' },
  { key: 'today', label: 'Today', icon: 'CalendarCheck' },
  { key: 'upcoming', label: 'Upcoming', icon: 'CalendarDays' },
  { key: 'this-week', label: 'This Week', icon: 'Calendar' },
  { key: 'waiting', label: 'Waiting', icon: 'Clock' },
  { key: 'backlog', label: 'Backlog', icon: 'Archive' },
  { key: 'completed', label: 'Completed', icon: 'CheckCircle2' },
] as const;

export type SidebarView = typeof SIDEBAR_VIEWS[number]['key'];
