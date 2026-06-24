import { useDraggable } from '@dnd-kit/core';
import { format, isPast, isToday } from 'date-fns';
import { useAppStore } from '@/stores/app.store';
import { TASK_PRIORITIES } from '@/lib/constants';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  checklistProgress?: { total: number; completed: number } | null;
}

export function TaskCard({ task, checklistProgress }: TaskCardProps) {
  const { selectedTaskId, setSelectedTaskId } = useAppStore();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const isSelected = selectedTaskId === task.id;
  const priority = TASK_PRIORITIES.find((p) => p.value === task.priority);

  const dueDateColor = task.due_date
    ? isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date))
      ? 'text-danger'
      : isToday(new Date(task.due_date))
        ? 'text-warning'
        : 'text-text-muted/60'
    : '';

  const progress = checklistProgress && checklistProgress.total > 0
    ? Math.round((checklistProgress.completed / checklistProgress.total) * 100)
    : null;

  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => setSelectedTaskId(task.id)}
      style={{ ...style, borderLeftColor: priority?.color, borderLeftWidth: 2 }}
      className={`group px-3 py-2.5 rounded border cursor-pointer transition-all duration-200 ${
        isDragging ? 'opacity-40 scale-[0.98]' : ''
      } ${
        isSelected
          ? 'bg-white/[0.06] border-white/15'
          : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08]'
      }`}
    >
      <div className="flex items-start gap-1.5">
        <span className="text-[12px] text-text-primary leading-snug flex-1 line-clamp-2 tracking-wide">{task.title}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {task.project && (
          <span
            className="text-[10px] tracking-wider uppercase opacity-70"
            style={{ color: task.project.color }}
          >
            {task.project.name}
          </span>
        )}
        {task.due_date && (
          <span className={`text-[10px] tracking-wide ${dueDateColor}`}>
            {format(new Date(task.due_date), 'MMM d')}
          </span>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-1">
            {task.tags.map((tag) => (
              <div
                key={tag.id}
                className="w-1.5 h-1.5 rounded-full opacity-60"
                style={{ backgroundColor: tag.color }}
                title={tag.name}
              />
            ))}
          </div>
        )}
        {progress !== null && (
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-10 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? '#27ae60' : 'rgba(192,192,192,0.4)',
                }}
              />
            </div>
            <span className="text-[9px] text-text-muted/50">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
