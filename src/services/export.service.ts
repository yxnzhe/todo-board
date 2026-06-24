import { supabase } from '@/lib/supabase';

export const exportService = {
  async exportAll(): Promise<string> {
    const [tasks, projects, contexts, tags, notes, comments, checklists, worklogs, decisions, activities] = await Promise.all([
      supabase.from('tasks').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('contexts').select('*'),
      supabase.from('tags').select('*'),
      supabase.from('daily_notes').select('*'),
      supabase.from('task_comments').select('*'),
      supabase.from('task_checklists').select('*'),
      supabase.from('task_worklogs').select('*'),
      supabase.from('task_decisions').select('*'),
      supabase.from('task_activities').select('*'),
    ]);

    const exportData = {
      version: 1,
      exported_at: new Date().toISOString(),
      data: {
        tasks: tasks.data || [],
        projects: projects.data || [],
        contexts: contexts.data || [],
        tags: tags.data || [],
        daily_notes: notes.data || [],
        task_comments: comments.data || [],
        task_checklists: checklists.data || [],
        task_worklogs: worklogs.data || [],
        task_decisions: decisions.data || [],
        task_activities: activities.data || [],
      },
    };

    return JSON.stringify(exportData, null, 2);
  },

  downloadJson(jsonString: string, filename: string) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
