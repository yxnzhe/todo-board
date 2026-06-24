import { useState, useEffect, useRef } from 'react';
import { Search, FileText, BookOpen, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useAppStore } from '@/stores/app.store';
import { format } from 'date-fns';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const { data: results } = useSearch(query);
  const { setSelectedTaskId, setSidebarView } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  function handleSelectTask(taskId: string) {
    setSelectedTaskId(taskId);
    onClose();
  }

  function handleSelectNote(date: string) {
    setSidebarView('notes');
    onClose();
  }

  const hasTasks = results?.tasks && results.tasks.length > 0;
  const hasNotes = results?.notes && results.notes.length > 0;
  const hasResults = hasTasks || hasNotes;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-bg-secondary border border-border rounded-lg shadow-2xl w-full max-w-xl mx-4">
        {/* Search input */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
          <Search size={14} className="text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, notes, decisions..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1 cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length >= 2 && !hasResults && (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-text-muted">No results for "{query}"</p>
            </div>
          )}

          {hasTasks && (
            <div>
              <div className="px-3 py-1.5 bg-bg-primary">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Tasks</span>
              </div>
              {results!.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleSelectTask(task.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-bg-hover cursor-pointer transition-colors"
                >
                  <FileText size={12} className="text-text-muted flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs text-text-primary truncate">{task.title}</div>
                    {task.description && (
                      <div className="text-[10px] text-text-muted truncate">{task.description.substring(0, 80)}</div>
                    )}
                  </div>
                  {task.project && (
                    <span className="text-[10px] px-1 rounded flex-shrink-0" style={{ color: task.project.color }}>
                      {task.project.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {hasNotes && (
            <div>
              <div className="px-3 py-1.5 bg-bg-primary">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Notes</span>
              </div>
              {results!.notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleSelectNote(note.date)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-bg-hover cursor-pointer transition-colors"
                >
                  <BookOpen size={12} className="text-text-muted flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs text-text-primary">{format(new Date(note.date + 'T00:00:00'), 'MMM d, yyyy')}</div>
                    <div className="text-[10px] text-text-muted truncate">{note.content.substring(0, 100)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length < 2 && (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-text-muted">Type at least 2 characters to search</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-text-muted">
                <span><kbd className="px-1 py-0.5 bg-bg-tertiary border border-border rounded">Esc</kbd> to close</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
