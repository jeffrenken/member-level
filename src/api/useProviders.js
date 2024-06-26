import { useQuery } from '@tanstack/react-query';
import { fetchProviders } from '@/api/requests';

export function useProviders() {
  return useQuery({ queryKey: ['providers'], queryFn: fetchProviders, placeholderData: [] });
}
