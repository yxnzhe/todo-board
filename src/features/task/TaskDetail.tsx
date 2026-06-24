import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useContexts } from '@/hooks/useContexts';
import { useAppStore } from '@/stores/app.store';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';
import { TaskChecklist } from './TaskChecklist';
import { TaskComments } from './TaskComments';
import { TaskActivity } from './TaskActivity';
import { TaskAttachments } from './TaskAttachments';
import { activitiesService } from '@/services/activities.service';
import type { TaskStatus, TaskPriority } from '@/types';

export function TaskDetail() {
  const { selectedTaskId, setSelectedTaskId } = useAppStore();
  const { data: task } = useTask(selectedTaskId);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { data: projects = [] } = useProjects();
  const { data: contexts = [] } = useContexts();
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  if (!task) return null;

  function saveTitle() {
    if (title.trim() && title !== task!.title) {
      updateTask.mutate({ id: task!.id, input: { title: title.trim() } });
    }
    setEditingTitle(false);
  }

  function saveDescription() {
    if (description !== (task!.description || '')) {
      updateTask.mutate({ id: task!.id, input: { description: description || null } });
    }
  }

  function updateField(field: string, value: string | null) {
    const old = (task as any)[field];
    updateTask.mutate({ id: task!.id, input: { [field]: value } });
    if (field === 'status' || field === 'priority') {
      activitiesService.create(task!.id, `${field}_changed`, field, old, value || '').catch(() => {});
    }
  }

  function handleDelete() {
    deleteTask.mutate(task!.id);
    setSelectedTaskId(null);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTaskId(null)}
            className="text-text-muted hover:text-text-primary p-1 rounded hover:bg-bg-hover cursor-pointer"
          >
            <X size={14} />
          </button>
          <span className="text-[10px] text-text-muted font-mono">{task.id.slice(0, 8)}</span>
        </div>
        <button
          onClick={handleDelete}
          className="text-text-muted hover:text-danger p-1 rounded hover:bg-bg-hover cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Title */}
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); }}
            className="w-full bg-transparent text-sm font-semibold text-text-primary outline-none border-b border-accent pb-1"
          />
        ) : (
          <h3
            onClick={() => setEditingTitle(true)}
            className="text-sm font-semibold text-text-primary cursor-text hover:bg-bg-hover rounded px-1 -mx-1 py-0.5"
          >
            {task.title}
          </h3>
        )}

        {/* Fields grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Status</label>
            <select
              value={task.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="bg-bg-tertiary border border-border rounded px-2 py-1 text-xs text-text-primary cursor-pointer"
            >
              {TASK_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => updateField('priority', e.target.value)}
              className="bg-bg-tertiary border border-border rounded px-2 py-1 text-xs text-text-primary cursor-pointer"
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Project</label>
            <select
              value={task.project_id || ''}
              onChange={(e) => updateField('project_id', e.target.value || null)}
              className="bg-bg-tertiary border border-border rounded px-2 py-1 text-xs text-text-primary cursor-pointer"
            >
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Context</label>
            <select
              value={task.context_id || ''}
              onChange={(e) => updateField('context_id', e.target.value || null)}
              className="bg-bg-tertiary border border-border rounded px-2 py-1 text-xs text-text-primary cursor-pointer"
            >
              <option value="">None</option>
              {contexts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-0.5 col-span-2">
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Due Date</label>
            <input
              type="date"
              value={task.due_date || ''}
              onChange={(e) => updateField('due_date', e.target.value || null)}
              className="bg-bg-tertiary border border-border rounded px-2 py-1 text-xs text-text-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={saveDescription}
            placeholder="Add a description..."
            rows={3}
            className="w-full bg-bg-tertiary border border-border rounded px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted resize-none focus:border-accent transition-colors"
          />
        </div>

        <div className="border-t border-border" />
        <TaskChecklist taskId={task.id} />
        <div className="border-t border-border" />
        <TaskComments taskId={task.id} />
        <div className="border-t border-border" />
        <TaskAttachments taskId={task.id} />
        <div className="border-t border-border" />
        <TaskActivity taskId={task.id} />
      </div>
    </div>
  );
}
