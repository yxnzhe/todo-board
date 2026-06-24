import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { TASK_STATUSES } from '@/lib/constants';
import type { Task, TaskStatus } from '@/types';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const statusConfig = TASK_STATUSES.find((s) => s.value === status);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[220px] w-[220px] rounded-lg transition-colors ${
        isOver ? 'bg-accent/5' : ''
      }`}
    >
      <div className="flex items-center gap-2 px-2 py-2 mb-1">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusConfig?.color }} />
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">{statusConfig?.label}</span>
        <span className="text-[10px] text-text-muted ml-auto">{tasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1.5 px-1 pb-2 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-16 text-[10px] text-text-muted border border-dashed border-border rounded">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
