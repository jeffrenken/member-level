import { useQuery } from '@tanstack/react-query';
import { fetchContracts } from '@/api/requests';

export default function useContracts() {
  return useQuery({ queryKey: ['contracts'], queryFn: fetchContracts });
}
