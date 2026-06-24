import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contextsService } from '@/services/contexts.service';
import type { Context } from '@/types';

export function useContexts() {
  return useQuery({
    queryKey: ['contexts'],
    queryFn: contextsService.getAll,
  });
}

export function useCreateContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; color?: string }) => contextsService.create(input),
    onSuccess: (newContext) => {
      queryClient.setQueryData<Context[]>(['contexts'], (old) => [...(old || []), newContext]);
    },
  });
}

export function useDeleteContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contextsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Context[]>(['contexts'], (old) => (old || []).filter((c) => c.id !== id));
    },
  });
}
