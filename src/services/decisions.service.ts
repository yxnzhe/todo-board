import { supabase } from '@/lib/supabase';
import type { TaskDecision } from '@/types';

export const decisionsService = {
  async getByTask(taskId: string): Promise<TaskDecision[]> {
    const { data, error } = await supabase
      .from('task_decisions')
      .select('*')
      .eq('task_id', taskId)
      .order('decided_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(taskId: string, title: string, reason: string, decidedAt?: string): Promise<TaskDecision> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('task_decisions')
      .insert({
        task_id: taskId,
        user_id: user.id,
        title,
        reason,
        decided_at: decidedAt || new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: { title?: string; reason?: string; decided_at?: string }): Promise<TaskDecision> {
    const { data, error } = await supabase
      .from('task_decisions')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('task_decisions').delete().eq('id', id);
    if (error) throw error;
  },
};
