import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/services/projects.service';
import type { CreateProjectInput } from '@/services/projects.service';
import type { Project } from '@/types';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsService.getAll,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectsService.create(input),
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>(['projects'], (old) => [...(old || []), newProject]);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateProjectInput & { archived: boolean; sort_order: number }> }) =>
      projectsService.update(id, input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Project[]>(['projects'], (old) => (old || []).filter((p) => p.id !== id));
    },
  });
}
