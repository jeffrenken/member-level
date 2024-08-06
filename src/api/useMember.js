import { useQuery } from '@tanstack/react-query';
import { fetchMember, fetchMembers } from '@/api/requests';

export function useMember(id) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: fetchMembers,
    enabled: Boolean(id),

    select: (data) => data.find((member) => member.id === parseInt(id))
  });
}
