import { useQuery } from '@tanstack/react-query';
import { fetchSupervisors } from '@/api/requests';

export function useSupervisors() {
  return useQuery({ queryKey: ['supervisors'], queryFn: fetchSupervisors, placeholderData: [] });
}
