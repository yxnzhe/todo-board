import { supabase } from '@/lib/supabase';
import type { Project } from '@/types';

export interface CreateProjectInput {
  name: string;
  color?: string;
  icon?: string | null;
}

export const projectsService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('archived', false)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...input, user_id: user.id, color: input.color || '#3b82f6' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: Partial<CreateProjectInput & { archived: boolean; sort_order: number }>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};
