import { useQuery } from '@tanstack/react-query';
import { fetchRatings } from '@/api/requests';

export default function useRatings() {
  return useQuery({ queryKey: ['ratings'], queryFn: fetchRatings });
}
