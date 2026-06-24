import { supabase } from '@/lib/supabase';
import type { TaskComment } from '@/types';

export const commentsService = {
  async getByTask(taskId: string): Promise<TaskComment[]> {
    const { data, error } = await supabase
      .from('task_comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(taskId: string, content: string): Promise<TaskComment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('task_comments')
      .insert({ task_id: taskId, user_id: user.id, content })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, content: string): Promise<TaskComment> {
    const { data, error } = await supabase
      .from('task_comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('task_comments').delete().eq('id', id);
    if (error) throw error;
  },
};
