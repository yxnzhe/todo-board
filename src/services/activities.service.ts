import { supabase } from '@/lib/supabase';
import type { TaskActivity } from '@/types';

export const activitiesService = {
  async getByTask(taskId: string): Promise<TaskActivity[]> {
    const { data, error } = await supabase
      .from('task_activities')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(taskId: string, action: string, field?: string, oldValue?: string, newValue?: string): Promise<TaskActivity> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('task_activities')
      .insert({
        task_id: taskId,
        user_id: user.id,
        action,
        field: field || null,
        old_value: oldValue || null,
        new_value: newValue || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
