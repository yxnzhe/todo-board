import { supabase } from '@/lib/supabase';
import type { Task, TaskStatus, TaskPriority } from '@/types';

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: string | null;
  context_id?: string | null;
  due_date?: string | null;
  sort_order?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: string | null;
  context_id?: string | null;
  due_date?: string | null;
  sort_order?: number;
}

export const tasksService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, project:projects(*), context:contexts(*)')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, project:projects(*), context:contexts(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...input, user_id: user.id, status: input.status || 'todo', priority: input.priority || 'medium' })
      .select('*, project:projects(*), context:contexts(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, project:projects(*), context:contexts(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },

  async reorder(id: string, newSortOrder: number): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update({ sort_order: newSortOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};
