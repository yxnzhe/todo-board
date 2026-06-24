import { supabase } from '@/lib/supabase';
import type { Context } from '@/types';

export const contextsService = {
  async getAll(): Promise<Context[]> {
    const { data, error } = await supabase
      .from('contexts')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(input: { name: string; color?: string }): Promise<Context> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('contexts')
      .insert({ ...input, user_id: user.id, color: input.color || '#6b7280' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: { name?: string; color?: string }): Promise<Context> {
    const { data, error } = await supabase
      .from('contexts')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('contexts').delete().eq('id', id);
    if (error) throw error;
  },
};
