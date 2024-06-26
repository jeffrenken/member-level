import { useQuery } from '@tanstack/react-query';
import { fetchSrf } from '@/api/requests';

export function useSrf() {
  return useQuery({ queryKey: ['srf'], queryFn: fetchSrf, placeholderData: [] });
}
