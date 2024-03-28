import { useQuery } from '@tanstack/react-query';
import { fetchYears } from '@/api/requests';

export default function useYears() {
  return useQuery({ queryKey: ['years'], queryFn: fetchYears, placeholderData: [] });
}
