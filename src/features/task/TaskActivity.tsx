import { format } from 'date-fns';
import { useTaskActivities } from '@/hooks/useTaskDetails';
import { Activity } from 'lucide-react';

interface TaskActivityProps {
  taskId: string;
}

export function TaskActivity({ taskId }: TaskActivityProps) {
  const { data: activities = [] } = useTaskActivities(taskId);

  function describeAction(action: string, field: string | null, oldVal: string | null, newVal: string | null): string {
    if (action === 'created') return 'Task created';
    if (action === 'status_changed' && field === 'status') return `Status: ${oldVal} → ${newVal}`;
    if (action === 'priority_changed') return `Priority: ${oldVal} → ${newVal}`;
    if (field) return `${field}: ${oldVal || '—'} → ${newVal || '—'}`;
    return action;
  }

  return (
    <div>
      <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Activity</h4>
      {activities.length === 0 ? (
        <p className="text-[11px] text-text-muted">No activity recorded</p>
      ) : (
        <div className="space-y-1">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start gap-2 py-1">
              <Activity size={11} className="text-text-muted mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-text-secondary">
                  {describeAction(act.action, act.field, act.old_value, act.new_value)}
                </span>
                <span className="text-[10px] text-text-muted ml-2">
                  {format(new Date(act.created_at), 'MMM d, HH:mm')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
