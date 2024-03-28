import { useQuery } from '@tanstack/react-query';
import { fetchMember } from '@/api/requests';

export default function useMember(id) {
  return useQuery({ queryKey: ['member', id], queryFn: () => fetchMember(id), enabled: Boolean(id) });
}
