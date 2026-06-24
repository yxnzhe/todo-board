import { useMemo } from 'react';
import { format, isToday, isPast, isThisWeek, isFuture, addDays, parseISO } from 'date-fns';
import { AlertCircle, Clock, Play, Pause, CheckCircle2, FolderKanban, CalendarClock } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useAppStore } from '@/stores/app.store';
import type { Task } from '@/types';

function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1 text-left rounded hover:bg-bg-hover cursor-pointer transition-colors"
    >
      <span className="text-xs text-text-primary truncate flex-1">{task.title}</span>
      {task.due_date && (
        <span className={`text-[10px] flex-shrink-0 ${
          isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) ? 'text-danger' : 'text-text-muted'
        }`}>
          {format(parseISO(task.due_date), 'MMM d')}
        </span>
      )}
      {task.project && (
        <span className="text-[10px] px-1 rounded flex-shrink-0" style={{ color: task.project.color }}>
          {task.project.name}
        </span>
      )}
    </button>
  );
}

function DashSection({ title, icon: Icon, count, children, color }: {
  title: string; icon: any; count?: number; children: React.ReactNode; color?: string;
}) {
  return (
    <div className="bg-bg-secondary border border-border rounded-lg">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Icon size={13} className={color || 'text-text-muted'} />
        <span className="text-xs font-semibold text-text-secondary">{title}</span>
        {count !== undefined && (
          <span className="ml-auto text-[10px] font-medium text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">{count}</span>
        )}
      </div>
      <div className="px-1 py-1 max-h-[200px] overflow-y-auto">{children}</div>
    </div>
  );
}

export function Dashboard() {
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const { setSelectedTaskId } = useAppStore();

  const today = new Date();
  const nextWeek = addDays(today, 7);

  const dueToday = useMemo(() => tasks.filter((t) => t.due_date && isToday(parseISO(t.due_date)) && t.status !== 'done'), [tasks]);
  const overdue = useMemo(() => tasks.filter((t) => t.due_date && isPast(parseISO(t.due_date)) && !isToday(parseISO(t.due_date)) && t.status !== 'done'), [tasks]);
  const inProgress = useMemo(() => tasks.filter((t) => t.status === 'in_progress'), [tasks]);
  const waiting = useMemo(() => tasks.filter((t) => t.status === 'waiting'), [tasks]);
  const completedThisWeek = useMemo(() => tasks.filter((t) => t.status === 'done' && isThisWeek(parseISO(t.updated_at))), [tasks]);
  const upcoming = useMemo(() =>
    tasks
      .filter((t) => t.due_date && isFuture(parseISO(t.due_date)) && parseISO(t.due_date) <= nextWeek && t.status !== 'done')
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()),
    [tasks, nextWeek]
  );

  const projectCounts = useMemo(() => {
    const map = new Map<string, number>();
    tasks.filter((t) => t.project_id && t.status !== 'done').forEach((t) => {
      map.set(t.project_id!, (map.get(t.project_id!) || 0) + 1);
    });
    return map;
  }, [tasks]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-secondary">
        <h2 className="text-sm font-semibold text-text-primary">Dashboard</h2>
        <span className="text-[11px] text-text-muted">{format(today, 'EEEE, MMMM d, yyyy')}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <DashSection title="Overdue" icon={AlertCircle} count={overdue.length} color="text-danger">
            {overdue.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-text-muted">None</p>
            ) : (
              overdue.map((t) => <TaskRow key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} />)
            )}
          </DashSection>

          <DashSection title="Due Today" icon={Clock} count={dueToday.length} color="text-warning">
            {dueToday.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-text-muted">Nothing due today</p>
            ) : (
              dueToday.map((t) => <TaskRow key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} />)
            )}
          </DashSection>

          <DashSection title="In Progress" icon={Play} count={inProgress.length} color="text-warning">
            {inProgress.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-text-muted">None</p>
            ) : (
              inProgress.map((t) => <TaskRow key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} />)
            )}
          </DashSection>

          <DashSection title="Waiting" icon={Pause} count={waiting.length} color="text-purple-400">
            {waiting.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-text-muted">None</p>
            ) : (
              waiting.map((t) => <TaskRow key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} />)
            )}
          </DashSection>

          <DashSection title="Completed This Week" icon={CheckCircle2} count={completedThisWeek.length} color="text-success">
            {completedThisWeek.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-text-muted">None yet</p>
            ) : (
              completedThisWeek.slice(0, 8).map((t) => <TaskRow key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} />)
            )}
          </DashSection>

          <DashSection title="Active Projects" icon={FolderKanban} count={projects.length}>
            {projects.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-text-muted">No projects</p>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="flex items-center gap-2 px-2 py-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-xs text-text-primary flex-1 truncate">{p.name}</span>
                  <span className="text-[10px] text-text-muted">{projectCounts.get(p.id) || 0} tasks</span>
                </div>
              ))
            )}
          </DashSection>

          <DashSection title="Upcoming Deadlines" icon={CalendarClock} count={upcoming.length} color="text-accent">
            {upcoming.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-text-muted">Clear schedule</p>
            ) : (
              upcoming.map((t) => <TaskRow key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} />)
            )}
          </DashSection>
        </div>
      </div>
    </div>
  );
}
