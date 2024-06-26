import { useQuery } from '@tanstack/react-query';
import { fetchRatings } from '@/api/requests';

export function useRatings() {
  return useQuery({ queryKey: ['ratings'], queryFn: fetchRatings });
}
