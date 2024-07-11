import { useQuery } from '@tanstack/react-query';
import { fetchMembers } from '@/api/requests';

export function useMembersPaginated(params) {
  return useQuery({ queryKey: ['membersPaginated'], queryFn: fetchMembers, placeholderData: [] });
}
