import { useQuery } from '@tanstack/react-query';
import { fetchMeasures } from '@/api/requests';

export default function useMeasures() {
  return useQuery({ queryKey: ['measures'], queryFn: fetchMeasures, placeholderData: [] });
}
