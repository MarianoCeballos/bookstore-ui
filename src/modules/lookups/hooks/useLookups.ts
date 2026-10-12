import { useQuery } from '@tanstack/react-query';
import { lookupsService } from '@/modules/lookups/services/lookups.service';

export function useAuthors(enabled = true) {
  return useQuery({
    queryKey: ['authors'],
    queryFn: lookupsService.authors,
    enabled,
  });
}

export function useCategories(enabled = true) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: lookupsService.categories,
    enabled,
  });
}
