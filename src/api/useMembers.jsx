import { useQuery } from '@tanstack/react-query';
import { fetchMembers } from '@/api/requests';

export default function useMembers() {
  return useQuery({ queryKey: ['members'], queryFn: fetchMembers, placeholderData: [] });
}
