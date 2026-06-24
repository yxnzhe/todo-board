import { supabase } from '@/lib/supabase';
import type { Attachment } from '@/types';

function detectLinkType(url: string): string {
  if (url.includes('github.com')) return 'github';
  if (url.includes('figma.com')) return 'figma';
  if (url.includes('sharepoint.com')) return 'sharepoint';
  if (url.includes('confluence')) return 'confluence';
  return 'link';
}

export const attachmentsService = {
  async getByTask(taskId: string): Promise<Attachment[]> {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(taskId: string, title: string, url: string): Promise<Attachment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('attachments')
      .insert({ task_id: taskId, user_id: user.id, title, url, type: detectLinkType(url) })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('attachments').delete().eq('id', id);
    if (error) throw error;
  },
};
