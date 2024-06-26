import { useQuery } from '@tanstack/react-query';
import { fetchContracts } from '@/api/requests';

export function useContracts() {
  return useQuery({ queryKey: ['contracts'], queryFn: fetchContracts });
}
