import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useContexts } from '@/hooks/useContexts';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';
import { useAppStore } from '@/stores/app.store';
import type { TaskStatus, TaskPriority } from '@/types';

interface NewTaskDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NewTaskDialog({ open, onClose }: NewTaskDialogProps) {
  const { selectedProjectId, newTaskDefaultStatus } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(newTaskDefaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState('');
  const [contextId, setContextId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const createTask = useCreateTask();
  const { data: projects = [] } = useProjects();
  const { data: contexts = [] } = useContexts();

  useEffect(() => { if (open) setStatus(newTaskDefaultStatus); }, [open, newTaskDefaultStatus]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate(
      {
        title: title.trim(),
        description: description || undefined,
        status,
        priority,
        project_id: projectId || selectedProjectId || null,
        context_id: contextId || null,
        due_date: dueDate || null,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setStatus('todo');
          setPriority('medium');
          setProjectId('');
          setContextId('');
          setDueDate('');
          onClose();
        },
      }
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title="New Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          autoFocus
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary font-medium">Description</label>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="bg-bg-tertiary border border-border rounded px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-accent transition-colors resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={TASK_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
          />
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={TASK_PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select
            label="Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={[{ value: '', label: 'None' }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
          />
          <Select
            label="Context"
            value={contextId}
            onChange={(e) => setContextId(e.target.value)}
            options={[{ value: '', label: 'None' }, ...contexts.map((c) => ({ value: c.id, label: c.name }))]}
          />
        </div>
        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-1">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={!title.trim()}>Create Task</Button>
        </div>
      </form>
    </Dialog>
  );
}
