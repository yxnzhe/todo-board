export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'waiting' | 'done';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
  archived: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Context {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string | null;
  context_id: string | null;
  due_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // joined fields (optional)
  project?: Project;
  context?: Context;
  tags?: Tag[];
  checklists?: TaskChecklist[];
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TaskChecklist {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  user_id: string;
  action: string;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

export interface TaskWorklog {
  id: string;
  task_id: string;
  user_id: string;
  date: string;
  minutes: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskDecision {
  id: string;
  task_id: string;
  user_id: string;
  title: string;
  reason: string;
  decided_at: string;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  task_id: string;
  user_id: string;
  title: string;
  url: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TaskTag {
  task_id: string;
  tag_id: string;
}

export interface DailyNote {
  id: string;
  user_id: string;
  date: string;
  content: string;
  created_at: string;
  updated_at: string;
}
