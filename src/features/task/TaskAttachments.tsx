import { useState } from 'react';
import { Plus, Trash2, ExternalLink, GitBranch, PenTool, Link as LinkIcon } from 'lucide-react';
import { useTaskAttachments, useCreateAttachment, useDeleteAttachment } from '@/hooks/useTaskDetails';
import { Button } from '@/components/ui/Button';

interface TaskAttachmentsProps {
  taskId: string;
}

function getIcon(type: string) {
  switch (type) {
    case 'github': return <GitBranch size={12} />;
    case 'figma': return <PenTool size={12} />;
    default: return <LinkIcon size={12} />;
  }
}

export function TaskAttachments({ taskId }: TaskAttachmentsProps) {
  const { data: attachments = [] } = useTaskAttachments(taskId);
  const createAttachment = useCreateAttachment();
  const deleteAttachment = useDeleteAttachment();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    createAttachment.mutate({ taskId, title: title.trim(), url: url.trim() });
    setTitle('');
    setUrl('');
    setAdding(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Links</h4>
        <button
          onClick={() => setAdding(!adding)}
          className="text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
        >
          <Plus size={13} />
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-bg-tertiary rounded p-2.5 mb-2 space-y-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Link title..."
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none border-b border-border pb-1"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none border-b border-border pb-1"
          />
          <div className="flex justify-end gap-1.5">
            <Button size="sm" variant="ghost" type="button" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" variant="primary" type="submit">Add Link</Button>
          </div>
        </form>
      )}

      <div className="space-y-1">
        {attachments.map((a) => (
          <div key={a.id} className="group flex items-center gap-2 px-1.5 py-1 rounded hover:bg-bg-hover">
            <span className="text-text-muted flex-shrink-0">{getIcon(a.type)}</span>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline flex-1 truncate"
            >
              {a.title}
            </a>
            <ExternalLink size={10} className="text-text-muted flex-shrink-0" />
            <button
              onClick={() => deleteAttachment.mutate({ id: a.id, taskId })}
              className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger p-0.5 cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
        {attachments.length === 0 && !adding && (
          <p className="text-[11px] text-text-muted">No links attached</p>
        )}
      </div>
    </div>
  );
}
