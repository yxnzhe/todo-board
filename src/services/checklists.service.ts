import { supabase } from '@/lib/supabase';
import type { TaskChecklist } from '@/types';

export const checklistsService = {
  async getByTask(taskId: string): Promise<TaskChecklist[]> {
    const { data, error } = await supabase
      .from('task_checklists')
      .select('*')
      .eq('task_id', taskId)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(taskId: string, title: string, sortOrder?: number): Promise<TaskChecklist> {
    const { data, error } = await supabase
      .from('task_checklists')
      .insert({ task_id: taskId, title, sort_order: sortOrder || 0 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: { title?: string; completed?: boolean; sort_order?: number }): Promise<TaskChecklist> {
    const { data, error } = await supabase
      .from('task_checklists')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('task_checklists').delete().eq('id', id);
    if (error) throw error;
  },
};
