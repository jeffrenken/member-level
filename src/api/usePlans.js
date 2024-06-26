import { useQuery } from '@tanstack/react-query';
import { fetchPlans } from '@/api/requests';

export function usePlans() {
  return useQuery({ queryKey: ['plans'], queryFn: fetchPlans });
}
