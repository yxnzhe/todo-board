import { useState } from 'react';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { useTaskChecklists, useCreateChecklist, useUpdateChecklist, useDeleteChecklist } from '@/hooks/useTaskDetails';

interface TaskChecklistProps {
  taskId: string;
}

export function TaskChecklist({ taskId }: TaskChecklistProps) {
  const { data: items = [] } = useTaskChecklists(taskId);
  const createChecklist = useCreateChecklist();
  const updateChecklist = useUpdateChecklist();
  const deleteChecklist = useDeleteChecklist();
  const [newItem, setNewItem] = useState('');

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.trim()) return;
    createChecklist.mutate({ taskId, title: newItem.trim() });
    setNewItem('');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Checklist</h4>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#10b981' : '#3b82f6' }}
              />
            </div>
            <span className="text-[10px] text-text-muted">{completed}/{total}</span>
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => (
          <div key={item.id} className="group flex items-center gap-2 px-1.5 py-1 rounded hover:bg-bg-hover">
            <button
              onClick={() => updateChecklist.mutate({ id: item.id, taskId, input: { completed: !item.completed } })}
              className="flex-shrink-0 text-text-muted hover:text-accent cursor-pointer"
            >
              {item.completed ? <CheckSquare size={14} className="text-success" /> : <Square size={14} />}
            </button>
            <span className={`text-xs flex-1 ${item.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
              {item.title}
            </span>
            <button
              onClick={() => deleteChecklist.mutate({ id: item.id, taskId })}
              className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger p-0.5 cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleAdd} className="mt-1.5 flex items-center gap-1.5">
        <Plus size={13} className="text-text-muted flex-shrink-0" />
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item..."
          className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none"
        />
      </form>
    </div>
  );
}
