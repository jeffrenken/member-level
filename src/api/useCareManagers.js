import { useQuery } from '@tanstack/react-query';
import { fetchCareManagers } from '@/api/requests';

export function useCareManagers() {
  return useQuery({ queryKey: ['careManagers'], queryFn: fetchCareManagers, placeholderData: [] });
}
