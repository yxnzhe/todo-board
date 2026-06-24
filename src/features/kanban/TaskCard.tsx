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
        : 'text-text-muted'
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
      className={`group px-2.5 py-2 rounded border cursor-pointer transition-colors ${
        isDragging ? 'opacity-50' : ''
      } ${
        isSelected
          ? 'bg-bg-active border-accent/40'
          : 'bg-bg-tertiary border-border hover:border-border-light hover:bg-bg-hover'
      }`}
    >
      <div className="flex items-start gap-1.5">
        <span className="text-xs text-text-primary leading-tight flex-1 line-clamp-2">{task.title}</span>
      </div>
      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        {task.project && (
          <span
            className="text-[10px] px-1 py-0 rounded"
            style={{ backgroundColor: `${task.project.color}18`, color: task.project.color }}
          >
            {task.project.name}
          </span>
        )}
        {task.due_date && (
          <span className={`text-[10px] ${dueDateColor}`}>
            {format(new Date(task.due_date), 'MMM d')}
          </span>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-0.5">
            {task.tags.map((tag) => (
              <div
                key={tag.id}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: tag.color }}
                title={tag.name}
              />
            ))}
          </div>
        )}
        {progress !== null && (
          <div className="flex items-center gap-1 ml-auto">
            <div className="w-10 h-1 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? '#10b981' : '#3b82f6',
                }}
              />
            </div>
            <span className="text-[9px] text-text-muted">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
