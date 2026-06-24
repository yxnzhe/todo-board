import { supabase } from '@/lib/supabase';
import type { Tag } from '@/types';

export const tagsService = {
  async getAll(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(name: string, color?: string): Promise<Tag> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('tags')
      .insert({ user_id: user.id, name, color: color || '#6b7280' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) throw error;
  },

  async addToTask(taskId: string, tagId: string): Promise<void> {
    const { error } = await supabase.from('task_tags').insert({ task_id: taskId, tag_id: tagId });
    if (error) throw error;
  },

  async removeFromTask(taskId: string, tagId: string): Promise<void> {
    const { error } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag_id', tagId);
    if (error) throw error;
  },

  async getTaskTags(taskId: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('task_tags')
      .select('tag:tags(*)')
      .eq('task_id', taskId);
    if (error) throw error;
    return (data || []).map((d: any) => d.tag).filter(Boolean);
  },
};
