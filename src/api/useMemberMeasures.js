import { useQuery } from '@tanstack/react-query';
import { fetchMemberMeasures } from '@/api/requests';

export function useMemberMeasures() {
  return useQuery({ queryKey: ['memberMeasures'], queryFn: fetchMemberMeasures });
}
