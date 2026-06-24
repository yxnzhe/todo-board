import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notes.service';
import type { DailyNote } from '@/types';

export function useDailyNote(date: string) {
  return useQuery({
    queryKey: ['daily-note', date],
    queryFn: () => notesService.getByDate(date),
  });
}

export function useRecentNotes() {
  return useQuery({
    queryKey: ['recent-notes'],
    queryFn: () => notesService.getRecent(14),
  });
}

export function useUpsertNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ date, content }: { date: string; content: string }) =>
      notesService.upsert(date, content),
    onSuccess: (note) => {
      qc.setQueryData<DailyNote | null>(['daily-note', note.date], note);
      qc.invalidateQueries({ queryKey: ['recent-notes'] });
    },
  });
}
