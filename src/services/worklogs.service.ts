import { supabase } from '@/lib/supabase';
import type { TaskWorklog } from '@/types';

export const worklogsService = {
  async getByTask(taskId: string): Promise<TaskWorklog[]> {
    const { data, error } = await supabase
      .from('task_worklogs')
      .select('*')
      .eq('task_id', taskId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(taskId: string, date: string, minutes: number, description?: string): Promise<TaskWorklog> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('task_worklogs')
      .insert({ task_id: taskId, user_id: user.id, date, minutes, description: description || null })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: { date?: string; minutes?: number; description?: string | null }): Promise<TaskWorklog> {
    const { data, error } = await supabase
      .from('task_worklogs')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('task_worklogs').delete().eq('id', id);
    if (error) throw error;
  },
};
