import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays, ListPlus } from 'lucide-react';
import { useDailyNote, useRecentNotes, useUpsertNote } from '@/hooks/useNotes';
import { useCreateTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';

export function DailyNotes() {
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { data: note } = useDailyNote(currentDate);
  const { data: recentNotes = [] } = useRecentNotes();
  const upsertNote = useUpsertNote();
  const createTask = useCreateTask();
  const [content, setContent] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setContent(note?.content || '');
  }, [note]);

  const autoSave = useCallback(
    (text: string) => {
      if (saveTimeout) clearTimeout(saveTimeout);
      const timeout = setTimeout(() => {
        upsertNote.mutate({ date: currentDate, content: text });
      }, 1000);
      setSaveTimeout(timeout);
    },
    [currentDate, saveTimeout, upsertNote]
  );

  function handleChange(text: string) {
    setContent(text);
    autoSave(text);
  }

  function handleConvertToTask() {
    const textarea = document.querySelector<HTMLTextAreaElement>('#daily-note-editor');
    const selected = textarea?.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const taskTitle = selected?.trim() || content.split('\n')[0]?.trim();
    if (!taskTitle) return;
    createTask.mutate({ title: taskTitle, status: 'todo' });
  }

  const displayDate = format(new Date(currentDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy');

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-secondary">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-text-muted" />
            <h2 className="text-sm font-semibold text-text-primary">Daily Notes</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={handleConvertToTask}>
              <ListPlus size={13} />
              Convert to Task
            </Button>
          </div>
        </div>

        {/* Date nav */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
          <button
            onClick={() => setCurrentDate(format(subDays(new Date(currentDate + 'T00:00:00'), 1), 'yyyy-MM-dd'))}
            className="p-1 text-text-muted hover:text-text-primary hover:bg-bg-hover rounded cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setCurrentDate(format(new Date(), 'yyyy-MM-dd'))}
            className="text-xs text-text-secondary hover:text-text-primary cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(format(addDays(new Date(currentDate + 'T00:00:00'), 1), 'yyyy-MM-dd'))}
            className="p-1 text-text-muted hover:text-text-primary hover:bg-bg-hover rounded cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
          <span className="text-xs text-text-primary font-medium">{displayDate}</span>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4">
          <textarea
            id="daily-note-editor"
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Meeting notes, ideas, blockers, brain dumps...&#10;&#10;Select text and click 'Convert to Task' to create a task from any line."
            className="w-full h-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none resize-none leading-relaxed font-sans"
          />
        </div>
      </div>

      {/* Recent notes sidebar */}
      <div className="w-[200px] border-l border-border bg-bg-secondary overflow-y-auto">
        <div className="px-3 py-2 border-b border-border">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Recent</span>
        </div>
        <div className="py-1">
          {recentNotes.map((n) => (
            <button
              key={n.id}
              onClick={() => setCurrentDate(n.date)}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                n.date === currentDate
                  ? 'bg-bg-active text-text-primary'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              <div className="font-medium">{format(new Date(n.date + 'T00:00:00'), 'MMM d, EEE')}</div>
              <div className="text-[10px] text-text-muted truncate mt-0.5">
                {n.content.substring(0, 50)}{n.content.length > 50 ? '...' : ''}
              </div>
            </button>
          ))}
          {recentNotes.length === 0 && (
            <p className="px-3 py-2 text-[11px] text-text-muted">No notes yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
