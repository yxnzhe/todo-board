import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsService } from '@/services/comments.service';
import { checklistsService } from '@/services/checklists.service';
import { activitiesService } from '@/services/activities.service';
import { worklogsService } from '@/services/worklogs.service';
import { decisionsService } from '@/services/decisions.service';
import { attachmentsService } from '@/services/attachments.service';
import { tagsService } from '@/services/tags.service';
import type { TaskComment, TaskChecklist, TaskActivity, TaskWorklog, TaskDecision, Attachment, Tag } from '@/types';

export function useTaskComments(taskId: string | null) {
  return useQuery({
    queryKey: ['task-comments', taskId],
    queryFn: () => (taskId ? commentsService.getByTask(taskId) : []),
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, content }: { taskId: string; content: string }) =>
      commentsService.create(taskId, content),
    onSuccess: (comment) => {
      qc.setQueryData<TaskComment[]>(['task-comments', comment.task_id], (old) => [...(old || []), comment]);
    },
  });
}

export function useTaskChecklists(taskId: string | null) {
  return useQuery({
    queryKey: ['task-checklists', taskId],
    queryFn: () => (taskId ? checklistsService.getByTask(taskId) : []),
    enabled: !!taskId,
  });
}

export function useCreateChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      checklistsService.create(taskId, title),
    onSuccess: (item) => {
      qc.setQueryData<TaskChecklist[]>(['task-checklists', item.task_id], (old) => [...(old || []), item]);
    },
  });
}

export function useUpdateChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, taskId, input }: { id: string; taskId: string; input: { title?: string; completed?: boolean } }) =>
      checklistsService.update(id, input),
    onMutate: async ({ id, taskId, input }) => {
      await qc.cancelQueries({ queryKey: ['task-checklists', taskId] });
      const previous = qc.getQueryData<TaskChecklist[]>(['task-checklists', taskId]);
      qc.setQueryData<TaskChecklist[]>(['task-checklists', taskId], (old) =>
        (old || []).map((c) => (c.id === id ? { ...c, ...input } : c))
      );
      return { previous, taskId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['task-checklists', context.taskId], context.previous);
      }
    },
  });
}

export function useDeleteChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, taskId }: { id: string; taskId: string }) => checklistsService.delete(id),
    onSuccess: (_data, { id, taskId }) => {
      qc.setQueryData<TaskChecklist[]>(['task-checklists', taskId], (old) =>
        (old || []).filter((c) => c.id !== id)
      );
    },
  });
}

export function useTaskActivities(taskId: string | null) {
  return useQuery({
    queryKey: ['task-activities', taskId],
    queryFn: () => (taskId ? activitiesService.getByTask(taskId) : []),
    enabled: !!taskId,
  });
}

export function useTaskWorklogs(taskId: string | null) {
  return useQuery({
    queryKey: ['task-worklogs', taskId],
    queryFn: () => (taskId ? worklogsService.getByTask(taskId) : []),
    enabled: !!taskId,
  });
}

export function useCreateWorklog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, date, minutes, description }: { taskId: string; date: string; minutes: number; description?: string }) =>
      worklogsService.create(taskId, date, minutes, description),
    onSuccess: (worklog) => {
      qc.setQueryData<TaskWorklog[]>(['task-worklogs', worklog.task_id], (old) => [worklog, ...(old || [])]);
    },
  });
}

export function useDeleteWorklog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, taskId }: { id: string; taskId: string }) => worklogsService.delete(id),
    onSuccess: (_data, { id, taskId }) => {
      qc.setQueryData<TaskWorklog[]>(['task-worklogs', taskId], (old) =>
        (old || []).filter((w) => w.id !== id)
      );
    },
  });
}

export function useTaskDecisions(taskId: string | null) {
  return useQuery({
    queryKey: ['task-decisions', taskId],
    queryFn: () => (taskId ? decisionsService.getByTask(taskId) : []),
    enabled: !!taskId,
  });
}

export function useCreateDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, title, reason }: { taskId: string; title: string; reason: string }) =>
      decisionsService.create(taskId, title, reason),
    onSuccess: (decision) => {
      qc.setQueryData<TaskDecision[]>(['task-decisions', decision.task_id], (old) => [decision, ...(old || [])]);
    },
  });
}

export function useDeleteDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, taskId }: { id: string; taskId: string }) => decisionsService.delete(id),
    onSuccess: (_data, { id, taskId }) => {
      qc.setQueryData<TaskDecision[]>(['task-decisions', taskId], (old) =>
        (old || []).filter((d) => d.id !== id)
      );
    },
  });
}

export function useTaskAttachments(taskId: string | null) {
  return useQuery({
    queryKey: ['task-attachments', taskId],
    queryFn: () => (taskId ? attachmentsService.getByTask(taskId) : []),
    enabled: !!taskId,
  });
}

export function useCreateAttachment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, title, url }: { taskId: string; title: string; url: string }) =>
      attachmentsService.create(taskId, title, url),
    onSuccess: (attachment) => {
      qc.setQueryData<Attachment[]>(['task-attachments', attachment.task_id], (old) => [attachment, ...(old || [])]);
    },
  });
}

export function useDeleteAttachment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, taskId }: { id: string; taskId: string }) => attachmentsService.delete(id),
    onSuccess: (_data, { id, taskId }) => {
      qc.setQueryData<Attachment[]>(['task-attachments', taskId], (old) =>
        (old || []).filter((a) => a.id !== id)
      );
    },
  });
}

export function useTaskTags(taskId: string | null) {
  return useQuery({
    queryKey: ['task-tags', taskId],
    queryFn: () => (taskId ? tagsService.getTaskTags(taskId) : []),
    enabled: !!taskId,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: tagsService.getAll,
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) => tagsService.create(name, color),
    onSuccess: (tag) => {
      qc.setQueryData<Tag[]>(['tags'], (old) => [...(old || []), tag]);
    },
  });
}

export function useAddTagToTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) => tagsService.addToTask(taskId, tagId),
    onSettled: (_data, _err, { taskId }) => {
      qc.invalidateQueries({ queryKey: ['task-tags', taskId] });
    },
  });
}

export function useRemoveTagFromTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) => tagsService.removeFromTask(taskId, tagId),
    onSettled: (_data, _err, { taskId }) => {
      qc.invalidateQueries({ queryKey: ['task-tags', taskId] });
    },
  });
}
