import { supabase } from '@/lib/supabase';
import type { DailyNote } from '@/types';

export const notesService = {
  async getByDate(date: string): Promise<DailyNote | null> {
    const { data, error } = await supabase
      .from('daily_notes')
      .select('*')
      .eq('date', date)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getRecent(limit = 7): Promise<DailyNote[]> {
    const { data, error } = await supabase
      .from('daily_notes')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async upsert(date: string, content: string): Promise<DailyNote> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('daily_notes')
      .upsert(
        { user_id: user.id, date, content, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,date' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
