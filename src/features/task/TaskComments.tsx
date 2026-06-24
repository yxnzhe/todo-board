import { useState } from 'react';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { useTaskComments, useCreateComment } from '@/hooks/useTaskDetails';

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const { data: comments = [] } = useTaskComments(taskId);
  const createComment = useCreateComment();
  const [content, setContent] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate({ taskId, content: content.trim() });
    setContent('');
  }

  return (
    <div>
      <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Comments</h4>
      <div className="space-y-2 mb-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-bg-tertiary rounded px-2.5 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-muted">
                {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
            <p className="text-xs text-text-primary whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-[11px] text-text-muted">No comments yet</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-1.5">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-bg-tertiary border border-border rounded px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-2 py-1.5 bg-accent hover:bg-accent-hover text-white rounded text-xs disabled:opacity-50 cursor-pointer disabled:cursor-default transition-colors"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
