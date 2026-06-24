import { supabase } from '@/lib/supabase';
import type { Task, DailyNote } from '@/types';

export interface SearchResults {
  tasks: Task[];
  notes: DailyNote[];
}

export const searchService = {
  async search(query: string): Promise<SearchResults> {
    if (!query.trim()) return { tasks: [], notes: [] };
    const pattern = `%${query}%`;

    const [tasksResult, notesResult] = await Promise.all([
      supabase
        .from('tasks')
        .select('*, project:projects(*), context:contexts(*)')
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(20),
      supabase
        .from('daily_notes')
        .select('*')
        .ilike('content', pattern)
        .limit(10),
    ]);

    return {
      tasks: tasksResult.data || [],
      notes: notesResult.data || [],
    };
  },
};
