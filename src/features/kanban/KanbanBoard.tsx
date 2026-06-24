import { useMemo } from 'react';
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { KANBAN_COLUMNS } from '@/lib/constants';
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { useAppStore } from '@/stores/app.store';
import { useProjects } from '@/hooks/useProjects';
import { useContexts } from '@/hooks/useContexts';
import { isToday, isThisWeek, isFuture, parseISO } from 'date-fns';
import { Plus, Search } from 'lucide-react';
import { activitiesService } from '@/services/activities.service';
import type { Task, TaskStatus } from '@/types';

function filterTasks(tasks: Task[], view: string, projectId: string | null, contextId: string | null): Task[] {
  if (projectId) return tasks.filter((t) => t.project_id === projectId);
  if (contextId) return tasks.filter((t) => t.context_id === contextId);

  switch (view) {
    case 'inbox':
      return tasks.filter((t) => t.status !== 'done');
    case 'today':
      return tasks.filter((t) => t.due_date && isToday(parseISO(t.due_date)));
    case 'upcoming':
      return tasks.filter((t) => t.due_date && isFuture(parseISO(t.due_date)));
    case 'this-week':
      return tasks.filter((t) => t.due_date && isThisWeek(parseISO(t.due_date)));
    case 'waiting':
      return tasks.filter((t) => t.status === 'waiting');
    case 'backlog':
      return tasks.filter((t) => t.status === 'backlog');
    case 'completed':
      return tasks.filter((t) => t.status === 'done');
    default:
      return tasks.filter((t) => t.status !== 'done');
  }
}

export function KanbanBoard() {
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const { data: contexts = [] } = useContexts();
  const updateTask = useUpdateTask();
  const { sidebarView, selectedProjectId, selectedContextId, setNewTaskOpen, setSearchOpen } = useAppStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filteredTasks = useMemo(
    () => filterTasks(tasks, sidebarView, selectedProjectId, selectedContextId),
    [tasks, sidebarView, selectedProjectId, selectedContextId]
  );

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      backlog: [], todo: [], in_progress: [], waiting: [], review: [], done: [],
    };
    filteredTasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [filteredTasks]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;
    const oldStatus = task.status;
    updateTask.mutate({ id: taskId, input: { status: newStatus } });
    activitiesService.create(taskId, 'status_changed', 'status', oldStatus, newStatus).catch(() => {});
  }

  const viewLabel = useMemo(() => {
    if (selectedProjectId) {
      const p = projects.find((p) => p.id === selectedProjectId);
      return p?.name || 'Project';
    }
    if (selectedContextId) {
      const c = contexts.find((c) => c.id === selectedContextId);
      return c?.name || 'Context';
    }
    const labels: Record<string, string> = {
      inbox: 'Inbox', today: 'Today', upcoming: 'Upcoming', 'this-week': 'This Week',
      waiting: 'Waiting', backlog: 'Backlog', completed: 'Completed',
    };
    return labels[sidebarView] || 'Tasks';
  }, [sidebarView, selectedProjectId, selectedContextId, projects, contexts]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-bg-secondary">
        <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-text-secondary">{viewLabel}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 text-[11px] text-text-muted hover:text-text-secondary hover:bg-bg-hover rounded transition-all duration-200 cursor-pointer tracking-wide"
          >
            <Search size={12} />
            <span>Search</span>
            <kbd className="px-1.5 py-0 bg-bg-tertiary border border-border-light rounded text-[8px] text-text-muted">/</kbd>
          </button>
          <button
            onClick={() => setNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-all duration-200 cursor-pointer tracking-wide uppercase"
          >
            <Plus size={12} />
            <span>Task</span>
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-1 p-4 h-full min-w-max">
            {KANBAN_COLUMNS.map(({ status }) => (
              <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
