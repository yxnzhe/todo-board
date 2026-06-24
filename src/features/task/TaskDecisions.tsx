import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Scale } from 'lucide-react';
import { useTaskDecisions, useCreateDecision, useDeleteDecision } from '@/hooks/useTaskDetails';
import { Button } from '@/components/ui/Button';

interface TaskDecisionsProps {
  taskId: string;
}

export function TaskDecisions({ taskId }: TaskDecisionsProps) {
  const { data: decisions = [] } = useTaskDecisions(taskId);
  const createDecision = useCreateDecision();
  const deleteDecision = useDeleteDecision();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !reason.trim()) return;
    createDecision.mutate({ taskId, title: title.trim(), reason: reason.trim() });
    setTitle('');
    setReason('');
    setAdding(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Decisions</h4>
        <button
          onClick={() => setAdding(!adding)}
          className="text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
        >
          <Plus size={13} />
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-bg-tertiary rounded p-2.5 mb-2 space-y-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Decision title..."
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none border-b border-border pb-1"
          />
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for this decision..."
            rows={2}
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none resize-none"
          />
          <div className="flex justify-end gap-1.5">
            <Button size="sm" variant="ghost" type="button" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" variant="primary" type="submit" disabled={!title.trim() || !reason.trim()}>Add</Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {decisions.map((d) => (
          <div key={d.id} className="group bg-bg-tertiary rounded px-2.5 py-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <Scale size={11} className="text-accent flex-shrink-0" />
                <span className="text-xs font-medium text-text-primary">{d.title}</span>
              </div>
              <button
                onClick={() => deleteDecision.mutate({ id: d.id, taskId })}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger p-0.5 cursor-pointer"
              >
                <Trash2 size={11} />
              </button>
            </div>
            <p className="text-[11px] text-text-secondary mt-1 ml-4">{d.reason}</p>
            <span className="text-[10px] text-text-muted mt-1 ml-4 block">
              {format(new Date(d.decided_at), 'MMM d, yyyy')}
            </span>
          </div>
        ))}
        {decisions.length === 0 && !adding && (
          <p className="text-[11px] text-text-muted">No decisions recorded</p>
        )}
      </div>
    </div>
  );
}
