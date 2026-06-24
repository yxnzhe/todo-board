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
      className={`flex flex-col min-w-[230px] w-[230px] transition-all duration-300 ${
        isOver ? 'bg-white/[0.02] rounded-lg' : ''
      }`}
    >
      <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-70" style={{ backgroundColor: statusConfig?.color }} />
        <span className="text-[10px] font-medium text-text-muted/60 uppercase tracking-[0.2em]">{statusConfig?.label}</span>
        <span className="text-[10px] text-text-muted/30 ml-auto tabular-nums">{tasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 px-1 pb-2 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-[10px] text-text-muted/20 border border-dashed border-white/[0.04] rounded tracking-widest uppercase">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
