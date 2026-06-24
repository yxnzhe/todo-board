import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Timer } from 'lucide-react';
import { useTaskWorklogs, useCreateWorklog, useDeleteWorklog } from '@/hooks/useTaskDetails';
import { Button } from '@/components/ui/Button';

interface TaskWorklogsProps {
  taskId: string;
}

function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const mins = m % 60;
  if (h === 0) return `${mins}m`;
  if (mins === 0) return `${h}h`;
  return `${h}h ${mins}m`;
}

export function TaskWorklogs({ taskId }: TaskWorklogsProps) {
  const { data: worklogs = [] } = useTaskWorklogs(taskId);
  const createWorklog = useCreateWorklog();
  const deleteWorklog = useDeleteWorklog();
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');

  const totalMinutes = worklogs.reduce((sum, w) => sum + w.minutes, 0);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const mins = parseInt(minutes);
    if (!mins || mins <= 0) return;
    createWorklog.mutate({ taskId, date, minutes: mins, description: description || undefined });
    setMinutes('');
    setDescription('');
    setAdding(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Work Log</h4>
          {totalMinutes > 0 && (
            <span className="text-[10px] text-accent font-medium">{formatMinutes(totalMinutes)} total</span>
          )}
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
        >
          <Plus size={13} />
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-bg-tertiary rounded p-2.5 mb-2 space-y-2">
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-xs text-text-primary border border-border rounded px-2 py-1"
            />
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Minutes"
              min="1"
              className="w-20 bg-transparent text-xs text-text-primary border border-border rounded px-2 py-1 placeholder:text-text-muted"
            />
          </div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you work on? (optional)"
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none border-b border-border pb-1"
          />
          <div className="flex justify-end gap-1.5">
            <Button size="sm" variant="ghost" type="button" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" variant="primary" type="submit">Log</Button>
          </div>
        </form>
      )}

      <div className="space-y-1">
        {worklogs.map((w) => (
          <div key={w.id} className="group flex items-center gap-2 px-1.5 py-1 rounded hover:bg-bg-hover">
            <Timer size={11} className="text-text-muted flex-shrink-0" />
            <span className="text-[11px] text-text-muted w-16">{format(new Date(w.date), 'MMM d')}</span>
            <span className="text-xs text-accent font-medium w-12">{formatMinutes(w.minutes)}</span>
            <span className="text-[11px] text-text-secondary flex-1 truncate">{w.description || ''}</span>
            <button
              onClick={() => deleteWorklog.mutate({ id: w.id, taskId })}
              className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger p-0.5 cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
        {worklogs.length === 0 && !adding && (
          <p className="text-[11px] text-text-muted">No work logged</p>
        )}
      </div>
    </div>
  );
}
