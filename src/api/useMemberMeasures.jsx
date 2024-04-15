import { useQuery } from '@tanstack/react-query';
import { fetchMemberMeasures } from '@/api/requests';

export default function useMemberMeasures() {
  return useQuery({ queryKey: ['memberMeasures'], queryFn: fetchMemberMeasures });
}
